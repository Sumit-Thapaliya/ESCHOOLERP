"use client";

import * as React from "react";
import {
  ArrowLeft,
  Printer,
  Edit3,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Bus,
  CheckCircle2,
  FileText,
  HeartPulse,
  GraduationCap,
  Banknote,
  CalendarCheck2,
  Download,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Building2,
} from "lucide-react";
import type { Student, StudentStatus } from "./student-types";
import { StudentIdCardModal } from "./student-id-card-modal";
import { toast } from "sonner";
import { cn } from "cn";

interface StudentProfilePageViewProps {
  student: Student;
  onBack: () => void;
}

type TabType =
  | "personal"
  | "academic"
  | "documents"
  | "health"
  | "fees"
  | "attendance";

export function StudentProfilePageView({
  student,
  onBack,
}: StudentProfilePageViewProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>("personal");
  const [currentStatus, setCurrentStatus] = React.useState<StudentStatus>(
    student.status
  );
  const [idCardOpen, setIdCardOpen] = React.useState(false);

  const handleStatusChange = (newStatus: StudentStatus) => {
    setCurrentStatus(newStatus);
    toast.success(`Student status changed to ${newStatus}`);
  };

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "On leave":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Suspended":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Alumni":
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const primaryGuardian = student.guardians[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE5F0] pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5F0] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to directory</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-xs text-slate-500">Student directory</span>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold text-[#2570D3]">
            {student.fullName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIdCardOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5F0] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-[#2570D3]" />
            <span>Print ID card</span>
          </button>
          <button
            type="button"
            onClick={() => toast.info("Opening edit student modal")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2570D3] px-3.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-[#1C5BB0] transition-colors cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit record</span>
          </button>
        </div>
      </div>

      {/* Main Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Student Profile
        </h1>
        <p className="text-xs text-slate-500">
          Comprehensive institutional record and student lifecycle history
        </p>
      </div>

      {/* Concept Header Card (Matching Page 4 in Roadmap PDF) */}
      <div className="rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar / Portrait */}
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-200 shadow-xs text-slate-700 text-3xl font-bold">
            {student.avatarUrl ? (
              <img
                src={student.avatarUrl}
                alt={student.fullName}
                className="h-full w-full object-cover rounded-2xl"
              />
            ) : (
              student.fullName.slice(0, 2).toUpperCase()
            )}
          </div>

          {/* Key Attributes in 2-Column Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {student.fullName}
                </h2>
                <p className="text-xs text-slate-500">
                  Admission ID: <span className="font-mono font-medium">{student.admissionNo}</span>
                </p>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    getStatusBadge(currentStatus)
                  )}
                >
                  {currentStatus}
                </span>
                <select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value as StudentStatus)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-hidden hover:bg-slate-50 cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="On leave">On leave</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>
            </div>

            {/* 2-Column Metadata Grid (Matching concept layout) */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
              <div className="flex items-baseline">
                <span className="w-32 text-slate-400 font-medium">Roll No :</span>
                <span className="font-semibold text-slate-800">{student.rollNo}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-32 text-slate-400 font-medium">Campus :</span>
                <span className="font-semibold text-slate-800">{student.campusName}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-32 text-slate-400 font-medium">Class :</span>
                <span className="font-semibold text-slate-800">
                  {student.grade} - Section {student.section}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="w-32 text-slate-400 font-medium">Joined date :</span>
                <span className="font-semibold text-slate-800">{student.joinedDate}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-32 text-slate-400 font-medium">DOB (BS / AD) :</span>
                <span className="font-semibold text-slate-800">
                  {student.dobBS} ({student.dobAD})
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="w-32 text-slate-400 font-medium">Father's Name :</span>
                <span className="font-semibold text-slate-800">
                  {primaryGuardian?.name ?? "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pill Navigation Tabs (Matching Page 4 Concept) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("personal")}
          className={cn(
            "rounded-xl px-4 py-2 transition-colors cursor-pointer whitespace-nowrap",
            activeTab === "personal"
              ? "bg-[#2570D3] text-white shadow-xs font-semibold"
              : "bg-white border border-[#DDE5F0] text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          Personal Info
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("academic")}
          className={cn(
            "rounded-xl px-4 py-2 transition-colors cursor-pointer whitespace-nowrap",
            activeTab === "academic"
              ? "bg-[#2570D3] text-white shadow-xs font-semibold"
              : "bg-white border border-[#DDE5F0] text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          Academic
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("documents")}
          className={cn(
            "rounded-xl px-4 py-2 transition-colors cursor-pointer whitespace-nowrap",
            activeTab === "documents"
              ? "bg-[#2570D3] text-white shadow-xs font-semibold"
              : "bg-white border border-[#DDE5F0] text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          Documents
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("health")}
          className={cn(
            "rounded-xl px-4 py-2 transition-colors cursor-pointer whitespace-nowrap",
            activeTab === "health"
              ? "bg-[#2570D3] text-white shadow-xs font-semibold"
              : "bg-white border border-[#DDE5F0] text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          Health
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("fees")}
          className={cn(
            "rounded-xl px-4 py-2 transition-colors cursor-pointer whitespace-nowrap",
            activeTab === "fees"
              ? "bg-[#2570D3] text-white shadow-xs font-semibold"
              : "bg-white border border-[#DDE5F0] text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          Fees & Dues
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("attendance")}
          className={cn(
            "rounded-xl px-4 py-2 transition-colors cursor-pointer whitespace-nowrap",
            activeTab === "attendance"
              ? "bg-[#2570D3] text-white shadow-xs font-semibold"
              : "bg-white border border-[#DDE5F0] text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          Attendance
        </button>
      </div>

      {/* Tab 1: PERSONAL INFO (Side-by-side cards matching the concept picture) */}
      {activeTab === "personal" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Card: Personal Info */}
          <div className="lg:col-span-7 rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100">
              Personal Info
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-baseline">
                <span className="w-36 text-slate-400 font-medium">Gender :</span>
                <span className="font-semibold text-slate-800">{student.gender}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-36 text-slate-400 font-medium">Address :</span>
                <span className="font-semibold text-slate-800">
                  {student.address.street}, {student.address.ward}, {student.address.municipality}, {student.address.district}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="w-36 text-slate-400 font-medium">Blood Group :</span>
                <span className="font-semibold text-slate-800">{student.bloodGroup}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-36 text-slate-400 font-medium">Category :</span>
                <span className="font-semibold text-slate-800">General</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-36 text-slate-400 font-medium">Emergency contact :</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {primaryGuardian?.phone ?? "N/A"} ({primaryGuardian?.relation})
                </span>
              </div>
              {student.transportRoute && (
                <div className="flex items-baseline">
                  <span className="w-36 text-slate-400 font-medium">Transit route :</span>
                  <span className="font-semibold text-slate-800">
                    {student.transportRoute} (Stop: {student.busStop})
                  </span>
                </div>
              )}
            </div>

            {/* Guardian contacts section */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-semibold text-xs text-slate-700 mb-2">
                Family & Guardian details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {student.guardians.map((g, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 p-3 bg-slate-50/50 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-800">{g.name}</p>
                      <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-600 font-medium">
                        {g.relation}
                      </span>
                    </div>
                    {g.occupation && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {g.occupation}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-700 font-mono mt-1 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-[#2570D3]" />
                      {g.phone}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Card: Documents (Matching the blue icons & green verified indicators from pic) */}
          <div className="lg:col-span-5 rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                Documents
              </h3>
              <span className="text-xs text-slate-400">
                {student.documents.length} files
              </span>
            </div>

            <div className="space-y-3">
              {/* Default realistic documents if list is short */}
              {[
                { title: "Birth Certificate", file: "birth_certificate_official.pdf", size: "1.2 MB", verified: true },
                { title: "Citizenship / National ID", file: "national_id_slip.pdf", size: "820 KB", verified: true },
                { title: "Previous Report Card / TC", file: "previous_gradesheet_tc.pdf", size: "1.5 MB", verified: true },
                ...student.documents.filter(d => !["Birth Certificate", "National ID"].includes(d.title)),
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50/80 transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    {/* Blue Icon Square matching pic */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2570D3] text-white font-bold shadow-2xs">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{doc.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {"fileName" in doc ? doc.fileName : doc.file} • {"fileSize" in doc ? doc.fileSize : doc.size}
                      </p>
                    </div>
                  </div>

                  {/* Green Verified Circle Indicator matching pic */}
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                      title="Verified Document"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => toast.success("Upload document dialog")}
                className="text-xs font-semibold text-[#2570D3] hover:underline"
              >
                + Upload new certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ACADEMIC */}
      {activeTab === "academic" && (
        <div className="rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Academic Progress & Terminal Examinations
              </h3>
              <p className="text-xs text-slate-500">
                Grade {student.grade} • Academic Year 2026/2027 (2083 BS)
              </p>
            </div>
            <button
              type="button"
              onClick={() => toast.success("Marksheet PDF generated")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download marksheet</span>
            </button>
          </div>

          {student.results.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No terminal results finalized yet for this term.
            </div>
          ) : (
            student.results.map((r, i) => (
              <div key={i} className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{r.term}</h4>
                    <p className="text-xs text-slate-500">
                      Rank: <strong className="text-slate-800">{r.rank}</strong> • Attendance during exams: {r.attendancePct}%
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-[#2570D3]">
                      GPA {r.gpa.toFixed(2)}
                    </span>
                    <p className="text-xs text-slate-500 font-medium">
                      Aggregate: {r.percentage}% (Distinction)
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-medium">
                        <th className="py-2.5 px-3">Subject</th>
                        <th className="py-2.5 px-3">Full Marks</th>
                        <th className="py-2.5 px-3">Pass Marks</th>
                        <th className="py-2.5 px-3">Obtained Marks</th>
                        <th className="py-2.5 px-3 text-right">Grade Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {r.subjects.map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 font-medium text-slate-900">
                            {s.name}
                          </td>
                          <td className="py-2.5 px-3">{s.fullMarks}</td>
                          <td className="py-2.5 px-3">{s.passMarks}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {s.obtainedMarks}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="font-bold text-[#2570D3] bg-[#2570D3]/10 px-2 py-0.5 rounded">
                              {s.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <span className="font-semibold">Class Teacher Remarks: </span>
                  <span className="italic">"{r.remarks}"</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: DOCUMENTS EXPANDED */}
      {activeTab === "documents" && (
        <div className="rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Institutional Document Repository
              </h3>
              <p className="text-xs text-slate-500">
                Verified compliance documents, identification slips, and certificates
              </p>
            </div>
            <button
              type="button"
              onClick={() => toast.success("Upload prompt opened")}
              className="rounded-lg bg-[#2570D3] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#1C5BB0]"
            >
              + Upload document
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Birth Certificate", file: "birth_certificate_official.pdf", size: "1.2 MB", verified: true, date: "2020-04-15" },
              { title: "Citizenship / National ID", file: "national_id_slip.pdf", size: "820 KB", verified: true, date: "2024-06-20" },
              { title: "Previous Report Card / TC", file: "previous_gradesheet_tc.pdf", size: "1.5 MB", verified: true, date: "2020-04-15" },
              { title: "Medical Fitness Record", file: "annual_health_clearance.pdf", size: "450 KB", verified: true, date: "2026-01-10" },
            ].map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2570D3] text-white shadow-2xs">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-slate-900">{d.title}</p>
                      <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-700">
                        Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {d.file} • {d.size} • {d.date}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toast.info(`Downloading ${d.file}`)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  title="Download file"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: HEALTH */}
      {activeTab === "health" && (
        <div className="rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">
              Student Health & Medical Profile
            </h3>
            <p className="text-xs text-slate-500">
              Emergency medical directives, allergies, and health clearance status
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <span className="text-slate-400 font-medium">Blood Group</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {student.bloodGroup}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Universal donor compatible
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <span className="text-slate-400 font-medium">Annual Physical Clearance</span>
              <p className="text-base font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Fit for Sports
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Certified by Dr. P. Karki (Jan 2026)
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <span className="text-slate-400 font-medium">Allergies & Dietary</span>
              <p className="text-sm font-semibold text-slate-800 mt-1">
                No Known Drug Allergies
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Vegetarian lunch preference
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: FEES & DUES */}
      {activeTab === "fees" && (
        <div className="rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Fee Account & Transaction Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Quarterly tuition installments, receipts, and outstanding dues
              </p>
            </div>
            <button
              type="button"
              onClick={() => toast.success("Collect fee counter opened")}
              className="rounded-lg bg-[#1F9D6B] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#188056]"
            >
              Collect payment
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Outstanding Balance</p>
              <p className="text-2xl font-bold text-slate-900">
                {student.pendingDueNpr > 0
                  ? `NPR ${student.pendingDueNpr.toLocaleString()}`
                  : "NPR 0.00 (All dues cleared)"}
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold",
                student.feeStatus === "Paid"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-[#D64545]"
              )}
            >
              {student.feeStatus}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-medium">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Receipt / Ref</th>
                  <th className="py-2.5 px-3">Amount (NPR)</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {student.feeLedger.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 text-slate-600 font-mono">{item.date}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{item.title}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">{item.receiptNo ?? "-"}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      NPR {item.amountNpr.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          item.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-[#D64545]"
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: ATTENDANCE */}
      {activeTab === "attendance" && (
        <div className="rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">
              Session Attendance Record
            </h3>
            <p className="text-xs text-slate-500">
              Tracking attendance rate and school day threshold
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <span className="text-xs text-slate-500">Total school days</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {student.totalSchoolDays} days
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-emerald-50/50">
              <span className="text-xs text-emerald-700">Days present</span>
              <p className="text-xl font-bold text-emerald-800 mt-1">
                {student.totalPresentDays} days
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-blue-50/50">
              <span className="text-xs text-[#2570D3]">Attendance rate</span>
              <p className="text-xl font-bold text-[#2570D3] mt-1">
                {student.attendancePct}%
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex justify-between text-xs text-slate-600 mb-2">
              <span>Exam eligibility threshold (80.0%)</span>
              <span className="font-semibold text-emerald-700">
                {student.attendancePct >= 80 ? "Eligible" : "Warning: Below threshold"}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#1F9D6B] rounded-full"
                style={{ width: `${student.attendancePct}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Printable ID Card Modal */}
      <StudentIdCardModal
        student={idCardOpen ? student : null}
        onClose={() => setIdCardOpen(false)}
      />
    </div>
  );
}
