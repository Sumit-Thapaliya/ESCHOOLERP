"use client";

import { CalendarCheck2, Layers, MapPin, ShieldCheck } from "lucide-react";
import { PromoButton } from "@/components/promotional/button";
import { Magnetic, Reveal } from "@/components/promotional/motion";
import { SectionHeading } from "@/components/promotional/section-heading";

const POINTS = [
  {
    icon: Layers,
    title: "One reconciled record",
    body: "Admissions, fees, payroll and exams share a single source — management sees the truth, not three versions of it.",
  },
  {
    icon: CalendarCheck2,
    title: "Live in seven days",
    body: "We map your departments, migrate your registers and train your staff on your own data.",
  },
  {
    icon: MapPin,
    title: "Built for Nepal",
    body: "Your fee heads, Nepali sessions and government formats — not a foreign tool bent to fit.",
  },
  {
    icon: ShieldCheck,
    title: "Yours, and safe",
    body: "Encrypted, backed up daily, with a full audit trail on every entry. Export any time.",
  },
];

export function Why() {
  return (
    <section id="why" className="scroll-mt-28 py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="Why Baudhika"
              title="The management system your office actually runs on"
              description="Baudhika automates your institution's daily operations in a single web-based platform — from the admissions desk to the accounts office."
            />
            <Reveal delay={0.15} className="mt-8">
              <PromoButton href="#system" variant="outline" size="md" arrow>
                Explore the modules
              </PromoButton>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {POINTS.map(({ icon: Icon, title, body }, index) => (
              <Reveal key={title} delay={(index % 2) * 0.08}>
                <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_40px_-24px_rgba(15,36,51,0.35)]">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-[17px] font-bold tracking-[-0.01em]">{title}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.65] text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1} className="mt-16">
          <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-highlight p-8 sm:p-10 lg:flex-row lg:items-center">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 size-[320px] rounded-full bg-white/25 blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, #231400 1px, transparent 0)",
                backgroundSize: "18px 18px",
              }}
            />
            <div className="relative">
              <b className="block text-[22px] font-extrabold tracking-[-0.015em] text-[#231400]">
                Want to see how Baudhika simplifies daily operations?
              </b>
              <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.65] text-[#4a3200]">
                One call. We walk through your departments and show you the system on your own numbers.
              </p>
            </div>
            <Magnetic strength={8} className="relative shrink-0">
              <PromoButton href="#contact" variant="dark" arrow>
                Talk to us
              </PromoButton>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
