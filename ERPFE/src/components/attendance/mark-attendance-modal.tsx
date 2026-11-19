"use client";

import * as React from "react";
import { X, Check, CheckCheck, AlertCircle, Clock, ShieldAlert, Sparkles } from "lucide-react";
import { StudentAttendanceRecord, AttendanceStatus } from "./attendance-types";

interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  classNameTitle: string;
  dateStr: string;
  initialRecords: StudentAttendanceRecord[];
  onSave: (updatedRecords: StudentAttendanceRecord[]) => void;
}

export function MarkAttendanceModal({
  isOpen,
  onClose,
  classNameTitle,
  dateStr,
  initialRecords,
  onSave,
}: MarkAttendanceModalProps) {
  const [records, setRecords] = React.useState<StudentAttendanceRecord[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setRecords(JSON.parse(JSON.stringify(initialRecords)));
    }
  }, [isOpen, initialRecords]);

  if (!isOpen) return null;

  const handleStatusChange = (rollNo: string, newStatus: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.rollNo === rollNo ? { ...rec, status: newStatus } : rec))
    );
  };

  const handleRemarkChange = (rollNo: string, remark: string) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.rollNo === rollNo ? { ...rec, remarks: remark } : rec))
    );
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((rec) => ({
        ...rec,
        status,
        checkInTime: status === "present" ? "08:45 AM" : undefined,
      }))
    );
  };

  const handleSave = () => {
    onSave(records);
    onClose();
  };

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const lateCount = records.filter((r) => r.status === "late").length;
  const excusedCount = records.filter((r) => r.status === "excused").length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">Mark Attendance</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {classNameTitle}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Roll call for <span className="font-medium text-slate-700">{dateStr}</span> •{" "}
              {records.length} students enrolled
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Bulk Action Bar & Counter */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Quick bulk actions:</span>
            <button
              type="button"
              onClick={() => handleMarkAll("present")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-medium transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all present
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll("absent")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-medium transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Mark all absent
            </button>
          </div>

          <div className="flex items-center gap-3 font-medium">
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {presentCount} Present
            </span>
            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              {absentCount} Absent
            </span>
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {lateCount} Late
            </span>
            <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
              {excusedCount} Excused
            </span>
          </div>
        </div>

        {/* Student Roll Call List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
          <div className="grid grid-cols-12 text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">
            <div className="col-span-1">Roll</div>
            <div className="col-span-4">Student Details</div>
            <div className="col-span-4 text-center">Status</div>
            <div className="col-span-3">Audit Remarks</div>
          </div>

          {records.map((student) => (
            <div
              key={student.rollNo}
              className="grid grid-cols-12 items-center py-2.5 gap-2 text-sm hover:bg-slate-50/70 rounded-lg px-1 transition-colors"
            >
              {/* Roll No */}
              <div className="col-span-1 font-mono font-bold text-slate-700 text-xs">
                {student.rollNo}
              </div>

              {/* Student Name & Admission */}
              <div className="col-span-4">
                <div className="font-medium text-slate-900">{student.studentName}</div>
                <div className="text-xs text-slate-400 font-mono">{student.admissionNo}</div>
              </div>

              {/* Quick Status Buttons */}
              <div className="col-span-4 flex items-center justify-center gap-1">
                {/* Present Button */}
                <button
                  type="button"
                  onClick={() => handleStatusChange(student.rollNo, "present")}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    student.status === "present"
                      ? "bg-emerald-600 text-white shadow-xs font-semibold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                  title="Mark Present"
                >
                  P
                </button>

                {/* Absent Button */}
                <button
                  type="button"
                  onClick={() => handleStatusChange(student.rollNo, "absent")}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    student.status === "absent"
                      ? "bg-rose-600 text-white shadow-xs font-semibold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                  title="Mark Absent"
                >
                  A
                </button>

                {/* Late Button */}
                <button
                  type="button"
                  onClick={() => handleStatusChange(student.rollNo, "late")}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    student.status === "late"
                      ? "bg-amber-500 text-white shadow-xs font-semibold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                  title="Mark Late"
                >
                  L
                </button>

                {/* Excused Button */}
                <button
                  type="button"
                  onClick={() => handleStatusChange(student.rollNo, "excused")}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    student.status === "excused"
                      ? "bg-sky-600 text-white shadow-xs font-semibold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                  title="Mark Excused"
                >
                  E
                </button>
              </div>

              {/* Remarks */}
              <div className="col-span-3">
                <input
                  type="text"
                  value={student.remarks || ""}
                  placeholder={
                    student.status === "absent"
                      ? "Reason (fever, travel)..."
                      : student.status === "late"
                      ? "Arrival delay reason..."
                      : "Optional remarks"
                  }
                  onChange={(e) => handleRemarkChange(student.rollNo, e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50/80">
          <div className="text-xs text-slate-500">
            Attendance changes will update real-time records and parent portals.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save attendance register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
