"use client";

import { Users } from "lucide-react";
import { StudentTableView } from "@/components/students/student-table-view";
import { useHasPermission } from "@/store/session-store";

/**
 * School-plane students: Ritik's directory design on top of the real
 * GET /students API. The gate stays here so the table never renders for a
 * session the backend would refuse anyway.
 */
export default function TenantStudentsPage() {
  const canRead = useHasPermission("student.read");

  if (!canRead) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md rounded-[calc(var(--radius)*2.2)] border border-border/80 bg-card/80 p-6 text-center">
          <Users className="mx-auto size-6 text-muted-foreground" />
          <h1 className="mt-3 text-[20px] font-semibold">Students are not visible to you</h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            This screen needs the <code>student.read</code> permission.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-8">
      <StudentTableView />
    </main>
  );
}
