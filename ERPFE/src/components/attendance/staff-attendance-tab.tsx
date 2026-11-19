"use client";

import * as React from "react";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  CalendarDays,
  MoreVertical,
  Check,
  Edit2,
  Fingerprint,
} from "lucide-react";
import { StaffAttendanceRecord, AttendanceStatus } from "./attendance-types";
import { MOCK_STAFF_ATTENDANCE } from "./attendance-mock-data";

export function StaffAttendanceTab() {
  const [staffRecords, setStaffRecords] = React.useState<StaffAttendanceRecord[]>(MOCK_STAFF_ATTENDANCE);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [editingStaffId, setEditingStaffId] = React.useState<string | null>(null);

  // Departments
  const departments = React.useMemo(() => {
    const set = new Set(MOCK_STAFF_ATTENDANCE.map((s) => s.department));
    return ["all", ...Array.from(set)];
  }, []);

  const filteredStaff = staffRecords.filter((staff) => {
    if (selectedDept !== "all" && staff.department !== selectedDept) return false;
    if (selectedStatus !== "all" && staff.status !== selectedStatus) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      staff.name.toLowerCase().includes(q) ||
      staff.staffId.toLowerCase().includes(q) ||
      staff.role.toLowerCase().includes(q)
    );
  });

  const totalCount = staffRecords.length;
  const presentCount = staffRecords.filter((s) => s.status === "present").length;
  const lateCount = staffRecords.filter((s) => s.status === "late").length;
  const absentCount = staffRecords.filter((s) => s.status === "absent").length;

  const handleUpdateStatus = (id: string, newStatus: AttendanceStatus) => {
    setStaffRecords((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          status: newStatus,
          checkInTime:
            newStatus === "present" && !s.checkInTime ? "08:30 AM" : s.checkInTime,
        };
      })
    );
    setEditingStaffId(null);
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Present
          </span>
        );
      case "absent":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Absent
          </span>
        );
      case "late":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Late
          </span>
        );
      case "excused":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            On Leave
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Total Faculty & Staff</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Present Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">{presentCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Late Arrivals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">{lateCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Absent / Leave</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-700">{absentCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty or staff ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            {departments.filter((d) => d !== "all").map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
            <option value="excused">On Leave</option>
          </select>
        </div>

        {/* Biometric sync indicator */}
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
          <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
          <span>Biometric Terminal: <strong className="text-emerald-700">Online</strong></span>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="px-4 py-3 w-28">Staff ID</th>
                <th className="px-4 py-3">Employee Name & Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3 text-center w-32">Status</th>
                <th className="px-4 py-3">Clock In</th>
                <th className="px-4 py-3">Clock Out</th>
                <th className="px-4 py-3">Remarks</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((staff) => {
                const isEditing = editingStaffId === staff.id;
                return (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-slate-600">
                      {staff.staffId}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{staff.name}</div>
                      <div className="text-slate-500 text-[11px]">{staff.role}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{staff.department}</td>
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          {(["present", "absent", "late", "excused"] as AttendanceStatus[]).map(
                            (st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleUpdateStatus(staff.id, st)}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                                  staff.status === st
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                              >
                                {st[0]}
                              </button>
                            )
                          )}
                        </div>
                      ) : (
                        getStatusBadge(staff.status)
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">
                      {staff.checkInTime || "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">
                      {staff.checkOutTime || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-[11px]">
                      {staff.remarks || "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingStaffId(isEditing ? null : staff.id)
                        }
                        className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit attendance"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
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
