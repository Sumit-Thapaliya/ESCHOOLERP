"use client";

import * as React from "react";
import {
  UserPlus,
  Receipt,
  UserCheck,
  Megaphone,
  FileSpreadsheet,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export function QuickActionsBar() {
  const [activeModal, setActiveModal] = React.useState<
    "admission" | "fee" | "attendance" | "notice" | null
  >(null);

  // Simple state for quick forms
  const [studentName, setStudentName] = React.useState("");
  const [grade, setGrade] = React.useState("Grade 1");
  const [feeStudent, setFeeStudent] = React.useState("");
  const [feeAmount, setFeeAmount] = React.useState("");
  const [noticeTitle, setNoticeTitle] = React.useState("");
  const [noticeAudience, setNoticeAudience] = React.useState("All Parents");

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    toast.success(`Application registered for ${studentName} (${grade})`);
    setActiveModal(null);
    setStudentName("");
  };

  const handleFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeAmount) return;
    toast.success(`Receipt issued: NPR ${Number(feeAmount).toLocaleString()} recorded`);
    setActiveModal(null);
    setFeeStudent("");
    setFeeAmount("");
  };

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;
    toast.success(`Notice published to ${noticeAudience}`);
    setActiveModal(null);
    setNoticeTitle("");
  };

  return (
    <>
      <section className="rounded-xl border border-[#DDE5F0] bg-white p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Quick actions
            </h2>
            <p className="text-xs text-slate-500">
              Direct access to frequent administrative tasks
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveModal("admission")}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2570D3] px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-[#1C5BB0] transition-colors cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>New admission</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("fee")}
              className="inline-flex items-center gap-2 rounded-lg border border-[#DDE5F0] bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Receipt className="h-4 w-4 text-[#1F9D6B]" />
              <span>Collect fee</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("attendance")}
              className="inline-flex items-center gap-2 rounded-lg border border-[#DDE5F0] bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <UserCheck className="h-4 w-4 text-[#2570D3]" />
              <span>Mark attendance</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("notice")}
              className="inline-flex items-center gap-2 rounded-lg border border-[#DDE5F0] bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Megaphone className="h-4 w-4 text-[#E69A2E]" />
              <span>Publish notice</span>
            </button>
          </div>
        </div>
      </section>

      {/* New Admission Modal */}
      {activeModal === "admission" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-sm text-slate-900">
                  New student admission
                </h3>
                <p className="text-xs text-slate-500">
                  Quick intake registration for current session
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAdmissionSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full student name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#2570D3] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target grade / class
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#2570D3] outline-hidden bg-white"
                >
                  <option value="Playgroup / Nursery">Playgroup / Nursery</option>
                  <option value="Kindergarten">Kindergarten</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 11 Science">Grade 11 Science</option>
                  <option value="Grade 11 Management">Grade 11 Management</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#2570D3] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#1C5BB0]"
                >
                  Create admission record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collect Fee Modal */}
      {activeModal === "fee" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-sm text-slate-900">
                  Collect student fee
                </h3>
                <p className="text-xs text-slate-500">
                  Issue quick counter receipt (NPR)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleFeeSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Student roll / admission number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-0842 or Student name"
                  value={feeStudent}
                  onChange={(e) => setFeeStudent(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#2570D3] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Amount collected (NPR)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 25000"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#2570D3] outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1F9D6B] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#198358]"
                >
                  Record & print receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark Attendance Modal */}
      {activeModal === "attendance" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-sm text-slate-900">
                  Class attendance register
                </h3>
                <p className="text-xs text-slate-500">
                  Batch entry for today (Today: 94.2% school-wide)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-600">
                Select a class to review or finalize morning attendance:
              </p>
              <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between p-2.5">
                  <span className="font-medium text-slate-800">Grade 10-A</span>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700 font-medium">
                    38/40 present
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5">
                  <span className="font-medium text-slate-800">Grade 10-B</span>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700 font-medium">
                    39/40 present
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5">
                  <span className="font-medium text-slate-800">Grade 8-B</span>
                  <span className="rounded bg-amber-50 px-2 py-0.5 text-amber-700 font-medium">
                    31/38 (81.4% - alert)
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Roster synced successfully");
                    setActiveModal(null);
                  }}
                  className="rounded-lg bg-[#2570D3] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#1C5BB0]"
                >
                  Confirm all rosters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Notice Modal */}
      {activeModal === "notice" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-sm text-slate-900">
                  Publish bulletin notice
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcast announcement via SMS, mobile app and portal
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleNoticeSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Notice title / subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. First Term Parent-Teacher Conference"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#2570D3] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Recipient audience
                </label>
                <select
                  value={noticeAudience}
                  onChange={(e) => setNoticeAudience(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#2570D3] outline-hidden bg-white"
                >
                  <option value="All Parents">All Parents & Guardians</option>
                  <option value="Teaching Staff">Teaching Staff Only</option>
                  <option value="High School Students">
                    High School (Grades 9-12)
                  </option>
                  <option value="All Campuses">All Campuses Broadcast</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#E69A2E] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#C9801E]"
                >
                  Publish & notify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
