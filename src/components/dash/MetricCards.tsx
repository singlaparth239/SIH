import { ArrowRight, BellRing, FileText, Video, ShieldCheck } from "lucide-react";

const cards = [
  {
    label: "Active Alerts",
    value: "3",
    icon: BellRing,
    tone: "danger" as const,
    action: "View all",
  },
  {
    label: "Today's Events",
    value: "27",
    icon: FileText,
    tone: "warning" as const,
    action: "View all",
  },
  {
    label: "Cameras Online",
    value: "12",
    suffix: "/ 16",
    icon: Video,
    tone: "primary" as const,
    action: "View all",
  },
  {
    label: "System Status",
    value: "Healthy",
    icon: ShieldCheck,
    tone: "success" as const,
    action: "View details",
  },
];

const toneMap = {
  danger: {
    label: "text-danger",
    icon: "bg-danger/15 text-danger",
    ring: "border-danger/40",
  },
  warning: {
    label: "text-warning",
    icon: "bg-warning/15 text-warning",
    ring: "border-border",
  },
  primary: {
    label: "text-primary",
    icon: "bg-primary/15 text-primary",
    ring: "border-border",
  },
  success: {
    label: "text-success",
    icon: "bg-success/15 text-success",
    ring: "border-border",
  },
};

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const tone = toneMap[card.tone];
        return (
          <div
            key={card.label}
            className={`group rounded-xl border ${tone.ring} bg-card p-4 transition-colors hover:border-primary/40`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className={`truncate text-sm font-medium ${tone.label}`}>{card.label}</p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
                  {card.value}
                  {card.suffix && (
                    <span className="ml-1 text-lg font-medium text-muted-foreground">
                      {card.suffix}
                    </span>
                  )}
                </p>
              </div>
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${tone.icon}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <button className="mt-4 flex w-full items-center justify-between text-xs text-muted-foreground transition-colors group-hover:text-foreground">
              <span>{card.action}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
