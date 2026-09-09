import { Car, Download, Footprints, Minus, PersonStanding, Play, Plus, ScanLine } from "lucide-react";
import mapImg from "@/assets/map.jpg";
import type { LogEvent } from "@/lib/eventLog";
import { EvidenceThumb } from "@/components/dash/EvidenceModal";

const severityClass: Record<LogEvent["severity"], string> = {
  HIGH: "bg-danger/15 text-danger border-danger/40",
  MEDIUM: "bg-warning/15 text-warning border-warning/40",
  LOW: "bg-primary/15 text-primary border-primary/40",
};

const typeMeta: Record<LogEvent["type"], { icon: typeof Car; tone: string }> = {
  INTRUSION: { icon: PersonStanding, tone: "text-danger" },
  ANPR: { icon: Car, tone: "text-primary" },
  OTHER: { icon: Footprints, tone: "text-primary" },
};

const mapCams = [
  { id: "CAM 02", x: 22, y: 18, online: true },
  { id: "CAM 01", x: 55, y: 46, online: true },
  { id: "CAM 04", x: 26, y: 80, online: false },
];

function RecentEvents({
  events = [],
  live,
  onOpenEvidence,
}: {
  events: LogEvent[];
  live: boolean;
  onOpenEvidence: (e: LogEvent) => void;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-border bg-card p-4">
      <header className="flex items-center justify-between gap-3">
        <h2 className="truncate text-sm font-bold tracking-[0.12em]">RECENT EVENTS</h2>
        <span
          className={`flex shrink-0 items-center gap-1.5 text-[10px] tracking-[0.16em] ${
            live ? "text-success" : "text-muted-foreground"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 animate-pulse rounded-full ${live ? "bg-success" : "bg-muted-foreground"}`}
          />
          {live ? "LIVE LOG" : "SAMPLE DATA"}
        </span>
      </header>
      <div className="mt-3 -mx-1 overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left text-xs">
          <thead>
            <tr className="text-muted-foreground">
              {["Time", "Evidence", "Event Type", "Details", "Camera", "Severity", "Actions"].map((h) => (
                <th key={h} className="border-b border-border px-2 pb-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.slice(0, 8).map((e) => {
              const meta = typeMeta[e.type];
              return (
                <tr key={e.id} className="border-b border-border/60 transition-colors hover:bg-accent/40">
                  <td className="whitespace-nowrap px-2 py-2.5 tabular-nums text-muted-foreground">
                    {e.timestamp}
                  </td>
                  <td className="px-2 py-2.5">
                    <EvidenceThumb event={e} onOpen={onOpenEvidence} className="h-10 w-14" />
                  </td>
                  <td className="px-2 py-2.5">
                    <span className="flex items-center gap-2">
                      <meta.icon className={`h-4 w-4 shrink-0 ${meta.tone}`} />
                      <span
                        className={`rounded border px-1.5 py-0.5 text-[10px] font-bold tracking-wider ${
                          e.type === "INTRUSION"
                            ? "border-danger/40 bg-danger/15 text-danger"
                            : e.type === "ANPR"
                              ? "border-warning/40 bg-warning/15 text-warning"
                              : "border-border bg-panel text-muted-foreground"
                        }`}
                      >
                        {e.type}
                      </span>
                    </span>
                  </td>
                  <td className="max-w-[200px] px-2 py-2.5">
                    <span className="block truncate">{e.details}</span>
                    {e.plate && (
                      <span className="mt-1 inline-block rounded border border-foreground/50 bg-background px-1.5 font-mono text-[10px] font-bold tracking-widest">
                        {e.plate}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-muted-foreground">{e.camera}</td>
                  <td className="px-2 py-2.5">
                    <span
                      className={`rounded border px-2 py-0.5 text-[10px] font-bold ${severityClass[e.severity]}`}
                    >
                      {e.severity}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
                    <span className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenEvidence(e)}
                        aria-label={`Open evidence for ${e.details}`}
                        className="grid h-6 w-6 place-items-center rounded border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <Play className="h-3 w-3" />
                      </button>
                      <a
                        href={e.snapshot ?? "#"}
                        download
                        aria-label={`Download evidence for ${e.details}`}
                        className="grid h-6 w-6 place-items-center rounded border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <Download className="h-3 w-3" />
                      </a>
                    </span>
                  </td>
                </tr>
              );
            })}
            {events.length === 0 && (
              <tr>
                <td colSpan={7} className="px-2 py-6 text-center text-muted-foreground">
                  <ScanLine className="mx-auto mb-2 h-4 w-4 animate-pulse" />
                  Waiting for event log data…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CameraMap() {
  return (
    <section className="min-w-0 rounded-xl border border-border bg-card p-4">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="truncate text-sm font-bold tracking-[0.12em]">CAMERA MAP</h2>
        <button className="shrink-0 text-xs text-primary transition-colors hover:text-primary/80">
          View full map
        </button>
      </header>

      <div className="relative mt-3 aspect-4/3 w-full overflow-hidden rounded-lg border border-border bg-black">
        <img
          src={mapImg}
          alt="Tactical overhead map of monitored border sector"
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover opacity-70"
        />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <polygon
            points="30,30 72,38 78,66 44,80 26,58"
            className="fill-danger/15 stroke-danger/70"
            strokeWidth={0.5}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {mapCams.map((c) => (
          <div
            key={c.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-md border border-border bg-background/85 px-1.5 py-1"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${c.online ? "bg-success" : "bg-danger"}`} />
            <span className="text-[10px] font-semibold">{c.id}</span>
          </div>
        ))}

        <div className="absolute bottom-2 right-2 flex flex-col overflow-hidden rounded-md border border-border bg-background/85">
          <button className="grid h-7 w-7 place-items-center text-muted-foreground transition-colors hover:text-foreground">
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button className="grid h-7 w-7 place-items-center border-t border-border text-muted-foreground transition-colors hover:text-foreground">
            <Minus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function EventsAndMap({
  events = [],
  live,
  onOpenEvidence,
}: {
  events: LogEvent[];
  live: boolean;
  onOpenEvidence: (e: LogEvent) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
      <RecentEvents events={events} live={live} onOpenEvidence={onOpenEvidence} />
      <CameraMap />
    </div>
  );
}
