/**
 * Motion presets — one motion language for the whole product.
 * Every animation answers: where did this come from, where did it go, why.
 * Apple-like easing, no bounce, no overshoot.
 */
import type { Transition, Variants } from "framer-motion";
import { duration, easing } from "../tokens";

export const transitions = {
  fast: { duration: duration.fast, ease: easing.standard } as Transition,
  enter: { duration: duration.slow, ease: easing.decelerate } as Transition,
  exit: { duration: duration.fast, ease: easing.accelerate } as Transition,
  move: { duration: duration.normal, ease: easing.standard } as Transition,
};

/** Fade. */
export const fade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitions.enter },
  exit: { opacity: 0, transition: transitions.exit },
};

/** Fade + rise — default for entering content. */
export const fadeRise: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: transitions.enter },
  exit: { opacity: 0, y: 8, transition: transitions.exit },
};

/** Scale — for dialogs/modals. */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.98, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: transitions.move },
  exit: { opacity: 0, scale: 0.98, y: 8, transition: transitions.exit },
};

/** Slide from the right — for drawers/panels. */
export const slideRight: Variants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: transitions.move },
  exit: { opacity: 0, x: 24, transition: transitions.exit },
};

/** Panel content swap (used by adaptive/context panels). */
export const swap: Variants = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0, transition: transitions.fast },
  exit: { opacity: 0, x: -12, transition: transitions.fast },
};

/** Staggered list container. */
export const stagger: Variants = {
  animate: { transition: { staggerChildren: 0.05 } },
};
