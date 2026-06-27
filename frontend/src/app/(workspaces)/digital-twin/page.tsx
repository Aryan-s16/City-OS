"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Layers,
  ZoomIn,
  ZoomOut,
  LocateFixed,
  Maximize2,
  Search,
  Sparkles,
  ChevronUp,
  Wand2,
} from "lucide-react";
import {
  DigitalTwinCanvas,
  type MapLayer,
} from "@/components/map/DigitalTwinCanvas";
import { AdaptiveContextPanel } from "@/components/workspace/AdaptiveContextPanel";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { StatusDot, cn } from "@ds";

const LAYERS: { id: MapLayer; label: string }[] = [
  { id: "incidents", label: "Incidents" },
  { id: "predictions", label: "Predictions" },
  { id: "heatmap", label: "Heatmap" },
  { id: "routes", label: "Routes" },
  { id: "crews", label: "Crews" },
  { id: "departments", label: "Departments" },
];

const FRAMES = ["Today", "Tomorrow", "3 Days", "7 Days", "30 Days"];

const THINKING = [
  "Analyzing nearby infrastructure…",
  "Predicting future failures…",
  "Calculating optimal routes…",
  "Searching historical reports…",
];

const LEGEND: { tone: "danger" | "warning" | "primary" | "success"; label: string }[] = [
  { tone: "danger", label: "Critical" },
  { tone: "warning", label: "Warning" },
  { tone: "primary", label: "Normal · Predicted" },
  { tone: "success", label: "Resolved" },
];

function MapButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick?: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "glass flex h-10 w-10 items-center justify-center rounded-md shadow-sm transition duration-fast ease-standard",
        active ? "text-primary" : "text-text-muted hover:text-text"
      )}
    >
      {children}
    </button>
  );
}

export default function DigitalTwin() {
  const openPalette = useCommandPalette((s) => s.setOpen);
  const mapRef = useRef<HTMLDivElement>(null);

  const [layers, setLayers] = useState<Set<MapLayer>>(
    new Set<MapLayer>(["incidents", "predictions"])
  );
  const [frame, setFrame] = useState(0);
  const [simulate, setSimulate] = useState(false);
  const [showLayers, setShowLayers] = useState(true);
  const [legendOpen, setLegendOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [think, setThink] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setThink((i) => (i + 1) % THINKING.length), 2800);
    return () => clearInterval(t);
  }, []);

  const toggleLayer = (id: MapLayer) =>
    setLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const fullscreen = () => {
    const el = mapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  return (
    <div className="flex h-full flex-col p-6">
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">
        {/* Map */}
        <div
          ref={mapRef}
          className="relative col-span-12 min-h-[480px] overflow-hidden rounded-map bg-bg lg:col-span-8 xl:col-span-9"
        >
          <div
            className="h-full w-full transition-transform duration-slow ease-standard"
            style={{ transform: `scale(${zoom})` }}
          >
            <DigitalTwinCanvas layers={layers} frame={frame} simulate={simulate} className="h-full" />
          </div>

          {/* Title + AI thinking */}
          <div className="pointer-events-none absolute left-4 top-4 z-20">
            <p className="text-overline uppercase tracking-widest text-text-subtle">
              Digital Twin
            </p>
            <h1 className="mt-1 text-title">
              {simulate ? "Projected city" : "Predictive city"} · {FRAMES[frame]}
            </h1>
            <div className="mt-1 flex h-5 items-center gap-2 text-caption text-text-muted">
              <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={think}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {THINKING[think]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Search */}
          <button
            onClick={() => openPalette(true)}
            className="glass absolute left-1/2 top-4 z-20 flex h-10 w-72 max-w-[60%] -translate-x-1/2 items-center gap-2 rounded-md px-3 text-left text-text-subtle shadow-sm"
          >
            <Search className="h-4 w-4" strokeWidth={1.75} />
            <span className="flex-1 truncate text-caption">Search the city, ask anything…</span>
          </button>

          {/* Controls */}
          <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
            <MapButton label="Toggle layers" active={showLayers} onClick={() => setShowLayers((s) => !s)}>
              <Layers className="h-4 w-4" strokeWidth={1.75} />
            </MapButton>
            <MapButton label="Zoom in" onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.15).toFixed(2)))}>
              <ZoomIn className="h-4 w-4" strokeWidth={1.75} />
            </MapButton>
            <MapButton label="Zoom out" onClick={() => setZoom((z) => Math.max(1, +(z - 0.15).toFixed(2)))}>
              <ZoomOut className="h-4 w-4" strokeWidth={1.75} />
            </MapButton>
            <MapButton label="Locate me" onClick={() => setZoom(1)}>
              <LocateFixed className="h-4 w-4" strokeWidth={1.75} />
            </MapButton>
            <MapButton label="Fullscreen" onClick={fullscreen}>
              <Maximize2 className="h-4 w-4" strokeWidth={1.75} />
            </MapButton>
          </div>

          {/* Layer chips */}
          <AnimatePresence>
            {showLayers && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="absolute left-4 top-24 z-20 flex max-w-[70%] flex-wrap gap-2"
              >
                {LAYERS.map((l) => {
                  const on = layers.has(l.id);
                  return (
                    <button
                      key={l.id}
                      onClick={() => toggleLayer(l.id)}
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-20">
            {legendOpen ? (
              <div className="glass rounded-md p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-6">
                  <span className="text-overline uppercase text-text-subtle">Legend</span>
                  <button onClick={() => setLegendOpen(false)} aria-label="Collapse legend" className="text-text-subtle hover:text-text">
                    <ChevronUp className="h-3.5 w-3.5 rotate-180" strokeWidth={2} />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {LEGEND.map((l) => (
                    <StatusDot key={l.label} tone={l.tone} label={l.label} />
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setLegendOpen(true)}
                className="glass flex items-center gap-1.5 rounded-md px-3 py-2 text-caption text-text-muted shadow-sm hover:text-text"
              >
                <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} /> Legend
              </button>
            )}
          </div>

          {/* Time slider + simulate */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            <div className="glass rounded-dialog p-2 shadow-sm">
              <div className="flex items-center gap-1">
                {FRAMES.map((f, i) => (
                  <button
                    key={f}
                    onClick={() => setFrame(i)}
                    className={cn(
                      "relative rounded-md px-3 py-1.5 text-caption font-medium transition duration-fast ease-standard",
                      i === frame ? "text-on-primary" : "text-text-muted hover:text-text"
                    )}
                  >
                    {i === frame && (
                      <motion.span layoutId="twin-frame" className="absolute inset-0 rounded-md bg-primary" transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }} />
                    )}
                    <span className="relative">{f}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setSimulate((s) => !s)}
              className={cn(
                "flex h-11 items-center gap-2 rounded-dialog px-4 text-caption font-medium shadow-sm transition duration-fast ease-standard",
                simulate ? "bg-primary text-on-primary" : "glass text-text-muted hover:text-text"
              )}
            >
              <Wand2 className="h-4 w-4" strokeWidth={1.75} />
              {simulate ? "Exit simulation" : "Simulate"}
            </button>
          </div>
        </div>

        {/* Adaptive context panel */}
        <div className="col-span-12 min-h-[480px] lg:col-span-4 xl:col-span-3">
          <AdaptiveContextPanel className="h-full" />
        </div>
      </div>
    </div>
  );
}
