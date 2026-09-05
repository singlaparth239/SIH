import { useEffect, useState } from "react";
import {
  LayoutGrid,
  Video,
  Bell,
  Search,
  PlayCircle,
  Car,
  UserRound,
  FileText,
  Activity,
  Settings,
  Users,
  Siren,
  ShieldCheck,
  ChevronDown,
  Clock,
} from "lucide-react";

const nav = [
  { label: "Dashboard", icon: LayoutGrid, active: true },
  { label: "Live Cameras", icon: Video },
  { label: "Events & Alerts", icon: Bell },
  { label: "Event Search", icon: Search },
  { label: "Playback", icon: PlayCircle },
  { label: "ANPR / Vehicles", icon: Car },
  { label: "People & Faces", icon: UserRound },
  { label: "Reports", icon: FileText },
  { label: "System Status", icon: Activity },
  { label: "Settings", icon: Settings },
  { label: "Users", icon: Users },
];

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function Sidebar() {
  const now = useClock();

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-[13px] font-bold tracking-[0.12em] text-sidebar-foreground">
            BORDER SURVEILLANCE
          </h1>
          <p className="truncate text-[10px] tracking-[0.18em] text-muted-foreground">
            AI VIDEO ANALYTICS
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active
                ? "bg-primary/20 font-semibold text-primary ring-1 ring-primary/30"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>

      <div className="space-y-3 border-t border-border p-3">
        <button className="animate-siren flex w-full items-center gap-3 rounded-xl border border-danger/50 bg-danger/15 px-4 py-4 text-left transition-colors hover:bg-danger/25">
          <Siren className="h-6 w-6 shrink-0 text-danger" />
          <span className="text-sm font-bold leading-tight tracking-wide text-danger">
            EMERGENCY
            <br />
            ALERT
          </span>
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Operator</p>
            <p className="flex items-center gap-1.5 text-xs text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Online
            </p>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span className="tabular-nums">
            {now
              ? `${now.toLocaleTimeString("en-US", { hour12: true })} | ${now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`
              : "--:--:-- | ---"}
          </span>
        </div>
      </div>
    </aside>
  );
}
