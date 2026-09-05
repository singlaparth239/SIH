import { createFileRoute } from "@tanstack/react-router";
import { Bell, LogOut, Maximize2, Menu, SunMedium } from "lucide-react";
import { Sidebar } from "@/components/dash/Sidebar";
import { MetricCards } from "@/components/dash/MetricCards";
import { LiveFeeds } from "@/components/dash/LiveFeeds";
import { EventsAndMap } from "@/components/dash/EventsAndMap";
import { RightPanel } from "@/components/dash/RightPanel";
import { StatusBar } from "@/components/dash/StatusBar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Border Surveillance — AI Video Analytics Control Room" },
      {
        name: "description",
        content:
          "Mission-critical AI border surveillance dashboard with live camera feeds, intrusion alerts, event analytics and system health monitoring.",
      },
      { property: "og:title", content: "Border Surveillance — AI Video Analytics Control Room" },
      {
        property: "og:description",
        content:
          "Live CCTV feeds, real-time intrusion alerts, ANPR, event analytics and alarm control in one dark-mode command center.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <button className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground">
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex min-w-0 items-center gap-2 rounded-lg border border-danger/50 bg-danger/15 px-3 py-2">
              <Bell className="h-4 w-4 shrink-0 animate-pulse text-danger" />
              <span className="truncate text-xs font-bold tracking-wide text-danger">
                3 ACTIVE ALERTS
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {[SunMedium, Maximize2, LogOut].map((Icon, i) => (
              <button
                key={i}
                className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </header>

        <main className="min-w-0 flex-1 space-y-3 p-3 md:p-4">
          <MetricCards />
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="min-w-0 flex-1 space-y-3">
              <LiveFeeds />
              <EventsAndMap />
            </div>
            <RightPanel />
          </div>
          <StatusBar />
        </main>
      </div>
    </div>
  );
}
