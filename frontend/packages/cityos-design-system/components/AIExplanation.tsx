"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "../utils";
import { ProgressBar } from "./Indicators";
import { Button } from "./Button";

export interface AIExplanationProps {
  recommendation: string;
  reasoning: string;
  confidence: number; // 0..1
  outcome: string;
  action?: { label: string; onClick?: () => void };
  className?: string;
}

/**
 * The canonical AI explanation block — used everywhere a recommendation
 * appears. One structure: recommendation → reasoning → confidence → outcome
 * → action. Distinct, softly highlighted.
 */
export function AIExplanation({
  recommendation,
  reasoning,
  confidence,
  outcome,
  action,
  className,
}: AIExplanationProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-primary/20 bg-primary-soft p-5",
        className
      )}
    >
      <div className="flex items-center gap-2 text-primary">
        <Sparkles className="h-4 w-4" strokeWidth={2} />
        <span className="text-overline uppercase">CityOS recommends</span>
      </div>

      <p className="mt-3 text-section text-text">{recommendation}</p>
      <p className="mt-2 text-body leading-relaxed text-text-muted">{reasoning}</p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-caption text-text-muted">
          <span>Confidence</span>
          <span className="tabular-nums text-text">{Math.round(confidence * 100)}%</span>
        </div>
        <ProgressBar value={confidence * 100} className="mt-1.5" />
      </div>

      <p className="mt-4 text-caption text-text-muted">
        <span className="font-medium text-text">Expected outcome · </span>
        {outcome}
      </p>

      {action && (
        <Button size="sm" className="mt-4" onClick={action.onClick}>
          {action.label}
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Button>
      )}
    </div>
  );
}
