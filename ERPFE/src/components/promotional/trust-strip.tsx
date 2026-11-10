"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/promotional/motion";
import { useReducedMotion } from "@/components/promotional/use-reduced-motion";

const SEGMENTS = ["SCHOOLS", "COLLEGES", "+2 COLLEGES", "TRAINING INSTITUTES"];

export function TrustStrip() {
  const reduce = useReducedMotion();
  const row = [...SEGMENTS, ...SEGMENTS, ...SEGMENTS, ...SEGMENTS];

  return (
    <section className="border-y border-border bg-muted/60 py-6">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-5 px-6 lg:flex-row lg:gap-8 lg:px-8">
        <Reveal className="flex shrink-0 items-center gap-3.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            Built for
          </span>
          <span className="hidden h-4 w-px bg-border lg:block" />
        </Reveal>

        <div
          className="w-full flex-1 overflow-hidden"
          style={{
            maskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
          }}
        >
          <motion.div
            className="flex w-max items-center gap-12"
            animate={reduce ? undefined : { x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {row.map((name, index) => (
              <span key={`${name}-${index}`} className="flex items-center gap-12">
                <span className="whitespace-nowrap text-[13px] font-bold tracking-[0.2em] text-muted-foreground">
                  {name}
                </span>
                <span className="text-[10px] text-highlight">◆</span>
              </span>
            ))}
          </motion.div>
        </div>

        <Reveal delay={0.1} className="shrink-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-[12px] font-semibold shadow-sm">
            <motion.i
              className="block size-1.5 rounded-full bg-teal"
              animate={reduce ? undefined : { opacity: [1, 0.35, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            All systems normal
          </span>
        </Reveal>
      </div>
    </section>
  );
}
