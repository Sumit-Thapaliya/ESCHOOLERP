"use client";

import { useTenant } from "@/providers/tenant-provider";
import { BookMarked, GraduationCap, Microscope, Palette, Trophy, Users2 } from "lucide-react";

export function SchoolPrograms() {
  const { tenant } = useTenant();

  const programs = [
    {
      title: "Foundational primary school",
      desc: "Early literacy, numeracy, and social development through guided exploration and structured classroom routines.",
      icon: BookMarked,
    },
    {
      icon: Microscope,
      title: "Middle years curriculum",
      desc: "In-depth study across sciences, mathematics, humanities, and languages with hands-on laboratory coursework.",
    },
    {
      icon: GraduationCap,
      title: "Secondary and college prep",
      desc: "Academic preparation, examination coaching, and guidance for higher secondary boards.",
    },
  ];

  const campusLife = [
    {
      icon: Trophy,
      title: "Athletics and physical training",
      desc: "Organized sports leagues, track and field, and fitness coaching across all grade levels.",
    },
    {
      icon: Palette,
      title: "Creative and performing arts",
      desc: "Music, visual art studios, drama, and school exhibitions encouraging individual creativity.",
    },
    {
      icon: Users2,
      title: "Student leadership and clubs",
      desc: "Debate societies, science fairs, community service, and student council initiatives.",
    },
  ];

  return (
    <div id="academics">
      {/* Academic Programs */}
      <section className="border-b border-border/60 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground break-words sm:text-3xl">
              Academic programs
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Progressive education paths designed to develop independent learners at every grade stage.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 [grid-template-columns:repeat(auto-fit,minmax(0,1fr))]">
            {programs.map((program) => (
              <div
                key={program.title}
                className="flex flex-col rounded-xl border border-border/70 bg-card p-6 shadow-xs transition-colors hover:border-primary/40"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <program.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                  {program.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {program.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Life & Facilities */}
      <section id="about" className="border-b border-border/60 bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground break-words sm:text-3xl">
              Campus life at {tenant.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              A balanced school environment supporting both academic rigor and personal development.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 [grid-template-columns:repeat(auto-fit,minmax(0,1fr))]">
            {campusLife.map((item) => (
              <div
                key={item.title}
                className="flex flex-col rounded-xl border border-border/70 bg-card p-6 shadow-xs transition-colors hover:border-primary/40"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
