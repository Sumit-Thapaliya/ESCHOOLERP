"use client";

import { useTenant } from "@/providers/tenant-provider";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Compass, Sparkles, Users } from "lucide-react";

export function Hero() {
  const { tenant } = useTenant();

  const values = [
    {
      icon: BookOpen,
      title: "Academic focus",
      desc: "Structured curricula designed for practical understanding and critical thinking.",
    },
    {
      icon: Users,
      title: "Supportive faculty",
      desc: "Experienced educators who guide students closely through every term.",
    },
    {
      icon: Compass,
      title: "Balanced development",
      desc: "Daily balance between academic studies, physical fitness, and arts.",
    },
  ];

  return (
    <section className="border-b border-border/60 bg-muted/20 py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Split Grid: Copy on Left, Image on Right */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 [grid-template-columns:repeat(auto-fit,minmax(0,1fr))] lg:[grid-template-columns:1.1fr_0.9fr]">
          <div className="min-w-0 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-medium text-foreground">
              <Sparkles className="size-3.5 text-primary" />
              <span>Admissions open for academic year 2026-2027</span>
            </div>

            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground break-words sm:text-5xl lg:text-5xl">
              Welcome to {tenant.name}
            </h1>

            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              {tenant.description ||
                "A dedicated learning institution providing balanced education, strong values, and a supportive environment for every student."}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg" className="gap-2">
                <a href="#admissions">
                  <span>Inquire about admissions</span>
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#academics">Our programs</a>
              </Button>
            </div>
          </div>

          {/* Promotional Campus Photography Card */}
          <div className="relative min-w-0">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80"
                alt="Students working together in classroom"
                loading="eager"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-medium text-white/90">
                  Campus life and learning
                </p>
                <p className="mt-0.5 text-sm font-medium">
                  Classroom discovery and collaborative projects.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Values Row */}
        <div className="mt-14 grid grid-cols-1 gap-4 text-left sm:grid-cols-3 [grid-template-columns:repeat(auto-fit,minmax(0,1fr))]">
          {values.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-colors hover:border-primary/40"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="size-4.5" />
              </div>
              <h2 className="mt-3 font-heading text-base font-semibold text-foreground">
                {item.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
