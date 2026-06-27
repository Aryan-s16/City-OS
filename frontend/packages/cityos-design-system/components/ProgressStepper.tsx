"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../utils";

export interface ProgressStepperProps {
  steps: string[];
  current: number;
  className?: string;
}

/** Animated wizard progress. Simple, calm. */
export function ProgressStepper({ steps, current, className }: ProgressStepperProps) {
  return (
    <ol className={cn("flex items-center", className)}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-caption font-semibold transition duration-normal ease-standard",
                  done && "border-primary bg-primary text-on-primary",
                  active && "border-primary text-primary",
                  !done && !active && "border-border text-text-subtle"
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-body-sm font-medium sm:block",
                  active || done ? "text-text" : "text-text-subtle"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-3 h-px flex-1 overflow-hidden bg-border">
                <motion.div
                  className="h-full bg-primary"
                  initial={false}
                  animate={{ scaleX: done ? 1 : 0 }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
