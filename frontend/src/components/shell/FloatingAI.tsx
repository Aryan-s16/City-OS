"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { duration, easing } from "@/design/tokens";

const INSIGHTS = [
  {
    tone: "warning",
    text: "Rain forecast in 6h — 3 districts with open drainage reports are likely to flood.",
  },
  {
    tone: "primary",
    text: "Pothole cluster on Market St resolved 22% faster than the city average.",
  },
];

const toneDot: Record<string, string> = {
  warning: "bg-warning",
  primary: "bg-primary",
};

/**
 * The AI lives in the product, quietly. It predicts and explains.
 * It never dominates — collapsed to a pill until summoned.
 */
export function FloatingAI() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: duration.base, ease: easing.decelerate }}
            className="glass w-80 overflow-hidden rounded-panel shadow-e3"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <span className="flex items-center gap-2 text-section">
                <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} />
                CityOS
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-button text-text-muted transition duration-fast ease-standard hover:bg-surface-muted hover:text-text"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="space-y-2 p-3">
              <p className="px-1 text-caption uppercase tracking-wider text-text-subtle">
                Proactive insights
              </p>
              {INSIGHTS.map((i, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 rounded-button bg-surface/60 p-3"
                >
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      toneDot[i.tone]
                    )}
                  />
                  <p className="text-caption leading-relaxed text-text">
                    {i.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-border/60 p-3">
              <div className="flex items-center gap-2 rounded-button border border-border bg-surface px-3 py-2">
                <input
                  placeholder="Ask about your city…"
                  className="flex-1 bg-transparent text-caption text-text outline-none placeholder:text-text-subtle"
                />
                <button
                  aria-label="Send"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-on-primary transition duration-fast ease-standard active:scale-95"
                >
                  <ArrowUp className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-12 items-center gap-2 rounded-full bg-text px-4 text-bg shadow-e3",
          "transition duration-base ease-standard active:scale-95"
        )}
      >
        <Sparkles className="h-5 w-5" strokeWidth={1.75} />
        {!open && <span className="text-body font-medium">Ask CityOS</span>}
      </button>
    </div>
  );
}
