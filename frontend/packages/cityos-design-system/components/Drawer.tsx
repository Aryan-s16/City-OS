"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Portal } from "./Portal";
import { cn } from "../utils";
import { transitions } from "../motion";
import { useBodyScrollLock } from "../hooks";

export type DrawerSide = "right" | "left";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  children,
  className,
}: DrawerProps) {
  useBodyScrollLock(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const x = side === "right" ? "100%" : "-100%";

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitions.fast}
          >
            <div
              className="absolute inset-0 bg-overlay/40 backdrop-blur-[2px]"
              onClick={onClose}
            />
            <motion.aside
              role="dialog"
              aria-modal
              aria-label={title}
              initial={{ x }}
              animate={{ x: 0 }}
              exit={{ x }}
              transition={transitions.move}
              className={cn(
                "absolute inset-y-0 flex w-full max-w-md flex-col bg-surface shadow-xl",
                side === "right" ? "right-0 border-l border-border" : "left-0 border-r border-border",
                className
              )}
            >
              <div className="flex items-center justify-between gap-4 px-6 pt-6">
                {title && <h2 className="text-title">{title}</h2>}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="ml-auto flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition duration-fast ease-standard hover:bg-hover hover:text-text"
                >
                  <X className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                {children}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
