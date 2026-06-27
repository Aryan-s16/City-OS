"use client";

import { AlertTriangle, X } from "lucide-react";
import { cn } from "../utils";
import { Button } from "./Button";

export interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/** Friendly, actionable failure. Preserves context; offers retry. */
export function ErrorBanner({
  title = "Something needs attention",
  message,
  onRetry,
  onDismiss,
  className,
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-lg border border-danger/25 bg-danger-soft p-4",
        className
      )}
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" strokeWidth={1.75} />
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium text-text">{title}</p>
        <p className="mt-0.5 text-caption text-text-muted">{message}</p>
        {onRetry && (
          <Button size="sm" variant="secondary" className="mt-3" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition duration-fast ease-standard hover:bg-hover hover:text-text"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}
