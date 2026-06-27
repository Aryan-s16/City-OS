/**
 * CityOS AI — Design tokens (TS source of truth).
 * Tailwind consumes the matching values via tailwind.config.ts; this module
 * exposes the same tokens to JavaScript (motion, canvas, charts).
 * Nothing in the product should hardcode a value that lives here.
 */

/** Spacing scale (px). Everything snaps to this rhythm. */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

/** Border radius (px). */
export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  "2xl": 36,
  full: 9999,
} as const;

/** Type scale (px) — nine roles, nothing else. */
export const typeScale = {
  displayXl: 72,
  display: 56,
  heading: 40,
  title: 28,
  bodyLarge: 18,
  body: 16,
  bodySmall: 14,
  caption: 13,
  overline: 12,
} as const;

/** Font weights — no random weights. */
export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/** Motion durations (seconds for framer; ms in CSS). */
export const duration = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
  /* back-compat aliases used by earlier components */
  base: 0.25,
  slower: 0.35,
} as const;

/** Easing — Apple-like, natural, no bounce. */
export const easing = {
  standard: [0.4, 0, 0.2, 1],
  decelerate: [0, 0, 0.2, 1], // enter
  accelerate: [0.4, 0, 1, 1], // exit
} as const;

/** Blur radii (px) — dialogs, palette, floating AI, context panel only. */
export const blur = {
  sm: 8,
  md: 20,
  lg: 40,
} as const;

/** Opacity tokens. */
export const opacity = {
  disabled: 0.4,
  muted: 0.64,
  scrim: 0.48,
  border: 0.15,
} as const;

/** Z-index scale — one ladder for the whole product. */
export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 20,
  nav: 30,
  overlay: 40,
  drawer: 50,
  modal: 60,
  popover: 70,
  toast: 80,
  command: 100,
} as const;

/** Border widths. */
export const border = {
  thin: 1,
  thick: 2,
} as const;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
export type DurationToken = keyof typeof duration;
