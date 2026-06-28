"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  TrafficCone,
  Zap,
  Trash2,
  RadioTower,
  Lightbulb,
  Truck,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";
import { cn, type Tone } from "@ds";
import type { GeoIssue, IssueCategory } from "../types";

const CATEGORY_ICON: Record<IssueCategory, LucideIcon> = {
  road: TrafficCone,
  water: Droplets,
  electrical: Zap,
  garbage: Trash2,
  signal: RadioTower,
  streetlight: Lightbulb,
};

const ring: Record<Tone, string> = {
  danger: "border-danger",
  warning: "border-warning",
  primary: "border-primary",
  success: "border-success",
  info: "border-info",
  neutral: "border-border-strong",
};
const text: Record<Tone, string> = {
  danger: "text-danger",
  warning: "text-warning",
  primary: "text-primary",
  success: "text-success",
  info: "text-info",
  neutral: "text-text-muted",
};
const dot: Record<Tone, string> = {
  danger: "bg-danger",
  warning: "bg-warning",
  primary: "bg-primary",
  success: "bg-success",
  info: "bg-info",
  neutral: "bg-text-subtle",
};

/** Custom incident pin — category icon + priority ring + status. */
export function IssuePin({
  issue,
  selected,
  dimmed,
  onClick,
}: {
  issue: GeoIssue;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: () => void;
}) {
  const Icon = CATEGORY_ICON[issue.category];
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      aria-label={`${issue.title}, ${issue.district}`}
      className={cn("group relative block", dimmed && !selected && "opacity-40")}
    >
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
        className="relative block"
      >
        {issue.live && !issue.resolved && (
          <motion.span
            className={cn("absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full", dot[issue.tone])}
            initial={{ opacity: 0.3, scale: 1 }}
            animate={{ opacity: 0, scale: 2.2 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-full border-2 bg-surface shadow-md transition-all duration-fast ease-standard",
            ring[issue.tone],
            text[issue.tone],
            "group-hover:-translate-y-0.5 group-hover:shadow-lg",
            selected && "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-bg"
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface",
              issue.resolved ? "bg-success" : dot[issue.tone]
            )}
          />
        </span>
      </motion.span>
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-text px-2.5 py-1 text-caption font-medium text-bg opacity-0 shadow-md transition duration-fast ease-standard group-hover:opacity-100">
        {issue.title}
      </span>
    </button>
  );
}

/** Cluster bubble — count + dominant tone. */
export function ClusterBubble({
  count,
  tone = "primary",
  onClick,
}: {
  count: number;
  tone?: Tone;
  onClick?: () => void;
}) {
  const size = count < 10 ? 36 : count < 50 ? 44 : 52;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      aria-label={`${count} incidents`}
      className="relative flex items-center justify-center rounded-full border-2 border-surface bg-surface shadow-md transition duration-fast ease-standard hover:shadow-lg"
      style={{ width: size, height: size }}
    >
      <span className={cn("absolute inset-1 rounded-full opacity-15", dot[tone])} />
      <span className={cn("relative text-body-sm font-semibold tabular-nums", text[tone])}>
        {count}
      </span>
    </button>
  );
}

/** Repair crew marker. */
export function CrewBadge({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      aria-label="Repair crew"
      className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-on-primary shadow-md ring-2 ring-surface"
    >
      <Truck className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  );
}

/** Community report marker — vote pill. */
export function CommunityPin({
  votes,
  selected,
  onClick,
}: {
  votes: number;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      aria-label={`Community report, ${votes} votes`}
      className={cn(
        "flex items-center gap-1.5 rounded-full border border-surface bg-surface px-2.5 py-1 shadow-md transition duration-fast ease-standard hover:shadow-lg",
        selected && "ring-2 ring-primary"
      )}
    >
      <ThumbsUp className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.75} />
      <span className="text-caption font-medium tabular-nums">{votes}</span>
    </button>
  );
}

const glow: Record<string, string> = {
  danger: "rgb(var(--danger) / 0.30)",
  warning: "rgb(var(--warning) / 0.28)",
  primary: "rgb(var(--primary) / 0.26)",
};

/** Prediction zone — soft translucent glow + probability pill. */
export function PredictionGlow({
  tone,
  probability,
  size,
  selected,
  onClick,
}: {
  tone: Tone;
  probability: number;
  size: number;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="relative flex items-center justify-center"
      aria-label="Prediction zone"
    >
      <motion.span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${glow[tone] ?? glow.primary}, transparent 70%)`,
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
          {Math.round(probability * 100)}%
        </span>
      </span>
    </button>
  );
}
