"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CloudRain,
  Car,
  Wallet,
  HardHat,
  Timer,
  Siren,
  PartyPopper,
  RotateCcw,
} from "lucide-react";
import { Button } from "@ds";
import { duration, easing } from "@/styles/tokens";
import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "warning" | "danger";
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const DEFAULTS = {
  rain: 20,
  traffic: 40,
  budget: 50,
  workers: 50,
  delay: 20,
  emergency: false,
  festival: false,
};
type Controls = typeof DEFAULTS;

const CURRENT = {
  Budget: 78,
  Traffic: 46,
  Repairs: 62,
  Risk: 28,
  Population: 84,
  Environment: 71,
};

/** Higher is better, except Traffic and Risk. */
const INVERTED = new Set(["Traffic", "Risk"]);

function project(c: Controls) {
  const em = c.emergency ? 1 : 0;
  const fe = c.festival ? 1 : 0;
  return {
    Budget: clamp(100 - c.budget * 0.5 - em * 18),
    Traffic: clamp(28 + c.traffic * 0.5 + fe * 22 + em * 12),
    Repairs: clamp(35 + c.workers * 0.45 + c.budget * 0.25 - c.delay * 0.3),
    Risk: clamp(12 + c.rain * 0.4 + c.delay * 0.3 + em * 28 + fe * 8 - c.workers * 0.2),
    Population: clamp(90 - c.rain * 0.1 - em * 14 - c.traffic * 0.05 + fe * 4),
    Environment: clamp(80 - c.rain * 0.12 - c.traffic * 0.15 - em * 6),
  };
}

function toneFor(metric: string, value: number): Tone {
  const good = INVERTED.has(metric) ? value < 45 : value > 60;
  const bad = INVERTED.has(metric) ? value > 65 : value < 40;
  return bad ? "danger" : good ? "success" : "warning";
}

const toneBg: Record<Tone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

function MetricRow({
  name,
  value,
  delta,
}: {
  name: string;
  value: number;
  delta?: number;
}) {
  const tone = toneFor(name, value);
  return (
    <div>
      <div className="flex items-center justify-between text-caption">
        <span className="text-text-muted">{name}</span>
        <span className="flex items-center gap-2">
          {delta !== undefined && delta !== 0 && (
            <span
              className={cn(
                "tabular-nums",
                (INVERTED.has(name) ? delta < 0 : delta > 0)
                  ? "text-success"
                  : "text-danger"
              )}
            >
              {delta > 0 ? "+" : ""}
              {delta}
            </span>
          )}
          <span className="tabular-nums text-text">{value}</span>
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted">
        <motion.div
          className={cn("h-full rounded-full", toneBg[tone])}
          animate={{ width: `${value}%` }}
          transition={{ duration: duration.base, ease: easing.standard }}
        />
      </div>
    </div>
  );
}

function Slider({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: typeof CloudRain;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-caption">
        <span className="flex items-center gap-2 text-text">
          <Icon className="h-4 w-4 text-text-muted" strokeWidth={1.75} />
          {label}
        </span>
        <span className="tabular-nums text-text-muted">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-muted accent-primary"
      />
    </div>
  );
}

function Toggle({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: typeof Siren;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        "flex items-center gap-2 rounded-button border px-3 py-2 text-caption font-medium transition duration-fast ease-standard",
        value
          ? "border-primary/30 bg-primary-soft text-primary"
          : "border-border bg-surface text-text-muted hover:bg-surface-muted"
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
      {label}
    </button>
  );
}

export default function Simulation() {
  const [c, setC] = useState<Controls>(DEFAULTS);
  const future = project(c);
  const set = (patch: Partial<Controls>) => setC((p) => ({ ...p, ...patch }));

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-caption uppercase tracking-widest text-text-subtle">
            Simulation
          </p>
          <h1 className="mt-1 text-heading">What if…</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setC(DEFAULTS)}>
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
          Reset
        </Button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">
        {/* Current city */}
        <div className="col-span-12 rounded-panel border border-border bg-surface p-5 shadow-e1 lg:col-span-4">
          <p className="text-caption uppercase tracking-wider text-text-subtle">
            Current city
          </p>
          <h2 className="mt-1 text-section">Today</h2>
          <div className="mt-5 space-y-4">
            {Object.entries(CURRENT).map(([k, v]) => (
              <MetricRow key={k} name={k} value={v} />
            ))}
          </div>
        </div>

        {/* Future city */}
        <div className="col-span-12 rounded-panel border border-primary/20 bg-primary-soft/40 p-5 shadow-e1 lg:col-span-4">
          <p className="text-caption uppercase tracking-wider text-primary">
            Projected city
          </p>
          <h2 className="mt-1 text-section">Under these conditions</h2>
          <div className="mt-5 space-y-4">
            {Object.entries(future).map(([k, v]) => (
              <MetricRow
                key={k}
                name={k}
                value={v}
                delta={v - CURRENT[k as keyof typeof CURRENT]}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="col-span-12 overflow-y-auto rounded-panel border border-border bg-surface p-5 shadow-e1 lg:col-span-4">
          <p className="text-caption uppercase tracking-wider text-text-subtle">
            Variables
          </p>
          <h2 className="mt-1 text-section">Adjust the city, live</h2>
          <div className="mt-5 space-y-5">
            <Slider icon={CloudRain} label="Rainfall" value={c.rain} onChange={(v) => set({ rain: v })} />
            <Slider icon={Car} label="Traffic load" value={c.traffic} onChange={(v) => set({ traffic: v })} />
            <Slider icon={Wallet} label="Budget spend" value={c.budget} onChange={(v) => set({ budget: v })} />
            <Slider icon={HardHat} label="Crews deployed" value={c.workers} onChange={(v) => set({ workers: v })} />
            <Slider icon={Timer} label="Repair delay" value={c.delay} onChange={(v) => set({ delay: v })} />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Toggle icon={Siren} label="Emergency" value={c.emergency} onChange={(v) => set({ emergency: v })} />
            <Toggle icon={PartyPopper} label="Festival" value={c.festival} onChange={(v) => set({ festival: v })} />
          </div>
        </div>
      </div>
    </div>
  );
}
