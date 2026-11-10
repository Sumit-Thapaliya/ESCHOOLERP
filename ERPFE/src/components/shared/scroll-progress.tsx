"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollProgress, type ScrollProgressOptions } from "@/hooks/use-scroll-progress";

const DEFAULT_BACKGROUND = "linear-gradient(90deg, var(--primary), var(--teal), var(--highlight))";

type ScrollProgressProps = ScrollProgressOptions & {
  /** `fixed` pins to the viewport edge; `absolute` sits inside a positioned parent. */
  position?: "fixed" | "absolute";
  placement?: "top" | "bottom";
  /** Bar thickness in px. */
  height?: number;
  /** Any CSS background — color or gradient. */
  background?: string;
  className?: string;
};

export function ScrollProgress({
  position = "fixed",
  placement = "top",
  height = 2,
  background = DEFAULT_BACKGROUND,
  className,
  ...options
}: ScrollProgressProps) {
  const scaleX = useScrollProgress(options);

  return (
    <motion.div
      aria-hidden
      className={cn(
        "left-0 z-[120] w-full origin-left pointer-events-none",
        position,
        placement === "top" ? "top-0" : "bottom-0",
        className
      )}
      style={{ scaleX, height, background }}
    />
  );
}
