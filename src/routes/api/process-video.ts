import { createFileRoute } from "@tanstack/react-router";
import { BACKEND_HEADERS, backendUrl } from "@/lib/backend.server";

/**
 * Proxies video uploads to the FastAPI backend's POST /process-video.
 * Accepts multipart/form-data with the field name "file" and forwards it
 * unchanged to the backend.
 */
export const Route = createFileRoute("/api/process-video")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return Response.json({ error: "Expected multipart/form-data" }, { status: 400 });
        }
        const file = form.get("file");
        if (!(file instanceof File)) {
          return Response.json({ error: 'Missing video file in form field "file"' }, { status: 400 });
        }

        const out = new FormData();
        out.append("file", file, file.name);

        try {
          const res = await fetch(`${backendUrl()}/process-video`, {
            method: "POST",
            headers: { ...BACKEND_HEADERS },
            body: out,
            signal: AbortSignal.timeout(120_000),
          });
          const text = await res.text();
          let data: unknown = text;
          try {
            data = JSON.parse(text);
          } catch {
            /* non-JSON response */
          }
          return Response.json(
            { ok: res.ok, status: res.status, data },
            { status: res.ok ? 200 : 502, headers: { "cache-control": "no-store" } },
          );
        } catch (err) {
          return Response.json(
            { ok: false, error: err instanceof Error ? err.message : "backend unreachable" },
            { status: 502, headers: { "cache-control": "no-store" } },
          );
        }
      },
    },
  },
});
