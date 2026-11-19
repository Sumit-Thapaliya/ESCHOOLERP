"use client";

import * as React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Printer, X, School } from "lucide-react";
import type { StudentDetail } from "@/lib/api/types";
import { initialsOfName } from "@/lib/initials";
import { useOptionalTenant } from "@/providers/tenant-provider";
import { schoolPath } from "@/lib/tenant-slug";
import { cn } from "cn";

interface StudentIdCardModalProps {
  student: StudentDetail | null;
  onClose: () => void;
}

/** First phone we can find for this student: guardian first, then their own. */
function emergencyPhoneOf(student: StudentDetail) {
  return (
    student.guardians.find((g) => g.isEmergencyContact)?.primaryPhone ??
    student.guardians.find((g) => g.isPrimary)?.primaryPhone ??
    student.guardians[0]?.primaryPhone ??
    student.person.contacts.find((c) => c.type === "phone")?.value ??
    null
  );
}

/**
 * Printable student identity card, built only from GET /students/{id}.
 *
 * Nothing on the card is typed in: the school name comes from the tenant, every
 * field from the student record, and the QR code is generated from this
 * student's real profile URL - scanning it opens this exact record (the ERP asks
 * for a login first, because student data is not public).
 *
 * Grade, section and roll number are deliberately absent rather than dashed:
 * they belong to the academics module, which has no backend yet, and an ID card
 * must never invent a roll number.
 */
export function StudentIdCardModal({ student, onClose }: StudentIdCardModalProps) {
  const tenantCtx = useOptionalTenant();
  const schoolName = tenantCtx?.tenant?.name ?? "School";

  // The QR payload is this student's real URL. window.location.origin only
  // exists in the browser, so it is read during render (this modal is only ever
  // mounted after a click, never on the server) and falls back to "".
  const profileUrl = React.useMemo(() => {
    if (!student) return "";
    const slug = tenantCtx?.slug;
    const path = slug ? schoolPath(slug, `/students/${student.id}`) : `/students/${student.id}`;
    return typeof window === "undefined" ? "" : `${window.location.origin}${path}`;
  }, [student, tenantCtx?.slug]);

  if (!student) return null;

  const person = student.person;
  const emergencyPhone = emergencyPhoneOf(student);

  const rows: { label: string; value: string }[] = [
    { label: "Admission No", value: student.admissionNo },
    { label: "Admission Date", value: student.admissionDate },
    { label: "Date of Birth", value: person.dob ?? "—" },
    { label: "Blood Group", value: person.bloodGroup ?? "—" },
    { label: "Gender", value: person.gender ?? "—" },
    { label: "Campus", value: student.campus?.name ?? "—" },
    { label: "Phone", value: person.contacts.find((c) => c.type === "phone")?.value ?? "—" },
    { label: "Emergency", value: emergencyPhone ?? "—" },
  ];
  if (student.emisId) rows.push({ label: "EMIS ID", value: student.emisId });

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-[14.5px] font-bold tracking-[-0.012em] text-slate-900">
              Student identity card
            </h3>
            <p className="mt-0.5 text-[12px] text-slate-500">
              Prints from the record shown on this page
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ------------------------------------------------- printable card */}
        <div className="my-5 flex justify-center">
          <div className="w-[304px] overflow-hidden rounded-xl border border-[#C9D8EC] bg-white shadow-md">
            {/* header */}
            <div className="bg-[#12294D] px-3 py-2.5 text-center text-white">
              <div className="mb-0.5 flex items-center justify-center gap-1.5">
                <School className="h-3.5 w-3.5 text-[#7FB0F0]" />
                <span className="text-[11.5px] font-bold tracking-wide">{schoolName}</span>
              </div>
              <p className="text-[9.5px] text-white/70">
                {student.campus?.name ?? "Campus not assigned"}
              </p>
            </div>

            <div className="px-3.5 py-3">
              {/* identity */}
              <div className="flex items-center gap-2.5">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-[#2570D3] bg-[#2570D3]/10 text-[17px] font-bold text-[#2570D3]">
                  {initialsOfName(person.displayName)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
                    {person.displayName}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-500">{student.admissionNo}</p>
                  <span
                    className={cn(
                      "mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-[2px] text-[9.5px] font-semibold capitalize",
                      student.status === "active"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-600"
                    )}
                  >
                    <span className="h-1 w-1 rounded-full bg-current" />
                    {student.status.replace(/_/g, " ").toLowerCase()}
                  </span>
                </div>
              </div>

              {/* real fields only */}
              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-y border-slate-100 py-2.5">
                {rows.map((row) => (
                  <div key={row.label} className="min-w-0">
                    <dt className="text-[9px] uppercase tracking-wide text-slate-400">
                      {row.label}
                    </dt>
                    <dd className="truncate text-[10.5px] font-semibold text-slate-800">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* QR + signature */}
              <div className="mt-2.5 flex items-end justify-between gap-2">
                <div className="text-center">
                  {profileUrl ? (
                    <QRCodeSVG
                      value={profileUrl}
                      size={76}
                      level="M"
                      marginSize={0}
                      bgColor="#FFFFFF"
                      fgColor="#12294D"
                      className="mx-auto block"
                      title={`Scan to open ${person.displayName}'s record`}
                    />
                  ) : (
                    // first paint, before window.location exists
                    <div className="h-[76px] w-[76px] rounded bg-slate-100" aria-hidden="true" />
                  )}
                  <p className="mt-1 text-[8px] leading-[1.3] text-slate-400">
                    Scan to open
                    <br />
                    this record
                  </p>
                </div>

                <div className="pb-1 text-right">
                  <div className="mb-0.5 h-3.5 w-20 border-b border-slate-300" />
                  <p className="text-[8px] text-slate-400">Principal signature</p>
                </div>
              </div>
            </div>

            <div className="h-1.5 w-full bg-[#2570D3]" />
          </div>
        </div>

        {/* ----------------------------------------------------- controls */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <p className="max-w-[190px] text-[11px] leading-snug text-slate-400">
            The QR opens this student&apos;s page, not a public file.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-[12.5px] text-slate-600 transition-colors hover:bg-slate-100"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#2570D3] px-3.5 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#1C5BB0]"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
