"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserX, Search } from "lucide-react";
import { MOCK_STUDENTS } from "./student-mock-data";
import { StudentProfilePageView } from "./student-profile-page-view";
import Link from "next/link";

interface StudentDetailRouteViewProps {
  studentId: string;
  backHref?: string;
}

export function StudentDetailRouteView({
  studentId,
  backHref = "/students",
}: StudentDetailRouteViewProps) {
  const router = useRouter();

  const student = React.useMemo(() => {
    if (!studentId) return undefined;
    const decoded = decodeURIComponent(studentId).toLowerCase();
    return MOCK_STUDENTS.find(
      (s) =>
        s.id.toLowerCase() === decoded ||
        s.admissionNo.toLowerCase() === decoded ||
        s.rollNo.toLowerCase() === decoded
    );
  }, [studentId]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(backHref);
    }
  };

  if (!student) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/80 mb-4">
          <UserX className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Student Record Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          No student matches the identifier <strong className="font-mono text-slate-700">{studentId}</strong> in this school repository.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Students Directory
          </Link>
        </div>

        {/* Suggest existing student IDs for testing */}
        <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs">
          <div className="font-semibold text-slate-700 mb-2">Available student identifiers for testing:</div>
          <div className="flex flex-wrap gap-1.5">
            {MOCK_STUDENTS.slice(0, 5).map((s) => (
              <Link
                key={s.id}
                href={`${backHref.replace(/\/$/, "")}/${s.id}`}
                className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 font-mono text-[11px] transition-colors"
              >
                {s.fullName} ({s.id})
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <StudentProfilePageView studentId={studentId} onBack={handleBack} />;
}
