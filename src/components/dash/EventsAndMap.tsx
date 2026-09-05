import { Car, Download, Footprints, Minus, PersonStanding, Play, Plus } from "lucide-react";
import mapImg from "@/assets/map.jpg";

type Severity = "HIGH" | "MEDIUM" | "LOW";

const severityClass: Record<Severity, string> = {
  HIGH: "bg-danger/15 text-danger border-danger/40",
  MEDIUM: "bg-warning/15 text-warning border-warning/40",
  LOW: "bg-caution/15 text-caution border-caution/40",
};

const events = [
  { time: "10:24:31 PM", type: "Intrusion Detected", icon: PersonStanding, tone: "text-danger", camera: "CAM 01 - Main Gate", location: "Gate Area", severity: "HIGH" as Severity },
  { time: "10:23:10 PM", type: "Vehicle in Restricted Zone", icon: Car, tone: "text-warning", camera: "CAM 02 - Perimeter North", location: "North Fence", severity: "MEDIUM" as Severity },
  { time: "10:20:05 PM", type: "Loitering Detected", icon: Footprints, tone: "text-danger", camera: "CAM 04 - River Bank", location: "River Side", severity: "HIGH" as Severity },
  { time: "10:15:44 PM", type: "Vehicle Detected", icon: Car, tone: "text-primary", camera: "CAM 03 - Check Post", location: "Check Post", severity: "LOW" as Severity },
  { time: "10:12:18 PM", type: "Intrusion Detected", icon: PersonStanding, tone: "text-warning", camera: "CAM 02 - Perimeter North", location: "North Fence", severity: "MEDIUM" as Severity },
];

const mapCams = [
  { id: "CAM 02", x: 22, y: 18, online: true },
  { id: "CAM 01", x: 55, y: 46, online: true },
  { id: "CAM 04", x: 26, y: 80, online: false },
];

function RecentEvents() {
  return (
    <section className="min-w-0 rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-bold tracking-[0.12em]">RECENT EVENTS</h2>
      <div className="mt-3 -mx-1 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-xs">
          <thead>
            <tr className="text-muted-foreground">
              {["Time", "Event Type", "Camera", "Location", "Severity", "Actions"].map((h) => (
                <th key={h} className="border-b border-border px-2 pb-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={i} className="border-b border-border/60 transition-colors hover:bg-accent/40">
                <td className="whitespace-nowrap px-2 py-2.5 tabular-nums text-muted-foreground">{e.time}</td>
                <td className="px-2 py-2.5">
                  <span className="flex items-center gap-2">
                    <e.icon className={`h-4 w-4 shrink-0 ${e.tone}`} />
                    <span className="truncate">{e.type}</span>
                  </span>
                </td>
                <td className="whitespace-nowrap px-2 py-2.5 text-muted-foreground">{e.camera}</td>
                <td className="whitespace-nowrap px-2 py-2.5 text-muted-foreground">{e.location}</td>
                <td className="px-2 py-2.5">
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-bold ${severityClass[e.severity]}`}>
                    {e.severity}
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <span className="flex items-center gap-1">
                    <button className="grid h-6 w-6 place-items-center rounded border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
                      <Play className="h-3 w-3" />
                    </button>
                    <button className="grid h-6 w-6 place-items-center rounded border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
                      <Download className="h-3 w-3" />
                    </button>
                  </span>
                </td>
              </tr>
            ))}
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

export function EventsAndMap() {
  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
      <RecentEvents />
      <CameraMap />
    </div>
  );
}
