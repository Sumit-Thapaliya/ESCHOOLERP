"use client";

import {
  Bell,
  BookOpen,
  Bus,
  CalendarCheck2,
  CreditCard,
  GraduationCap,
} from "lucide-react";

const modules = [
  {
    icon: GraduationCap,
    title: "Academics & Examination",
    desc: "Comprehensive curriculum planning, continuous assessment tracking, report cards, and automated GPA computation.",
  },
  {
    icon: CalendarCheck2,
    title: "Attendance & Schedules",
    desc: "Period-wise digital roll calls, student absence alerts, faculty leave management, and clash-free timetables.",
  },
  {
    icon: CreditCard,
    title: "Fee Collection & Invoicing",
    desc: "Digital fee receipts, term-wise installment structures, penalty tracking, and financial reconciliation reports.",
  },
  {
    icon: BookOpen,
    title: "Digital Library System",
    desc: "Full catalog search, barcode book issue/return tracking, overdue fine management, and e-learning resources.",
  },
  {
    icon: Bell,
    title: "Notices & Circulars",
    desc: "Direct push announcements for academic calendars, exam schedules, events, and urgent school advisories.",
  },
  {
    icon: Bus,
    title: "Transport & Logistics",
    desc: "Bus routes, pickup point allocation, driver assignments, and vehicle emergency maintenance logs.",
  },
];

export function FeaturesShowcase() {
  return (
    <section id="features" className="border-b border-border/50 bg-muted/20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Platform Capabilities
          </span>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Integrated Campus Management
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Everything your teachers, students, and administrators need in one secure, unified digital environment.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((item) => (
            <div
              key={item.title}
              className="flex flex-col rounded-xl border border-border/60 bg-card p-5 shadow-2xs transition-all duration-200 hover:border-primary/40 hover:shadow-xs"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
