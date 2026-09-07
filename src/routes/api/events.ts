import { createFileRoute } from "@tanstack/react-router";

/**
 * Reads the real-time event log written by the local Python backend.
 *
 * File: <project root>/data.json
 * Expected shape — a JSON array (newest first or last, both fine):
 * [
 *   {
 *     "timestamp": "2026-09-07 22:24:31",        // or ISO string / epoch seconds
 *     "event_type": "INTRUSION" | "ANPR",
 *     "details": "Person crossed fence line",     // free text
 *     "camera": "CAM 01 - Main Gate",             // optional
 *     "plate": "DL 3C AB 1234",                   // optional (ANPR)
 *     "vehicle_type": "car" | "truck" | "bike",   // optional (ANPR)
 *     "confidence": 0.94,                          // optional
 *     "snapshot_path": "evidence_snapshots/x.jpg"  // optional
 *   }
 * ]
 * An object with an "events"/"logs" array is also accepted.
 */

export const Route = createFileRoute("/api/events")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { readFile } = await import("node:fs/promises");
          const { join } = await import("node:path");
          const raw = await readFile(join(process.cwd(), "data.json"), "utf8");
          const parsed: unknown = JSON.parse(raw);
          const list = Array.isArray(parsed)
            ? parsed
            : typeof parsed === "object" && parsed !== null
              ? ((parsed as Record<string, unknown>)["events"] ??
                  (parsed as Record<string, unknown>)["logs"] ??
                  [])
              : [];
          return Response.json(
            { source: "file", events: Array.isArray(list) ? list : [] },
            { headers: { "cache-control": "no-store" } },
          );
        } catch {
          return Response.json(
            { source: "missing", events: [] },
            { headers: { "cache-control": "no-store" } },
          );
        }
      },
    },
  },
});
