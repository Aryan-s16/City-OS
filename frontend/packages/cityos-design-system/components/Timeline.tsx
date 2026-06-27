"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "../utils";

export interface TimelineStep {
  time: string;
  actor: string;
  action: string;
  explanation?: string;
  done?: boolean;
}

/** Vertical timeline. Each step is expandable to reveal the AI explanation. */
export function Timeline({
  steps,
  className,
}: {
  steps: TimelineStep[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ol className={cn("space-y-0", className)}>
      {steps.map((s, i) => {
        const expanded = open === i;
        const last = i === steps.length - 1;
        return (
          <li key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              {s.done ? (
                <CheckCircle2 className="h-5 w-5 text-success" strokeWidth={1.75} />
              ) : (
                <Circle className="h-5 w-5 text-text-subtle" strokeWidth={1.75} />
              )}
              {!last && <span className="my-1 w-px flex-1 bg-border" />}
            </div>

            <div className="flex-1 pb-5">
              <button
                onClick={() => s.explanation && setOpen(expanded ? null : i)}
                className={cn(
                  "flex w-full items-start justify-between gap-3 text-left",
                  s.explanation && "group"
                )}
              >
                <div>
                  <p className="text-body text-text">{s.action}</p>
                  <p className="text-caption text-text-subtle">
                    {s.actor} · {s.time}
                  </p>
                </div>
                {s.explanation && (
                  <ChevronDown
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0 text-text-subtle transition-transform duration-fast",
                      expanded && "rotate-180"
                    )}
                    strokeWidth={1.75}
                  />
                )}
              </button>

              <AnimatePresence initial={false}>
                {expanded && s.explanation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 flex gap-2 rounded-md bg-primary-soft p-3">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2} />
                      <p className="text-caption leading-relaxed text-text">
                        {s.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
