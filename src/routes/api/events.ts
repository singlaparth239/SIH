import { createFileRoute } from "@tanstack/react-router";
import { BACKEND_HEADERS, backendUrl } from "@/lib/backend.server";

/**
 * Proxies the FastAPI backend's GET /events endpoint.
 * The dashboard polls this same-origin route (no CORS / ngrok interstitial issues).
 * Falls back to the local data.json file if the backend is unreachable.
 */

function extractList(parsed: unknown): unknown[] {
  if (Array.isArray(parsed)) return parsed;
  if (typeof parsed === "object" && parsed !== null) {
    const r = parsed as Record<string, unknown>;
    const inner = r["events"] ?? r["logs"];
    if (Array.isArray(inner)) return inner;
  }
  return [];
}

export const Route = createFileRoute("/api/events")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const res = await fetch(`${backendUrl()}/events`, {
            headers: { ...BACKEND_HEADERS, accept: "application/json" },
            signal: AbortSignal.timeout(8000),
          });
          if (!res.ok) throw new Error(`backend ${res.status}`);
          const list = extractList(await res.json());
          return Response.json(
            { source: "backend", events: list },
            { headers: { "cache-control": "no-store" } },
          );
        } catch {
          // Backend down — fall back to a local data.json if one exists.
          try {
            const { readFile } = await import("node:fs/promises");
            const { join } = await import("node:path");
            const list = extractList(JSON.parse(await readFile(join(process.cwd(), "data.json"), "utf8")));
            return Response.json(
              { source: "file", events: list },
              { headers: { "cache-control": "no-store" } },
            );
          } catch {
            return Response.json(
              { source: "missing", events: [] },
              { headers: { "cache-control": "no-store" } },
            );
          }
        }
      },
    },
  },
});
