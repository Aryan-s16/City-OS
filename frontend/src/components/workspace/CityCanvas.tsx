"use client";

import { motion } from "framer-motion";
import { Layers, Navigation, Plus, Minus } from "lucide-react";
import { ISSUES, type Issue } from "@/lib/mock";
import { useContextPanel } from "@/hooks/useContextPanel";
import { cn } from "@/lib/utils";

/** Deterministic city blocks so SSR and client render identically. */
const BLOCKS = Array.from({ length: 40 }, (_, i) => {
  const col = i % 8;
  const row = Math.floor(i / 8);
  return {
    x: 80 + col * 135 + ((row % 2) * 18 - 9),
    y: 70 + row * 130,
    w: 96 + (i % 3) * 10,
    h: 80 + (i % 2) * 14,
  };
});

const toneColor: Record<string, string> = {
  danger: "bg-danger",
  warning: "bg-warning",
  primary: "bg-primary",
  success: "bg-success",
  info: "bg-info",
};

function Marker({
  issue,
  selected,
  delay,
  onSelect,
}: {
  issue: Issue;
  selected: boolean;
  delay: number;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      aria-label={issue.title}
      className="group absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: issue.x, top: issue.y }}
    >
      <motion.span
        className={cn("absolute inset-0 rounded-full", toneColor[issue.tone])}
        initial={{ opacity: 0.35, scale: 1 }}
        animate={{ opacity: 0, scale: 2.6 }}
        transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity, delay }}
        style={{ width: 16, height: 16 }}
      />
      <span
        className={cn(
          "relative block h-4 w-4 rounded-full border-2 border-surface shadow-e1 transition duration-fast ease-standard",
          toneColor[issue.tone],
          selected && "scale-150 ring-2 ring-offset-2 ring-offset-bg"
        )}
        style={selected ? { boxShadow: "0 0 0 2px rgb(var(--primary))" } : undefined}
      />
      <span className="pointer-events-none absolute left-1/2 top-6 z-10 -translate-x-1/2 whitespace-nowrap rounded-button bg-text px-2.5 py-1 text-caption font-medium text-bg opacity-0 shadow-e2 transition duration-fast ease-standard group-hover:opacity-100">
        {issue.title} · {issue.district}
      </span>
    </button>
  );
}

/** The city is the product. Markers drive the adaptive context panel. */
export function CityCanvas({ className }: { className?: string }) {
  const { kind, id, select } = useContextPanel();

  return (
    <div
      className={cn(
        "relative h-full min-h-[420px] w-full overflow-hidden rounded-map border border-border bg-surface-muted",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface/60 to-transparent" />

      <svg
        viewBox="0 0 1200 760"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M -50 180 C 300 240 500 120 760 220 C 980 300 1100 240 1300 320 L 1300 460 C 1080 380 980 440 760 360 C 520 270 320 380 -50 320 Z"
          style={{ fill: "rgb(var(--info-soft))" }}
          opacity={0.9}
        />
        <rect
          x="860"
          y="470"
          width="260"
          height="210"
          rx="28"
          style={{ fill: "rgb(var(--success-soft))" }}
        />
        {BLOCKS.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="10"
            style={{ fill: "rgb(var(--surface))", stroke: "rgb(var(--border))" }}
            strokeWidth={1.5}
          />
        ))}
      </svg>

      {/* Map controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        {[Layers, Navigation].map((Icon, i) => (
          <button
            key={i}
            className="glass flex h-10 w-10 items-center justify-center rounded-button text-text-muted shadow-e1 transition duration-fast ease-standard hover:text-text"
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </button>
        ))}
      </div>
      <div className="glass absolute bottom-4 right-4 flex flex-col overflow-hidden rounded-button shadow-e1">
        <button className="flex h-10 w-10 items-center justify-center text-text-muted transition hover:text-text">
          <Plus className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <span className="mx-2 h-px bg-border" />
        <button className="flex h-10 w-10 items-center justify-center text-text-muted transition hover:text-text">
          <Minus className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      {ISSUES.map((issue, i) => (
        <Marker
          key={issue.id}
          issue={issue}
          selected={kind === "issue" && id === issue.id}
          delay={i * 0.5}
          onSelect={() => select("issue", issue.id)}
        />
      ))}
    </div>
  );
}
