"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, GraduationCap, HeartHandshake, UserCheck } from "lucide-react";

const portals = [
  {
    title: "Student Portal",
    role: "For Students",
    desc: "View class timetables, daily attendance, exam results, download assignments, and course materials.",
    icon: GraduationCap,
    tags: ["Timetable", "Results", "Assignments"],
    badgeColor: "bg-primary/10 text-primary border-primary/20",
  },
  {
    title: "Faculty & Staff",
    role: "For Educators",
    desc: "Record classroom attendance, publish term grades, upload lesson materials, and process leaves.",
    icon: UserCheck,
    tags: ["Attendance", "Gradebook", "Lesson Plans"],
    badgeColor: "bg-secondary/10 text-secondary border-secondary/20",
  },
  {
    title: "Parent Portal",
    role: "For Guardians",
    desc: "Monitor your ward's attendance records, track academic performance, pay term fees, and receive notices.",
    icon: HeartHandshake,
    tags: ["Fee Payment", "Progress", "Direct Notices"],
    badgeColor: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  },
];

export function PortalAccessGrid() {
  return (
    <section id="portals" className="border-b border-border/50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Choose Your Portal
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Dedicated dashboards customized for students, faculty members, and parents.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {portals.map((portal) => (
            <Card
              key={portal.title}
              className="group relative flex flex-col justify-between border-border/70 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <portal.icon className="size-5.5" />
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${portal.badgeColor}`}>
                    {portal.role}
                  </span>
                </div>

                <div>
                  <CardTitle className="text-lg font-semibold">{portal.title}</CardTitle>
                  <CardDescription className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {portal.desc}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {portal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button asChild className="w-full justify-between" size="sm">
                  <Link href="/login">
                    <span>Sign In</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
