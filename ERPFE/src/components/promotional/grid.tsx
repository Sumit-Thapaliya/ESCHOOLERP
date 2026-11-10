"use client";

import { ArrowRight, BookOpen, CircleDollarSign, FileBarChart, GraduationCap, Megaphone, Wallet } from "lucide-react";
import { BeamCard, GradientRule } from "@/components/promotional/beam";
import { PromoButton } from "@/components/promotional/button";
import { Reveal } from "@/components/promotional/motion";
import { SectionHeading } from "@/components/promotional/section-heading";

const CARDS = [
  {
    icon: CircleDollarSign,
    title: "Fee collection",
    body: "Collect online or at the counter. Receipts reconcile themselves; defaulters surface on their own.",
    accent: "var(--teal)",
    tags: ["Online & counter", "Auto-reconcile"],
  },
  {
    icon: GraduationCap,
    title: "Admissions",
    body: "Enquiries to enrolment in one pipeline. No lost forms, no duplicate entries, no chaos in Shrawan.",
    accent: "var(--tertiary)",
    tags: ["Enquiry pipeline", "No duplicates"],
  },
  {
    icon: Wallet,
    title: "Payroll & HR",
    body: "Salaries, deductions and Provident Fund computed and posted — the same figures, every month.",
    accent: "var(--info)",
    tags: ["Provident Fund", "Monthly posting"],
  },
  {
    icon: FileBarChart,
    title: "Records & reports",
    body: "Board packs, audits and government formats generated from live data — never re-typed.",
    accent: "var(--highlight)",
    tags: ["Board packs", "Audit-ready"],
  },
  {
    icon: Megaphone,
    title: "Communication",
    body: "Reach parents, staff and students instantly — notices, dues and announcements in one send.",
    accent: "var(--primary)",
    tags: ["Notices", "Due reminders"],
  },
  {
    icon: BookOpen,
    title: "Academic setup",
    body: "Classes, sections, subjects and sessions configured once — everything downstream just follows.",
    accent: "var(--teal)",
    tags: ["Classes & sections", "Sessions"],
  },
];

export function SystemGrid() {
  return (
    <section id="system" className="relative scroll-mt-28 border-y border-border bg-muted/40 py-24 lg:py-32">
      <GradientRule />
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-8">
        <SectionHeading
          eyebrow="The system"
          title="One platform for every department"
          description="Everything your office runs on — reconciled automatically, visible instantly."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map(({ icon: Icon, title, body, accent, tags }, index) => (
            <Reveal key={title} delay={(index % 3) * 0.08} className="h-full">
              <BeamCard accent={accent} className="h-full transition-transform duration-300 hover:-translate-y-1">
                <div className="flex h-full flex-col p-7">
                  <span
                    className="grid size-12 place-items-center rounded-xl ring-1"
                    style={{
                      color: accent,
                      background: `color-mix(in srgb, ${accent} 12%, transparent)`,
                      ["--tw-ring-color" as string]: `color-mix(in srgb, ${accent} 22%, transparent)`,
                    }}
                  >
                    <Icon className="size-[22px]" />
                  </span>
                  <h3 className="mt-6 text-[18px] font-bold tracking-[-0.01em]">{title}</h3>
                  <p className="mt-2.5 flex-1 text-[14.5px] leading-[1.65] text-muted-foreground">{body}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[11.5px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href="#contact"
                    className="group/lm mt-6 inline-flex items-center gap-1.5 self-start rounded text-[14px] font-semibold text-primary focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Learn more
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover/lm:translate-x-1" />
                  </a>
                </div>
              </BeamCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12 flex flex-col items-center gap-5 text-center">
          <p className="text-[15px] text-muted-foreground">+ everything else your office runs on, under one roof.</p>
          <PromoButton href="#contact" variant="outline" arrow>
            Book a walkthrough
          </PromoButton>
        </Reveal>
      </div>
    </section>
  );
}
