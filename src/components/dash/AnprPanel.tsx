import { useEffect, useRef, useState } from "react";
import { Car, Truck, Bike, X, ScanLine, Plug, RefreshCw } from "lucide-react";

/**
 * ─── ANPR DATA SOURCE ────────────────────────────────────────────────────────
 *
 * `ANPR_ENDPOINT` — local JSON endpoint to poll for plate detections.
 *   • Set to `null` (or leave it unreachable) to use the built-in simulator.
 *   • Default is the in-app stub at `/api/anpr/plates`; point it at your own
 *     local backend instead, e.g. "http://localhost:5000/api/plates".
 *
 * Expected response: JSON array, newest first — see src/routes/api/anpr/plates.ts
 * for the exact field contract. Missing optional fields are filled in safely.
 *
 * `POLL_INTERVAL_MS` — how often the endpoint is polled / the simulator emits.
 */
const ANPR_ENDPOINT: string | null = "/api/anpr/plates";
const POLL_INTERVAL_MS = 3200;

export type Plate = {
  id: string;
  plate: string;
  time: string;
  cam: string;
  type: "car" | "truck" | "bike";
  flagged?: boolean;
};

type SourceMode = "connecting" | "api" | "simulation";

const CAMS = [
  "CAM 01 — Main Gate",
  "CAM 02 — Perimeter North",
  "CAM 03 — Check Post",
  "CAM 04 — River Bank",
];

const STATES = ["DL", "HR", "PB", "RJ", "UP", "JK"];
const LETTERS = "ABCDEFGHJKLMNPRSTUVWXYZ";
const TYPES: Plate["type"][] = ["car", "truck", "bike"];

function randomPlateText(): string {
  const s = STATES[Math.floor(Math.random() * STATES.length)]!;
  const d = Math.floor(Math.random() * 9) + 1;
  const l =
    LETTERS[Math.floor(Math.random() * LETTERS.length)]! +
    LETTERS[Math.floor(Math.random() * LETTERS.length)]!;
  const n = String(Math.floor(Math.random() * 9000) + 1000);
  return `${s} ${d}C ${l} ${n}`;
}

let seq = 1;

/** Simulator: one new detection per tick. */
function simulatePlate(): Plate {
  return {
    id: `sim-${seq++}`,
    plate: randomPlateText(),
    time: new Date().toLocaleTimeString("en-US", { hour12: true }),
    cam: CAMS[Math.floor(Math.random() * CAMS.length)]!,
    type: TYPES[Math.floor(Math.random() * TYPES.length)]!,
    flagged: Math.random() < 0.18,
  };
}

/** Normalize one raw API row into a Plate, tolerating missing optional fields. */
function normalizePlate(raw: unknown): Plate | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const plate = r["plate"];
  if (typeof plate !== "string" || !plate.trim()) return null;
  const rawType = r["type"];
  const type: Plate["type"] =
    rawType === "truck" || rawType === "bike" || rawType === "car" ? rawType : "car";
  const rawId = r["id"];
  const rawTime = r["time"];
  const rawCam = r["cam"];
  return {
    id:
      typeof rawId === "string" || typeof rawId === "number" ? `api-${rawId}` : `api-${seq++}`,
    plate,
    time:
      typeof rawTime === "string" && rawTime
        ? rawTime
        : new Date().toLocaleTimeString("en-US", { hour12: true }),
    cam: typeof rawCam === "string" && rawCam ? rawCam : "UNKNOWN CAM",
    type,
    flagged: r["flagged"] === true,
  };
}

const typeIcon = { car: Car, truck: Truck, bike: Bike };

export function AnprPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [plates, setPlates] = useState<Plate[]>([]);
  const [mode, setMode] = useState<SourceMode>("connecting");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    let useApi = ANPR_ENDPOINT !== null;
    setMode(ANPR_ENDPOINT ? "connecting" : "simulation");
    setPlates([]);

    async function pollApi() {
      try {
        const res = await fetch(ANPR_ENDPOINT!, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: unknown = await res.json();
        if (!Array.isArray(data)) throw new Error("Expected JSON array");
        const next = data.map(normalizePlate).filter((p): p is Plate => p !== null).slice(0, 40);
        if (cancelled) return;
        setMode("api");
        // Merge by plate+time so the list stays chronological and deduped.
        setPlates((prev) => {
          const seen = new Set(prev.map((p) => `${p.plate}|${p.time}`));
          const fresh = next.filter((p) => !seen.has(`${p.plate}|${p.time}`));
          return [...fresh, ...prev].slice(0, 40);
        });
      } catch {
        // Endpoint unreachable or malformed — degrade gracefully to the simulator.
        if (cancelled || !useApi) return;
        useApi = false;
        setMode("simulation");
        setPlates(Array.from({ length: 5 }, simulatePlate));
      }
    }

    function tick() {
      if (useApi) void pollApi();
      else setPlates((prev) => [simulatePlate(), ...prev].slice(0, 40));
    }

    if (useApi) void pollApi();
    else setPlates(Array.from({ length: 5 }, simulatePlate));

    timer.current = setInterval(tick, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      if (timer.current) clearInterval(timer.current);
    };
  }, [open]);

  if (!open) return null;

  return (
    <aside className="w-full shrink-0 rounded-xl border border-border bg-card xl:w-[320px]">
      <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <ScanLine className="h-4 w-4 shrink-0 animate-pulse text-primary" />
          <h2 className="truncate text-sm font-bold tracking-[0.12em]">LIVE PLATE LOG</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close live plate log"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex items-center justify-between px-4 py-2 text-[10px] tracking-[0.16em] text-muted-foreground">
        <span
          className={`flex items-center gap-1.5 ${
            mode === "api" ? "text-success" : mode === "connecting" ? "text-warning" : "text-primary"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 animate-pulse rounded-full ${
              mode === "api" ? "bg-success" : mode === "connecting" ? "bg-warning" : "bg-primary"
            }`}
          />
          {mode === "api" ? (
            <>
              <Plug className="h-3 w-3" /> API FEED
            </>
          ) : mode === "connecting" ? (
            <>
              <RefreshCw className="h-3 w-3 animate-spin" /> CONNECTING
            </>
          ) : (
            "ANPR SIMULATION"
          )}
        </span>
        <span className="tabular-nums">{plates.length} DETECTIONS</span>
      </div>

      <ul className="max-h-[560px] space-y-2 overflow-y-auto px-3 pb-3">
        {plates.map((p) => {
          const Icon = typeIcon[p.type];
          return (
            <li
              key={p.id}
              className="animate-plate-in rounded-lg border border-border bg-panel p-3 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md border-2 px-2 py-1 font-mono text-sm font-bold tracking-widest tabular-nums ${
                    p.flagged
                      ? "border-danger bg-danger/15 text-danger"
                      : "border-foreground/60 bg-background text-foreground"
                  }`}
                >
                  {p.plate}
                </span>
                <Icon
                  className={`ml-auto h-4 w-4 shrink-0 ${p.flagged ? "text-danger" : "text-primary"}`}
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <span className="truncate">{p.cam}</span>
                <span className="shrink-0 tabular-nums">{p.time}</span>
              </div>
              {p.flagged && (
                <p className="mt-1.5 text-[10px] font-bold tracking-[0.14em] text-danger">
                  WATCHLIST MATCH
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
