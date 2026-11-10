"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { PromoButton } from "@/components/promotional/button";
import { DashboardPreview } from "@/components/promotional/dashboard-preview";
import { Counter, EASE, Magnetic, SplitText } from "@/components/promotional/motion";
import { useReducedMotion } from "@/components/promotional/use-reduced-motion";

const STATS = [
  { to: 240, suffix: "+", decimals: 0, label: "Institutions live" },
  { to: 310, suffix: "k", decimals: 0, label: "Records daily" },
  { to: 98.6, suffix: "%", decimals: 1, label: "Billing accuracy" },
  { to: 7, suffix: " days", decimals: 0, label: "First call to live" },
];

const fadeUp = (delay: number, reduce: boolean) => ({
  initial: reduce ? false : { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
});

export function Hero() {
  const reduce = useReducedMotion();
  const previewRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: previewRef, offset: ["start end", "start 30%"] });
  const tiltRaw = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const tilt = useSpring(tiltRaw, { stiffness: 90, damping: 26 });

  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.5] dark:opacity-[0.25]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, #000 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, #000 30%, transparent 75%)",
          }}
        />
        <div
          className="absolute left-1/2 top-[-180px] h-[480px] w-[900px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in srgb, var(--primary) 28%, transparent), transparent), radial-gradient(closest-side at 70% 60%, color-mix(in srgb, var(--highlight) 22%, transparent), transparent)",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-6 pb-20 pt-14 text-center lg:px-8 lg:pb-28 lg:pt-20">
        <motion.a
          href="#system"
          {...fadeUp(0, reduce)}
          className="group mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/70 py-1 pl-1 pr-3.5 text-[12.5px] font-medium text-muted-foreground shadow-sm backdrop-blur transition-colors hover:border-primary/30 hover:text-foreground"
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
            <Sparkles className="size-3" /> 2083
          </span>
          Ready for the new academic year
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </motion.a>

        <SplitText
          as="h1"
          delay={0.1}
          text="School & College Management Software"
          className="mx-auto mt-7 max-w-[18ch] text-balance text-[clamp(2.6rem,5.6vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.035em]"
        />

        <motion.p
          {...fadeUp(0.45, reduce)}
          className="mx-auto mt-6 max-w-[56ch] text-pretty text-[18px] leading-[1.65] text-muted-foreground"
        >
          <b className="font-semibold text-foreground">Automate daily operations. Reconcile every record.</b>{" "}
          Baudhika carries your institution&apos;s academic and administrative work in one place.
        </motion.p>

        <motion.div {...fadeUp(0.6, reduce)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <PromoButton href="#contact" arrow shine>
              Get started
            </PromoButton>
          </Magnetic>
          <PromoButton href="#system" variant="outline">
            See the system
          </PromoButton>
        </motion.div>

        <motion.p {...fadeUp(0.7, reduce)} className="mt-5 text-[13px] text-muted-foreground">
          Live in 7 days · Records migrated for you · Staff trained on site
        </motion.p>

        <motion.div
          ref={previewRef}
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
          style={reduce ? undefined : { rotateX: tilt, transformPerspective: 1400 }}
          className="mx-auto mt-16 max-w-[1080px] origin-top"
        >
          <DashboardPreview />
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-[880px] grid-cols-2 gap-y-10 sm:grid-cols-4 sm:divide-x sm:divide-border">
          {STATS.map((stat, index) => (
            <motion.div key={stat.label} {...fadeUp(0.9 + index * 0.08, reduce)} className="px-6">
              <Counter
                to={stat.to}
                suffix={stat.suffix}
                decimals={stat.decimals}
                className="block text-[34px] font-extrabold tabular-nums tracking-[-0.03em] text-foreground"
              />
              <span className="mt-1 block text-[13px] font-medium text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
