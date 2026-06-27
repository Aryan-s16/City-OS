"use client";

import { Drawer } from "./Drawer";
import { cn } from "../utils";

export interface DetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  kicker?: string;
  title: string;
  /** Vertical storytelling content: summary → primary → AI → metadata → actions. */
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Elegant side drawer for details (mission, issue, prediction, agent…).
 * Fullscreen on mobile. One consistent layout: kicker + title, then content.
 */
export function DetailsDrawer({
  open,
  onClose,
  kicker,
  title,
  children,
  actions,
  className,
}: DetailsDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} className={cn("max-sm:max-w-full", className)}>
      <div className="-mt-2">
        {kicker && (
          <p className="text-overline uppercase text-text-subtle">{kicker}</p>
        )}
        <h2 className="mt-1 text-title text-text">{title}</h2>
        <div className="mt-5 space-y-4">{children}</div>
        {actions && <div className="mt-6 flex items-center gap-3">{actions}</div>}
      </div>
    </Drawer>
  );
}
