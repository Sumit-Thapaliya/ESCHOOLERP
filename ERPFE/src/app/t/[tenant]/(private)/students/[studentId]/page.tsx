"use client";

import { useParams, useRouter } from "next/navigation";
import { StudentProfilePageView } from "@/components/students/student-profile-page-view";
import { useOptionalTenant } from "@/providers/tenant-provider";
import { schoolPath } from "@/lib/tenant-slug";

/**
 * A student profile is a URL, not drawer state: back/forward, refresh and
 * shared links all behave. The view itself is Ritik's design, rewired to
 * GET /students/{id} (+ status history, + permission-gated health).
 *
 * No extra padding or min-h-screen here: the dashboard shell already owns the
 * page frame, and doubling them left a band of empty space under the record.
 */
export default function TenantStudentProfilePage() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();
  const tenant = useOptionalTenant();

  // "Back to directory" must land on the directory, even when this URL was
  // opened directly from a shared link and there is no history to go back to.
  const directoryHref = tenant
    ? schoolPath(tenant.slug, "/students")
    : "/students";

  return (
    <div className="w-full">
      <StudentProfilePageView
        studentId={params.studentId}
        onBack={() => router.push(directoryHref)}
        directoryHref={directoryHref}
      />
    </div>
  );
}
