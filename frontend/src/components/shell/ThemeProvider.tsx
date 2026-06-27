"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";

/** Applies the persisted theme to <html> as a class. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useTheme((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
}
