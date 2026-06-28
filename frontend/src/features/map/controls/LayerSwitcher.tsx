"use client";

import { cn } from "@ds";
import type { MapLayerId } from "../types";

export const LAYER_OPTIONS: { id: MapLayerId; label: string }[] = [
  { id: "incidents", label: "Incidents" },
  { id: "predictions", label: "Predictions" },
  { id: "heatmap", label: "Heatmap" },
  { id: "routes", label: "Routes" },
  { id: "crews", label: "Crews" },
  { id: "departments", label: "Departments" },
  { id: "community", label: "Community" },
];

export function LayerSwitcher({
  layers,
  onToggle,
  className,
}: {
  layers: Set<MapLayerId>;
  onToggle: (id: MapLayerId) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {LAYER_OPTIONS.map((l) => {
        const on = layers.has(l.id);
        return (
          <button
            key={l.id}
            onClick={() => onToggle(l.id)}
            aria-pressed={on}
            className={cn(
              "rounded-full border px-3 py-1.5 text-caption font-medium shadow-xs transition duration-fast ease-standard",
              on
                ? "border-primary/30 bg-primary-soft text-primary"
                : "glass border-border text-text-muted hover:text-text"
            )}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
