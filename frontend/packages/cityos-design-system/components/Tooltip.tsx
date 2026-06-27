"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../utils";
import { transitions } from "../motion";

type Side = "right" | "top" | "bottom" | "left";

const sidePos: Record<Side, string> = {
  right: "left-full top-1/2 ml-3 -translate-y-1/2",
  left: "right-full top-1/2 mr-3 -translate-y-1/2",
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
};

const sideMotion: Record<Side, { x?: number; y?: number }> = {
  right: { x: -4 },
  left: { x: 4 },
  top: { y: 4 },
  bottom: { y: -4 },
};

export function Tooltip({
  label,
  side = "right",
  children,
  className,
}: {
  label: string;
  side?: Side;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const off = sideMotion[side];

  return (
    <div
      className={cn("relative flex items-center", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, ...off }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...off }}
            transition={transitions.fast}
            className={cn(
              "pointer-events-none absolute z-popover whitespace-nowrap rounded-md bg-text px-3 py-1.5 text-caption font-medium text-bg shadow-md",
              sidePos[side]
            )}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
