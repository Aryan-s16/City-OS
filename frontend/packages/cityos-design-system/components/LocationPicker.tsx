"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, LocateFixed, Search as SearchIcon, Check } from "lucide-react";
import { cn } from "../utils";

export interface LatLngLike {
  x: number; // % across
  y: number; // % down
}

const LANDMARKS = [
  { name: "Market & 5th St", x: 46, y: 48 },
  { name: "Mission District", x: 28, y: 64 },
  { name: "Embarcadero", x: 74, y: 30 },
  { name: "Civic Center", x: 40, y: 38 },
  { name: "SoMa", x: 56, y: 60 },
];

function nearest(p: LatLngLike) {
  let best = LANDMARKS[0];
  let bestD = Infinity;
  for (const l of LANDMARKS) {
    const d = (l.x - p.x) ** 2 + (l.y - p.y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = l;
    }
  }
  // Closer to a known landmark → higher confidence.
  const confidence = Math.max(0.62, Math.min(0.98, 1 - Math.sqrt(bestD) / 80));
  return { landmark: best, confidence };
}

export interface LocationPickerProps {
  value?: LatLngLike;
  onChange?: (p: LatLngLike, address: string) => void;
  className?: string;
}

/** Never raw coordinates — a real map with search, marker, address & confidence. */
export function LocationPicker({ value, onChange, className }: LocationPickerProps) {
  const [pos, setPos] = useState<LatLngLike>(value ?? { x: 46, y: 48 });
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const { landmark, confidence } = useMemo(() => nearest(pos), [pos]);
  const address = `Near ${landmark.name}, San Francisco`;

  const place = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100));
    const y = Math.max(2, Math.min(98, ((clientY - r.top) / r.height) * 100));
    const p = { x, y };
    setPos(p);
    onChange?.(p, `Near ${nearest(p).landmark.name}, San Francisco`);
  };

  const submitSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const hit = LANDMARKS.find((l) => l.name.toLowerCase().includes(q));
    if (hit) {
      const p = { x: hit.x, y: hit.y };
      setPos(p);
      onChange?.(p, `Near ${hit.name}, San Francisco`);
    }
  };

  return (
    <div className={className}>
      {/* Search + current location */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            placeholder="Search for a place…"
            className="h-11 w-full rounded-md border border-border bg-surface pl-10 pr-4 text-body text-text outline-none transition duration-fast ease-standard placeholder:text-text-subtle hover:border-border-strong focus:border-focus focus:ring-2 focus:ring-focus/25"
          />
        </div>
        <button
          onClick={() => {
            const p = { x: 46, y: 48 };
            setPos(p);
            onChange?.(p, `Near ${nearest(p).landmark.name}, San Francisco`);
          }}
          className="flex h-11 items-center gap-2 rounded-md border border-border bg-surface px-3 text-caption font-medium text-text-muted transition duration-fast ease-standard hover:text-text"
        >
          <LocateFixed className="h-4 w-4" strokeWidth={1.75} />
          Current
        </button>
      </div>

      {/* Map */}
      <div
        ref={ref}
        onClick={(e) => place(e.clientX, e.clientY)}
        onPointerMove={(e) => dragging.current && place(e.clientX, e.clientY)}
        className="relative mt-3 h-64 w-full cursor-crosshair overflow-hidden rounded-xl border border-border bg-surface-muted"
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M -5 30 C 30 38 50 22 105 36 L 105 50 C 60 38 30 52 -5 46 Z" style={{ fill: "rgb(var(--info-soft))" }} />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 12.5} y1={0} x2={i * 12.5} y2={100} style={{ stroke: "rgb(var(--border))" }} strokeWidth={0.4} vectorEffect="non-scaling-stroke" />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 16} x2={100} y2={i * 16} style={{ stroke: "rgb(var(--border))" }} strokeWidth={0.4} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>

        {/* Marker */}
        <motion.button
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          }}
          onPointerUp={() => (dragging.current = false)}
          onClick={(e) => e.stopPropagation()}
          className="absolute -translate-x-1/2 -translate-y-full cursor-grab active:cursor-grabbing"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          aria-label="Drag to set location"
        >
          <span className="relative flex flex-col items-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary shadow-md">
              <MapPin className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="-mt-1 h-2 w-2 rotate-45 bg-primary" />
          </span>
        </motion.button>
      </div>

      {/* Address preview + confidence */}
      <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
        <Check className="h-4 w-4 shrink-0 text-success" strokeWidth={2} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-body text-text">{address}</p>
          <p className="text-caption text-text-muted">
            Location confidence {Math.round(confidence * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}
