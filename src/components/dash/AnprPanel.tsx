import { useEffect, useRef, useState } from "react";
import { Car, Truck, Bike, X, ScanLine } from "lucide-react";

type Plate = {
  id: number;
  plate: string;
  time: string;
  cam: string;
  type: "car" | "truck" | "bike";
  flagged?: boolean;
};

const CAMS = [
  "CAM 01 — Main Gate",
  "CAM 02 — Perimeter North",
  "CAM 03 — Check Post",
  "CAM 04 — River Bank",
];

const STATES = ["DL", "HR", "PB", "RJ", "UP", "JK"];
const LETTERS = "ABCDEFGHJKLMNPRSTUVWXYZ";
const TYPES: Plate["type"][] = ["car", "truck", "bike"];

function randomPlate(): string {
  const s = STATES[Math.floor(Math.random() * STATES.length)]!;
  const d = Math.floor(Math.random() * 9) + 1;
  const l =
    LETTERS[Math.floor(Math.random() * LETTERS.length)]! +
    LETTERS[Math.floor(Math.random() * LETTERS.length)]!;
  const n = String(Math.floor(Math.random() * 9000) + 1000);
  return `${s} ${d}C ${l} ${n}`;
}

let seq = 1;
function makePlate(): Plate {
  return {
    id: seq++,
    plate: randomPlate(),
    time: new Date().toLocaleTimeString("en-US", { hour12: true }),
    cam: CAMS[Math.floor(Math.random() * CAMS.length)]!,
    type: TYPES[Math.floor(Math.random() * TYPES.length)]!,
    flagged: Math.random() < 0.18,
  };
}

const typeIcon = { car: Car, truck: Truck, bike: Bike };

export function AnprPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [plates, setPlates] = useState<Plate[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) return;
    setPlates(Array.from({ length: 5 }, makePlate));
    timer.current = setInterval(() => {
      setPlates((prev) => [makePlate(), ...prev].slice(0, 40));
    }, 3200);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [open]);

  if (!open) return null;

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
        <span className="flex items-center gap-1.5 text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          ANPR ACTIVE
        </span>
        <span className="tabular-nums">{plates.length} DETECTIONS</span>
      </div>

      <ul className="max-h-[560px] space-y-2 overflow-y-auto px-3 pb-3">
        {plates.map((p) => {
          const Icon = typeIcon[p.type];
          return (
            <li
              key={p.id}
              className="animate-plate-in rounded-lg border border-border bg-panel p-3 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md border-2 px-2 py-1 font-mono text-sm font-bold tracking-widest tabular-nums ${
                    p.flagged
                      ? "border-danger bg-danger/15 text-danger"
                      : "border-foreground/60 bg-background text-foreground"
                  }`}
                >
                  {p.plate}
                </span>
                <Icon
                  className={`ml-auto h-4 w-4 shrink-0 ${p.flagged ? "text-danger" : "text-primary"}`}
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <span className="truncate">{p.cam}</span>
                <span className="shrink-0 tabular-nums">{p.time}</span>
              </div>
              {p.flagged && (
                <p className="mt-1.5 text-[10px] font-bold tracking-[0.14em] text-danger">
                  WATCHLIST MATCH
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
