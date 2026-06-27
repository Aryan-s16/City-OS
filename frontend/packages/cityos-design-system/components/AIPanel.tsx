"use client";

import { Sparkles, FileText, ShieldCheck } from "lucide-react";
import { cn } from "../utils";

/**
 * AI component system. Every AI surface shares the same anatomy:
 *   Thinking → Reasoning → Confidence → Sources → Recommendation → Actions
 * Compose these so AI looks and behaves identically across the product.
 */

export function AIReasoning({
  title = "AI reasoning",
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-primary/20 bg-primary-soft p-4",
        className
      )}
    >
      <p className="flex items-center gap-2 text-overline uppercase text-primary">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
        {title}
      </p>
      <div className="mt-2 text-body leading-relaxed text-text">{children}</div>
    </div>
  );
}

export function AIConfidence({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between text-caption text-text-muted">
        <span>Confidence</span>
        <span className="tabular-nums text-text">{pct}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-slow ease-decelerate"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function AISources({
  sources,
}: {
  sources: { label: string; meta?: string }[];
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="flex items-center gap-2 text-overline uppercase text-text-muted">
        <FileText className="h-3.5 w-3.5" strokeWidth={2} />
        Sources
      </p>
      <div className="mt-3 space-y-2">
        {sources.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-caption">
            <span className="text-text">{s.label}</span>
            {s.meta && <span className="text-text-subtle">· {s.meta}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AIRecommendation({
  children,
  impact,
}: {
  children: React.ReactNode;
  impact?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="flex items-center gap-2 text-overline uppercase text-text-muted">
        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
        Recommendation
      </p>
      <div className="mt-2 text-body text-text">{children}</div>
      {impact && <p className="mt-3 text-caption text-text-muted">{impact}</p>}
    </div>
  );
}

export function AIActions({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}
