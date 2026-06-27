"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn, type Tone } from "@ds";

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

export interface MapPinProps {
  x: string;
  y: string;
  icon: LucideIcon;
  tone: Tone;
  label: string;
  meta?: string;
  live?: boolean;
  resolved?: boolean;
  selected?: boolean;
  delay?: number;
  onClick?: () => void;
}

/**
 * Custom premium map pin — never a default Google marker.
 * Category icon + priority ring + status indicator, with hover / selected /
 * appear states. Soft semantic tones, never neon.
 */
export function MapPin({
  x, y, icon: Icon, tone, label, meta, live, resolved, selected, delay = 0, onClick,
}: MapPinProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="group absolute z-raised -translate-x-1/2 -translate-y-1/2 outline-none"
      style={{ left: x, top: y }}
    >
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay, duration: 0.35, ease: [0, 0, 0.2, 1] }}
        className="relative block"
      >
        {/* Gentle pulse for live critical/warning incidents */}
        {live && !resolved && (
          <motion.span
            className={cn("absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full", dot[tone])}
            initial={{ opacity: 0.3, scale: 1 }}
            animate={{ opacity: 0, scale: 2.2 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        {/* Priority ring + core */}
        <span
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-full border-2 bg-surface shadow-md transition-all duration-fast ease-standard",
            ring[tone],
            text[tone],
            "group-hover:-translate-y-0.5 group-hover:shadow-lg",
            selected && "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-bg"
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
          {/* Status indicator */}
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface",
              resolved ? "bg-success" : dot[tone]
            )}
          />
        </span>
      </motion.span>

      {/* Hover label */}
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-text px-2.5 py-1 text-caption font-medium text-bg opacity-0 shadow-md transition duration-fast ease-standard group-hover:opacity-100">
        {label}
        {meta && <span className="ml-1.5 opacity-70">{meta}</span>}
      </span>
    </button>
  );
}
