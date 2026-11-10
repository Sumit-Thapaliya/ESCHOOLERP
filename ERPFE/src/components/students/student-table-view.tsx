"use client";

import * as React from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  Printer,
  ChevronRight,
  MoreVertical,
  UserCheck,
  Check,
  Building2,
  Phone,
  ArrowUpDown,
  X,
  MessageSquare,
  Trash2,
} from "lucide-react";
import {
  MOCK_STUDENTS,
  GRADES_LIST,
  SECTIONS_LIST,
} from "./student-mock-data";
import type { Student, StudentFilters, StudentStatus } from "./student-types";
import { StudentProfilePageView } from "./student-profile-page-view";
import { AddStudentModal } from "./add-student-modal";
import { StudentIdCardModal } from "./student-id-card-modal";
import { toast } from "sonner";
import { cn } from "cn";

export function StudentTableView() {
  const [students, setStudents] = React.useState<Student[]>(MOCK_STUDENTS);

  // Filters state
  const [filters, setFilters] = React.useState<StudentFilters>({
    search: "",
    grade: "All grades",
    section: "All sections",
    status: "All",
    campusId: "All",
    feeStatus: "All",
  });

  // Selected students for bulk actions
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Modals & Drawers state
  const [activeProfileStudent, setActiveProfileStudent] = React.useState<Student | null>(null);
  const [activeIdCardStudent, setActiveIdCardStudent] = React.useState<Student | null>(null);
  const [addModalOpen, setAddModalOpen] = React.useState(false);

  // Sorting
  const [sortField, setSortField] = React.useState<"name" | "roll" | "attendance">("name");
  const [sortAsc, setSortAsc] = React.useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 8;

  // Filter & sort logic
  const filteredStudents = React.useMemo(() => {
    return students
      .filter((s) => {
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchName = s.fullName.toLowerCase().includes(q);
          const matchRoll = s.rollNo.toLowerCase().includes(q);
          const matchAdm = s.admissionNo.toLowerCase().includes(q);
          const matchPhone = s.guardians.some((g) => g.phone.includes(q));
          if (!matchName && !matchRoll && !matchAdm && !matchPhone) return false;
        }
        if (filters.grade !== "All grades" && s.grade !== filters.grade) return false;
        if (filters.section !== "All sections" && s.section !== filters.section) return false;
        if (filters.status !== "All" && s.status !== filters.status) return false;
        if (filters.campusId !== "All" && s.campusId !== filters.campusId) return false;
        if (filters.feeStatus !== "All" && s.feeStatus !== filters.feeStatus) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortField === "name") {
          return sortAsc
            ? a.fullName.localeCompare(b.fullName)
            : b.fullName.localeCompare(a.fullName);
        }
        if (sortField === "roll") {
          return sortAsc ? a.rollNo.localeCompare(b.rollNo) : b.rollNo.localeCompare(a.rollNo);
        }
        if (sortField === "attendance") {
          return sortAsc ? a.attendancePct - b.attendancePct : b.attendancePct - a.attendancePct;
        }
        return 0;
      });
  }, [students, filters, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (activeProfileStudent) {
    return (
      <StudentProfilePageView
        student={activeProfileStudent}
        onBack={() => setActiveProfileStudent(null)}
      />
    );
  }

  // Bulk selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedStudents.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = (status: StudentStatus) => {
    setStudents((prev) =>
      prev.map((s) => (selectedIds.includes(s.id) ? { ...s, status } : s))
    );
    toast.success(`Updated ${selectedIds.length} student records to ${status}`);
    setSelectedIds([]);
  };

  const handleExportSelected = () => {
    toast.success(`Exported ${selectedIds.length} student records as CSV`);
    setSelectedIds([]);
  };

  const handleStudentCreated = (newStudent: Partial<Student>) => {
    setStudents((prev) => [newStudent as Student, ...prev]);
  };

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700";
      case "On leave":
        return "bg-amber-50 text-amber-700";
      case "Suspended":
        return "bg-rose-50 text-rose-700";
      case "Alumni":
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE5F0] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">Home</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-semibold text-[#2570D3]">Student directory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Student directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Find and manage student enrollments, profiles, guardians, and academic history
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toast.success("Student register exported to Excel")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5F0] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2570D3] px-3.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-[#1C5BB0] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-[#DDE5F0] bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, roll number, admission ID, or phone..."
              value={filters.search}
              onChange={(e) => {
                setFilters((f) => ({ ...f, search: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:border-[#2570D3] outline-hidden placeholder-slate-400"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Grade filter */}
            <select
              value={filters.grade}
              onChange={(e) => {
                setFilters((f) => ({ ...f, grade: e.target.value }));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-hidden"
            >
              {GRADES_LIST.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {/* Section filter */}
            <select
              value={filters.section}
              onChange={(e) => {
                setFilters((f) => ({ ...f, section: e.target.value }));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-hidden"
            >
              {SECTIONS_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Campus filter */}
            <select
              value={filters.campusId}
              onChange={(e) => {
                setFilters((f) => ({ ...f, campusId: e.target.value }));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-hidden"
            >
              <option value="All">All campuses</option>
              <option value="ktm">Main Campus (KTM)</option>
              <option value="lal">City Wing (LAL)</option>
              <option value="pkr">West Campus (PKR)</option>
            </select>

            {/* Status filter */}
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters((f) => ({ ...f, status: e.target.value }));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-hidden"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="On leave">On leave</option>
              <option value="Suspended">Suspended</option>
              <option value="Alumni">Alumni</option>
            </select>

            {/* Fee Status */}
            <select
              value={filters.feeStatus}
              onChange={(e) => {
                setFilters((f) => ({ ...f, feeStatus: e.target.value }));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-hidden"
            >
              <option value="All">All fee states</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Overdue">Overdue dues</option>
            </select>

            {/* Reset button if filtered */}
            {(filters.search ||
              filters.grade !== "All grades" ||
              filters.section !== "All sections" ||
              filters.status !== "All" ||
              filters.campusId !== "All" ||
              filters.feeStatus !== "All") && (
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    search: "",
                    grade: "All grades",
                    section: "All sections",
                    status: "All",
                    campusId: "All",
                    feeStatus: "All",
                  })
                }
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Floating Bulk-Select Toolbar */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#12294D] px-3.5 py-2 text-white text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{selectedIds.length}</span>
              <span>students selected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportSelected}
                className="rounded bg-[#2570D3] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#1C5BB0]"
              >
                Export selected
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus("Active")}
                className="rounded bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-white/20"
              >
                Mark active
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus("On leave")}
                className="rounded bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-white/20"
              >
                Mark on leave
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-white/70 hover:text-white p-1"
                title="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Student Table */}
      <div className="rounded-xl border border-[#DDE5F0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium">
                <th className="py-3 px-3 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginatedStudents.length > 0 &&
                      paginatedStudents.every((s) => selectedIds.includes(s.id))
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2570D3] cursor-pointer"
                  />
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                  onClick={() => {
                    setSortField("name");
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Student info</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Grade & Section</th>
                <th className="py-3 px-3">Campus</th>
                <th className="py-3 px-3">Primary guardian</th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                  onClick={() => {
                    setSortField("attendance");
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Attendance</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Fee status</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No students match the current filters.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const isSelected = selectedIds.includes(student.id);

                  return (
                    <tr
                      key={student.id}
                      className={cn(
                        "hover:bg-slate-50/70 transition-colors",
                        isSelected && "bg-[#2570D3]/5"
                      )}
                    >
                      {/* Select checkbox */}
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(student.id)}
                          className="rounded border-slate-300 text-[#2570D3] cursor-pointer"
                        />
                      </td>

                      {/* Student info */}
                      <td className="py-3 px-3">
                        <div
                          onClick={() => setActiveProfileStudent(student)}
                          className="flex items-center gap-2.5 cursor-pointer group"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#12294D] text-white text-xs font-semibold">
                            {student.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-[#2570D3] transition-colors">
                              {student.fullName}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {student.admissionNo} • Roll: {student.rollNo}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Grade & Section */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-900">
                          {student.grade}
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Section {student.section}
                        </p>
                      </td>

                      {/* Campus */}
                      <td className="py-3 px-3">
                        <span className="text-slate-800">
                          {student.campusName.split("(")[0]}
                        </span>
                        <p className="text-[11px] text-slate-400">
                          {student.campusId.toUpperCase()}
                        </p>
                      </td>

                      {/* Guardian */}
                      <td className="py-3 px-3">
                        <p className="font-medium text-slate-800">
                          {student.guardians[0]?.name ?? "N/A"}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {student.guardians[0]?.phone ?? "No phone"}
                        </p>
                      </td>

                      {/* Attendance */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "font-semibold",
                              student.attendancePct >= 94
                                ? "text-emerald-700"
                                : student.attendancePct >= 85
                                ? "text-slate-800"
                                : "text-[#D64545]"
                            )}
                          >
                            {student.attendancePct}%
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({student.totalPresentDays}/{student.totalSchoolDays})
                          </span>
                        </div>
                      </td>

                      {/* Fee Status */}
                      <td className="py-3 px-3">
                        <div>
                          <span
                            className={cn(
                              "inline-block rounded-full px-2 py-0.2 text-[10px] font-semibold",
                              student.feeStatus === "Paid"
                                ? "bg-emerald-50 text-emerald-700"
                                : student.feeStatus === "Partial"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-rose-50 text-[#D64545]"
                            )}
                          >
                            {student.feeStatus}
                          </span>
                          {student.pendingDueNpr > 0 && (
                            <p className="text-[10px] text-[#D64545] font-mono">
                              NPR {student.pendingDueNpr.toLocaleString()} due
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                            getStatusBadge(student.status)
                          )}
                        >
                          {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setActiveProfileStudent(student)}
                            className="rounded-md border border-slate-200 px-2 py-1 text-xs text-[#2570D3] font-medium hover:bg-[#2570D3] hover:text-white transition-colors"
                          >
                            Profile
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveIdCardStudent(student)}
                            className="rounded-md border border-slate-200 p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                            title="Print identity card"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredStudents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-800">
              {Math.min(currentPage * pageSize, filteredStudents.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {filteredStudents.length}
            </span>{" "}
            students
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              Previous
            </button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add New Student Multi-Step Modal */}
      <AddStudentModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onStudentCreated={handleStudentCreated}
      />

      {/* Printable ID Card Modal */}
      <StudentIdCardModal
        student={activeIdCardStudent}
        onClose={() => setActiveIdCardStudent(null)}
      />
    </div>
  );
}
