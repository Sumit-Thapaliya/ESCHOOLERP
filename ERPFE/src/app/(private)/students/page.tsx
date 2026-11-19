"use client";

import { School } from "lucide-react";

/**
 * Platform-plane admins manage SCHOOLS, not any one school's students: the
 * /students API is tenant-scoped (x-tenant-id + School JWT), so there is no
 * honest dataset to show here. The previous mock table implied one.
 * Student administration lives inside each school portal, /t/<slug>/students.
 */
export default function RootStudentsPage() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="max-w-md rounded-[calc(var(--radius)*2.2)] border border-border/80 bg-card/80 p-6 text-center">
        <School className="mx-auto size-6 text-muted-foreground" />
        <h1 className="mt-3 text-[20px] font-semibold">Students live in school portals</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
          Student records are scoped to a single school and need its tenant
          context. Open a school portal — <code>/t/&lt;slug&gt;/students</code> —
          to administer its students.
        </p>
      </div>
    </main>
  );
}
