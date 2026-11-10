"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calculator, CheckCircle2, FileSpreadsheet, NotebookPen, ReceiptText } from "lucide-react";
import { PromoButton } from "@/components/promotional/button";
import { EASE, Magnetic, Reveal } from "@/components/promotional/motion";
import { SectionHeading } from "@/components/promotional/section-heading";
import { useReducedMotion } from "@/components/promotional/use-reduced-motion";

const PAINS = [
  { icon: NotebookPen, label: "Paper registers" },
  { icon: FileSpreadsheet, label: "Excel sheets" },
  { icon: ReceiptText, label: "Cash receipts" },
  { icon: Calculator, label: "Manual payroll" },
];

export function PaperBand() {
  const reduce = useReducedMotion();

  return (
    <motion.section
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
      className="relative overflow-hidden bg-[#0f2433] py-24 text-white lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 60% 70% at 50% 50%, #000, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 50% 50%, #000, transparent 80%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-6 lg:px-8">
        <SectionHeading
          tone="inverse"
          eyebrow="Before & after"
          title="Still running on paper and spreadsheets?"
          description="See what changes when every desk works from one reconciled record."
        />

        <div className="mx-auto mt-14 grid max-w-[980px] items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <Reveal>
            <div className="grid grid-cols-2 gap-3">
              {PAINS.map(({ icon: Icon, label }, index) => (
                <motion.div
                  key={label}
                  initial={reduce ? false : { rotate: 0 }}
                  whileInView={{ rotate: index % 2 ? 1.5 : -1.5 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.06, ease: EASE }}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left"
                >
                  <Icon className="size-5 shrink-0 text-white/45" />
                  <span className="text-[14px] font-semibold text-white/55 line-through decoration-[#ff6b6b]/70 decoration-2">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mx-auto">
            <span className="grid size-12 rotate-90 place-items-center rounded-full border border-white/15 bg-white/5 lg:rotate-0">
              <ArrowRight className="size-5 text-highlight" />
            </span>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="relative rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.1] to-white/[0.03] p-6 text-left shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-teal text-[15px] font-bold">
                  B
                </span>
                <div>
                  <p className="text-[15px] font-bold">One reconciled record</p>
                  <p className="text-[12.5px] text-white/55">Every desk, the same numbers</p>
                </div>
              </div>
              <ul className="mt-5 space-y-2.5 text-[14px] text-white/80">
                {["Admissions in one pipeline", "Receipts that reconcile themselves", "Payroll posted on time"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-[18px] shrink-0 text-teal" />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.18} className="mt-14 text-center">
          <Magnetic>
            <PromoButton href="#system" variant="light" arrow>
              See the system
            </PromoButton>
          </Magnetic>
        </Reveal>
      </div>
    </motion.section>
  );
}
