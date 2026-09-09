/**
 * FastAPI backend connection (single source of truth for server routes).
 * Override with BACKEND_URL env var if the tunnel URL changes.
 */
export const BACKEND_URL = (
  process.env["BACKEND_URL"] ?? "https://zone-calibrate-encircle.ngrok-free.dev"
).replace(/\/+$/, "");

/** ngrok serves an interstitial to non-browser clients unless this header is sent. */
export const BACKEND_HEADERS = { "ngrok-skip-browser-warning": "true" } as const;
