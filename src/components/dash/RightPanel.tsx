import { ArrowRight, Car, Footprints, PersonStanding, Siren } from "lucide-react";
import type { LogEvent } from "@/lib/eventLog";
import { EvidenceThumb } from "@/components/dash/EvidenceModal";

const iconFor = (e: LogEvent) =>
  e.type === "ANPR" ? Car : e.type === "INTRUSION" ? PersonStanding : Footprints;

function Donut({ slices, total }: { slices: { label: string; pct: number; color: string }[]; total: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        {slices.map((s) => {
          const len = (s.pct / 100) * c;
          const dash = `${len} ${c - len}`;
          const el = (
            <circle
              key={s.label}
              cx={50}
              cy={50}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={12}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-2xl font-bold tabular-nums">{total}</p>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </div>
      </div>
    </div>
  );
}

export function RightPanel({
  events = [],
  onOpenEvidence,
}: {
  events: LogEvent[];
  onOpenEvidence: (e: LogEvent) => void;
}) {
  const alerts = events.filter((e) => e.severity !== "LOW").slice(0, 4);
  const total = events.length;
  const counts = {
    Intrusion: events.filter((e) => e.type === "INTRUSION").length,
    ANPR: events.filter((e) => e.type === "ANPR").length,
    Others: events.filter((e) => e.type === "OTHER").length,
  };
  const colors: Record<string, { color: string; dot: string }> = {
    Intrusion: { color: "var(--danger)", dot: "bg-danger" },
    ANPR: { color: "var(--warning)", dot: "bg-warning" },
    Others: { color: "var(--muted-foreground)", dot: "bg-muted-foreground" },
  };
  const summary = Object.entries(counts).map(([label, count]) => ({
    label,
    count,
    pct: total ? Math.round((count / total) * 100) : 0,
    color: colors[label]!.color,
    dot: colors[label]!.dot,
  }));

  return (
    <div className="flex w-full flex-col gap-3 xl:w-[340px] xl:shrink-0">
      <section className="rounded-xl border border-border bg-card p-4">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 className="truncate text-sm font-bold tracking-[0.12em]">LIVE ALERTS</h2>
          <span className="shrink-0 text-xs tabular-nums text-primary">{alerts.length} active</span>
        </header>

        <ul className="mt-3 space-y-2">
          {alerts.map((a) => {
            const Icon = iconFor(a);
            const danger = a.severity === "HIGH";
            return (
              <li
                key={a.id}
                className="animate-plate-in flex items-start gap-3 rounded-lg border border-border bg-panel p-2.5 transition-colors hover:border-primary/40"
              >
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                    danger ? "bg-danger/15 text-danger" : "bg-warning/15 text-warning"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <EvidenceThumb event={a} onOpen={onOpenEvidence} className="h-14 w-20" />
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-xs font-semibold ${danger ? "text-danger" : "text-warning"}`}
                  >
                    {a.details}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">{a.camera}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="truncate text-[10px] tabular-nums text-muted-foreground">
                      {a.timestamp} · {a.type}
                    </span>
                    <span
                      className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-bold ${
                        danger
                          ? "border-danger/40 bg-danger/15 text-danger"
                          : "border-warning/40 bg-warning/15 text-warning"
                      }`}
                    >
                      {a.severity}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
          {alerts.length === 0 && (
            <li className="rounded-lg border border-border bg-panel p-4 text-center text-xs text-muted-foreground">
              No active alerts
            </li>
          )}
        </ul>

        <button className="mt-3 flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
          View All Alerts
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-bold tracking-[0.12em]">EVENT SUMMARY (TODAY)</h2>
        <div className="mt-3 flex items-center gap-4">
          <Donut slices={summary} total={total} />
          <ul className="min-w-0 flex-1 space-y-2">
            {summary.map((s) => (
              <li key={s.label} className="flex items-center gap-2 text-xs">
                <span className={`h-2 w-2 shrink-0 rounded-full ${s.dot}`} />
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{s.label}</span>
                <span className="shrink-0 tabular-nums">
                  {s.count} ({s.pct}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-bold tracking-[0.12em]">ALARM SYSTEM</h2>
        <div className="mt-3 flex items-center gap-4">
          <div className="animate-siren grid h-20 w-20 shrink-0 place-items-center rounded-full border border-danger/50 bg-danger/15 text-danger">
            <Siren className="h-9 w-9" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] tracking-[0.14em] text-muted-foreground">SIREN STATUS</p>
            <p className="text-glow-danger text-xl font-bold text-danger">ACTIVE</p>
            <button className="mt-2 rounded-md border border-danger/50 bg-danger/15 px-3 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/25">
              Stop Alarm
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
