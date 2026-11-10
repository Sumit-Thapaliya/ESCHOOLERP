"use client";

import * as React from "react";
import { Printer, X, Download, School, QrCode } from "lucide-react";
import type { Student } from "./student-types";
import { useOptionalTenant } from "@/providers/tenant-provider";
import { toast } from "sonner";

interface StudentIdCardModalProps {
  student: Student | null;
  onClose: () => void;
}

export function StudentIdCardModal({ student, onClose }: StudentIdCardModalProps) {
  const tenantCtx = useOptionalTenant();
  const schoolName = tenantCtx?.tenant?.name ?? "Baudhika Academy";

  if (!student) return null;

  const handlePrint = () => {
    window.print();
    toast.success("Printing student identity card");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Student identity card
            </h3>
            <p className="text-xs text-slate-500">
              Official institutional pass (Session 2026/27)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Printable Card Canvas */}
        <div className="my-6 flex justify-center">
          <div className="w-80 rounded-xl border-2 border-[#12294D] bg-white overflow-hidden shadow-md">
            {/* ID Header */}
            <div className="bg-[#12294D] text-white p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <School className="h-4 w-4 text-[#2570D3]" />
                <span className="font-bold text-xs tracking-wide">
                  {schoolName}
                </span>
              </div>
              <p className="text-[10px] text-white/70">
                {student.campusName}
              </p>
            </div>

            {/* Photo & Badges */}
            <div className="p-4 flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2570D3]/10 border-2 border-[#2570D3] text-[#2570D3] text-xl font-bold mb-3 shadow-xs">
                {student.fullName.slice(0, 2).toUpperCase()}
              </div>

              <h4 className="text-base font-bold text-slate-900 text-center">
                {student.fullName}
              </h4>
              <span className="mt-0.5 rounded-full bg-[#2570D3]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#2570D3]">
                {student.grade} - Section {student.section}
              </span>

              {/* Grid Metadata */}
              <div className="mt-4 w-full grid grid-cols-2 gap-2 text-[11px] border-t border-b border-slate-100 py-2.5">
                <div>
                  <span className="text-slate-400">Roll number:</span>
                  <p className="font-semibold text-slate-800">{student.rollNo}</p>
                </div>
                <div>
                  <span className="text-slate-400">Admission ID:</span>
                  <p className="font-semibold text-slate-800 font-mono text-[10px]">
                    {student.admissionNo}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Blood group:</span>
                  <p className="font-semibold text-slate-800">{student.bloodGroup}</p>
                </div>
                <div>
                  <span className="text-slate-400">Emergency:</span>
                  <p className="font-semibold text-slate-800 text-[10px]">
                    {student.guardians[0]?.phone ?? "N/A"}
                  </p>
                </div>
              </div>

              {/* Barcode / QR Simulation */}
              <div className="mt-3 flex items-center justify-between w-full px-2">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <QrCode className="h-7 w-7 text-slate-700" />
                  <span className="text-[9px] font-mono leading-tight">
                    VALID UNTIL<br />CHAITRA 2083
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400">Principal Signature</p>
                  <p className="font-serif italic text-xs text-slate-700 font-semibold">
                    K.P. Adhikari
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer Stripe */}
            <div className="bg-[#2570D3] h-2 w-full" />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2570D3] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#1C5BB0] transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print ID card</span>
          </button>
        </div>
      </div>
    </div>
  );
}
