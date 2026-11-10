"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Backpack, Building2, FlaskConical, Presentation } from "lucide-react";
import { PromoButton } from "@/components/promotional/button";
import { EASE, Magnetic, Reveal } from "@/components/promotional/motion";
import { SectionHeading } from "@/components/promotional/section-heading";
import { useReducedMotion } from "@/components/promotional/use-reduced-motion";
import { cn } from "@/lib/utils";

const SEGMENTS = [
  {
    label: "Schools",
    icon: Backpack,
    line: "Admissions to report cards — one record from playgroup to Grade 12.",
  },
  {
    label: "Colleges",
    icon: Building2,
    line: "Batches, faculties and exams reconciled across every program.",
  },
  {
    label: "+2 Colleges",
    icon: FlaskConical,
    line: "Science, management, humanities — streams, sections and sessions in one place.",
  },
  {
    label: "Training institutes",
    icon: Presentation,
    line: "Courses, intakes and certificates tracked intake to intake.",
  },
];

export function Configurator() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const segment = SEGMENTS[active];
  const Icon = segment.icon;

  return (
    <section className="border-b border-border py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1280px] px-6 text-center lg:px-8">
        <SectionHeading
          eyebrow="Made to fit"
          title="Shape it around your institution"
          description="One platform, configured for the way your institution actually works."
        />

        <Reveal delay={0.14}>
          <div
            role="group"
            aria-label="Institution type"
            className="mx-auto mt-10 inline-flex max-w-full flex-wrap justify-center gap-1 rounded-2xl border border-border bg-muted/70 p-1.5 sm:rounded-full"
          >
            {SEGMENTS.map(({ label, icon: SegmentIcon }, index) => {
              const isActive = index === active;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative isolate inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-colors",
                    "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="segment-pill"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 -z-10 rounded-full bg-primary shadow-[0_6px_16px_-8px_var(--primary)]"
                    />
                  )}
                  <SegmentIcon className="size-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mx-auto mt-8 max-w-[640px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 text-left shadow-[0_20px_40px_-28px_rgba(15,36,51,0.4)]"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-teal text-white">
                <Icon className="size-6" />
              </span>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  For {segment.label.toLowerCase()}
                </p>
                <p className="mt-1 text-[17px] font-semibold leading-[1.5]">{segment.line}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <Reveal delay={0.1} className="mt-10">
          <Magnetic>
            <PromoButton href="#contact" arrow>
              Get started
            </PromoButton>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
