import type { RefObject } from "react";
import { useScroll, useSpring, type MotionValue, type SpringOptions } from "framer-motion";

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

export type ScrollProgressOptions = {
  /** Scrollable element to track. Defaults to the window. */
  container?: RefObject<HTMLElement | null>;
  /** Track progress through this element instead of the whole scroll range. */
  target?: RefObject<HTMLElement | null>;
  offset?: ScrollOffset;
  /** Spring config for smoothing, or `false` for the raw value. */
  smooth?: SpringOptions | false;
};

const DEFAULT_SPRING: SpringOptions = { stiffness: 120, damping: 26, mass: 0.3 };

/** Scroll progress from 0 to 1 — goes forward on scroll down, back on scroll up. */
export function useScrollProgress({
  container,
  target,
  offset,
  smooth = DEFAULT_SPRING,
}: ScrollProgressOptions = {}): MotionValue<number> {
  const { scrollYProgress } = useScroll({ container, target, offset });
  const spring = useSpring(scrollYProgress, smooth || DEFAULT_SPRING);
  return smooth ? spring : scrollYProgress;
}
