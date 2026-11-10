"use client";

import { motion, useReducedMotion } from "framer-motion";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")";

const GRID_STYLE = {
  backgroundImage:
    "linear-gradient(to right, color-mix(in srgb, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--foreground) 6%, transparent) 1px, transparent 1px)",
  backgroundSize: "46px 46px",
  maskImage:
    "radial-gradient(ellipse 68% 58% at 50% 44%, #000 8%, transparent 76%)",
  WebkitMaskImage:
    "radial-gradient(ellipse 68% 58% at 50% 44%, #000 8%, transparent 76%)",
} as const;

const GLOW_ONE = {
  background:
    "radial-gradient(46% 40% at 20% 16%, color-mix(in srgb, var(--primary) 58%, transparent) 0%, transparent 64%)",
} as const;

const GLOW_TWO = {
  background:
    "radial-gradient(44% 38% at 82% 22%, color-mix(in srgb, var(--teal) 52%, transparent) 0%, transparent 66%)",
} as const;

const GLOW_THREE = {
  background:
    "radial-gradient(52% 40% at 52% 98%, color-mix(in srgb, var(--highlight) 34%, transparent) 0%, transparent 70%)",
} as const;

const CONIC_BAND = {
  background:
    "conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb, var(--teal) 55%, transparent) 52deg, transparent 118deg, color-mix(in srgb, var(--primary) 50%, transparent) 206deg, transparent 286deg, color-mix(in srgb, var(--highlight) 38%, transparent) 330deg, transparent 360deg)",
  maskImage:
    "radial-gradient(closest-side, transparent 32%, #000 62%, transparent 100%)",
  WebkitMaskImage:
    "radial-gradient(closest-side, transparent 32%, #000 62%, transparent 100%)",
} as const;

const VIGNETTE = {
  background:
    "radial-gradient(ellipse 78% 72% at 50% 42%, transparent 34%, color-mix(in srgb, var(--background) 78%, transparent) 100%)",
} as const;

const GRAIN_STYLE = {
  backgroundImage: GRAIN,
  backgroundRepeat: "repeat",
} as const;

export function AuthBackground() {
  const reduced = useReducedMotion();

  const drift = (
    x: number[],
    y: number[],
    scale: number[],
    duration: number,
  ) =>
    reduced
      ? {}
      : {
          animate: { x, y, scale },
          transition: {
            duration,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-background" />

      <motion.div
        className="absolute inset-[-25%] opacity-60 dark:opacity-40"
        style={GLOW_ONE}
        {...drift([0, 34, 0], [0, 26, 0], [1, 1.08, 1], 26)}
      />
      <motion.div
        className="absolute inset-[-25%] opacity-55 dark:opacity-35"
        style={GLOW_TWO}
        {...drift([0, -38, 0], [0, 30, 0], [1, 1.06, 1], 31)}
      />
      <motion.div
        className="absolute inset-[-25%] opacity-40 dark:opacity-25"
        style={GLOW_THREE}
        {...drift([0, 26, 0], [0, -22, 0], [1, 1.1, 1], 36)}
      />

      <motion.div
        // className="absolute left-1/2 top-1/2 size-[150%] -translate-x-1/2 -translate-y-1/2 opacity-25 mix-blend-plus-lighter dark:opacity-20"
        className="absolute left-1/2 top-1/2 size-[150%] ... opacity-25 dark:opacity-20"
        style={CONIC_BAND}
        animate={reduced ? undefined : { rotate: 360 }}
        transition={
          reduced
            ? undefined
            : { duration: 110, repeat: Infinity, ease: "linear" }
        }
      />

      <div className="absolute inset-0 opacity-40" style={GRID_STYLE} />

      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={GRAIN_STYLE}
      />

      <div className="absolute inset-0" style={VIGNETTE} />
    </div>
  );
}
