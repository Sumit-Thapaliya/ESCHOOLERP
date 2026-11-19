"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  Send,
  MoreVertical,
  Check,
  Edit2,
  PhoneCall,
  MessageSquare,
  Users,
  Layers,
  FileSpreadsheet,
  Building,
  Sparkles,
} from "lucide-react";
import {
  ATTENDANCE_CLASSES,
  MOCK_STUDENT_ATTENDANCE,
} from "./attendance-mock-data";
import {
  StudentAttendanceRecord,
  AttendanceStatus,
  AttendanceSummary,
} from "./attendance-types";
import { AttendanceStatRibbon } from "./attendance-stat-ribbon";
import { MarkAttendanceModal } from "./mark-attendance-modal";
import { MonthlyAttendanceMatrix } from "./monthly-attendance-matrix";
import { StaffAttendanceTab } from "./staff-attendance-tab";
import { LeaveManagementTab } from "./leave-management-tab";

function AttendanceInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL search params with sensible defaults
  const urlClass = searchParams.get("class") || "Grade 8 - A";
  const urlDate = searchParams.get("date") || "2025-04-22";
  const rawTab = searchParams.get("tab") || "daily";
  const urlTab: "daily" | "monthly" | "staff" | "leave" =
    ["daily", "monthly", "staff", "leave"].includes(rawTab)
      ? (rawTab as "daily" | "monthly" | "staff" | "leave")
      : "daily";

  const [selectedClass, setSelectedClass] = React.useState(urlClass);
  const [selectedDate, setSelectedDate] = React.useState(urlDate);
  const [displayDateText, setDisplayDateText] = React.useState("22 Apr 2025");
  const [activeTab, setActiveTab] = React.useState<"daily" | "monthly" | "staff" | "leave">(urlTab);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "present" | "absent" | "late" | "excused"
  >("all");

  const [studentRecords, setStudentRecords] = React.useState<
    Record<string, StudentAttendanceRecord[]>
  >(MOCK_STUDENT_ATTENDANCE);

  const [isMarkModalOpen, setIsMarkModalOpen] = React.useState(false);
  const [notificationToast, setNotificationToast] = React.useState<string | null>(null);
  const [parentAlertStudent, setParentAlertStudent] =
    React.useState<StudentAttendanceRecord | null>(null);

  // Sync state if browser back/forward buttons change searchParams
  React.useEffect(() => {
    const qClass = searchParams.get("class");
    if (qClass && qClass !== selectedClass) setSelectedClass(qClass);

    const qDate = searchParams.get("date");
    if (qDate && qDate !== selectedDate) setSelectedDate(qDate);

    const qTab = searchParams.get("tab");
    if (qTab && ["daily", "monthly", "staff", "leave"].includes(qTab) && qTab !== activeTab) {
      setActiveTab(qTab as any);
    }
  }, [searchParams]);

  // Synchronize state changes to URL query parameters smoothly
  const updateUrlParams = React.useCallback(
    (updates: { class?: string; date?: string; tab?: string }) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      if (updates.class !== undefined) nextParams.set("class", updates.class);
      if (updates.date !== undefined) nextParams.set("date", updates.date);
      if (updates.tab !== undefined) nextParams.set("tab", updates.tab);
      router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
    updateUrlParams({ class: newClass });
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    updateUrlParams({ date: newDate });
  };

  const handleTabChange = (newTab: "daily" | "monthly" | "staff" | "leave") => {
    setActiveTab(newTab);
    updateUrlParams({ tab: newTab });
  };

  // Sync date text when date input changes
  React.useEffect(() => {
    try {
      const parts = selectedDate.split("-");
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        const formatted = d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        setDisplayDateText(formatted);
      }
    } catch {
      setDisplayDateText(selectedDate);
    }
  }, [selectedDate]);

  const currentClassStudents =
    studentRecords[selectedClass] ||
    studentRecords["Grade 8 - A"] ||
    [];

  // Attendance summary metrics
  const summary: AttendanceSummary = React.useMemo(() => {
    const total = currentClassStudents.length;
    const present = currentClassStudents.filter((s) => s.status === "present").length;
    const absent = currentClassStudents.filter((s) => s.status === "absent").length;
    const late = currentClassStudents.filter((s) => s.status === "late").length;
    const excused = currentClassStudents.filter((s) => s.status === "excused").length;
    const percentage = total > 0 ? Math.round(((present + late * 0.8) / total) * 100) : 0;
    return { total, present, absent, late, excused, percentage };
  }, [currentClassStudents]);

  // Date stepper
  const handleStepDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    const newStr = current.toISOString().split("T")[0];
    handleDateChange(newStr);
  };

  // Quick single-student status update
  const handleQuickStatusChange = (rollNo: string, newStatus: AttendanceStatus) => {
    setStudentRecords((prev) => {
      const list = prev[selectedClass] || prev["Grade 8 - A"] || [];
      const updated = list.map((st) =>
        st.rollNo === rollNo
          ? {
              ...st,
              status: newStatus,
              checkInTime: newStatus === "present" ? "08:45 AM" : st.checkInTime,
            }
          : st
      );
      return { ...prev, [selectedClass]: updated };
    });
  };

  // Save from MarkAttendanceModal
  const handleSaveModalRecords = (updated: StudentAttendanceRecord[]) => {
    setStudentRecords((prev) => ({
      ...prev,
      [selectedClass]: updated,
    }));
    setNotificationToast(
      `Daily attendance for ${selectedClass} successfully saved (${displayDateText}).`
    );
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // Send parent alert
  const handleSendParentAlert = (student: StudentAttendanceRecord) => {
    setNotificationToast(
      `SMS absence alert sent to ${student.studentName}'s guardian (${student.guardianPhone || "registered contact"}).`
    );
    setParentAlertStudent(null);
    setTimeout(() => setNotificationToast(null), 5000);
  };

  // Filtered students for daily table
  const filteredStudents = currentClassStudents.filter((student) => {
    if (statusFilter !== "all" && student.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      student.studentName.toLowerCase().includes(q) ||
      student.rollNo.includes(q) ||
      student.admissionNo.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Present
          </span>
        );
      case "absent":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Absent
          </span>
        );
      case "late":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Late
          </span>
        );
      case "excused":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Excused
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast banner */}
      {notificationToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notificationToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotificationToast(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Page Header (Mockup exact replica on page 6 of Product Roadmap) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title and subtitle */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Attendance
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Class roll call, period registers, employee tracking and student leave approvals.
            </p>
          </div>

          {/* Right Action Controls: Date, Class selector, and Primary Mark Attendance Button */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Navigator */}
            <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-200/90 shadow-2xs">
              <button
                type="button"
                onClick={() => handleStepDate(-1)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white transition-colors"
                title="Previous day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="relative px-2 flex items-center gap-2 cursor-pointer">
                <CalendarIcon className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-800 select-none">
                  {displayDateText}
                </span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                />
              </div>

              <button
                type="button"
                onClick={() => handleStepDate(1)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white transition-colors"
                title="Next day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Class Dropdown */}
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="appearance-none text-xs font-semibold px-4 py-2.5 pr-8 rounded-xl border border-slate-200/90 bg-white text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs transition-colors cursor-pointer"
              >
                {ATTENDANCE_CLASSES.map((cls) => (
                  <option key={cls.value} value={cls.value}>
                    {cls.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                <ChevronRight className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>

            {/* Primary Action Button: Mark Attendance */}
            <button
              type="button"
              onClick={() => setIsMarkModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <Plus className="w-4 h-4" />
              Mark Attendance
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mt-5 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange("daily")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "daily"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Users className="w-4 h-4" />
            Daily Class Register
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("monthly")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "monthly"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Monthly Attendance Matrix
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("staff")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "staff"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Building className="w-4 h-4" />
            Faculty & Staff Attendance
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("leave")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "leave"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Leave Requests & Approvals
          </button>
        </div>
      </div>

      {/* Tab 1: Daily Register (The exact UI from roadmap_img-002.png) */}
      {activeTab === "daily" && (
        <div className="space-y-4">
          {/* Quick Metrics Ribbon */}
          <AttendanceStatRibbon summary={summary} />

          {/* Filter, Search & Quick Actions Bar */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Left: Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All ({summary.total})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("present")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === "present"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                Present ({summary.present})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("absent")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === "absent"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
              >
                Absent ({summary.absent})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("late")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === "late"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                }`}
              >
                Late ({summary.late})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("excused")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === "excused"
                    ? "bg-sky-600 text-white"
                    : "bg-sky-50 text-sky-700 hover:bg-sky-100"
                }`}
              >
                Excused ({summary.excused})
              </button>
            </div>

            {/* Right: Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name or roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Primary Table matching roadmap_img-002.png */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="px-5 py-3.5 w-24">Roll No</th>
                    <th className="px-5 py-3.5">Student Name</th>
                    <th className="px-5 py-3.5 text-center w-36">Status</th>
                    <th className="px-5 py-3.5 w-28">Check-In</th>
                    <th className="px-5 py-3.5">Audit Remarks</th>
                    <th className="px-5 py-3.5 text-right w-36">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-slate-400 text-xs"
                      >
                        No student records match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.rollNo}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        {/* Roll No */}
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-700 text-xs">
                          {student.rollNo}
                        </td>

                        {/* Student Name */}
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-900 text-sm">
                            {student.studentName}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {student.admissionNo}
                          </div>
                        </td>

                        {/* Status badge matching roadmap pill visual */}
                        <td className="px-5 py-3.5 text-center">
                          {getStatusBadge(student.status)}
                        </td>

                        {/* Check-In Time */}
                        <td className="px-5 py-3.5 font-mono text-slate-500 text-xs">
                          {student.checkInTime || "—"}
                        </td>

                        {/* Audit Remarks */}
                        <td className="px-5 py-3.5 text-slate-500 text-xs">
                          {student.remarks ? (
                            <span className="text-slate-700">{student.remarks}</span>
                          ) : (
                            <span className="text-slate-400 italic">No notes</span>
                          )}
                        </td>

                        {/* Fast Actions: Quick toggle or Parent alert */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Fast status toggle buttons */}
                            <div className="hidden group-hover:flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200">
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuickStatusChange(student.rollNo, "present")
                                }
                                title="Mark Present"
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  student.status === "present"
                                    ? "bg-emerald-600 text-white"
                                    : "text-slate-600 hover:bg-white"
                                }`}
                              >
                                P
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuickStatusChange(student.rollNo, "absent")
                                }
                                title="Mark Absent"
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  student.status === "absent"
                                    ? "bg-rose-600 text-white"
                                    : "text-slate-600 hover:bg-white"
                                }`}
                              >
                                A
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuickStatusChange(student.rollNo, "late")
                                }
                                title="Mark Late"
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  student.status === "late"
                                    ? "bg-amber-600 text-white"
                                    : "text-slate-600 hover:bg-white"
                                }`}
                              >
                                L
                              </button>
                            </div>

                            {/* Parent Alert button for absentees */}
                            {student.status === "absent" && (
                              <button
                                type="button"
                                onClick={() => setParentAlertStudent(student)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                                title="Send SMS/App absence alert to parent"
                              >
                                <Send className="w-3 h-3" />
                                Alert Parent
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Attendance Matrix */}
      {activeTab === "monthly" && (
        <MonthlyAttendanceMatrix classNameTitle={selectedClass} />
      )}

      {/* Tab 3: Staff Attendance Register */}
      {activeTab === "staff" && <StaffAttendanceTab />}

      {/* Tab 4: Leave Requests & Approvals */}
      {activeTab === "leave" && <LeaveManagementTab />}

      {/* Interactive Modal: Mark Attendance */}
      <MarkAttendanceModal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        classNameTitle={selectedClass}
        dateStr={displayDateText}
        initialRecords={currentClassStudents}
        onSave={handleSaveModalRecords}
      />

      {/* Parent Alert Confirmation Modal */}
      {parentAlertStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-md p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Notify Guardian of Absence
                </h3>
                <p className="text-xs text-slate-500">
                  Automated SMS & Mobile App Push Notification
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-semibold text-slate-800">
                  {parentAlertStudent.studentName} (Roll {parentAlertStudent.rollNo})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Class:</span>
                <span className="font-medium text-slate-800">{selectedClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Guardian Contact:</span>
                <span className="font-mono text-slate-800">
                  {parentAlertStudent.guardianPhone || "+977 9841234567"}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/80 text-slate-600">
                <p className="italic">
                  &ldquo;Dear Parent, your ward {parentAlertStudent.studentName} was marked
                  absent for today&apos;s morning roll call ({displayDateText}). Please
                  submit a leave request or contact the school office.&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setParentAlertStudent(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSendParentAlert(parentAlertStudent)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors"
              >
                Send SMS Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AttendanceView() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 text-xs animate-pulse">
          Loading attendance register...
        </div>
      }
    >
      <AttendanceInner />
    </React.Suspense>
  );
}
