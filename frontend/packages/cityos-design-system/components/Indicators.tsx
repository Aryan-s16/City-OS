"use client";

import { motion } from "framer-motion";
import { cn } from "../utils";
import type { Tone } from "./Badge";

const toneBg: Record<Tone, string> = {
  neutral: "bg-text-subtle",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

const toneVar: Record<Tone, string> = {
  neutral: "--text-subtle",
  primary: "--primary",
  success: "--success",
  warning: "--warning",
  danger: "--danger",
  info: "--info",
};

/** Small colored dot + optional label. The default way to show status. */
export function StatusDot({
  tone = "neutral",
  label,
  pulse,
  className,
}: {
  tone?: Tone;
  label?: string;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span className={cn("absolute inline-flex h-2 w-2 animate-ping rounded-full opacity-60", toneBg[tone])} />
        )}
        <span className={cn("relative h-2 w-2 rounded-full", toneBg[tone])} />
      </span>
      {label && <span className="text-caption text-text-muted">{label}</span>}
    </span>
  );
}

/** Thin, elegant, animated progress bar. */
export function ProgressBar({
  value,
  tone = "primary",
  className,
}: {
  value: number;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-muted", className)}
    >
      <motion.div
        className={cn("h-full rounded-full", toneBg[tone])}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
      />
    </div>
  );
}

/** Compact circular progress — used for probabilities. No giant gauges. */
export function CircularProgress({
  value,
  size = 64,
  stroke = 6,
  tone = "primary",
  children,
}: {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  tone?: Tone;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - Math.max(0, Math.min(1, value)) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          style={{ stroke: "rgb(var(--border))" }}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          style={{ stroke: `rgb(var(${toneVar[tone]}))` }}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0, 0, 0.2, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
