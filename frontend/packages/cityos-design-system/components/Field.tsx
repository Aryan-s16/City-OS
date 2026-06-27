"use client";

import { AlertCircle, CheckCircle2, Info, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "../utils";

type MsgTone = "error" | "success" | "warning" | "info";

const msg: Record<MsgTone, { icon: typeof Info; color: string }> = {
  error: { icon: AlertCircle, color: "text-danger" },
  success: { icon: CheckCircle2, color: "text-success" },
  warning: { icon: AlertTriangle, color: "text-warning" },
  info: { icon: Info, color: "text-text-muted" },
};

/** Validation that never relies on color alone — always an icon + plain words. */
export function ValidationMessage({
  tone = "error",
  children,
  className,
}: {
  tone?: MsgTone;
  children: React.ReactNode;
  className?: string;
}) {
  const { icon: Glyph, color } = msg[tone];
  return (
    <p
      role={tone === "error" ? "alert" : undefined}
      className={cn("mt-1.5 flex items-center gap-1.5 text-caption", color, className)}
    >
      <Glyph className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
      {children}
    </p>
  );
}

export interface FieldProps {
  label?: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  success?: string;
  /** Optional inline AI assist, e.g. "Improve description". */
  aiAction?: { label: string; onClick: () => void };
  children: React.ReactNode;
  className?: string;
}

/** Consistent label + control + help/validation wrapper for every form field. */
export function Field({
  label,
  htmlFor,
  description,
  error,
  success,
  aiAction,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("w-full", className)}>
      {(label || aiAction) && (
        <div className="mb-1.5 flex items-center justify-between gap-3">
          {label && (
            <label htmlFor={htmlFor} className="text-body-sm font-medium text-text">
              {label}
            </label>
          )}
          {aiAction && (
            <button
              type="button"
              onClick={aiAction.onClick}
              className="flex items-center gap-1.5 rounded-full px-2 py-1 text-caption font-medium text-primary transition duration-fast ease-standard hover:bg-primary-soft"
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              {aiAction.label}
            </button>
          )}
        </div>
      )}
      {children}
      {description && !error && !success && (
        <p className="mt-1.5 text-caption text-text-muted">{description}</p>
      )}
      {error && <ValidationMessage tone="error">{error}</ValidationMessage>}
      {success && <ValidationMessage tone="success">{success}</ValidationMessage>}
    </div>
  );
}
