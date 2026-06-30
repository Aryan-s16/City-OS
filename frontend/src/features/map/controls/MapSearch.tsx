"use client";

import { useMemo, useState } from "react";
import { Search, CornerDownLeft } from "lucide-react";
import { cn } from "@ds";
import { GEO_PREDICTIONS, COMMUNITY_REPORTS } from "../data/city";
import { useLiveIssues } from "@/hooks/useLiveIssues";

export interface MapSearchPick {
  lng: number;
  lat: number;
  kind: "issue" | "prediction" | "community";
  id: string;
  label: string;
}

export function MapSearch({ onPick, className }: { onPick: (p: MapSearchPick) => void; className?: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const { issues: liveIssues } = useLiveIssues();

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    
    const index: MapSearchPick[] = [
      ...liveIssues.map((i) => ({ lng: i.lng, lat: i.lat, kind: "issue" as const, id: i.id, label: `${i.title} · ${i.district}` })),
      ...GEO_PREDICTIONS.map((p) => ({ lng: p.lng, lat: p.lat, kind: "prediction" as const, id: p.id, label: p.title })),
      ...COMMUNITY_REPORTS.map((r) => ({ lng: r.lng, lat: r.lat, kind: "community" as const, id: r.id, label: r.title })),
    ];
    
    return index.filter((i) => i.label.toLowerCase().includes(s)).slice(0, 6);
  }, [q, liveIssues]);

  return (
    <div className={cn("w-72 max-w-[60vw]", className)}>
      <div className="glass flex h-10 items-center gap-2 rounded-md px-3 shadow-sm">
        <Search className="h-4 w-4 text-text-subtle" strokeWidth={1.75} />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search the city, ask anything…"
          className="h-full flex-1 bg-transparent text-caption text-text outline-none placeholder:text-text-subtle"
        />
      </div>
      {open && results.length > 0 && (
        <div className="glass mt-2 overflow-hidden rounded-md p-1 shadow-md">
          {results.map((r) => (
            <button
              key={`${r.kind}-${r.id}`}
              onMouseDown={() => onPick(r)}
              className="flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2 text-left transition duration-fast ease-standard hover:bg-hover"
            >
              <span className="truncate text-caption text-text">{r.label}</span>
              <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-text-subtle" strokeWidth={1.75} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
