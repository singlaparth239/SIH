import { useEffect, useState } from "react";
import { X, ImageOff } from "lucide-react";
import type { LogEvent } from "@/lib/eventLog";

function MissingThumb({ className = "h-14 w-20" }: { className?: string }) {
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-md border border-border bg-panel text-muted-foreground ${className}`}
      aria-label="No evidence snapshot"
    >
      <ImageOff className="h-4 w-4" />
    </div>
  );
}

export function EvidenceThumb({
  event,
  onOpen,
  className = "h-14 w-20",
}: {
  event: LogEvent;
  onOpen: (e: LogEvent) => void;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  if (!event.snapshot || broken) return <MissingThumb className={className} />;
  return (
    <button
      type="button"
      onClick={() => onOpen(event)}
      aria-label={`View full-size evidence for ${event.details}`}
      className={`group relative shrink-0 overflow-hidden rounded-md border border-border transition-colors hover:border-primary ${className}`}
    >
      <img
        src={event.snapshot}
        alt={`Evidence snapshot — ${event.details} on ${event.camera}`}
        loading="lazy"
        onError={() => setBroken(true)}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </button>
  );
}

export function EvidenceModal({ event, onClose }: { event: LogEvent | null; onClose: () => void }) {
  useEffect(() => {
    if (!event) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [event, onClose]);

  if (!event || !event.snapshot) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Evidence snapshot preview"
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-background/85 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
      >
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-[0.1em]">
              {event.type} — {event.camera}
            </p>
            <p className="truncate text-[11px] tabular-nums text-muted-foreground">
              {event.timestamp}
              {event.plate ? ` · ${event.plate}` : ""}
              {event.confidence !== undefined
                ? ` · ${Math.round(event.confidence * 100)}% confidence`
                : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close evidence preview"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="bg-black">
          <img
            src={event.snapshot}
            alt={`Full-size evidence — ${event.details} on ${event.camera}`}
            className="max-h-[70vh] w-full object-contain"
          />
        </div>
        <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          {event.details}
        </p>
      </div>
    </div>
  );
}
