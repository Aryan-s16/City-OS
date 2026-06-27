import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Compact number formatting, e.g. 1284 → "1,284". */
export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

/** Clamp a number into [min, max]. */
export function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}
