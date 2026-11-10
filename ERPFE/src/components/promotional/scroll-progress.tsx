"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-[120] h-0.5 w-full origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--primary), var(--teal), var(--highlight))",
      }}
    />
  );
}
