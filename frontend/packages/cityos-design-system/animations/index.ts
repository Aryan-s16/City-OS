/**
 * CSS animation tokens. Keyframes themselves live in tailwind.config.ts
 * (shimmer, fade-rise); this module exposes their canonical class names and
 * timing so non-React surfaces stay consistent.
 */
export const animationClass = {
  shimmer: "animate-shimmer",
  fadeRise: "animate-fade-rise",
} as const;

/** Canonical durations in ms (mirror of motion tokens). */
export const durationMs = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

/** Canonical CSS easing curves. */
export const cssEasing = {
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  decelerate: "cubic-bezier(0, 0, 0.2, 1)",
  accelerate: "cubic-bezier(0.4, 0, 1, 1)",
} as const;
