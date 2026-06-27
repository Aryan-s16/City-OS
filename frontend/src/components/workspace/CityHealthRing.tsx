"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * One metric, beautifully. A circular indicator of overall city health that
 * draws itself on mount. Calm, not flashy.
 */
export function CityHealthRing({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const tone =
    value >= 85 ? "var(--success)" : value >= 70 ? "var(--warning)" : "var(--danger)";

  return (
    <div
      className={cn(
        "glass flex items-center gap-4 rounded-panel p-4 shadow-e1",
        className
      )}
    >
      <div className="relative h-[88px] w-[88px]">
        <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
          <circle
            cx="44"
            cy="44"
            r={r}
            fill="none"
            strokeWidth={7}
            style={{ stroke: "rgb(var(--border))" }}
          />
          <motion.circle
            cx="44"
            cy="44"
            r={r}
            fill="none"
            strokeWidth={7}
            strokeLinecap="round"
            style={{ stroke: `rgb(${tone})` }}
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: [0, 0, 0.2, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-section font-semibold tabular-nums">{value}</span>
        </div>
      </div>
      <div>
        <p className="text-caption uppercase tracking-wider text-text-subtle">
          City health
        </p>
        <p className="mt-0.5 text-body font-medium text-text">Stable</p>
        <p className="text-caption text-text-muted">+2 since yesterday</p>
      </div>
    </div>
  );
}
