"use client";

import * as React from "react";
import {
  Download,
  Printer,
  Search,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { MonthlyStudentAttendance, AttendanceStatus } from "./attendance-types";
import { MOCK_MONTHLY_ATTENDANCE } from "./attendance-mock-data";

interface MonthlyAttendanceMatrixProps {
  classNameTitle: string;
}

export function MonthlyAttendanceMatrix({ classNameTitle }: MonthlyAttendanceMatrixProps) {
  const [selectedMonth, setSelectedMonth] = React.useState("April 2025");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [data, setData] = React.useState<MonthlyStudentAttendance[]>(MOCK_MONTHLY_ATTENDANCE);

  const daysInMonth = 30; // April has 30 days
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Weekend days in April 2025 (Sundays: 6, 13, 20, 27; Saturdays: 5, 12, 19, 26)
  const isSunday = (day: number) => day === 6 || day === 13 || day === 20 || day === 27;

  const filteredData = data.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.studentName.toLowerCase().includes(q) || item.rollNo.includes(q);
  });

  const getStatusBadge = (status: AttendanceStatus | undefined, isWknd: boolean) => {
    if (isWknd || status === "weekend") {
      return (
        <span className="w-5 h-5 flex items-center justify-center text-[10px] text-slate-300 font-mono select-none">
          -
        </span>
      );
    }
    switch (status) {
      case "present":
        return (
          <span
            title="Present"
            className="w-5 h-5 rounded-sm bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center"
          >
            P
          </span>
        );
      case "absent":
        return (
          <span
            title="Absent"
            className="w-5 h-5 rounded-sm bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center justify-center animate-pulse"
          >
            A
          </span>
        );
      case "late":
        return (
          <span
            title="Late"
            className="w-5 h-5 rounded-sm bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center"
          >
            L
          </span>
        );
      case "excused":
        return (
          <span
            title="Excused Leave"
            className="w-5 h-5 rounded-sm bg-sky-100 text-sky-800 text-[10px] font-bold flex items-center justify-center"
          >
            E
          </span>
        );
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-[10px] text-slate-300">
            ·
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const headers = ["Roll No", "Student Name", ...daysArray.map((d) => `Day ${d}`), "Present", "Absent", "Late", "Percentage"];
    const rows = filteredData.map((s) => [
      s.rollNo,
      `"${s.studentName}"`,
      ...daysArray.map((d) => (isSunday(d) ? "W" : s.days[d] || "-")),
      s.presentCount,
      s.absentCount,
      s.lateCount,
      `${s.percentage}%`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_matrix_${classNameTitle.replace(/\s+/g, "_")}_${selectedMonth.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar Controls */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Month Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-white text-slate-600 transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-slate-800 select-none">
              {selectedMonth}
            </span>
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-white text-slate-600 transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Class register: <strong className="text-slate-800">{classNameTitle}</strong>
          </span>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Print sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>

      {/* Legend & Policy Note */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-500">Legend:</span>
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 rounded-xs bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
              P
            </span>
            Present
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 rounded-xs bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center justify-center">
              A
            </span>
            Absent
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 rounded-xs bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center">
              L
            </span>
            Late
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 rounded-xs bg-sky-100 text-sky-800 text-[10px] font-bold flex items-center justify-center">
              E
            </span>
            Excused
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <span className="w-4 h-4 text-slate-400 text-center">-</span>
            Weekend
          </span>
        </div>

        <div className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          Minimum 75% attendance mandatory for exam qualification.
        </div>
      </div>

      {/* Grid Container */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="sticky left-0 z-20 bg-slate-50/95 backdrop-blur-xs px-3 py-2.5 w-12 border-r border-slate-200 text-center">
                  Roll
                </th>
                <th className="sticky left-12 z-20 bg-slate-50/95 backdrop-blur-xs px-3 py-2.5 w-44 border-r border-slate-200">
                  Student Name
                </th>
                {daysArray.map((d) => (
                  <th
                    key={d}
                    className={`px-1 py-2 text-center font-mono text-[11px] min-w-[28px] border-r border-slate-100 ${
                      isSunday(d) ? "bg-slate-100/70 text-slate-400 font-normal" : "text-slate-600"
                    }`}
                  >
                    {d}
                  </th>
                ))}
                <th className="px-2 py-2.5 text-center bg-slate-50 border-r border-slate-200 w-12">
                  Pres.
                </th>
                <th className="px-2 py-2.5 text-center bg-slate-50 border-r border-slate-200 w-12">
                  Abs.
                </th>
                <th className="px-2 py-2.5 text-center bg-slate-50 border-r border-slate-200 w-12">
                  Late
                </th>
                <th className="px-3 py-2.5 text-center bg-slate-50 w-24">Rate (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((student) => {
                const isUnderThreshold = student.percentage < 75;
                return (
                  <tr
                    key={student.rollNo}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Sticky Roll No */}
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/90 px-3 py-2 text-center font-mono font-bold text-slate-700 border-r border-slate-200">
                      {student.rollNo}
                    </td>

                    {/* Sticky Student Name */}
                    <td className="sticky left-12 z-10 bg-white group-hover:bg-slate-50/90 px-3 py-2 border-r border-slate-200">
                      <div className="font-medium text-slate-900 truncate max-w-[150px]">
                        {student.studentName}
                      </div>
                    </td>

                    {/* Day Cells */}
                    {daysArray.map((d) => {
                      const wknd = isSunday(d);
                      const status = student.days[d];
                      return (
                        <td
                          key={d}
                          className={`p-0.5 text-center border-r border-slate-100 ${
                            wknd ? "bg-slate-50/50" : ""
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            {getStatusBadge(status, wknd)}
                          </div>
                        </td>
                      );
                    })}

                    {/* Summary Columns */}
                    <td className="px-2 py-2 text-center font-mono text-emerald-700 font-semibold bg-slate-50/40 border-r border-slate-100">
                      {student.presentCount}
                    </td>
                    <td className="px-2 py-2 text-center font-mono text-rose-700 font-semibold bg-slate-50/40 border-r border-slate-100">
                      {student.absentCount}
                    </td>
                    <td className="px-2 py-2 text-center font-mono text-amber-700 font-semibold bg-slate-50/40 border-r border-slate-100">
                      {student.lateCount}
                    </td>
                    <td className="px-3 py-2 text-center bg-slate-50/40">
                      <div className="flex items-center justify-center gap-1.5">
                        <span
                          className={`font-semibold font-mono text-xs ${
                            isUnderThreshold ? "text-rose-600 font-bold" : "text-slate-800"
                          }`}
                        >
                          {student.percentage}%
                        </span>
                        {isUnderThreshold && (
                          <span
                            title="Below 75% attendance threshold"
                            className="inline-flex text-rose-600"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
