"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Bell, ChevronDown, CloudSun, Plus } from "lucide-react";
import { Button } from "@ds";
import { Kbd } from "@/components/ui/Kbd";
import { useCommandPalette } from "@/hooks/useCommandPalette";

function LiveClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  // Render nothing until mounted to avoid hydration mismatch.
  return <span className="tabular-nums">{now ?? "—:—"}</span>;
}

/**
 * Top context bar: city, time, weather, global search, notifications, profile.
 * 72px, borderless, generous whitespace.
 */
export function TopBar() {
  const openPalette = useCommandPalette((s) => s.setOpen);

  return (
    <header className="flex h-[72px] shrink-0 items-center gap-4 px-6">
      {/* City selector */}
      <button className="flex items-center gap-2 rounded-button px-3 py-2 font-medium transition duration-fast ease-standard hover:bg-surface-muted">
        <span className="h-2 w-2 rounded-full bg-success" />
        San Francisco
        <ChevronDown className="h-4 w-4 text-text-subtle" strokeWidth={1.75} />
      </button>

      {/* Time + weather */}
      <div className="hidden items-center gap-4 text-caption text-text-muted md:flex">
        <LiveClock />
        <span className="flex items-center gap-1.5">
          <CloudSun className="h-4 w-4" strokeWidth={1.75} />
          18° · Light rain in 6h
        </span>
      </div>

      {/* Global search → command palette */}
      <button
        onClick={() => openPalette(true)}
        className="group ml-auto flex h-10 w-full max-w-sm items-center gap-3 rounded-button border border-border bg-surface px-4 text-left text-text-subtle transition duration-fast ease-standard hover:border-border-strong"
      >
        <Search className="h-4 w-4" strokeWidth={1.75} />
        <span className="flex-1 truncate">Search the city, ask anything…</span>
        <Kbd>⌘K</Kbd>
      </button>

      <Button asChild size="sm" className="hidden sm:inline-flex">
        <Link href="/report">
          <Plus className="h-4 w-4" strokeWidth={2} />
          New report
        </Link>
      </Button>

      <button
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-button text-text-muted transition duration-fast ease-standard hover:bg-surface-muted hover:text-text"
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-bg bg-danger" />
      </button>
    </header>
  );
}
