"use client";

import { cn } from "../utils";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  value: string;
  onChange: (v: string) => void;
  options: RadioOption[];
  name: string;
}

export function RadioGroup({ value, onChange, options, name }: RadioGroupProps) {
  return (
    <div role="radiogroup" className="space-y-2">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <label
            key={o.value}
            className="flex cursor-pointer items-center gap-2.5 text-body text-text"
          >
            <button
              type="button"
              role="radio"
              name={name}
              aria-checked={selected}
              onClick={() => onChange(o.value)}
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border transition duration-fast ease-standard",
                selected ? "border-primary" : "border-border-strong"
              )}
            >
              {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
            </button>
            {o.label}
          </label>
        );
      })}
    </div>
  );
}
