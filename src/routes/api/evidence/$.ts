import { createFileRoute } from "@tanstack/react-router";

/**
 * Serves evidence snapshots written by the local Python backend into
 * <project root>/evidence_snapshots/. Requested as /api/evidence/<filename>.
 */

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  bmp: "image/bmp",
};

export const Route = createFileRoute("/api/evidence/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const splat = (params as Record<string, string | undefined>)["_splat"] ?? "";
        // Only allow a flat filename — no traversal, no absolute paths.
        const name = splat.split("/").pop() ?? "";
        if (!name || !/^[\w.\- ]+$/.test(name) || name.includes("..")) {
          return new Response("Bad request", { status: 400 });
        }
        const ext = name.split(".").pop()?.toLowerCase() ?? "";
        if (!MIME[ext]) return new Response("Unsupported file type", { status: 400 });

        try {
          const { readFile } = await import("node:fs/promises");
          const { join } = await import("node:path");
          const buf = await readFile(join(process.cwd(), "evidence_snapshots", name));
          return new Response(new Uint8Array(buf), {
            headers: { "content-type": MIME[ext]!, "cache-control": "public, max-age=60" },
          });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});
