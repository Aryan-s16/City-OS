"use client";

import { motion } from "framer-motion";
import { Check, CheckCircle2, Circle } from "lucide-react";
import { cn } from "../utils";
import { Button } from "./Button";

export interface SuccessScreenProps {
  missionId: string;
  title?: string;
  eta?: string;
  onView?: () => void;
  onBack?: () => void;
  className?: string;
}

const TIMELINE = [
  { label: "Report submitted", done: true },
  { label: "AI triage complete", done: true },
  { label: "Assigned to department", done: false },
  { label: "Crew dispatched", done: false },
];

/** Subtle celebration — no confetti. Mission created, tracked, actionable. */
export function SuccessScreen({
  missionId,
  title = "Mission created",
  eta = "~2 hours",
  onView,
  onBack,
  className,
}: SuccessScreenProps) {
  return (
    <div className={cn("mx-auto max-w-md text-center", className)}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success"
      >
        <Check className="h-8 w-8" strokeWidth={2.5} />
      </motion.div>

      <h2 className="mt-6 text-title">{title}</h2>
      <p className="mt-2 text-body text-text-muted">
        CityOS is already coordinating a response.
      </p>

      <div className="mt-6 flex items-center justify-center gap-2">
        <span className="text-caption text-text-muted">Tracking ID</span>
        <span className="rounded-md bg-surface-muted px-2.5 py-1 text-body-sm font-medium tabular-nums text-text">
          {missionId}
        </span>
      </div>

      {/* Timeline */}
      <div className="mt-8 rounded-lg border border-border bg-surface p-5 text-left">
        <div className="space-y-0">
          {TIMELINE.map((t, i) => (
            <div key={t.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                {t.done ? (
                  <CheckCircle2 className="h-5 w-5 text-success" strokeWidth={1.75} />
                ) : (
                  <Circle className="h-5 w-5 text-text-subtle" strokeWidth={1.75} />
                )}
                {i < TIMELINE.length - 1 && <span className="my-1 h-6 w-px bg-border" />}
              </div>
              <div className="pb-1">
                <p className={cn("text-body", t.done ? "text-text" : "text-text-muted")}>
                  {t.label}
                </p>
                {i === 1 && (
                  <p className="text-caption text-text-subtle">
                    Next: assignment · est. {eta}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button onClick={onView}>View mission</Button>
        <Button variant="ghost" onClick={onBack}>
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
