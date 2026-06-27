"use client";

import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: LucideIcon;
  error?: boolean;
  success?: boolean;
}

const fieldBase =
  "h-11 w-full rounded-md border bg-surface text-body text-text outline-none transition duration-fast ease-standard placeholder:text-text-subtle disabled:opacity-disabled disabled:pointer-events-none";

function stateRing(error?: boolean, success?: boolean) {
  if (error)
    return "border-danger focus:border-danger focus:ring-2 focus:ring-danger/25";
  if (success)
    return "border-success focus:border-success focus:ring-2 focus:ring-success/25";
  return "border-border hover:border-border-strong focus:border-focus focus:ring-2 focus:ring-focus/25";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon: Left, error, success, ...props }, ref) => (
    <div className="relative w-full">
      {Left && (
        <Left
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
          strokeWidth={1.75}
        />
      )}
      <input
        ref={ref}
        aria-invalid={error || undefined}
        className={cn(
          fieldBase,
          stateRing(error, success),
          Left ? "pl-10 pr-4" : "px-4",
          className
        )}
        {...props}
      />
    </div>
  )
);

Input.displayName = "Input";

export { fieldBase, stateRing };
