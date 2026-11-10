"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/components/promotional/use-reduced-motion";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<unknown> };
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    const element = ref.current;
    const doc = typeof document === "undefined" ? null : (document as ViewTransitionDocument);

    if (!element || !doc || !doc.startViewTransition || reduce) {
      setTheme(next);
      return;
    }

    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const root = doc.documentElement;
    root.style.setProperty("--vt-x", `${x}px`);
    root.style.setProperty("--vt-y", `${y}px`);
    root.style.setProperty("--vt-r", `${radius}px`);

    setPressed(true);
    const transition = doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });

    Promise.resolve(transition.finished).finally(() => setPressed(false));
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      title="Toggle colour theme"
      className="group/theme relative grid size-9 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full border border-border bg-background/70 text-muted-foreground transition-colors duration-300 hover:border-primary/50 hover:text-primary focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
    >
      <motion.span
        className="grid place-items-center"
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: pressed ? 0.82 : 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
      >
        {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      </motion.span>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover/theme:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 70%)",
        }}
      />
    </button>
  );
}
