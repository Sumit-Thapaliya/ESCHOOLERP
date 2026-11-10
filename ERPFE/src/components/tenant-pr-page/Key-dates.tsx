"use client";

import { CalendarDays, Clock, MapPin } from "lucide-react";

export function KeyDates() {
  const announcements = [
    {
      title: "Admissions open",
      tag: "Session 2026-2027",
      date: "Applications currently accepted",
      description: "Enrollment open for Kindergarten through Grade 11. Early assessment rounds are underway.",
      icon: CalendarDays,
    },
    {
      title: "Weekly campus tours",
      tag: "Every Friday",
      date: "10:00 AM to 1:00 PM",
      description: "Tour classroom facilities, laboratories, and grounds with our academic coordinators.",
      icon: Clock,
    },
    {
      title: "New student orientation",
      tag: "Upcoming term",
      date: "Main auditorium",
      description: "Parent welcome meeting, syllabus briefings, and student handbook distribution.",
      icon: MapPin,
    },
  ];

  return (
    <section id="dates" className="border-b border-border/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground break-words sm:text-3xl">
            Key dates and notices
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Important dates for admissions, upcoming visits, and academic milestones.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 [grid-template-columns:repeat(auto-fit,minmax(0,1fr))]">
          {announcements.map((item) => (
            <div
              key={item.title}
              className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-6 shadow-xs transition-colors hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {item.tag}
                  </span>
                  <item.icon className="size-4 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-primary">
                  {item.date}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
