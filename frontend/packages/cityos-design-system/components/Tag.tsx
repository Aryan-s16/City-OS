"use client";

import { X } from "lucide-react";
import { cn } from "../utils";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void;
}

/** Rounded, subtle, compact. Optionally removable. */
export function Tag({ className, onRemove, children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-body-sm text-text-muted",
        className
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove"
          className="-mr-1 flex h-4 w-4 items-center justify-center rounded-full text-text-subtle transition duration-fast ease-standard hover:bg-hover hover:text-text"
        >
          <X className="h-3 w-3" strokeWidth={2} />
        </button>
      )}
    </span>
  );
}
