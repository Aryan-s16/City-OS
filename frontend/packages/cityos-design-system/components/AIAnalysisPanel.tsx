"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ShieldAlert, Boxes, Building2 } from "lucide-react";
import { cn } from "../utils";
import { Badge, type Tone } from "./Badge";
import { Tag } from "./Tag";
import { Thinking } from "./Loading";
import { AIReasoning, AIConfidence } from "./AIPanel";

export interface AIAnalysisResult {
  issueType: string;
  severity: string;
  severityTone: Tone;
  confidence: number;
  objects: string[];
  summary: string;
  safety: string;
  department: string;
}

export interface AIAnalysisPanelProps {
  steps: string[];
  result: AIAnalysisResult;
  onComplete?: () => void;
  className?: string;
}

/** Streams the analysis (never a spinner), then reveals result cards. */
export function AIAnalysisPanel({
  steps,
  result,
  onComplete,
  className,
}: AIAnalysisPanelProps) {
  const [done, setDone] = useState(0);
  const finished = done >= steps.length;

  useEffect(() => {
    if (finished) {
      const t = setTimeout(() => onComplete?.(), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((d) => d + 1), 900);
    return () => clearTimeout(t);
  }, [done, finished, steps.length, onComplete]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Streaming steps */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="space-y-2.5">
          {steps.map((s, i) => {
            const complete = i < done;
            const active = i === done;
            if (i > done) return null;
            return (
              <motion.div
                key={s}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 text-body-sm"
              >
                {complete ? (
                  <Check className="h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
                ) : (
                  <span className="flex h-4 w-4 items-center justify-center">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  </span>
                )}
                <span className={complete ? "text-text-muted" : "text-text"}>{s}</span>
                {active && <Thinking label="" className="ml-1" />}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-overline uppercase text-text-subtle">Issue type</p>
                <p className="mt-1 text-body font-medium text-text">{result.issueType}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-overline uppercase text-text-subtle">Severity</p>
                <Badge tone={result.severityTone} dot className="mt-1.5">
                  {result.severity}
                </Badge>
              </div>
            </div>

            <AIConfidence value={result.confidence} />

            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="flex items-center gap-2 text-overline uppercase text-text-muted">
                <Boxes className="h-3.5 w-3.5" strokeWidth={2} />
                Detected objects
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.objects.map((o) => (
                  <Tag key={o}>{o}</Tag>
                ))}
              </div>
            </div>

            <AIReasoning title="AI summary">{result.summary}</AIReasoning>

            <div className="rounded-lg border border-warning/25 bg-warning-soft p-4">
              <p className="flex items-center gap-2 text-overline uppercase text-warning">
                <ShieldAlert className="h-3.5 w-3.5" strokeWidth={2} />
                Safety concerns
              </p>
              <p className="mt-2 text-body text-text">{result.safety}</p>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
              <Building2 className="h-4 w-4 text-text-muted" strokeWidth={1.75} />
              <span className="text-caption text-text-muted">Suggested department</span>
              <span className="ml-auto text-body font-medium text-text">
                {result.department}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
