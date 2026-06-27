"use client";

import type { LucideIcon } from "lucide-react";
import { Inbox, AlertTriangle } from "lucide-react";
import { cn } from "../utils";
import { Button } from "./Button";

interface Action {
  label: string;
  onClick?: () => void;
}

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: Action;
  secondaryAction?: Action;
  className?: string;
}

/** Empty states teach. Never "No data." */
export function EmptyState({
  icon: GlyphIcon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-muted text-text-subtle">
        <GlyphIcon className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h3 className="mt-5 text-section">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-body text-text-muted">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-6 flex items-center gap-3">
          {action && (
            <Button size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button size="sm" variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: Action;
  className?: string;
}

/** Friendly, actionable, clear. */
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this just now. The issue has been noted.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-soft text-danger">
        <AlertTriangle className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h3 className="mt-5 text-section">{title}</h3>
      <p className="mt-2 max-w-sm text-body text-text-muted">{description}</p>
      {action && (
        <Button size="sm" variant="secondary" className="mt-6" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
