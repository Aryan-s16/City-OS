"use client";

import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { cn } from "@ds";

export const FRAMES = ["Today", "Tomorrow", "3 Days", "7 Days", "30 Days"];

export function TimelineSlider({
  frame,
  onFrame,
  simulate,
  onToggleSimulate,
  className,
}: {
  frame: number;
  onFrame: (i: number) => void;
  simulate: boolean;
  onToggleSimulate: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="glass rounded-dialog p-2 shadow-sm">
        <div className="flex items-center gap-1">
          {FRAMES.map((f, i) => (
            <button
              key={f}
              onClick={() => onFrame(i)}
              className={cn(
                "relative rounded-md px-3 py-1.5 text-caption font-medium transition duration-fast ease-standard",
                i === frame ? "text-on-primary" : "text-text-muted hover:text-text"
              )}
            >
              {i === frame && (
                <motion.span
                  layoutId="twin-frame"
                  className="absolute inset-0 rounded-md bg-primary"
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                />
              )}
              <span className="relative">{f}</span>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={onToggleSimulate}
        className={cn(
          "flex h-11 items-center gap-2 rounded-dialog px-4 text-caption font-medium shadow-sm transition duration-fast ease-standard",
          simulate ? "bg-primary text-on-primary" : "glass text-text-muted hover:text-text"
        )}
      >
        <Wand2 className="h-4 w-4" strokeWidth={1.75} />
        {simulate ? "Exit simulation" : "Simulate"}
      </button>
    </div>
  );
}
