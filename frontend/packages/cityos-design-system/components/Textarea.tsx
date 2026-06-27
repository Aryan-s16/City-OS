"use client";

import { forwardRef, useCallback } from "react";
import { cn } from "../utils";
import { stateRing } from "./Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  success?: boolean;
  autoGrow?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, success, rows = 4, autoGrow, onInput, ...props }, ref) => {
    const grow = useCallback((el: HTMLTextAreaElement) => {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, []);

    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={error || undefined}
        onInput={(e) => {
          if (autoGrow) grow(e.currentTarget);
          onInput?.(e);
        }}
        className={cn(
          "w-full resize-none rounded-md border bg-surface px-4 py-3 text-body text-text outline-none transition duration-fast ease-standard placeholder:text-text-subtle disabled:opacity-disabled",
          stateRing(error, success),
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
