"use client";

import * as React from "react";
import { TIMETABLE_PERIODS, MOCK_WEEKLY_TIMETABLE } from "./academic-mock-data";
import { TimetableCell } from "./academic-types";
import { Printer, Calendar, Clock, MapPin, User, Download } from "lucide-react";

interface ClassTimetableGridProps {
  grade: string;
  section: string;
  academicYear: string;
}

const DAYS: Array<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"> = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export function ClassTimetableGrid({
  grade,
  section,
  academicYear,
}: ClassTimetableGridProps) {
  const [selectedCell, setSelectedCell] = React.useState<TimetableCell | null>(null);

  const getCellForSlot = (
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday",
    periodNumber: number
  ): TimetableCell | undefined => {
    return MOCK_WEEKLY_TIMETABLE.find(
      (cell) => cell.day === day && cell.periodNumber === periodNumber
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-[#0F243E]">
            {grade} · Section {section} Weekly Timetable
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic Session {academicYear} • 36 Teaching Periods/Week • Mon - Fri
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Print timetable</span>
          </button>
          <button
            type="button"
            onClick={() => {
              // Simple CSV export
              const rows = [
                ["Day", "Period", "Time", "Subject", "Teacher", "Room"],
                ...MOCK_WEEKLY_TIMETABLE.map((c) => [
                  c.day,
                  `Period ${c.periodNumber}`,
                  TIMETABLE_PERIODS.find((p) => p.periodNumber === c.periodNumber)?.startTime || "",
                  c.subjectName,
                  c.teacherName,
                  c.room,
                ]),
              ];
              const csvContent =
                "data:text/csv;charset=utf-8," +
                rows.map((e) => e.join(",")).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `${grade}_${section}_timetable.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Timetable Matrix Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full min-w-[900px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75">
              <th className="w-28 p-3 font-semibold text-slate-700 uppercase tracking-wider text-[11px] sticky left-0 bg-slate-50/95 z-10 border-r border-slate-200">
                Day / Period
              </th>
              {TIMETABLE_PERIODS.map((period, idx) => {
                if (period.isBreak) {
                  return (
                    <th
                      key={`break-${idx}`}
                      className="w-16 p-2 text-center font-medium text-slate-400 bg-amber-50/50 border-r border-slate-200"
                    >
                      <div className="text-[10px] font-semibold text-amber-800">
                        {period.breakLabel}
                      </div>
                      <div className="text-[10px] text-amber-700 font-mono">
                        {period.startTime}-{period.endTime}
                      </div>
                    </th>
                  );
                }

                return (
                  <th
                    key={`p-${period.periodNumber}`}
                    className="p-3 font-semibold text-slate-700 border-r border-slate-200 last:border-r-0 min-w-[120px]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F243E]">
                        P{period.periodNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {period.startTime} - {period.endTime}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DAYS.map((day) => (
              <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-3 font-bold text-slate-800 border-r border-slate-200 sticky left-0 bg-white z-10">
                  {day}
                </td>
                {TIMETABLE_PERIODS.map((period, idx) => {
                  if (period.isBreak) {
                    return (
                      <td
                        key={`break-col-${idx}`}
                        className="bg-amber-50/30 text-center text-[11px] text-slate-400 border-r border-slate-200 font-mono select-none"
                      >
                        ·
                      </td>
                    );
                  }

                  const cell = getCellForSlot(day, period.periodNumber);
                  if (!cell) {
                    return (
                      <td
                        key={`slot-${period.periodNumber}`}
                        className="p-2 border-r border-slate-100 text-center text-slate-300 italic"
                      >
                        Free
                      </td>
                    );
                  }

                  return (
                    <td
                      key={`slot-${period.periodNumber}`}
                      className="p-1.5 border-r border-slate-100 last:border-r-0"
                    >
                      <div
                        onClick={() => setSelectedCell(cell)}
                        className={`group relative rounded-lg border p-2 cursor-pointer transition-all duration-150 hover:shadow-xs hover:-translate-y-0.5 ${cell.colorClass}`}
                      >
                        <p className="font-bold text-[12px] truncate leading-tight">
                          {cell.subjectName}
                        </p>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-600">
                          <span className="truncate max-w-[85px]">{cell.teacherName}</span>
                          <span className="font-mono px-1 py-0.2 rounded bg-white/70 border border-black/5 text-[9px] font-semibold">
                            {cell.room}
                          </span>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Slot Quick Drawer / Detail */}
      {selectedCell && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1E6DEB] text-white font-bold text-sm">
              {selectedCell.subjectCode.slice(0, 3)}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">
                {selectedCell.subjectName} ({selectedCell.subjectCode})
              </p>
              <div className="flex flex-wrap items-center gap-3 text-slate-600 mt-0.5 text-xs">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3 text-slate-400" />
                  {selectedCell.teacherName}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  Room {selectedCell.room}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  {selectedCell.day} • Period {selectedCell.periodNumber}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedCell(null)}
            className="self-end sm:self-auto rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
