import { createFileRoute } from "@tanstack/react-router";

/**
 * Local ANPR backend stub.
 *
 * Response shape the dashboard consumes (JSON array, newest first):
 * [
 *   {
 *     "plate":   "DL 3C AB 1234",          // required — plate text
 *     "time":    "10:25:02 PM",            // optional — display timestamp (defaults to now)
 *     "cam":     "CAM 01 — Main Gate",     // optional — camera label
 *     "type":    "car" | "truck" | "bike", // optional — vehicle type
 *     "flagged": true                       // optional — watchlist match
 *   },
 *   ...
 * ]
 *
 * Point the panel at your real local backend by changing ANPR_ENDPOINT in
 * src/components/dash/AnprPanel.tsx (e.g. "http://localhost:5000/api/plates").
 */

const CAMS = [
  "CAM 01 — Main Gate",
  "CAM 02 — Perimeter North",
  "CAM 03 — Check Post",
  "CAM 04 — River Bank",
];
const STATES = ["DL", "HR", "PB", "RJ", "UP", "JK"];
const LETTERS = "ABCDEFGHJKLMNPRSTUVWXYZ";
const TYPES = ["car", "truck", "bike"] as const;

function randomPlate() {
  const s = STATES[Math.floor(Math.random() * STATES.length)]!;
  const d = Math.floor(Math.random() * 9) + 1;
  const l =
    LETTERS[Math.floor(Math.random() * LETTERS.length)]! +
    LETTERS[Math.floor(Math.random() * LETTERS.length)]!;
  const n = String(Math.floor(Math.random() * 9000) + 1000);
  return `${s} ${d}C ${l} ${n}`;
}

export const Route = createFileRoute("/api/anpr/plates")({
  server: {
    handlers: {
      GET: async () => {
        const now = Date.now();
        const plates = Array.from({ length: 8 }, (_, i) => ({
          plate: randomPlate(),
          time: new Date(now - i * 4000).toLocaleTimeString("en-US", { hour12: true }),
          cam: CAMS[Math.floor(Math.random() * CAMS.length)]!,
          type: TYPES[Math.floor(Math.random() * TYPES.length)]!,
          flagged: Math.random() < 0.18,
        }));
        return Response.json(plates);
      },
    },
  },
});
