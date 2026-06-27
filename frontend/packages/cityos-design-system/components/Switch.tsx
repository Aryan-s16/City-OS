"use client";

import { cn } from "../utils";

export interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
}

export function Switch({ checked, onChange, disabled, ...props }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition duration-fast ease-standard",
        "disabled:pointer-events-none disabled:opacity-disabled",
        checked ? "bg-primary" : "bg-border-strong"
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-surface shadow-sm transition-all duration-fast ease-standard",
          checked ? "left-6" : "left-1"
        )}
      />
    </button>
  );
}
