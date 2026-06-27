"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Portal } from "./Portal";
import { cn } from "../utils";
import { transitions, scaleIn } from "../motion";
import { useBodyScrollLock } from "../hooks";

export type ModalSize = "md" | "lg" | "fullscreen";

const sizeClass: Record<ModalSize, string> = {
  md: "w-full max-w-lg rounded-2xl",
  lg: "w-full max-w-3xl rounded-2xl",
  fullscreen: "w-[96vw] h-[92vh] rounded-2xl",
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  size = "md",
  title,
  children,
  footer,
}: ModalProps) {
  useBodyScrollLock(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-modal flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitions.fast}
          >
            <div
              className="absolute inset-0 bg-overlay/50 backdrop-blur-[2px]"
              onClick={onClose}
            />
            <motion.div
              role="dialog"
              aria-modal
              aria-label={title}
              variants={scaleIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                "glass relative flex max-h-[92vh] flex-col overflow-hidden shadow-xl",
                sizeClass[size]
              )}
            >
              {title && (
                <div className="flex items-center justify-between gap-4 px-6 pt-6">
                  <h2 className="text-title">{title}</h2>
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition duration-fast ease-standard hover:bg-hover hover:text-text"
                  >
                    <X className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                </div>
              )}
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                {children}
              </div>
              {footer && (
                <div className="flex items-center justify-end gap-3 border-t border-border/60 px-6 py-4">
                  {footer}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
