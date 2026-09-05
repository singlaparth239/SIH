const metrics = [
  { label: "CPU Usage", value: 45, display: "45%", bar: "bg-primary" },
  { label: "GPU Usage", value: 38, display: "38%", bar: "bg-success" },
  { label: "Storage", value: 62, display: "62%", bar: "bg-warning" },
  { label: "Network", value: 55, display: "124.4 Mbps", bar: "bg-caution" },
];

export function StatusBar() {
  return (
    <footer className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl border border-border bg-card px-4 py-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((m) => (
        <div key={m.label} className="flex min-w-0 items-center gap-3">
          <span className="w-24 shrink-0 truncate text-xs text-muted-foreground">{m.label}</span>
          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
            <div className={`h-full rounded-full ${m.bar}`} style={{ width: `${m.value}%` }} />
          </div>
          <span className="w-20 shrink-0 text-right text-xs tabular-nums">{m.display}</span>
        </div>
      ))}
    </footer>
  );
}
