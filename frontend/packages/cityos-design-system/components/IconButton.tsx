"use client";

import { forwardRef } from "react";
import { cn } from "../utils";

export type IconButtonSize = "sm" | "md" | "lg";

const sizes: Record<IconButtonSize, string> = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
  lg: "h-11 w-11",
};

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  size?: IconButtonSize;
  /** Accessible label is required for icon-only controls. */
  "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, active, size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md",
        "text-text-muted transition duration-fast ease-standard active:scale-[0.96]",
        "hover:bg-hover hover:text-text",
        "disabled:pointer-events-none disabled:opacity-disabled",
        active && "bg-primary-soft text-primary hover:bg-primary-soft",
        sizes[size],
        className
      )}
      {...props}
    />
  )
);

IconButton.displayName = "IconButton";
