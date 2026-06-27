"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  TrafficCone,
  RadioTower,
  CheckCircle2,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { MapBackground } from "@/components/workspace/MapBackground";
import { MapPin } from "./MapPin";
import { ISSUES, PREDICTIONS } from "@/lib/mock";
import { useContextPanel } from "@/hooks/useContextPanel";
import { cn, type Tone } from "@ds";

export type MapLayer =
  | "incidents"
  | "predictions"
  | "heatmap"
  | "routes"
  | "crews"
  | "departments";

const ISSUE_META: Record<string, { icon: LucideIcon; live: boolean; resolved: boolean }> = {
  "i-1": { icon: Droplets, live: true, resolved: false },
  "i-2": { icon: TrafficCone, live: true, resolved: false },
  "i-3": { icon: RadioTower, live: true, resolved: false },
  "i-4": { icon: CheckCircle2, live: false, resolved: true },
};

const ZONES = [
  { id: "p-1", x: 28, y: 60, tone: "danger" as Tone },
  { id: "p-2", x: 60, y: 42, tone: "warning" as Tone },
];

const HEAT = [
  { x: "40%", y: "56%", tone: "danger" },
  { x: "66%", y: "36%", tone: "warning" },
  { x: "22%", y: "42%", tone: "info" },
];

const DEPARTMENTS = [
  { x: "6%", y: "16%", w: "30%", h: "30%", tone: "info", name: "Water" },
  { x: "60%", y: "58%", w: "32%", h: "30%", tone: "success", name: "Roads" },
];

const heatColor: Record<string, string> = {
  danger: "rgb(var(--danger) / 0.30)",
  warning: "rgb(var(--warning) / 0.28)",
  info: "rgb(var(--info) / 0.26)",
};
const deptBg: Record<string, string> = {
  info: "bg-info/10 border-info/20",
  success: "bg-success/10 border-success/20",
};

export function DigitalTwinCanvas({
  layers,
  frame,
  simulate,
  className,
}: {
  layers: Set<MapLayer>;
  frame: number;
  simulate: boolean;
  className?: string;
}) {
  const { kind, id, select } = useContextPanel();
  const t = frame / 4;
  const intensify = simulate ? 1.3 : 1;

  return (
    <div className={cn("relative h-full min-h-[480px] w-full overflow-hidden rounded-map border border-border bg-surface-muted", className)}>
      <MapBackground dim />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/30 via-transparent to-bg/10" />

      {/* Simulation tint */}
      {simulate && (
        <div className="pointer-events-none absolute inset-0 bg-danger/[0.04]" />
      )}

      {/* Department coverage */}
      {layers.has("departments") &&
        DEPARTMENTS.map((d) => (
          <div
            key={d.name}
            className={cn("absolute rounded-xl border", deptBg[d.tone])}
            style={{ left: d.x, top: d.y, width: d.w, height: d.h }}
          >
            <span className="absolute left-3 top-2 text-caption font-medium text-text-muted">
              {d.name}
            </span>
          </div>
        ))}

      {/* Heatmap */}
      {layers.has("heatmap") &&
        HEAT.map((h, i) => (
          <div
            key={i}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: h.x,
              top: h.y,
              width: 220 * intensify,
              height: 220 * intensify,
              background: `radial-gradient(circle, ${heatColor[h.tone]}, transparent 70%)`,
            }}
          />
        ))}

      {/* Routes + crews */}
      {(layers.has("routes") || layers.has("crews")) && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
          {layers.has("routes") && (
            <motion.path
              d="M18,30 L34,42 L46,58 L60,66"
              fill="none"
              style={{ stroke: "rgb(var(--primary))" }}
              strokeWidth={1.5}
              strokeDasharray="3 4"
              vectorEffect="non-scaling-stroke"
              initial={{ strokeDashoffset: 28 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
          )}
        </svg>
      )}
      {layers.has("crews") && (
        <motion.div
          className="absolute z-raised flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-on-primary shadow-md"
          animate={{
            left: ["18%", "34%", "46%", "60%", "46%", "34%", "18%"],
            top: ["30%", "42%", "58%", "66%", "58%", "42%", "30%"],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          <Truck className="h-3.5 w-3.5" strokeWidth={2} />
        </motion.div>
      )}

      {/* Prediction zones */}
      {layers.has("predictions") &&
        ZONES.map((z) => {
          const p = PREDICTIONS.find((x) => x.id === z.id);
          const prob = p?.probability ?? 0.5;
          const size = (120 + prob * 150 * (1 + t)) * intensify;
          const selected = kind === "prediction" && id === z.id;
          return (
            <button
              key={z.id}
              onClick={() => select("prediction", z.id)}
              className="absolute z-raised -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${z.x}%`, top: `${z.y}%` }}
            >
              <motion.span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: size,
                  height: size,
                  background: `radial-gradient(circle, ${heatColor[z.tone]}, transparent 70%)`,
                }}
                animate={{ opacity: [0.55, 0.85, 0.55] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <span
                className={cn(
                  "relative flex items-center gap-1 rounded-full border border-primary/40 bg-surface/85 px-2.5 py-1 shadow-sm backdrop-blur-sm",
                  selected && "ring-2 ring-primary"
                )}
              >
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-caption font-medium tabular-nums">
                  {Math.round(prob * 100 * (1 + t * 0.4))}%
                </span>
              </span>
            </button>
          );
        })}

      {/* Incident pins */}
      {layers.has("incidents") &&
        ISSUES.map((issue, i) => {
          const meta = ISSUE_META[issue.id];
          return (
            <MapPin
              key={issue.id}
              x={issue.x}
              y={issue.y}
              icon={meta.icon}
              tone={issue.tone}
              label={issue.title}
              meta={issue.district}
              live={meta.live}
              resolved={meta.resolved}
              selected={kind === "issue" && id === issue.id}
              delay={i * 0.08}
              onClick={() => select("issue", issue.id)}
            />
          );
        })}
    </div>
  );
}
