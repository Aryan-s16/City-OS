"use client";

import { X } from "lucide-react";
import { cn } from "../utils";

/**
 * Shared panel structure for Adaptive / Context / Floating / Inspector panels.
 * Same anatomy everywhere: header (kicker + title + close) → body → footer.
 */
export function Panel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  kicker,
  title,
  onClose,
  actions,
}: {
  kicker?: string;
  title: string;
  onClose?: () => void;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5">
      <div className="min-w-0">
        {kicker && (
          <p className="text-overline uppercase text-text-subtle">{kicker}</p>
        )}
        <h2 className="mt-1 truncate text-section">{title}</h2>
      </div>
      <div className="flex items-center gap-1">
        {actions}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition duration-fast ease-standard hover:bg-hover hover:text-text"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </div>
  );
}

export function PanelBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5 pt-4", className)}>
      {children}
    </div>
  );
}

export function PanelFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-border/60 px-5 py-4">
      {children}
    </div>
  );
}
