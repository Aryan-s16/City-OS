"use client";

import { ZoomIn, ZoomOut, LocateFixed, RotateCcw, Maximize2, Moon, Sun } from "lucide-react";
import { cn } from "@ds";

function Ctl({ label, onClick, children }: { label: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="glass flex h-10 w-10 items-center justify-center text-text-muted shadow-sm transition duration-fast ease-standard first:rounded-t-md last:rounded-b-md hover:text-text"
    >
      {children}
    </button>
  );
}

export interface MapControlsProps {
  theme: "light" | "dark";
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
  onReset: () => void;
  onFullscreen: () => void;
  onToggleTheme: () => void;
  className?: string;
}

/** Minimal custom map controls, design-system consistent. */
export function MapControls({
  theme, onZoomIn, onZoomOut, onLocate, onReset, onFullscreen, onToggleTheme, className,
}: MapControlsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-col overflow-hidden rounded-md shadow-sm">
        <Ctl label="Zoom in" onClick={onZoomIn}><ZoomIn className="h-4 w-4" strokeWidth={1.75} /></Ctl>
        <span className="mx-2 h-px bg-border" />
        <Ctl label="Zoom out" onClick={onZoomOut}><ZoomOut className="h-4 w-4" strokeWidth={1.75} /></Ctl>
      </div>
      <div className="flex flex-col overflow-hidden rounded-md shadow-sm">
        <Ctl label="Locate me" onClick={onLocate}><LocateFixed className="h-4 w-4" strokeWidth={1.75} /></Ctl>
        <span className="mx-2 h-px bg-border" />
        <Ctl label="Reset camera" onClick={onReset}><RotateCcw className="h-4 w-4" strokeWidth={1.75} /></Ctl>
      </div>
      <div className="flex flex-col overflow-hidden rounded-md shadow-sm">
        <Ctl label={theme === "dark" ? "Light mode" : "Dark mode"} onClick={onToggleTheme}>
          {theme === "dark" ? <Sun className="h-4 w-4" strokeWidth={1.75} /> : <Moon className="h-4 w-4" strokeWidth={1.75} />}
        </Ctl>
        <span className="mx-2 h-px bg-border" />
        <Ctl label="Fullscreen" onClick={onFullscreen}><Maximize2 className="h-4 w-4" strokeWidth={1.75} /></Ctl>
      </div>
    </div>
  );
}
