import { useEffect, useState } from "react";
import cam01 from "@/assets/cam01.jpg";
import cam02 from "@/assets/cam02.jpg";
import cam03 from "@/assets/cam03.jpg";
import cam04 from "@/assets/cam04.jpg";

export type EventType = "INTRUSION" | "ANPR" | "OTHER";

export type LogEvent = {
  id: string;
  timestamp: string;
  type: EventType;
  details: string;
  camera: string;
  plate?: string;
  vehicleType: "car" | "truck" | "bike";
  confidence?: number;
  severity: "HIGH" | "MEDIUM" | "LOW";
  snapshot?: string;
};

export const EVENTS_ENDPOINT = "/api/events";
export const EVENTS_POLL_MS = 3000;

/** Turn a backend snapshot_path into a URL this app can render. */
export function snapshotUrl(path: unknown): string | undefined {
  if (typeof path !== "string" || !path.trim()) return undefined;
  const p = path.trim();
  if (/^https?:\/\//i.test(p) || p.startsWith("data:")) return p;
  const name = p.replace(/\\/g, "/").split("/").pop();
  return name ? `/api/evidence/${encodeURIComponent(name)}` : undefined;
}

/** Pick the best image reference from a raw backend event row. */
function snapshotFrom(r: Record<string, unknown>): string | undefined {
  return (
    snapshotUrl(r["snapshot_path"] ?? r["snapshot"] ?? r["image_path"]) ??
    snapshotUrl(r["snapshot_url"])
  );
}

function formatTime(value: unknown): string {
  if (typeof value === "number") return new Date(value * (value > 1e12 ? 1 : 1000)).toLocaleTimeString("en-US", { hour12: true });
  if (typeof value === "string" && value.trim()) {
    const d = new Date(value.includes("T") ? value : value.replace(" ", "T"));
    if (!Number.isNaN(d.getTime())) return d.toLocaleTimeString("en-US", { hour12: true });
    return value;
  }
  return new Date().toLocaleTimeString("en-US", { hour12: true });
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

export function normalizeEvent(raw: unknown, index: number): LogEvent | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const rawType = (str(r["event_type"]) ?? str(r["type"]) ?? "").toUpperCase();
  const type: EventType =
    rawType.includes("ANPR") || rawType.includes("PLATE") || rawType.includes("VEHICLE")
      ? "ANPR"
      : rawType.includes("INTRU") || rawType.includes("PERSON") || rawType.includes("LOITER")
        ? "INTRUSION"
        : "OTHER";
  const plate = str(r["plate"]) ?? str(r["plate_text"]) ?? str(r["number_plate"]);
  const vt = (str(r["vehicle_type"]) ?? "").toLowerCase();
  const conf = typeof r["confidence"] === "number" ? (r["confidence"] as number) : undefined;
  const sev = (str(r["severity"]) ?? "").toUpperCase();
  return {
    id: String(str(r["id"]) ?? `${index}-${str(r["timestamp"]) ?? ""}-${plate ?? rawType}`),
    timestamp: formatTime(r["timestamp"] ?? r["time"] ?? r["datetime"]),
    type,
    details: str(r["details"]) ?? str(r["description"]) ?? plate ?? rawType ?? "Event",
    camera: str(r["camera"]) ?? str(r["camera_id"]) ?? str(r["cam"]) ?? "UNKNOWN CAM",
    ...(plate ? { plate } : {}),
    vehicleType: vt === "truck" || vt === "bike" ? (vt as "truck" | "bike") : "car",
    ...(conf !== undefined ? { confidence: conf } : {}),
    severity:
      sev === "HIGH" || sev === "MEDIUM" || sev === "LOW"
        ? (sev as LogEvent["severity"])
        : type === "INTRUSION"
          ? "HIGH"
          : "LOW",
    ...(snapshotUrl(r["snapshot_path"] ?? r["snapshot"] ?? r["image_path"])
      ? { snapshot: snapshotUrl(r["snapshot_path"] ?? r["snapshot"] ?? r["image_path"])! }
      : {}),
  };
}

/** Shown when data.json is not present yet, so the dashboard is never empty. */
export const DEMO_EVENTS: LogEvent[] = [
  { id: "d1", timestamp: "10:24:31 PM", type: "INTRUSION", details: "Person crossed fence line", camera: "CAM 01 - Main Gate", vehicleType: "car", severity: "HIGH", snapshot: cam01, confidence: 0.94 },
  { id: "d2", timestamp: "10:23:10 PM", type: "ANPR", details: "Vehicle in restricted zone", camera: "CAM 02 - Perimeter North", plate: "DL 3C AB 1234", vehicleType: "truck", severity: "MEDIUM", snapshot: cam02, confidence: 0.89 },
  { id: "d3", timestamp: "10:20:05 PM", type: "INTRUSION", details: "Loitering detected", camera: "CAM 04 - River Bank", vehicleType: "car", severity: "HIGH", snapshot: cam04 },
  { id: "d4", timestamp: "10:15:44 PM", type: "ANPR", details: "Plate captured at check post", camera: "CAM 03 - Check Post", plate: "HR 26 BX 7781", vehicleType: "car", severity: "LOW", snapshot: cam03, confidence: 0.97 },
  { id: "d5", timestamp: "10:12:18 PM", type: "ANPR", details: "Two-wheeler tracked", camera: "CAM 02 - Perimeter North", plate: "PB 10 KQ 5520", vehicleType: "bike", severity: "LOW", snapshot: cam02 },
];

export type EventFeed = {
  events: LogEvent[];
  live: boolean;
  loading: boolean;
};

/** Polls the local backend event log; falls back to demo data when data.json is absent. */
export function useEventLog(): EventFeed {
  const [state, setState] = useState<EventFeed>({ events: DEMO_EVENTS, live: false, loading: true });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(EVENTS_ENDPOINT, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { events?: unknown[] };
        const list = Array.isArray(data.events) ? data.events : [];
        const parsed = list
          .map((e, i) => normalizeEvent(e, i))
          .filter((e): e is LogEvent => e !== null);
        if (cancelled) return;
        if (parsed.length === 0) {
          setState({ events: DEMO_EVENTS, live: false, loading: false });
          return;
        }
        setState({ events: parsed.slice(0, 60), live: true, loading: false });
      } catch {
        if (!cancelled) setState({ events: DEMO_EVENTS, live: false, loading: false });
      }
    }

    void load();
    const t = setInterval(load, EVENTS_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  return state;
}
