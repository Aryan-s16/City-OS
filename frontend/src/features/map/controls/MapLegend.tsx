"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { StatusDot, cn } from "@ds";

const ITEMS: { tone: "danger" | "warning" | "primary" | "success" | "info"; label: string }[] = [
  { tone: "danger", label: "Critical" },
  { tone: "warning", label: "Warning" },
  { tone: "primary", label: "Normal · Predicted" },
  { tone: "success", label: "Resolved" },
  { tone: "info", label: "Coverage" },
];

export function MapLegend({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      {open ? (
        <div className="glass rounded-md p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-6">
            <span className="text-overline uppercase text-text-subtle">Legend</span>
            <button onClick={() => setOpen(false)} aria-label="Collapse legend" className="text-text-subtle hover:text-text">
              <ChevronUp className="h-3.5 w-3.5 rotate-180" strokeWidth={2} />
            </button>
          </div>
          <div className="space-y-1.5">
            {ITEMS.map((i) => (
              <StatusDot key={i.label} tone={i.tone} label={i.label} />
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="glass flex items-center gap-1.5 rounded-md px-3 py-2 text-caption text-text-muted shadow-sm hover:text-text"
        >
          <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} /> Legend
        </button>
      )}
    </div>
  );
}
