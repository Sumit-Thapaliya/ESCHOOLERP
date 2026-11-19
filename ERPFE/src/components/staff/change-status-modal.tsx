"use client";

import * as React from "react";
import { X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { StaffMember, StaffStatus } from "./staff-types";

interface ChangeStatusModalProps {
  staff: StaffMember;
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: StaffStatus, leavingDate?: string, leavingReason?: string) => void;
}

export function ChangeStatusModal({
  staff,
  isOpen,
  onClose,
  onSave,
}: ChangeStatusModalProps) {
  const [status, setStatus] = React.useState<StaffStatus>(staff.status);
  const [leavingDate, setLeavingDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [leavingReason, setLeavingReason] = React.useState("");

  if (!isOpen) return null;

  const isExitStatus = ["resigned", "terminated", "retired"].includes(status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExitStatus && !leavingDate) return;
    onSave(status, isExitStatus ? leavingDate : undefined, isExitStatus ? leavingReason : undefined);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-md p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Change Employment Status</h3>
            <p className="text-xs text-slate-500">
              {staff.person.displayName} ({staff.employeeCode})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              New Status (Swagger API: POST /staff/:id/status)
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StaffStatus)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="active">Active (Full Duty)</option>
              <option value="on_leave">On Leave (Medical / Approved)</option>
              <option value="resigned">Resigned (Formal Resignation)</option>
              <option value="terminated">Terminated (Administrative Action)</option>
              <option value="retired">Retired (Service Completion)</option>
            </select>
          </div>

          {isExitStatus && (
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-3">
              <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Leaving details required by backend API
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Last Working / Leaving Date</label>
                <input
                  type="date"
                  required
                  value={leavingDate}
                  onChange={(e) => setLeavingDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Official Reason for Departure</label>
                <textarea
                  rows={2}
                  required
                  value={leavingReason}
                  onChange={(e) => setLeavingReason(e.target.value)}
                  placeholder="e.g. Relocation outside Kathmandu valley / Personal reasons..."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold shadow-xs"
            >
              Update Employment Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
