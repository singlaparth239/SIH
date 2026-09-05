import { ArrowRight, Car, Footprints, PersonStanding, Siren } from "lucide-react";
import cam01 from "@/assets/cam01.jpg";
import cam02 from "@/assets/cam02.jpg";
import cam04 from "@/assets/cam04.jpg";

const alerts = [
  {
    title: "Intrusion Detected",
    camera: "CAM 01 - Main Gate",
    time: "10:24:31 PM",
    severity: "HIGH",
    icon: PersonStanding,
    thumb: cam01,
    tone: "danger" as const,
  },
  {
    title: "Vehicle in Restricted Zone",
    camera: "CAM 02 - Perimeter North",
    time: "10:23:10 PM",
    severity: "MEDIUM",
    icon: Car,
    thumb: cam02,
    tone: "warning" as const,
  },
  {
    title: "Loitering Detected",
    camera: "CAM 04 - River Bank",
    time: "10:20:05 PM",
    severity: "HIGH",
    icon: Footprints,
    thumb: cam04,
    tone: "danger" as const,
  },
];

const summary = [
  { label: "Intrusion", count: 10, pct: 37, color: "var(--danger)", dot: "bg-danger" },
  { label: "Vehicle", count: 8, pct: 30, color: "var(--warning)", dot: "bg-warning" },
  { label: "Loitering", count: 6, pct: 22, color: "var(--primary)", dot: "bg-primary" },
  { label: "Others", count: 3, pct: 11, color: "var(--muted-foreground)", dot: "bg-muted-foreground" },
];

function Donut() {
  const r = 42;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        {summary.map((s) => {
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
          <p className="text-2xl font-bold tabular-nums">27</p>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </div>
      </div>
    </div>
  );
}

export function RightPanel() {
  return (
    <div className="flex w-full flex-col gap-3 xl:w-[340px] xl:shrink-0">
      <section className="rounded-xl border border-border bg-card p-4">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 className="truncate text-sm font-bold tracking-[0.12em]">LIVE ALERTS</h2>
          <button className="shrink-0 text-xs text-primary hover:text-primary/80">View all</button>
        </header>

        <ul className="mt-3 space-y-2">
          {alerts.map((a) => (
            <li
              key={a.title}
              className="flex items-start gap-3 rounded-lg border border-border bg-panel p-2.5 transition-colors hover:border-primary/40"
            >
              <div
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                  a.tone === "danger" ? "bg-danger/15 text-danger" : "bg-warning/15 text-warning"
                }`}
              >
                <a.icon className="h-4.5 w-4.5" />
              </div>
              <img
                src={a.thumb}
                alt={`${a.title} snapshot`}
                loading="lazy"
                width={96}
                height={64}
                className="h-14 w-20 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-xs font-semibold ${
                    a.tone === "danger" ? "text-danger" : "text-warning"
                  }`}
                >
                  {a.title}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">{a.camera}</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="truncate text-[10px] tabular-nums text-muted-foreground">
                    {a.time} · Today
                  </span>
                  <span
                    className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-bold ${
                      a.tone === "danger"
                        ? "border-danger/40 bg-danger/15 text-danger"
                        : "border-warning/40 bg-warning/15 text-warning"
                    }`}
                  >
                    {a.severity}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button className="mt-3 flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
          View All Alerts
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-bold tracking-[0.12em]">EVENT SUMMARY (TODAY)</h2>
        <div className="mt-3 flex items-center gap-4">
          <Donut />
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
