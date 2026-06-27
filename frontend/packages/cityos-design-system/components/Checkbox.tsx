"use client";

import { Check } from "lucide-react";
import { cn } from "../utils";

export interface CheckboxProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2.5 text-body text-text",
        disabled && "pointer-events-none opacity-disabled"
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-xs border transition duration-fast ease-standard",
          checked ? "border-primary bg-primary text-on-primary" : "border-border-strong bg-surface"
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </button>
      {label}
    </label>
  );
}
