import { createFileRoute } from "@tanstack/react-router";
import { BACKEND_HEADERS, BACKEND_URL } from "@/lib/backend.server";

/** Proxies the FastAPI backend's GET /health endpoint. */
export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const res = await fetch(`${BACKEND_URL}/health`, {
            headers: { ...BACKEND_HEADERS, accept: "application/json" },
            signal: AbortSignal.timeout(5000),
          });
          const body = await res.text();
          let data: unknown = body;
          try {
            data = JSON.parse(body);
          } catch {
            /* plain-text health response */
          }
          return Response.json(
            { ok: res.ok, status: res.status, backend: BACKEND_URL, data },
            { status: res.ok ? 200 : 502, headers: { "cache-control": "no-store" } },
          );
        } catch (err) {
          return Response.json(
            {
              ok: false,
              backend: BACKEND_URL,
              error: err instanceof Error ? err.message : "unreachable",
            },
            { status: 502, headers: { "cache-control": "no-store" } },
          );
        }
      },
    },
  },
});
