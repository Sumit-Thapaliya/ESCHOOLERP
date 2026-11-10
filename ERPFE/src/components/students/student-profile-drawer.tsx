"use client";

import * as React from "react";
import {
  X,
  Printer,
  Edit3,
  Receipt,
  User,
  Users,
  CalendarCheck2,
  Banknote,
  GraduationCap,
  FileText,
  Clock,
  Phone,
  Mail,
  MapPin,
  Bus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Award,
} from "lucide-react";
import type { Student, StudentStatus } from "./student-types";
import { toast } from "sonner";
import { cn } from "cn";

interface StudentProfileDrawerProps {
  student: Student | null;
  onClose: () => void;
  onPrintIdCard: (student: Student) => void;
}

type ProfileTab =
  | "overview"
  | "guardians"
  | "attendance"
  | "fees"
  | "results"
  | "documents"
  | "history";

export function StudentProfileDrawer({
  student,
  onClose,
  onPrintIdCard,
}: StudentProfileDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<ProfileTab>("overview");
  const [currentStatus, setCurrentStatus] = React.useState<StudentStatus>(
    student?.status ?? "Active"
  );

  React.useEffect(() => {
    if (student) {
      setCurrentStatus(student.status);
      setActiveTab("overview");
    }
  }, [student]);

  if (!student) return null;

  const handleStatusChange = (newStatus: StudentStatus) => {
    setCurrentStatus(newStatus);
    toast.success(`Student status updated to ${newStatus}`);
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

  const TABS: { id: ProfileTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview", label: "Overview", icon: User },
    { id: "guardians", label: "Guardians", icon: Users },
    { id: "attendance", label: "Attendance", icon: CalendarCheck2 },
    { id: "fees", label: "Fees & dues", icon: Banknote },
    { id: "results", label: "Results & exams", icon: GraduationCap },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "history", label: "History", icon: Clock },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div
        role="button"
        tabIndex={0}
        aria-label="Close profile drawer"
        className="fixed inset-0 -z-10"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
      />

      <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col border-l border-[#DDE5F0] overflow-hidden">
        {/* Top Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Student profile
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-xs text-slate-600 font-semibold">
              {student.admissionNo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPrintIdCard(student)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-[#2570D3]" />
              <span>ID card</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Header Summary Card */}
        <div className="bg-[#F8FAFD] p-6 border-b border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#12294D] text-white text-xl font-bold shadow-xs">
                {student.fullName.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    {student.fullName}
                  </h2>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                      getStatusBadge(currentStatus)
                    )}
                  >
                    {currentStatus}
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-slate-600">
                  <strong className="text-slate-900 font-semibold">
                    {student.grade} - Section {student.section}
                  </strong>{" "}
                  • Roll: {student.rollNo} • {student.campusName}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span>Gender: {student.gender}</span>
                  <span>Blood: {student.bloodGroup}</span>
                  <span>Joined: {student.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Quick Status Select */}
            <div className="shrink-0 self-start">
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value as StudentStatus)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 outline-hidden hover:bg-slate-50"
              >
                <option value="Active">Mark active</option>
                <option value="On leave">Mark on leave</option>
                <option value="Suspended">Mark suspended</option>
                <option value="Alumni">Mark alumni</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1 border-b border-slate-200 px-6 bg-white overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer",
                  active
                    ? "border-[#2570D3] text-[#2570D3] font-semibold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body Viewports */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {/* 1. OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 text-xs">
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                <h3 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider text-slate-500">
                  Personal & demographic records
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-400">Date of birth (BS)</span>
                    <p className="font-medium text-slate-800">{student.dobBS}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Date of birth (AD)</span>
                    <p className="font-medium text-slate-800">{student.dobAD}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Blood group</span>
                    <p className="font-medium text-slate-800">{student.bloodGroup}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Campus code</span>
                    <p className="font-medium text-slate-800 uppercase">{student.campusId}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Admission number</span>
                    <p className="font-medium text-slate-800 font-mono">{student.admissionNo}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Session enrolled</span>
                    <p className="font-medium text-slate-800">2026/2027 (2083 BS)</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider text-slate-500">
                  Residential address & transit
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-slate-700">
                    <MapPin className="h-4 w-4 text-[#2570D3] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {student.address.street}, {student.address.ward}
                      </p>
                      <p className="text-slate-500">
                        {student.address.municipality}, {student.address.district}
                      </p>
                    </div>
                  </div>
                  {student.transportRoute && (
                    <div className="flex items-start gap-2 text-slate-700 pt-2 border-t border-slate-100">
                      <Bus className="h-4 w-4 text-[#1F9D6B] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{student.transportRoute}</p>
                        <p className="text-slate-500">Assigned stop: {student.busStop}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. GUARDIANS */}
          {activeTab === "guardians" && (
            <div className="space-y-4 text-xs">
              {student.guardians.map((g, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">
                        {g.name}
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {g.relation}
                      </span>
                      {g.isEmergencyContact && (
                        <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-[#D64545]">
                          Primary emergency contact
                        </span>
                      )}
                    </div>
                    {g.occupation && (
                      <p className="text-slate-500">Occupation: {g.occupation}</p>
                    )}
                    <div className="pt-2 flex flex-wrap items-center gap-4 text-slate-600">
                      <span className="flex items-center gap-1 font-mono font-medium">
                        <Phone className="h-3.5 w-3.5 text-[#2570D3]" />
                        {g.phone}
                      </span>
                      {g.email && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          {g.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <a
                    href={`tel:${g.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#2570D3]/10 px-3 py-1.5 text-xs font-semibold text-[#2570D3] hover:bg-[#2570D3]/20 self-start sm:self-auto"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call guardian</span>
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* 3. ATTENDANCE */}
          {activeTab === "attendance" && (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 text-center">
                  <span className="text-slate-400 text-[11px]">Total session days</span>
                  <p className="text-lg font-bold text-slate-900">
                    {student.totalSchoolDays}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 bg-emerald-50/50 text-center">
                  <span className="text-emerald-700 text-[11px]">Present count</span>
                  <p className="text-lg font-bold text-emerald-800">
                    {student.totalPresentDays}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 bg-blue-50/50 text-center">
                  <span className="text-[#2570D3] text-[11px]">Attendance rate</span>
                  <p className="text-lg font-bold text-[#2570D3]">
                    {student.attendancePct}%
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Session attendance velocity
                </h4>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#1F9D6B] rounded-full"
                    style={{ width: `${student.attendancePct}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Minimum institutional requirement is 80.0% for term exam eligibility.
                </p>
              </div>
            </div>
          )}

          {/* 4. FEES & DUES */}
          {activeTab === "fees" && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-slate-500">Outstanding fee balance</span>
                  <p className="text-lg font-bold text-slate-900">
                    {student.pendingDueNpr > 0
                      ? `NPR ${student.pendingDueNpr.toLocaleString()}`
                      : "Clear (NPR 0)"}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 font-semibold text-[11px]",
                    student.feeStatus === "Paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-[#D64545]"
                  )}
                >
                  {student.feeStatus}
                </span>
              </div>

              <h4 className="font-semibold text-slate-900 pt-2">
                Ledger transaction history
              </h4>
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                {student.feeLedger.length === 0 ? (
                  <p className="p-4 text-center text-slate-400">
                    No ledger transactions recorded yet.
                  </p>
                ) : (
                  student.feeLedger.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-slate-800">{item.title}</p>
                        <p className="text-[11px] text-slate-400">
                          {item.date} {item.receiptNo && `• ${item.receiptNo}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          NPR {item.amountNpr.toLocaleString()}
                        </p>
                        <span
                          className={cn(
                            "text-[10px] font-semibold",
                            item.status === "Paid"
                              ? "text-emerald-700"
                              : "text-[#D64545]"
                          )}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 5. RESULTS & EXAMS */}
          {activeTab === "results" && (
            <div className="space-y-4 text-xs">
              {student.results.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  No term examination records published yet for this session.
                </div>
              ) : (
                student.results.map((r, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-900">{r.term}</h4>
                        <p className="text-[11px] text-slate-500">{r.rank}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-[#2570D3]">
                          GPA {r.gpa.toFixed(2)}
                        </span>
                        <p className="text-[11px] text-slate-500">{r.percentage}% overall</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-100">
                            <th className="py-1">Subject</th>
                            <th className="py-1">Full Marks</th>
                            <th className="py-1">Obtained</th>
                            <th className="py-1 text-right">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {r.subjects.map((s, idx) => (
                            <tr key={idx}>
                              <td className="py-1.5 font-medium text-slate-700">{s.name}</td>
                              <td className="py-1.5 text-slate-500">{s.fullMarks}</td>
                              <td className="py-1.5 font-semibold text-slate-800">{s.obtainedMarks}</td>
                              <td className="py-1.5 text-right font-bold text-[#2570D3]">{s.grade}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                      Remarks: "{r.remarks}"
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 6. DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="space-y-3 text-xs">
              {student.documents.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  No verified certificates uploaded for this student.
                </div>
              ) : (
                student.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[#2570D3]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800">{doc.title}</p>
                          {doc.verified && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-medium">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {doc.fileName} • {doc.fileSize} • Uploaded {doc.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info(`Downloading ${doc.fileName}`)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 7. HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-4 text-xs">
              {student.timeline.length === 0 ? (
                <p className="py-8 text-center text-slate-400">
                  No audit history records yet.
                </p>
              ) : (
                <div className="relative border-l border-slate-200 ml-3 space-y-4 py-2">
                  {student.timeline.map((event) => (
                    <div key={event.id} className="relative pl-6">
                      <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-white bg-[#2570D3]" />
                      <div className="flex items-baseline justify-between">
                        <p className="font-semibold text-slate-900">{event.title}</p>
                        <span className="text-[10px] text-slate-400">{event.date}</span>
                      </div>
                      <p className="mt-0.5 text-slate-600">{event.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
