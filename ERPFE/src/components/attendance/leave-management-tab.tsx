"use client";

import * as React from "react";
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Search,
  Filter,
  Check,
  X,
  FileText,
  User,
} from "lucide-react";
import { LeaveRequestRecord } from "./attendance-types";
import { MOCK_LEAVE_REQUESTS } from "./attendance-mock-data";

export function LeaveManagementTab() {
  const [requests, setRequests] = React.useState<LeaveRequestRecord[]>(MOCK_LEAVE_REQUESTS);
  const [roleFilter, setRoleFilter] = React.useState<"all" | "Student" | "Staff">("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);

  // New leave form state
  const [newApplicantName, setNewApplicantName] = React.useState("");
  const [newRole, setNewRole] = React.useState<"Student" | "Staff">("Student");
  const [newClassOrDept, setNewClassOrDept] = React.useState("Grade 8 - A");
  const [newLeaveType, setNewLeaveType] = React.useState<LeaveRequestRecord["leaveType"]>("Sick Leave");
  const [newFromDate, setNewFromDate] = React.useState("2025-04-25");
  const [newToDate, setNewToDate] = React.useState("2025-04-26");
  const [newDaysCount, setNewDaysCount] = React.useState(2);
  const [newReason, setNewReason] = React.useState("");

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r))
    );
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
    );
  };

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApplicantName.trim() || !newReason.trim()) return;

    const newRecord: LeaveRequestRecord = {
      id: `lv-${Date.now()}`,
      applicantName: newApplicantName.trim(),
      applicantRole: newRole,
      classOrDepartment: newClassOrDept.trim(),
      leaveType: newLeaveType,
      fromDate: newFromDate,
      toDate: newToDate,
      daysCount: Number(newDaysCount) || 1,
      reason: newReason.trim(),
      status: "pending",
      appliedOn: new Date().toISOString().split("T")[0],
    };

    setRequests([newRecord, ...requests]);
    setIsApplyModalOpen(false);
    setNewApplicantName("");
    setNewReason("");
  };

  const filteredRequests = requests.filter((r) => {
    if (roleFilter !== "all" && r.applicantRole !== roleFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.applicantName.toLowerCase().includes(q) ||
      r.classOrDepartment.toLowerCase().includes(q) ||
      r.leaveType.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q)
    );
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  return (
    <div className="space-y-4">
      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Total Requests</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{requests.length}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">{pendingCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Approved</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">{approvedCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-700">{rejectedCount}</div>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search applicant or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="Student">Students Only</option>
            <option value="Staff">Staff Only</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsApplyModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Apply for leave
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Class / Dept</th>
                <th className="px-4 py-3">Leave Type</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3 max-w-xs">Reason</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{req.applicantName}</div>
                    <div className="text-[11px] text-slate-500">
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded font-medium ${
                          req.applicantRole === "Student"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {req.applicantRole}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    {req.classOrDepartment}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                      {req.leaveType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-slate-700">
                      {req.fromDate} to {req.toDate}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {req.daysCount} {req.daysCount === 1 ? "day" : "days"}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs text-slate-600 text-xs">
                    <p className="line-clamp-2">{req.reason}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {req.status === "approved" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check className="w-3 h-3" />
                        Approved
                      </span>
                    )}
                    {req.status === "pending" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                    {req.status === "rejected" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <X className="w-3 h-3" />
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {req.status === "pending" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApprove(req.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(req.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-md p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">Submit Leave Application</h3>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLeave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Applicant Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewRole("Student")}
                    className={`py-1.5 rounded-lg border font-medium ${
                      newRole === "Student"
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRole("Staff")}
                    className={`py-1.5 rounded-lg border font-medium ${
                      newRole === "Staff"
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    Faculty / Staff
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Applicant Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={newApplicantName}
                  onChange={(e) => setNewApplicantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {newRole === "Student" ? "Class & Section" : "Department"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={newRole === "Student" ? "e.g. Grade 8 - A" : "e.g. Mathematics Faculty"}
                  value={newClassOrDept}
                  onChange={(e) => setNewClassOrDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Leave Type
                </label>
                <select
                  value={newLeaveType}
                  onChange={(e) => setNewLeaveType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Family Emergency">Family Emergency</option>
                  <option value="Study Leave">Study Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={newFromDate}
                    onChange={(e) => setNewFromDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={newToDate}
                    onChange={(e) => setNewToDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Absence
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide legitimate justification for school administrative records..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold shadow-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
