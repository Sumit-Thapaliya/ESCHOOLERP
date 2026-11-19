"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ACADEMIC_YEARS,
  GRADES_LIST,
  SECTIONS_LIST,
  MOCK_CLASS_INFO,
  MOCK_SUBJECT_ALLOCATIONS,
  MOCK_ALL_CLASSES_OVERVIEW,
} from "./academic-mock-data";
import { SubjectAllocation, SubjectCategory } from "./academic-types";
import { ClassTimetableGrid } from "./class-timetable-grid";
import { SyllabusProgressCard } from "./syllabus-progress-card";
import { AssignSubjectModal } from "./assign-subject-modal";
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Search,
  CheckCircle2,
  Filter,
  Layers,
  GraduationCap,
  Users,
  Building,
  School,
  ArrowUpDown,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";

function AcademicsInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial from search params or defaults
  const urlYear = searchParams.get("year") || "2024 - 2025";
  const urlGrade = searchParams.get("grade") || "Grade 8";
  const urlSection = searchParams.get("section") || "A";
  const rawTab = searchParams.get("tab") || "allocation";
  const urlTab: "allocation" | "timetable" | "syllabus" | "overview" =
    ["allocation", "timetable", "syllabus", "overview"].includes(rawTab)
      ? (rawTab as any)
      : "allocation";

  const [academicYear, setAcademicYear] = React.useState(urlYear);
  const [grade, setGrade] = React.useState(urlGrade);
  const [section, setSection] = React.useState(urlSection);
  const [activeTab, setActiveTab] = React.useState<
    "allocation" | "timetable" | "syllabus" | "overview"
  >(urlTab);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);

  // Sync state if browser back/forward buttons change searchParams
  React.useEffect(() => {
    const qYear = searchParams.get("year");
    if (qYear && qYear !== academicYear) setAcademicYear(qYear);

    const qGrade = searchParams.get("grade");
    if (qGrade && qGrade !== grade) setGrade(qGrade);

    const qSection = searchParams.get("section");
    if (qSection && qSection !== section) setSection(qSection);

    const qTab = searchParams.get("tab");
    if (qTab && ["allocation", "timetable", "syllabus", "overview"].includes(qTab) && qTab !== activeTab) {
      setActiveTab(qTab as any);
    }
  }, [searchParams]);

  // Synchronize state changes to URL query parameters smoothly
  const updateUrlParams = React.useCallback(
    (updates: { year?: string; grade?: string; section?: string; tab?: string }) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      if (updates.year !== undefined) nextParams.set("year", updates.year);
      if (updates.grade !== undefined) nextParams.set("grade", updates.grade);
      if (updates.section !== undefined) nextParams.set("section", updates.section);
      if (updates.tab !== undefined) nextParams.set("tab", updates.tab);
      router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleYearChange = (newYear: string) => {
    setAcademicYear(newYear);
    updateUrlParams({ year: newYear });
  };

  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade);
    updateUrlParams({ grade: newGrade });
  };

  const handleSectionChange = (newSection: string) => {
    setSection(newSection);
    updateUrlParams({ section: newSection });
  };

  const handleTabChange = (newTab: "allocation" | "timetable" | "syllabus" | "overview") => {
    setActiveTab(newTab);
    updateUrlParams({ tab: newTab });
  };

  const classKey = `${grade}-${section}`;
  const classInfo = MOCK_CLASS_INFO[classKey] ?? {
    id: `cls-${grade}-${section}`,
    academicYear,
    grade,
    section,
    classTeacher: { name: "Ms. Neha Sharma", department: "Faculty of Mathematics" },
    assignedRoom: "101 (Main Block)",
    totalStudents: 42,
    capacity: 45,
    totalWeeklyPeriods: 36,
  };

  const [subjectsList, setSubjectsList] = React.useState<SubjectAllocation[]>(
    MOCK_SUBJECT_ALLOCATIONS[classKey] ?? MOCK_SUBJECT_ALLOCATIONS["Grade 8-A"]
  );

  // Update subjects when grade/section changes
  React.useEffect(() => {
    const defaultData =
      MOCK_SUBJECT_ALLOCATIONS[classKey] ?? MOCK_SUBJECT_ALLOCATIONS["Grade 8-A"];
    setSubjectsList(defaultData);
  }, [classKey]);

  const handleAddSubject = (newSubject: SubjectAllocation) => {
    setSubjectsList((prev) => [newSubject, ...prev]);
  };

  const filteredSubjects = subjectsList.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.teacher.name.toLowerCase().includes(q) ||
      s.room.toLowerCase().includes(q)
    );
  });

  const getCategoryBadge = (category: SubjectCategory) => {
    switch (category) {
      case "core":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "practical":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "elective":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "language":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Academic Management
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              {academicYear}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section 3.3 curriculum planning, subject allocation, faculty assignments, and timetable scheduling.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAssignModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1E6DEB] hover:bg-[#1557bf] text-white px-4 py-2.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Assign Subject to Class</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon: Academic Year, Class, Section (Matches Roadmap Concept Screenshot) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-3xl">
            {/* Academic Year Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20 outline-hidden cursor-pointer"
              >
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Class
              </label>
              <select
                value={grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20 outline-hidden cursor-pointer"
              >
                {GRADES_LIST.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Section
              </label>
              <select
                value={section}
                onChange={(e) => handleSectionChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20 outline-hidden cursor-pointer"
              >
                {SECTIONS_LIST.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Stats Pill for the Selected Class */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="rounded-xl border border-slate-200 bg-slate-50/75 px-3.5 py-2 text-xs">
              <span className="text-[10px] text-slate-400 block font-medium">Class Teacher</span>
              <span className="font-bold text-slate-900">{classInfo.classTeacher.name}</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/75 px-3.5 py-2 text-xs">
              <span className="text-[10px] text-slate-400 block font-medium">Enrolled</span>
              <span className="font-bold text-slate-900">
                {classInfo.totalStudents}/{classInfo.capacity} students
              </span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/75 px-3.5 py-2 text-xs">
              <span className="text-[10px] text-slate-400 block font-medium">Room</span>
              <span className="font-bold text-slate-900">{classInfo.assignedRoom}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex items-center gap-6 text-xs font-bold" aria-label="Academics sub tabs">
          <button
            type="button"
            onClick={() => handleTabChange("allocation")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "allocation"
                ? "border-[#1E6DEB] text-[#1E6DEB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Class & Section Allocation
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("timetable")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "timetable"
                ? "border-[#1E6DEB] text-[#1E6DEB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Weekly Timetable
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("syllabus")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "syllabus"
                ? "border-[#1E6DEB] text-[#1E6DEB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Curriculum & Syllabus
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("overview")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "border-[#1E6DEB] text-[#1E6DEB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            All Classes & Capacity
          </button>
        </nav>
      </div>

      {/* TAB 1: Class & Section Allocation (The exact table from roadmap_img-001.png) */}
      {activeTab === "allocation" && (
        <div className="space-y-4">
          {/* Card Container for Class & Section matching the reference mockup */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            {/* Mockup Title bar */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1E6DEB]" />
                <h2 className="text-lg font-bold text-[#0F243E]">
                  Class & Section
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  ({grade} • Section {section})
                </span>
              </div>

              {/* Table Search & quick filter */}
              <div className="relative w-full sm:w-64">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter subjects, code, teacher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E6DEB]"
                />
              </div>
            </div>

            {/* Allocation Table (Columns: Subject Name, Teacher, Weekly Periods, Room, Category, Status) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-5">Subject Name</th>
                    <th className="py-3.5 px-5">Assigned Teacher</th>
                    <th className="py-3.5 px-5 text-center">Periods / Wk</th>
                    <th className="py-3.5 px-5">Room</th>
                    <th className="py-3.5 px-5">Category</th>
                    <th className="py-3.5 px-5 text-center">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        No subjects match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors group">
                        {/* Subject Name & Code */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#1E6DEB] flex items-center justify-center font-bold text-xs shrink-0">
                              {sub.code.slice(0, 3)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-[#1E6DEB] transition-colors">
                                {sub.name}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">
                                {sub.code} • {sub.creditHours} Credits
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Teacher */}
                        <td className="py-3.5 px-5">
                          <div className="font-semibold text-slate-800">{sub.teacher.name}</div>
                          <div className="text-[11px] text-slate-400">{sub.teacher.department}</div>
                        </td>

                        {/* Weekly periods */}
                        <td className="py-3.5 px-5 text-center font-mono font-bold text-slate-700">
                          {sub.weeklyPeriods} periods
                        </td>

                        {/* Room */}
                        <td className="py-3.5 px-5 text-slate-600 font-medium">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {sub.room}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${getCategoryBadge(
                              sub.category
                            )}`}
                          >
                            {sub.category}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-5 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            Active
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit allocation"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Remove subject"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
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

      {/* TAB 2: Weekly Timetable Grid */}
      {activeTab === "timetable" && (
        <ClassTimetableGrid
          grade={grade}
          section={section}
          academicYear={academicYear}
        />
      )}

      {/* TAB 3: Curriculum & Syllabus Progress */}
      {activeTab === "syllabus" && (
        <SyllabusProgressCard grade={grade} section={section} />
      )}

      {/* TAB 4: All Classes & Capacity Overview */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_ALL_CLASSES_OVERVIEW.map((cls) => (
              <div
                key={cls.grade}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-[#1E6DEB] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {cls.grade}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Room {cls.room}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Class Teacher:</span>
                    <strong className="text-slate-800">{cls.classTeacher}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Students:</span>
                    <span className="font-semibold text-slate-800">
                      {cls.totalStudents} students
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Sections:</span>
                    <span className="font-mono text-slate-700">{cls.sections.join(", ")}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-slate-500">Today Attendance</span>
                    <span className="text-emerald-700 font-bold">
                      {cls.attendanceToday}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${cls.attendanceToday}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Switch to this class button */}
                <div className="mt-3 pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      handleGradeChange(cls.grade);
                      handleSectionChange(cls.sections[0] || "A");
                      handleTabChange("allocation");
                    }}
                    className="text-xs font-semibold text-[#1E6DEB] hover:underline cursor-pointer"
                  >
                    View Section {cls.sections[0] || "A"} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for adding a new subject allocation */}
      <AssignSubjectModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        grade={grade}
        section={section}
        academicYear={academicYear}
        onAddSubject={handleAddSubject}
      />
    </div>
  );
}

export function AcademicsView() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 text-xs animate-pulse">
          Loading academic management...
        </div>
      }
    >
      <AcademicsInner />
    </React.Suspense>
  );
}
