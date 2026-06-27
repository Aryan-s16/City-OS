"use client";

import { forwardRef, cloneElement, isValidElement } from "react";
import { cn } from "../utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary shadow-sm hover:shadow-md hover:brightness-[1.03]",
  secondary:
    "bg-surface text-text border border-border shadow-sm hover:bg-hover",
  ghost: "text-text-muted hover:bg-hover hover:text-text",
  danger: "bg-danger text-white shadow-sm hover:brightness-105",
  success: "bg-success text-white shadow-sm hover:brightness-105",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-body-sm gap-1.5 rounded-md",
  md: "h-11 px-5 text-body gap-2 rounded-md",
  lg: "h-12 px-6 text-body-lg gap-2 rounded-lg",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  selected?: boolean;
  /** Render as the single child element (e.g. a next/link <Link>). */
  asChild?: boolean;
}

const base = cn(
  "relative inline-flex select-none items-center justify-center font-medium",
  "transition duration-fast ease-standard active:scale-[0.98]",
  "disabled:pointer-events-none disabled:opacity-disabled",
  "data-[selected=true]:ring-2 data-[selected=true]:ring-focus data-[selected=true]:ring-offset-1 data-[selected=true]:ring-offset-bg"
);

/** Soft, expensive, minimal. Gentle lift on hover; soft compression on press. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, selected, asChild, disabled, children, ...props },
    ref
  ) => {
    const classes = cn(base, variants[variant], sizes[size], className);

    if (asChild && isValidElement(children)) {
      return cloneElement(children as React.ReactElement, {
        className: cn(classes, (children as React.ReactElement).props.className),
        "data-selected": selected || undefined,
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        data-selected={selected || undefined}
        className={classes}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-current"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </span>
        )}
        <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";
