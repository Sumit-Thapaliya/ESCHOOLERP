"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleQuestion, Plus } from "lucide-react";
import { PromoButton } from "@/components/promotional/button";
import { EASE, Reveal } from "@/components/promotional/motion";
import { SectionHeading } from "@/components/promotional/section-heading";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    q: "How long does setup take?",
    a: "Seven days from first call to fully live: we map your departments, migrate your records, configure your workflows, and train your staff on your own data.",
  },
  {
    q: "Do you migrate our existing records?",
    a: "Yes — registers, spreadsheets and legacy files are migrated and verified by our team before go-live. Nothing is re-typed by your staff.",
  },
  {
    q: "Is our data safe?",
    a: "Your data is encrypted end to end, backed up daily, and stays yours — exportable any time you ask. Every entry carries a full audit trail.",
  },
  {
    q: "Do you train our staff?",
    a: "On site, on your own data, until the system runs without us. And support answers in under four hours after that.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="scroll-mt-28 border-b border-border bg-muted/40 py-24 lg:py-32">
      <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Questions institutions ask us"
            description="Everything you need to know before your first call."
          />
          <Reveal delay={0.15}>
            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <MessageCircleQuestion className="size-5" />
              </span>
              <div>
                <p className="text-[15px] font-bold">Still have questions?</p>
                <p className="mt-1 text-[14px] text-muted-foreground">Our team answers within four hours.</p>
                <PromoButton href="#contact" variant="outline" size="md" arrow className="mt-4">
                  Contact us
                </PromoButton>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="space-y-3">
          {ITEMS.map((item, index) => {
            const isOpen = open === index;
            const panelId = `faq-panel-${index}`;
            return (
              <Reveal key={item.q} delay={index * 0.06}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-card transition-[border-color,box-shadow] duration-300",
                    isOpen
                      ? "border-primary/30 shadow-[0_20px_40px_-28px_rgba(15,36,51,0.45)]"
                      : "border-border hover:border-primary/20"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[16px] font-semibold focus:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  >
                    <span className="flex items-center gap-4">
                      <span className="text-[13px] font-semibold tabular-nums text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full transition-colors",
                        isOpen ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                      )}
                    >
                      <Plus className="size-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 pl-[3.75rem] text-[15px] leading-[1.7] text-muted-foreground">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
