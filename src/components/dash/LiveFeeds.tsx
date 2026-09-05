import { Camera, Grid2X2, List, Move3D, Plus, Settings2, Bell } from "lucide-react";
import cam01 from "@/assets/cam01.jpg";
import cam02 from "@/assets/cam02.jpg";
import cam03 from "@/assets/cam03.jpg";
import cam04 from "@/assets/cam04.jpg";

type Box = { x: number; y: number; w: number; h: number; tag: string; tone: "danger" | "success" };

type Feed = {
  id: string;
  name: string;
  src: string;
  zone?: { points: string; tone: "danger" | "warning" };
  boxes: Box[];
};

const feeds: Feed[] = [
  {
    id: "CAM 01",
    name: "Main Gate",
    src: cam01,
    zone: { points: "6,92 38,52 58,54 46,96", tone: "danger" },
    boxes: [{ x: 38, y: 46, w: 11, h: 34, tag: "PERSON 0.96", tone: "danger" }],
  },
  {
    id: "CAM 02",
    name: "Perimeter North",
    src: cam02,
    zone: { points: "18,58 62,38 96,52 82,84", tone: "warning" },
    boxes: [{ x: 66, y: 24, w: 18, h: 20, tag: "VEHICLE 0.91", tone: "danger" }],
  },
  {
    id: "CAM 03",
    name: "Check Post",
    src: cam03,
    boxes: [
      { x: 60, y: 52, w: 22, h: 26, tag: "VEHICLE 0.88", tone: "success" },
      { x: 33, y: 42, w: 8, h: 36, tag: "PERSON 0.93", tone: "success" },
    ],
  },
  {
    id: "CAM 04",
    name: "River Bank",
    src: cam04,
    boxes: [
      { x: 28, y: 42, w: 8, h: 26, tag: "PERSON", tone: "success" },
      { x: 60, y: 44, w: 8, h: 24, tag: "PERSON", tone: "success" },
    ],
  },
];

function FeedTile({ feed }: { feed: Feed }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-panel transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <p className="truncate text-xs font-semibold tracking-wide">
          {feed.id} — {feed.name}
        </p>
        <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-semibold text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          LIVE
        </span>
      </div>

      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <img
          src={feed.src}
          alt={`${feed.id} ${feed.name} live feed`}
          loading="lazy"
          width={960}
          height={540}
          className="h-full w-full object-cover opacity-90"
        />

        {feed.zone && (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <polygon
              points={feed.zone.points}
              className={
                feed.zone.tone === "danger"
                  ? "fill-danger/15 stroke-danger"
                  : "fill-warning/10 stroke-warning"
              }
              strokeWidth={0.6}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}

        {feed.boxes.map((box, i) => (
          <div
            key={i}
            className={`absolute border-2 ${box.tone === "danger" ? "border-danger" : "border-success"}`}
            style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` }}
          >
            <span
              className={`absolute -top-4 left-0 whitespace-nowrap px-1 text-[9px] font-bold text-background ${
                box.tone === "danger" ? "bg-danger" : "bg-success"
              }`}
            >
              {box.tag}
            </span>
          </div>
        ))}

        <span className="absolute right-2 top-2 rounded bg-background/70 px-1.5 py-0.5 text-[10px] tabular-nums text-foreground/80">
          10:25:02 PM
        </span>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-background/90 to-transparent px-2 py-2">
          <div className="flex items-center gap-1">
            {[Camera, Move3D, Settings2].map((Icon, i) => (
              <button
                key={i}
                className="grid h-7 w-7 place-items-center rounded-md bg-background/60 text-foreground/80 transition-colors hover:bg-primary/30 hover:text-foreground"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
          <Bell className="h-4 w-4 shrink-0 text-danger" />
        </div>
      </div>
    </div>
  );
}

export function LiveFeeds() {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="truncate text-sm font-bold tracking-[0.12em] text-foreground">LIVE FEEDS</h2>
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex overflow-hidden rounded-md border border-border">
            <button className="grid h-8 w-8 place-items-center bg-accent text-foreground">
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button className="grid h-8 w-8 place-items-center text-muted-foreground transition-colors hover:text-foreground">
              <List className="h-4 w-4" />
            </button>
          </div>
          <button className="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/85">
            <Plus className="h-3.5 w-3.5" />
            Add Camera
          </button>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {feeds.map((feed) => (
          <FeedTile key={feed.id} feed={feed} />
        ))}
      </div>
    </section>
  );
}
