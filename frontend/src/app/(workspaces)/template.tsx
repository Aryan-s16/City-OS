"use client";

import { motion } from "framer-motion";
import { duration, easing } from "@/design/tokens";

/**
 * Seamless room-to-room transition. Re-runs on every navigation so each
 * workspace eases in — moving between rooms of one operating system.
 */
export default function WorkspaceTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, ease: easing.decelerate }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
