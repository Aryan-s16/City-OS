import type { Config } from "tailwindcss";

/**
 * CityOS AI — Design Token System (Part 1)
 * --------------------------------------------------------------------------
 * This config is the single source of truth for the design language.
 * Color is themeable via CSS custom properties (see globals.css); every
 * other token (spacing, radius, type, motion, elevation, blur) is defined
 * here so that NO hardcoded values ever appear downstream.
 *
 * Rules encoded from the Design Bible:
 *  - 95% neutral. Color communicates STATE, never decoration.
 *  - Six type sizes only. Nothing random.
 *  - Spacing limited to the canonical scale.
 *  - Motion: 200/250/300/350ms, natural easing, no bounce / no overshoot.
 *  - Elevation: near-invisible, soft. Depth comes from scale & whitespace.
 */

// Color tokens reference CSS variables so light/dark are a single switch.
// Variables hold space-separated RGB channels to support `/opacity`.
const themeColor = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./packages/cityos-design-system/**/*.{ts,tsx}",
  ],
  // Classes built dynamically (bg-${tone}, rounded-${r}, shadow-${s}) — keep
  // them in the build so the showcase and tone helpers render.
  safelist: [
    "bg-bg",
    "bg-surface",
    "bg-surface-muted",
    "bg-primary",
    "bg-secondary",
    "bg-accent",
    "bg-success",
    "bg-warning",
    "bg-danger",
    "bg-info",
    "text-primary",
    "text-success",
    "text-warning",
    "text-danger",
    "text-info",
    "rounded-xs",
    "rounded-sm",
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "shadow-xs",
    "shadow-sm",
    "shadow-md",
    "shadow-lg",
    "shadow-xl",
  ],
  theme: {
    // --- Grid --------------------------------------------------------------
    // NOTE: We intentionally keep Tailwind's default spacing scale. Its keys
    // already match our design tokens (4=16px, 6=24px, …) and add the
    // in-between steps the UI relies on. The "only these values" rule from the
    // bible is a usage guideline (see design/tokens.ts), not a hard override —
    // overriding the whole scale silently breaks h-11/gap-1.5/etc.
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1600px", // max canvas width
    },

    extend: {
      // --- Color: semantic, neutral-first --------------------------------
      colors: {
        bg: themeColor("bg"),
        surface: themeColor("surface"),
        "surface-muted": themeColor("surface-muted"),
        border: themeColor("border"),
        "border-strong": themeColor("border-strong"),
        text: themeColor("text"),
        "text-muted": themeColor("text-muted"),
        "text-subtle": themeColor("text-subtle"),

        // State colors — used ONLY to communicate meaning.
        primary: {
          DEFAULT: themeColor("primary"),
          soft: themeColor("primary-soft"),
        },
        "on-primary": themeColor("on-primary"),
        accent: themeColor("accent"),
        secondary: {
          DEFAULT: themeColor("secondary"),
          soft: themeColor("secondary-soft"),
        },
        success: {
          DEFAULT: themeColor("success"),
          soft: themeColor("success-soft"),
        },
        warning: {
          DEFAULT: themeColor("warning"),
          soft: themeColor("warning-soft"),
        },
        danger: {
          DEFAULT: themeColor("danger"),
          soft: themeColor("danger-soft"),
        },
        info: {
          DEFAULT: themeColor("info"),
          soft: themeColor("info-soft"),
        },

        // System / interaction tokens
        overlay: themeColor("overlay"),
        glass: themeColor("glass"),
        focus: themeColor("focus"),
        selection: themeColor("selection"),
        hover: themeColor("hover"),
        pressed: themeColor("pressed"),
        disabled: themeColor("disabled"),
      },

      // --- Radius (XS..2XL) ---------------------------------------------
      borderRadius: {
        none: "0px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "28px",
        "2xl": "36px",
        DEFAULT: "16px",
        full: "9999px",
        // Semantic back-compat aliases
        button: "16px",
        base: "20px",
        panel: "24px",
        dialog: "28px",
        map: "36px",
      },

      // --- Typography: nine roles ----------------------------------------
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "4.5rem",
          { lineHeight: "1.04", letterSpacing: "-0.022em", fontWeight: "600" },
        ],
        display: [
          "3.5rem",
          { lineHeight: "1.06", letterSpacing: "-0.021em", fontWeight: "600" },
        ],
        heading: [
          "2.5rem",
          { lineHeight: "1.12", letterSpacing: "-0.018em", fontWeight: "600" },
        ],
        title: [
          "1.75rem",
          { lineHeight: "1.2", letterSpacing: "-0.012em", fontWeight: "600" },
        ],
        "body-lg": [
          "1.125rem",
          { lineHeight: "1.6", letterSpacing: "0em", fontWeight: "400" },
        ],
        body: [
          "1rem",
          { lineHeight: "1.6", letterSpacing: "0em", fontWeight: "400" },
        ],
        "body-sm": [
          "0.875rem",
          { lineHeight: "1.55", letterSpacing: "0em", fontWeight: "400" },
        ],
        caption: [
          "0.8125rem",
          { lineHeight: "1.5", letterSpacing: "0.01em", fontWeight: "500" },
        ],
        overline: [
          "0.75rem",
          { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "600" },
        ],
        // Back-compat aliases (Part 1/2 components)
        hero: [
          "3rem",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        section: [
          "1.25rem",
          { lineHeight: "1.4", letterSpacing: "-0.006em", fontWeight: "600" },
        ],
      },

      // --- Elevation: five soft levels (XS..XL) --------------------------
      boxShadow: {
        none: "none",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        // Back-compat aliases
        e1: "var(--shadow-sm)",
        e2: "var(--shadow-md)",
        e3: "var(--shadow-lg)",
      },

      // --- Blur: reserved for palette / floating AI / modals -------------
      blur: {
        sm: "8px",
        md: "20px",
        lg: "40px",
      },

      // --- Motion: fast / normal / slow ----------------------------------
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "350ms",
        // Back-compat aliases
        base: "250ms",
        slower: "350ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        decelerate: "cubic-bezier(0, 0, 0.2, 1)", // enter
        accelerate: "cubic-bezier(0.4, 0, 1, 1)", // exit
      },

      // --- Z-index ladder ------------------------------------------------
      zIndex: {
        base: "0",
        raised: "10",
        sticky: "20",
        nav: "30",
        overlay: "40",
        drawer: "50",
        modal: "60",
        popover: "70",
        toast: "80",
        command: "100",
      },

      // --- Opacity tokens ------------------------------------------------
      opacity: {
        disabled: "0.4",
        muted: "0.64",
        scrim: "0.48",
      },

      maxWidth: {
        canvas: "1600px",
      },

      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-rise": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s ease-in-out infinite",
        "fade-rise": "fade-rise 350ms cubic-bezier(0, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
