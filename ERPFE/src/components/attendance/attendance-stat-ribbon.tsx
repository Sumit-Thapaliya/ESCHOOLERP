import * as React from "react";
import { Users, CheckCircle2, XCircle, Clock, CalendarDays } from "lucide-react";
import { AttendanceSummary } from "./attendance-types";

interface AttendanceStatRibbonProps {
  summary: AttendanceSummary;
}

export function AttendanceStatRibbon({ summary }: AttendanceStatRibbonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {/* Total Students */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Total Enrolled</span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{summary.total}</span>
          <span className="text-xs text-slate-500">students</span>
        </div>
      </div>

      {/* Present */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Present</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-700">{summary.present}</span>
          <span className="text-xs font-medium text-emerald-600">
            {summary.total > 0 ? Math.round((summary.present / summary.total) * 100) : 0}% rate
          </span>
        </div>
      </div>

      {/* Absent */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Absent</span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-rose-700">{summary.absent}</span>
          <span className="text-xs text-slate-500">unexcused</span>
        </div>
      </div>

      {/* Late */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Late Arrival</span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-700">{summary.late}</span>
          <span className="text-xs text-slate-500">recorded</span>
        </div>
      </div>

      {/* Excused / Leave */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">On Leave / Excused</span>
          <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
            <CalendarDays className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-sky-700">{summary.excused}</span>
          <span className="text-xs text-slate-500">approved</span>
        </div>
      </div>
    </div>
  );
}
