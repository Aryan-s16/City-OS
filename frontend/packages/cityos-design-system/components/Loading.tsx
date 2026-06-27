"use client";

import { cn } from "../utils";

/** Streaming "thinking" indicator — three soft pulsing dots, never a spinner. */
export function Thinking({
  label = "Thinking",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-caption text-text-muted", className)}>
      <span className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-text-subtle"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>
      {label}
    </span>
  );
}

/** A line of streaming text with a soft caret — for AI responses. */
export function StreamingLine({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-body text-text", className)}>
      {children}
      <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-primary" />
    </span>
  );
}
