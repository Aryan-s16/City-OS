"use client";

import { useState } from "react";
import { Pencil, Check, Sparkles } from "lucide-react";
import { cn } from "../utils";
import { Input } from "./Input";
import { Textarea } from "./Textarea";

export interface ReviewCardProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  /** Whether the user has edited away from the AI-generated value. */
  edited?: boolean;
  multiline?: boolean;
  options?: string[];
  className?: string;
}

/** A reviewable field that clearly distinguishes AI-generated from user edits. */
export function ReviewCard({
  label,
  value,
  onChange,
  edited,
  multiline,
  options,
  className,
}: ReviewCardProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg border bg-surface p-4 transition duration-fast ease-standard",
        edited ? "border-border" : "border-primary/20",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-overline uppercase text-text-subtle">{label}</p>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-medium",
            edited
              ? "bg-surface-muted text-text-muted"
              : "bg-primary-soft text-primary"
          )}
        >
          {edited ? (
            <>
              <Check className="h-3 w-3" strokeWidth={2.5} /> Edited
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3" strokeWidth={2} /> AI
            </>
          )}
        </span>
      </div>

      {editing ? (
        <div className="mt-3">
          {options ? (
            <div className="flex flex-wrap gap-2">
              {options.map((o) => (
                <button
                  key={o}
                  onClick={() => {
                    onChange(o);
                    setEditing(false);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-caption font-medium transition duration-fast ease-standard",
                    o === value
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border text-text-muted hover:bg-hover"
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
          ) : multiline ? (
            <Textarea
              autoFocus
              value={value}
              autoGrow
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => setEditing(false)}
            />
          ) : (
            <Input
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
            />
          )}
        </div>
      ) : (
        <div className="mt-2 flex items-start justify-between gap-3">
          <p className="text-body leading-relaxed text-text">{value}</p>
          <button
            onClick={() => setEditing(true)}
            aria-label={`Edit ${label}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-muted transition duration-fast ease-standard hover:bg-hover hover:text-text"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  );
}
