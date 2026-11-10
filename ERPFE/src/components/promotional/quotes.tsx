"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { EASE, Reveal } from "@/components/promotional/motion";
import { SectionHeading } from "@/components/promotional/section-heading";
import { useReducedMotion } from "@/components/promotional/use-reduced-motion";

const QUOTES = [
  {
    text: "For the first time, our board pack and our bank statement agree. That alone was worth the move.",
    name: "Bijay Sharma",
    role: "Managing Director, Pioneer Higher Secondary College, Kathmandu",
  },
  {
    text: "Fee season used to take my office three weeks. Now the receipts reconcile themselves and I just verify.",
    name: "Principal",
    role: "Secondary School, Pokhara",
  },
  {
    text: "Payroll posts the same day every month and the figures never drift. Our audit finished two weeks early.",
    name: "Accountant",
    role: "+2 College, Chitwan",
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

export function Quotes() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const quote = QUOTES[index];

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setIndex((value) => (value + 1) % QUOTES.length), 6000);
    return () => clearInterval(id);
  }, [reduce, paused]);

  const go = (direction: number) =>
    setIndex((value) => (value + direction + QUOTES.length) % QUOTES.length);

  const arrowClass =
    "grid size-11 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary/40 hover:bg-muted focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <section
      id="stories"
      className="scroll-mt-28 py-24 lg:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-8">
        <SectionHeading eyebrow="Stories" title="Hear from our institutions" />

        <Reveal delay={0.1}>
          <div className="relative mx-auto mt-12 max-w-[920px] overflow-hidden rounded-3xl border border-border bg-card px-6 py-12 shadow-[0_30px_60px_-36px_rgba(15,36,51,0.4)] sm:px-14 sm:py-14">
            <Quote
              aria-hidden
              className="absolute -right-4 -top-4 size-40 rotate-180 text-primary/[0.06]"
              strokeWidth={1.25}
            />
            <div className="min-h-[230px] sm:min-h-[200px]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={index}
                  initial={reduce ? false : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: -24 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  drag={reduce ? false : "x"}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.12}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70) go(1);
                    else if (info.offset.x > 70) go(-1);
                  }}
                  className="relative cursor-grab active:cursor-grabbing"
                >
                  <blockquote className="text-pretty text-[clamp(1.35rem,2.6vw,1.9rem)] font-semibold leading-[1.45] tracking-[-0.015em]">
                    &ldquo;{quote.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-teal text-[15px] font-bold text-white">
                      {initials(quote.name)}
                    </span>
                    <span className="text-[14px] leading-[1.5]">
                      <b className="block font-bold text-foreground">{quote.name}</b>
                      <span className="text-muted-foreground">{quote.role}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6">
              <div className="flex gap-1.5">
                {QUOTES.map((item, i) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show story ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className="grid h-8 place-items-center px-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <motion.span
                      animate={{ width: i === index ? 28 : 8 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={`block h-2 rounded-full ${i === index ? "bg-highlight" : "bg-border"}`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => go(-1)} aria-label="Previous story" className={arrowClass}>
                  <ChevronLeft className="size-5" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next story" className={arrowClass}>
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
