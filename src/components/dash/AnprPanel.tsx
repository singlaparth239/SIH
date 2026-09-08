import { Car, Truck, Bike, X, ScanLine, Plug, Database } from "lucide-react";
import type { LogEvent } from "@/lib/eventLog";
import { EvidenceThumb } from "@/components/dash/EvidenceModal";

const typeIcon = { car: Car, truck: Truck, bike: Bike };

/**
 * Live plate log driven by the shared surveillance event feed
 * (timestamp, event_type, details, snapshot_path). It re-renders
 * automatically whenever the feed refreshes.
 */
export function AnprPanel({
  open,
  onClose,
  events = [],
  live,
  onOpenEvidence,
}: {
  open: boolean;
  onClose: () => void;
  events: LogEvent[];
  live: boolean;
  onOpenEvidence: (e: LogEvent) => void;
}) {
  if (!open) return null;

  const plates = events.filter((e) => e.type === "ANPR").slice(0, 40);

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
        <span className={`flex items-center gap-1.5 ${live ? "text-success" : "text-primary"}`}>
          <span
            className={`h-1.5 w-1.5 animate-pulse rounded-full ${live ? "bg-success" : "bg-primary"}`}
          />
          {live ? (
            <>
              <Plug className="h-3 w-3" /> LIVE LOG
            </>
          ) : (
            <>
              <Database className="h-3 w-3" /> SAMPLE DATA
            </>
          )}
        </span>
        <span className="tabular-nums">{plates.length} DETECTIONS</span>
      </div>

      <ul className="max-h-[560px] space-y-2 overflow-y-auto px-3 pb-3">
        {plates.map((p) => {
          const Icon = typeIcon[p.vehicleType];
          const flagged = p.severity === "HIGH";
          return (
            <li
              key={p.id}
              className="animate-plate-in rounded-lg border border-border bg-panel p-3 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md border-2 px-2 py-1 font-mono text-sm font-bold tracking-widest tabular-nums ${
                    flagged
                      ? "border-danger bg-danger/15 text-danger"
                      : "border-foreground/60 bg-background text-foreground"
                  }`}
                >
                  {p.plate ?? "UNREADABLE"}
                </span>
                <Icon className={`ml-auto h-4 w-4 shrink-0 ${flagged ? "text-danger" : "text-primary"}`} />
              </div>
              <div className="mt-2 flex items-start gap-2">
                <EvidenceThumb event={p} onOpen={onOpenEvidence} className="h-12 w-16" />
                <div className="min-w-0 flex-1 text-[11px] text-muted-foreground">
                  <p className="truncate">{p.details}</p>
                  <p className="truncate">{p.camera}</p>
                  <p className="tabular-nums">
                    {p.timestamp}
                    {p.confidence !== undefined ? ` · ${Math.round(p.confidence * 100)}%` : ""}
                  </p>
                </div>
              </div>
              {flagged && (
                <p className="mt-1.5 text-[10px] font-bold tracking-[0.14em] text-danger">
                  WATCHLIST MATCH
                </p>
              )}
            </li>
          );
        })}
        {plates.length === 0 && (
          <li className="rounded-lg border border-border bg-panel p-4 text-center text-xs text-muted-foreground">
            No plate detections yet
          </li>
        )}
      </ul>
    </aside>
  );
}
