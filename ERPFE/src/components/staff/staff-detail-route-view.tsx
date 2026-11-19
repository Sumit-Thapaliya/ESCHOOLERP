"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  GraduationCap,
  Award,
  ShieldAlert,
  Edit2,
  Printer,
  UserX,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Briefcase,
} from "lucide-react";
import { StaffMember, StaffStatus } from "./staff-types";
import { MOCK_STAFF_MEMBERS } from "./staff-mock-data";
import { ChangeStatusModal } from "./change-status-modal";
import Link from "next/link";

interface StaffDetailRouteViewProps {
  staffId: string;
  backHref?: string;
}

export function StaffDetailRouteView({
  staffId,
  backHref = "/staff",
}: StaffDetailRouteViewProps) {
  const router = useRouter();
  const [staffList, setStaffList] = React.useState<StaffMember[]>(MOCK_STAFF_MEMBERS);
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "teacher" | "qualifications" | "employment"
  >("overview");
  const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const staff = staffList.find(
    (s) =>
      s.id.toLowerCase() === staffId.toLowerCase() ||
      s.employeeCode.toLowerCase() === staffId.toLowerCase()
  );

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(backHref);
    }
  };

  const handleStatusUpdate = (
    newStatus: StaffStatus,
    leavingDate?: string,
    leavingReason?: string
  ) => {
    if (!staff) return;
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staff.id
          ? {
              ...s,
              status: newStatus,
              leavingDate: leavingDate || null,
              leavingReason: leavingReason || null,
            }
          : s
      )
    );
    setToastMessage(`Status for ${staff.person.displayName} updated to "${newStatus}"!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!staff) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/80 mb-4">
          <UserX className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Staff Member Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          No employee record matches identifier <strong className="font-mono text-slate-700">{staffId}</strong>.
        </p>

        <div className="mt-6">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Staff Directory
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: StaffStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active Duty
          </span>
        );
      case "on_leave":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            On Leave
          </span>
        );
      case "resigned":
      case "terminated":
      case "retired":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 capitalize">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Staff Directory
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsStatusModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
            Change Employment Status
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Staff Dossier
          </button>
        </div>
      </div>

      {/* Profile Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            {staff.person.displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900">{staff.person.displayName}</h1>
              {getStatusBadge(staff.status)}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                {staff.staffType}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {staff.designation?.name || "Faculty Member"} •{" "}
              <strong className="text-slate-700">{staff.department?.name || "General"}</strong>
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-mono">
              <span>Code: <strong className="text-slate-800">{staff.employeeCode}</strong></span>
              <span>•</span>
              <span>Campus: <strong className="text-slate-800">{staff.campus?.name}</strong></span>
              <span>•</span>
              <span>Joined: <strong className="text-slate-800">{staff.joiningDate}</strong></span>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`py-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Overview & Contacts
          </button>

          {staff.teacherProfile && (
            <button
              type="button"
              onClick={() => setActiveTab("teacher")}
              className={`py-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === "teacher"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Teacher Profile
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab("qualifications")}
            className={`py-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "qualifications"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Qualifications & Degrees ({staff.qualifications?.length || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("employment")}
            className={`py-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "employment"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Employment Terms & History
          </button>
        </div>
      </div>

      {/* Tab 1: Overview & Contacts */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Personal Information
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Full Name</span>
                <span className="font-semibold text-slate-800">{staff.person.displayName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Gender</span>
                <span className="font-semibold text-slate-800 capitalize">{staff.person.gender || "Unspecified"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Date of Birth</span>
                <span className="font-mono text-slate-800">{staff.person.dob || "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Blood Group</span>
                <span className="font-bold text-slate-800">{staff.person.bloodGroup || "—"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Contact & Emergency Information
            </h3>

            <div className="space-y-2">
              {staff.person.contacts?.map((c, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 capitalize">{c.type} {c.isPrimary ? "(Primary)" : ""}</span>
                  <span className="font-mono font-semibold text-slate-800">{c.value}</span>
                </div>
              ))}
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Emergency Contact</span>
                <span className="font-medium text-slate-800">
                  {staff.emergencyContactName ? `${staff.emergencyContactName} (${staff.emergencyContactPhone || ""})` : "On school file"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Teacher Profile */}
      {activeTab === "teacher" && staff.teacherProfile && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs text-xs space-y-3 max-w-2xl">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Teaching Credentials & Workload
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Specialization</span>
              <span className="font-semibold text-slate-800">{staff.teacherProfile.specialization || "General"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Highest Academic Qualification</span>
              <span className="font-semibold text-slate-800">{staff.teacherProfile.highestQualification || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Total Teaching Experience</span>
              <span className="font-semibold text-slate-800">{staff.teacherProfile.experienceYears || 0} Years</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Teaching License Number</span>
              <span className="font-mono font-semibold text-blue-700">{staff.teacherProfile.teachingLicenseNo || "Verified"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Max Weekly Assigned Periods</span>
              <span className="font-mono font-bold text-slate-800">{staff.teacherProfile.maxWeeklyPeriods || 30} Periods</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Qualifications */}
      {activeTab === "qualifications" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Educational Qualifications & Certifications
            </h3>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                  <th className="px-5 py-3">Degree / Diploma</th>
                  <th className="px-5 py-3">Board / University</th>
                  <th className="px-5 py-3">Passing Year</th>
                  <th className="px-5 py-3">Division / Grade</th>
                  <th className="px-5 py-3 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.qualifications && staff.qualifications.length > 0 ? (
                  staff.qualifications.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3 font-bold text-slate-900">{q.degree}</td>
                      <td className="px-5 py-3 text-slate-700">{q.institution || "Tribhuvan University"}</td>
                      <td className="px-5 py-3 font-mono text-slate-600">{q.passedYear || "—"}</td>
                      <td className="px-5 py-3 font-semibold text-slate-800">{q.grade || "First Division"}</td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-slate-400 text-xs">
                      No qualification certificates recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Employment Details */}
      {activeTab === "employment" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs text-xs space-y-3 max-w-2xl">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Employment Terms & Lifecycle
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Employee Identification Code</span>
              <span className="font-mono font-bold text-slate-900">{staff.employeeCode}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Employment Category</span>
              <span className="font-semibold text-slate-800 capitalize">{staff.employmentType || "Permanent"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Date of Joining</span>
              <span className="font-mono text-slate-800">{staff.joiningDate}</span>
            </div>
            {staff.leavingDate && (
              <div className="flex justify-between py-1 border-b border-slate-50 text-rose-700 font-semibold">
                <span>Leaving Date:</span>
                <span className="font-mono">{staff.leavingDate} ({staff.leavingReason})</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      <ChangeStatusModal
        staff={staff}
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSave={handleStatusUpdate}
      />
    </div>
  );
}
