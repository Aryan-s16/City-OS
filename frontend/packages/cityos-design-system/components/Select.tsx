"use client";

import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../utils";
import { stateRing } from "./Input";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          "h-11 w-full appearance-none rounded-md border bg-surface pl-4 pr-10 text-body text-text outline-none transition duration-fast ease-standard disabled:opacity-disabled",
          stateRing(error),
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
        strokeWidth={1.75}
      />
    </div>
  )
);

Select.displayName = "Select";
