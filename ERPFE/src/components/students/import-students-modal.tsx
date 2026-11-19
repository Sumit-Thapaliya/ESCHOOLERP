"use client";

import * as React from "react";
import {
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useQuery } from "@tanstack/react-query";
import { createStudent, linkGuardian, listCampuses } from "@/lib/api/school";
import type { CreateStudentInput, GuardianRelation } from "@/lib/api/types";
import { toast } from "sonner";
import { cn } from "cn";

const GENDERS = ["male", "female", "other"];
const BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const ADMIT_TYPES = ["new", "transfer_in", "readmission"];
/** Must match the server's guardian_relation enum. */
const RELATIONS = ["father", "mother", "legal_guardian", "grandparent", "uncle_aunt", "other"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_RE = /^\+?[0-9]{7,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** One spreadsheet row after parsing, before validation. */
type RawRow = Record<string, unknown>;

type ParsedRow = {
  /** 1-based sheet row, for error reports that match what staff see. */
  n: number;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  admissionDate: string;
  admissionType: string;
  campusKey: string;
  emisId: string;
  previousSchoolName: string;
  previousTcNo: string;
  phone: string;
  email: string;
  municipality: string;
  district: string;
  birthPlace: string;
  motherTongue: string;
  nationality: string;
  remarks: string;
  specialNeeds: boolean;
  /** Guardian columns: all four empty means "admit the student alone". */
  guardianFirstName: string;
  guardianLastName: string;
  guardianRelation: string;
  guardianPhone: string;
  errors: string[];
};

type RowResult = { n: number; name: string; ok: boolean; detail: string };

function normKey(k: string): string {
  return k.trim().toLowerCase().replace(/\s+/g, "_").replace(/\*$/, "");
}

function toStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).trim();
}

/** Excel may hand us a real Date, a YYYY-MM-DD string, or a serial number. */
function toDateStr(v: unknown): string {
  if (v === null || v === undefined || v === "") return "";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = String(v).trim();
  if (DATE_RE.test(s)) return s;
  if (/^\d+(\.\d+)?$/.test(s)) {
    // Excel serial date.
    const d = XLSX.SSF.parse_date_code(Number(s));
    if (d) {
      const mm = String(d.m).padStart(2, "0");
      const dd = String(d.d).padStart(2, "0");
      return `${d.y}-${mm}-${dd}`;
    }
  }
  return `INVALID:${s}`;
}

function parseRows(sheet: XLSX.WorkSheet): ParsedRow[] {
  const raw = XLSX.utils.sheet_to_json<RawRow>(sheet, { defval: "" });
  return raw.map((r, i) => {
    const row: RawRow = {};
    for (const [k, v] of Object.entries(r)) row[normKey(k)] = v;
    const get = (k: string) => toStr(row[k]);
    return {
      n: i + 2, // header is row 1
      firstName: get("first_name"),
      middleName: get("middle_name"),
      lastName: get("last_name"),
      gender: get("gender").toLowerCase(),
      dob: toDateStr(row["date_of_birth"] ?? row["dob"]),
      bloodGroup: get("blood_group"),
      admissionDate: toDateStr(row["admission_date"]),
      admissionType: (get("admission_type") || "new").toLowerCase(),
      campusKey: get("campus").toLowerCase(),
      emisId: get("emis_id"),
      previousSchoolName: get("previous_school_name"),
      previousTcNo: get("previous_tc_no"),
      phone: get("phone").replace(/[\s()-]/g, ""),
      email: get("email").toLowerCase(),
      municipality: get("municipality"),
      district: get("district"),
      birthPlace: get("birth_place"),
      motherTongue: get("mother_tongue"),
      nationality: get("nationality"),
      remarks: get("remarks"),
      specialNeeds: ["yes", "true", "1"].includes(get("has_special_needs").toLowerCase()),
      guardianFirstName: get("guardian_first_name"),
      guardianLastName: get("guardian_last_name"),
      guardianRelation: (get("guardian_relation") || "father").toLowerCase(),
      guardianPhone: get("guardian_phone").replace(/[\s()-]/g, ""),
      errors: [],
    };
  });
}

function validateRow(
  row: ParsedRow,
  campusIds: Map<string, string>,
  campusReady: boolean,
): void {
  const e = row.errors;
  if (!row.firstName) e.push("first_name is required");
  if (!GENDERS.includes(row.gender)) e.push("gender must be male, female or other");
  if (!row.admissionDate || row.admissionDate.startsWith("INVALID"))
    e.push("admission_date must be a real date written as YYYY-MM-DD");
  else if (row.admissionDate > new Date().toISOString().slice(0, 10))
    e.push("admission_date cannot be in the future");
  if (!row.dob) e.push("date_of_birth is required for a student");
  if (row.dob.startsWith("INVALID")) e.push("date_of_birth must be YYYY-MM-DD");
  if (row.dob && !row.dob.startsWith("INVALID") && row.dob > new Date().toISOString().slice(0, 10))
    e.push("date_of_birth cannot be in the future");
  if (row.bloodGroup && !BLOOD.includes(row.bloodGroup))
    e.push("blood_group must be one of the eight groups");
  if (!ADMIT_TYPES.includes(row.admissionType))
    e.push("admission_type must be new, transfer_in or readmission");
  if (!row.campusKey) e.push("campus is required");
  else if (campusReady && !campusIds.has(row.campusKey))
    e.push(`campus not found in this school: "${row.campusKey}"`);
  if (row.admissionType === "transfer_in") {
    if (!row.previousSchoolName) e.push("transfer_in needs previous_school_name");
    if (!row.previousTcNo) e.push("transfer_in needs previous_tc_no");
  }
  if (row.phone && !PHONE_RE.test(row.phone)) e.push("phone must be 7-15 digits, optional leading +");
  if (row.email && !EMAIL_RE.test(row.email)) e.push("email looks invalid");

  // Guardian: optional as a block, strict once started.
  const guardianStarted = !!(row.guardianFirstName || row.guardianLastName || row.guardianPhone);
  if (guardianStarted) {
    if (!row.guardianFirstName) e.push("guardian_first_name is required when a guardian is given");
    if (!row.guardianPhone)
      e.push("guardian_phone is required when a guardian is given");
    else if (!PHONE_RE.test(row.guardianPhone))
      e.push("guardian_phone must be 7-15 digits, optional leading +");
    if (!RELATIONS.includes(row.guardianRelation))
      e.push("guardian_relation must be father, mother, legal_guardian, grandparent, uncle_aunt or other");
  }
}

/**
 * Bulk admission from the locked Excel template. The file never leaves the
 * browser: it is parsed here, validated against the same rules the server
 * enforces, previewed, and then admitted one honest POST /students per row.
 */
export function ImportStudentsModal({
  onClose,
  onImported,
}: {
  onClose: () => void;
  onImported: (created: number) => void;
}) {
  const campusesQuery = useQuery({ queryKey: ["campuses"], queryFn: listCampuses });

  const [rows, setRows] = React.useState<ParsedRow[] | null>(null);
  const [fileName, setFileName] = React.useState("");
  const [parseError, setParseError] = React.useState("");
  const [phase, setPhase] = React.useState<"pick" | "preview" | "running" | "done">("pick");
  const [progress, setProgress] = React.useState({ done: 0, ok: 0, failed: 0 });
  const [results, setResults] = React.useState<RowResult[]>([]);
  const cancelRef = React.useRef(false);

  const campusIds = React.useMemo(() => {
    const m = new Map<string, string>();
    for (const c of campusesQuery.data?.items ?? []) {
      m.set(c.name.toLowerCase(), c.id);
      m.set(c.code.toLowerCase(), c.id);
    }
    return m;
  }, [campusesQuery.data]);

  const handleFile = async (file: File) => {
    setParseError("");
    setFileName(file.name);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { cellDates: true });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      if (!sheet) throw new Error("empty workbook");
      const parsed = parseRows(sheet).filter(
        (r) => r.firstName || r.lastName || r.admissionDate || r.campusKey,
      );
      if (parsed.length === 0) {
        setParseError("No student rows found. Fill the Students sheet of the template first.");
        return;
      }
      setRows(parsed);
      setPhase("preview");
    } catch {
      setParseError("That file could not be read as an Excel sheet. Use the template.");
    }
  };

  // Validation runs as a pure derivation: same rows + same campus list always
  // produce the same verdicts, and it re-runs the moment campuses arrive.
  const validatedRows = React.useMemo(() => {
    if (!rows) return null;
    return rows.map((r) => {
      const copy: ParsedRow = { ...r, errors: [] };
      validateRow(copy, campusIds, campusesQuery.isSuccess);
      return copy;
    });
  }, [rows, campusIds, campusesQuery.isSuccess]);

  const readyRows = (validatedRows ?? []).filter((r) => r.errors.length === 0);
  const badRows = (validatedRows ?? []).filter((r) => r.errors.length > 0);

  const runImport = async () => {
    setPhase("running");
    setProgress({ done: 0, ok: 0, failed: 0 });
    setResults([]);
    cancelRef.current = false;

    const queue = [...readyRows];
    const collected: RowResult[] = [];
    let ok = 0;
    let failed = 0;
    let done = 0;

    const worker = async () => {
      while (queue.length > 0) {
        if (cancelRef.current) return;
        const row = queue.shift();
        if (!row) return;
        const campusId = campusIds.get(row.campusKey);
        const input: CreateStudentInput = {
          person: {
            firstName: row.firstName,
            middleName: row.middleName || undefined,
            lastName: row.lastName || undefined,
            gender: row.gender as CreateStudentInput["person"]["gender"],
            dob: row.dob || undefined,
            bloodGroup: row.bloodGroup || undefined,
            birthPlace: row.birthPlace || undefined,
            motherTongue: row.motherTongue || undefined,
            nationality: row.nationality || undefined,
            contacts: [
              ...(row.phone ? [{ type: "phone", value: row.phone, isPrimary: true }] : []),
              ...(row.email ? [{ type: "email", value: row.email, isPrimary: !row.phone }] : []),
            ],
            addresses:
              row.municipality || row.district
                ? [
                    {
                      type: "current",
                      municipality: row.municipality || undefined,
                      district: row.district || undefined,
                    },
                  ]
                : undefined,
          },
          campusId: campusId ?? undefined,
          admissionDate: row.admissionDate,
          admissionType: row.admissionType as CreateStudentInput["admissionType"],
          emisId: row.emisId || undefined,
          previousSchoolName: row.previousSchoolName || undefined,
          previousTcNo: row.previousTcNo || undefined,
          hasSpecialNeeds: row.specialNeeds,
          remarks: row.remarks || undefined,
        };
        const name = `${row.firstName} ${row.lastName}`.trim();
        try {
          const created = await createStudent(input);

          // Second call, same row: link the parent typed into the guardian
          // columns. A student is never rolled back because a parent failed -
          // the row keeps its admission number and carries the reason instead.
          let guardianNote = "";
          if (row.guardianFirstName) {
            try {
              await linkGuardian(created.id, {
                relation: row.guardianRelation as GuardianRelation,
                isPrimary: true,
                isEmergencyContact: true,
                canPickup: true,
                canPayFees: true,
                guardian: {
                  person: {
                    firstName: row.guardianFirstName,
                    lastName: row.guardianLastName || null,
                    contacts: [{ type: "phone", value: row.guardianPhone, isPrimary: true }],
                  },
                },
              });
              guardianNote = ` + ${row.guardianFirstName} ${row.guardianRelation}`;
            } catch (linkErr) {
              const why = linkErr instanceof Error ? linkErr.message : "refused";
              guardianNote = ` (guardian not linked: ${why})`;
            }
          }

          ok += 1;
          collected.push({ n: row.n, name, ok: true, detail: `${created.admissionNo}${guardianNote}` });
        } catch (err) {
          failed += 1;
          const msg = err instanceof Error ? err.message : "unknown error";
          collected.push({
            n: row.n,
            name,
            ok: false,
            detail: msg.includes("already") ? "duplicate student" : msg,
          });
        }
        done += 1;
        setProgress({ done, ok, failed });
        setResults([...collected]);
      }
    };

    await Promise.all([worker(), worker(), worker()]);
    setResults([...collected]);
    setPhase("done");
    if (ok > 0) {
      toast.success(`${ok} student${ok === 1 ? "" : "s"} admitted.`);
      onImported(ok);
    }
    if (failed > 0) toast.error(`${failed} row${failed === 1 ? "" : "s"} failed - download the report.`);
  };

  const downloadErrorReport = () => {
    const failedResults = results.filter((r) => !r.ok);
    const badPreview = phase === "preview" ? badRows : [];
    const lines = ["sheet_row,name,reason"];
    for (const r of badPreview)
      lines.push(`${r.n},"${`${r.firstName} ${r.lastName}`.trim()}","${r.errors.join("; ")}"`);
    for (const r of failedResults) lines.push(`${r.n},"${r.name}","${r.detail}"`);
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student-import-errors.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const total = rows?.length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-[#2570D3]" />
            <h3 className="font-semibold text-sm text-slate-900">Import students from Excel</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={phase === "running"}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {phase === "pick" && (
          <div className="pt-5 space-y-4">
            <div className="rounded-xl border border-[#DDE5F0] bg-slate-50/60 p-4 space-y-3">
              <p className="text-[13px] text-slate-600">
                1. Download the template - its required columns and dropdowns are enforced by
                Excel itself. 2. Fill the <strong>Students</strong> sheet. 3. Choose the file here.
                Nothing is uploaded anywhere: the sheet is read in your browser and admitted row
                by row through the normal admission endpoint.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/templates/students-import-template.xlsx"
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5F0] bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" />
                  Download template
                </a>
                <label className="inline-flex items-center gap-1.5 rounded-lg bg-[#2570D3] px-3.5 py-1.5 text-[13px] font-medium text-white shadow-xs hover:bg-[#1C5BB0] cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Choose filled file
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleFile(f);
                    }}
                  />
                </label>
              </div>
              {parseError && <p className="text-xs text-[#D64545]">{parseError}</p>}
              <p className="text-[11px] text-slate-500">
                Guardians, health records and documents are not part of this import - add them
                later from each student&apos;s profile. Admission numbers are generated by the
                server and every imported student starts as an applicant.
              </p>
            </div>
          </div>
        )}

        {phase === "preview" && rows && (
          <div className="pt-4 space-y-4">
            <p className="text-[13px] text-slate-600">
              <strong>{fileName}</strong>: {total} rows -{" "}
              <span className="text-emerald-700">{readyRows.length} ready</span>,{" "}
              <span className={badRows.length ? "text-[#D64545]" : "text-slate-500"}>
                {badRows.length} with problems
              </span>
              . Problem rows are skipped, not guessed at.
            </p>
            <div className="max-h-72 overflow-y-auto rounded-xl border border-[#DDE5F0]">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-slate-50">
                  <tr className="border-b border-[#DDE5F0]">
                    <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Row</th>
                    <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Student</th>
                    <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Campus</th>
                    <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {(validatedRows ?? []).map((r) => (
                    <tr key={r.n} className="border-b border-slate-100 last:border-0">
                      <td className="px-3 py-2 text-xs text-slate-500">{r.n}</td>
                      <td className="px-3 py-2 text-[13px] font-medium text-slate-800">
                        {r.firstName} {r.lastName}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-600">{r.campusKey || "-"}</td>
                      <td className="px-3 py-2">
                        {r.errors.length === 0 ? (
                          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            ready
                          </span>
                        ) : (
                          <span
                            className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700"
                            title={r.errors.join("; ")}
                          >
                            {r.errors[0]}
                            {r.errors.length > 1 ? ` +${r.errors.length - 1}` : ""}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setRows(null);
                  setPhase("pick");
                }}
                className="rounded-lg border border-[#DDE5F0] bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50"
              >
                Choose a different file
              </button>
              <div className="flex gap-2">
                {badRows.length > 0 && (
                  <button
                    type="button"
                    onClick={downloadErrorReport}
                    className="rounded-lg border border-[#DDE5F0] bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50"
                  >
                    Download problem list
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void runImport()}
                  disabled={readyRows.length === 0 || campusesQuery.isLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#2570D3] px-3.5 py-1.5 text-[13px] font-medium text-white shadow-xs hover:bg-[#1C5BB0] disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Upload className="h-4 w-4" />
                  Admit {readyRows.length} student{readyRows.length === 1 ? "" : "s"}
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === "running" && (
          <div className="pt-6 space-y-4">
            <p className="text-[13px] text-slate-600">
              Admitting... {progress.done} of {readyRows.length} processed -{" "}
              <span className="text-emerald-700">{progress.ok} admitted</span>,{" "}
              <span className="text-[#D64545]">{progress.failed} failed</span>.
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-[#2570D3] transition-all"
                style={{
                  width: `${Math.round((progress.done / Math.max(1, readyRows.length)) * 100)}%`,
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                cancelRef.current = true;
              }}
              className="rounded-lg border border-[#DDE5F0] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#D64545] shadow-2xs hover:bg-rose-50"
            >
              Stop after the current rows
            </button>
          </div>
        )}

        {phase === "done" && (
          <div className="pt-5 space-y-4">
            <p className="text-[13px] text-slate-600">
              Finished: <span className="text-emerald-700">{progress.ok} admitted</span>,{" "}
              <span className={progress.failed ? "text-[#D64545]" : ""}>
                {progress.failed} failed
              </span>
              . Admission numbers were generated by the server; new students start as
              applicants.
            </p>
            {progress.failed > 0 && (
              <button
                type="button"
                onClick={downloadErrorReport}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5F0] bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Download error report
              </button>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "rounded-lg bg-[#2570D3] px-3.5 py-1.5 text-[13px] font-medium text-white shadow-xs hover:bg-[#1C5BB0]",
                )}
              >
                Back to the directory
              </button>
            </div>
            {results.length > 0 && (
              <div className="max-h-48 overflow-y-auto rounded-xl border border-[#DDE5F0]">
                <table className="w-full text-left">
                  <tbody>
                    {results.map((r) => (
                      <tr key={`${r.n}-${r.detail}`} className="border-b border-slate-100 last:border-0">
                        <td className="px-3 py-1.5 text-xs text-slate-500">{r.n}</td>
                        <td className="px-3 py-1.5 text-xs font-medium text-slate-800">{r.name}</td>
                        <td
                          className={cn(
                            "px-3 py-1.5 text-xs",
                            r.ok ? "text-emerald-700" : "text-[#D64545]",
                          )}
                        >
                          {r.detail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {phase === "running" && (
          <p className="pt-3 flex items-center gap-2 text-[11px] text-slate-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            Each row is its own admission - one failure never stops the next row.
          </p>
        )}
      </div>
    </div>
  );
}
