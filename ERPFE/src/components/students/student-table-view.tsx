"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Download,
  Printer,
  Upload,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
  Users,
  GraduationCap,
  Clock,
  CheckCircle2,
  Building2,
  List,
  LayoutGrid,
  MapPin,
} from "lucide-react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStudent, listCampuses, listStudents } from "@/lib/api/school";
import { schoolPath } from "@/lib/tenant-slug";
import type {
  AdmissionType,
  StudentDetail,
  StudentListItem,
  StudentStatus,
} from "@/lib/api/types";
import { useTenant } from "@/providers/tenant-provider";
import { useHasPermission } from "@/store/session-store";
import { AddStudentModal } from "./add-student-modal";
import { ImportStudentsModal } from "./import-students-modal";
import { StudentIdCardModal } from "./student-id-card-modal";
import { toast } from "sonner";
import { cn } from "cn";
import { initialsOfName } from "@/lib/initials";

const ADMISSION_TYPES: AdmissionType[] = ["new", "transfer_in", "readmission"];

const STATUS_BADGE: Record<StudentStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  applicant: "bg-sky-50 text-sky-700 border-sky-200",
  suspended: "bg-rose-50 text-rose-700 border-rose-200",
  dropped: "bg-rose-50 text-rose-700 border-rose-200",
  transferred_out: "bg-slate-100 text-slate-700 border-slate-200",
  alumni: "bg-slate-100 text-slate-700 border-slate-200",
};

type SortField = "name" | "admissionNo" | "admissionDate";
type ViewMode = "table" | "grid";

/** Declared outside render so React sees a stable component identity. */
function SortHeader({
  field,
  label,
  active,
  onToggle,
}: {
  field: SortField;
  label: string;
  active: boolean;
  onToggle: (f: SortField) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(field)}
      className="inline-flex items-center gap-1 cursor-pointer transition-colors hover:text-slate-900"
      title="Sorts this page"
    >
      <span>{label}</span>
      <ArrowUpDown className={cn("h-3 w-3", active ? "text-[#2570D3]" : "text-slate-300")} />
    </button>
  );
}

/** One number in the stat row. The value is always counted, never typed. */
function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number | null;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-[#DDE5F0] bg-white px-4 py-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EFF6FF] text-[#2570D3]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold leading-tight text-slate-900">
          {value === null ? "—" : value}
        </p>
        <p className="truncate text-[13px] text-slate-500">{label}</p>
      </div>
    </div>
  );
}

/**
 * Student directory on the real GET /students API.
 *
 * Filters, search and paging are server-side. Sorting runs on the current page
 * only, because the contract has no sort parameter. Two presentations share the
 * same data: a table for scanning and a grid for browsing - and in the grid the
 * whole card is the link to the profile, not just a word inside it.
 *
 * Every count on this screen comes from the API (`total`), never from
 * `rows.length`, so admitting or importing a student moves the numbers by
 * itself: the mutation handlers invalidate the ["students"] key, and the count
 * queries live under that same prefix.
 */
export function StudentTableView() {
  const { slug } = useTenant();
  const router = useRouter();
  const queryClient = useQueryClient();
  const canCreate = useHasPermission("student.create");

  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"" | StudentStatus>("");
  const [admissionType, setAdmissionType] = React.useState<"" | AdmissionType>("");
  const [campusId, setCampusId] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 8;
  const [view, setView] = React.useState<ViewMode>("table");

  const [sortField, setSortField] = React.useState<SortField>("name");
  const [sortAsc, setSortAsc] = React.useState(true);

  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);
  const [idCardStudent, setIdCardStudent] = React.useState<StudentDetail | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Debounce typing so every keystroke is not a server round-trip.
  React.useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const studentsQuery = useQuery({
    queryKey: ["students", { search, status, admissionType, campusId, page, pageSize, refreshKey }],
    queryFn: () =>
      listStudents({
        page,
        limit: pageSize,
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        ...(admissionType ? { admissionType } : {}),
        ...(campusId ? { campusId } : {}),
      }),
    placeholderData: keepPreviousData,
  });

  // Campus dropdown; hidden entirely if the role cannot list campuses.
  const campusesQuery = useQuery({
    queryKey: ["campuses"],
    queryFn: listCampuses,
    retry: false,
  });

  // The stat row asks the server for a count of each status: one row, read the
  // `total`. Three tiny requests beat paginating the whole directory to count.
  const applicantCount = useQuery({
    queryKey: ["students", "count", "applicant"],
    queryFn: () => listStudents({ limit: 1, status: "applicant" }),
    select: (page) => page.total,
  });
  const activeCount = useQuery({
    queryKey: ["students", "count", "active"],
    queryFn: () => listStudents({ limit: 1, status: "active" }),
    select: (page) => page.total,
  });

  const rows = React.useMemo(() => {
    const items = studentsQuery.data?.items ?? [];
    return [...items].sort((a, b) => {
      const pick = (s: StudentListItem) =>
        sortField === "name"
          ? s.person.displayName.toLowerCase()
          : sortField === "admissionNo"
            ? s.admissionNo.toLowerCase()
            : s.admissionDate;
      const cmp = pick(a) < pick(b) ? -1 : pick(a) > pick(b) ? 1 : 0;
      return sortAsc ? cmp : -cmp;
    });
  }, [studentsQuery.data, sortField, sortAsc]);

  const total = studentsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasFilters = Boolean(search || status || admissionType || campusId);

  const profileHref = (id: string) => schoolPath(slug, `/students/${id}`);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortAsc((v) => !v);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const openIdCard = async (id: string) => {
    try {
      const detail = await queryClient.ensureQueryData({
        queryKey: ["student", id],
        queryFn: () => getStudent(id),
      });
      setIdCardStudent(detail);
    } catch {
      toast.error("Could not load the full record for the ID card.");
    }
  };

  const prefetchProfile = (student: StudentListItem) => {
    void queryClient.prefetchQuery({
      queryKey: ["student", student.id],
      queryFn: () => getStudent(student.id),
    });
    router.prefetch(profileHref(student.id));
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setAdmissionType("");
    setCampusId("");
    setPage(1);
  };

  const emptyState = (
    <div className="px-4 py-14 text-center text-sm text-slate-400">
      <Users className="mx-auto mb-2 h-6 w-6 text-slate-300" />
      {hasFilters
        ? "No students match the current filters."
        : "No students yet. Admit the first one to see the directory come alive."}
    </div>
  );

  return (
    <div className="pb-12">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-[13px] text-slate-500">
            <Link
              href={schoolPath(slug, "/dashboard")}
              className="font-medium text-slate-600 transition-colors hover:text-[#2570D3]"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="font-semibold text-[#2570D3]">Student directory</span>
          </div>
          <h1 className="text-[27px] font-bold tracking-tight text-slate-900">Student directory</h1>
          <p className="mt-1 text-sm text-slate-500">
            Find and manage student enrollments, profiles, guardians, and academic history.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled
            title="Export arrives with the reports module"
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#DDE5F0] bg-white px-3.5 py-2 text-[13.5px] font-semibold text-slate-400"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>

          {canCreate && (
            <button
              type="button"
              onClick={() => setImportOpen(true)}
              className="relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-lg border border-[#DDE5F0] bg-white px-3.5 py-2 text-[13.5px] font-semibold text-slate-600 shadow-2xs transition-all duration-200 before:absolute before:inset-0 before:-translate-x-full before:bg-slate-100/70 before:transition-transform before:duration-500 hover:-translate-y-0.5 hover:border-[#C9DCF2] hover:before:translate-x-full"
            >
              <Upload className="relative h-4 w-4" />
              <span className="relative">Import from Excel</span>
            </button>
          )}

          {canCreate && (
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-lg bg-[#2570D3] px-3.5 py-2 text-[13.5px] font-semibold text-white shadow-xs transition-all duration-200 before:absolute before:inset-0 before:-translate-x-full before:bg-white/20 before:transition-transform before:duration-500 hover:-translate-y-0.5 hover:bg-[#1C5BB0] hover:before:translate-x-full"
            >
              <Plus className="relative h-4 w-4" />
              <span className="relative">Add student</span>
            </button>
          )}
        </div>
      </div>

      {/* Counts. Every value is a server total. */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={GraduationCap} value={total} label="Total students" />
        <StatCard icon={Clock} value={applicantCount.data ?? null} label="Applicants" />
        <StatCard icon={CheckCircle2} value={activeCount.data ?? null} label="Active" />
        <StatCard icon={Building2} value={campusesQuery.data?.items.length ?? null} label="Campuses" />
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-2xl border border-[#DDE5F0] bg-white p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex h-[38px] items-center rounded-xl bg-slate-100 p-0.5">
            {(
              [
                { value: "", label: "All", count: total },
                { value: "applicant", label: "Applicants", count: applicantCount.data ?? null },
                { value: "active", label: "Active", count: activeCount.data ?? null },
              ] as const
            ).map((tab) => (
              <button
                key={tab.label}
                type="button"
                aria-pressed={status === tab.value}
                onClick={() => {
                  setStatus(tab.value);
                  setPage(1);
                }}
                className={cn(
                  "inline-flex h-[34px] cursor-pointer items-center gap-1.5 rounded-lg px-3 text-[13.5px] font-semibold transition-all duration-150",
                  status === tab.value
                    ? "bg-white text-[#2570D3] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className={cn("text-xs font-bold", status === tab.value ? "text-[#2570D3]/80" : "text-slate-400")}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative h-[38px] min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name or exact admission / EMIS number"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-[38px] w-full rounded-xl border border-slate-200 pl-9 pr-3 text-[13.5px] text-slate-900 outline-hidden transition-shadow focus:border-[#2570D3] focus:ring-3 focus:ring-[#2570D3]/12 placeholder:text-slate-400"
            />
          </div>

          <select
            value={admissionType}
            onChange={(e) => {
              setAdmissionType(e.target.value as "" | AdmissionType);
              setPage(1);
            }}
            className="h-[38px] min-w-[168px] rounded-xl border border-slate-200 bg-white px-3 text-[13.5px] text-slate-700 outline-hidden focus:border-[#2570D3]"
          >
            <option value="">All admission types</option>
            {ADMISSION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </select>

          {campusesQuery.data && (
            <select
              value={campusId}
              onChange={(e) => {
                setCampusId(e.target.value);
                setPage(1);
              }}
              className="h-[38px] min-w-[160px] rounded-xl border border-slate-200 bg-white px-3 text-[13.5px] text-slate-700 outline-hidden focus:border-[#2570D3]"
            >
              <option value="">All campuses</option>
              {campusesQuery.data.items.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="h-[38px] cursor-pointer rounded-xl px-2.5 text-[13px] font-semibold text-[#2570D3] transition-colors hover:bg-[#2570D3]/8"
            >
              Clear
            </button>
          )}

          <div className="ml-auto flex h-[38px] items-center gap-2" role="group" aria-label="View">
            <button
              type="button"
              aria-pressed={view === "table"}
              aria-label="List view"
              title="List view"
              onClick={() => setView("table")}
              className={cn(
                "grid h-[38px] w-[38px] cursor-pointer place-items-center rounded-xl border transition-all duration-150",
                view === "table"
                  ? "border-[#BFD6F2] bg-[#EFF6FF] text-[#2570D3] shadow-[inset_0_0_0_1px_#BFD6F2]"
                  : "border-slate-200 bg-white text-slate-400 hover:-translate-y-0.5 hover:border-[#BFD6F2] hover:text-[#2570D3]"
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-pressed={view === "grid"}
              aria-label="Grid view"
              title="Grid view"
              onClick={() => setView("grid")}
              className={cn(
                "grid h-[38px] w-[38px] cursor-pointer place-items-center rounded-xl border transition-all duration-150",
                view === "grid"
                  ? "border-[#BFD6F2] bg-[#EFF6FF] text-[#2570D3] shadow-[inset_0_0_0_1px_#BFD6F2]"
                  : "border-slate-200 bg-white text-slate-400 hover:-translate-y-0.5 hover:border-[#BFD6F2] hover:text-[#2570D3]"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-[#DDE5F0] bg-white shadow-2xs">
        {studentsQuery.isLoading ? (
          <div className="px-4 py-14 text-center text-sm text-slate-400">Loading students…</div>
        ) : studentsQuery.error ? (
          <div className="px-4 py-14 text-center text-sm text-[#D64545]">
            Could not load students. Check your session and permissions.
          </div>
        ) : rows.length === 0 ? (
          emptyState
        ) : view === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#EDF2F8] bg-[#FBFDFF] text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">
                    <SortHeader field="name" label="Student" active={sortField === "name"} onToggle={toggleSort} />
                  </th>
                  <th className="px-4 py-3">Campus</th>
                  <th className="px-4 py-3">
                    <SortHeader field="admissionNo" label="Admission no" active={sortField === "admissionNo"} onToggle={toggleSort} />
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader field="admissionDate" label="Admitted" active={sortField === "admissionDate"} onToggle={toggleSort} />
                  </th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {rows.map((student) => (
                  <tr
                    key={student.id}
                    className="transition-colors hover:bg-[#F8FBFF]"
                    onMouseEnter={() => prefetchProfile(student)}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-xl bg-[#12294D] text-xs font-bold text-white">
                          {initialsOfName(student.person.displayName)}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={profileHref(student.id)}
                            className="font-semibold text-slate-900 transition-colors hover:text-[#2570D3]"
                          >
                            {student.person.displayName}
                          </Link>
                          <p className="text-[12.5px] text-slate-400">
                            {student.person.gender ?? "—"}
                            {student.person.dob ? ` · born ${student.person.dob}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {student.campus?.name ?? <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[13px]">{student.admissionNo}</span>
                      <p className="text-[12.5px] text-slate-400">
                        {student.emisId ? `EMIS ${student.emisId}` : "No EMIS yet"}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      {student.admissionDate}
                      <p className="text-[12.5px] text-slate-400">
                        {student.admissionType.replace("_", " ")}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                          STATUS_BADGE[student.status]
                        )}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                        {student.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={profileHref(student.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#CFE0F5] bg-white px-2.5 py-1.5 text-[13px] font-semibold text-[#2570D3] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2570D3] hover:text-white"
                        >
                          Profile
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => void openIdCard(student.id)}
                          title="Print identity card"
                          aria-label={`Print the identity card of ${student.person.displayName}`}
                          className="grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#BFD6F2] hover:bg-[#F5FAFF] hover:text-[#2570D3]"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-[18px] p-[18px] sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((student) => (
              <article
                key={student.id}
                role="link"
                tabIndex={0}
                aria-label={`Open the profile of ${student.person.displayName}`}
                onClick={() => router.push(profileHref(student.id))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(profileHref(student.id));
                  }
                }}
                onMouseEnter={() => prefetchProfile(student)}
                className="group flex cursor-pointer flex-col gap-[18px] rounded-2xl border border-[#DDE5F0] bg-white p-5 outline-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DCF2] hover:shadow-xs focus-visible:border-[#2570D3] focus-visible:ring-3 focus-visible:ring-[#2570D3]/20"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl bg-[#12294D] text-sm font-bold text-white transition-colors group-hover:bg-[#173B69]">
                    {initialsOfName(student.person.displayName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[15.5px] font-semibold leading-tight text-slate-900 transition-colors group-hover:text-[#2570D3]">
                      {student.person.displayName}
                    </h3>
                    <p className="mt-0.5 truncate font-mono text-[12.5px] text-slate-400">
                      {student.admissionNo}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                      STATUS_BADGE[student.status]
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                    {student.status.replace("_", " ")}
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-[13px] text-slate-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                  <span className={cn("truncate", !student.campus && "italic text-slate-300")}>
                    {student.campus?.name ?? "No campus yet"}
                  </span>
                  <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-slate-300" />
                  <span className="shrink-0">{student.admissionDate}</span>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2570D3]">
                    View profile
                    <ChevronRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      void openIdCard(student.id);
                    }}
                    title="Print identity card"
                    aria-label={`Print the identity card of ${student.person.displayName}`}
                    className="grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#BFD6F2] hover:bg-[#F5FAFF] hover:text-[#2570D3]"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EDF2F8] px-4 py-3.5 text-[13.5px] text-slate-500">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {total === 0 ? 0 : (page - 1) * pageSize + 1}
            </span>{" "}
            to <span className="font-semibold text-slate-800">{Math.min(page * pageSize, total)}</span> of{" "}
            <span className="font-semibold text-slate-800">{total}</span> students
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || studentsQuery.isPlaceholderData}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex h-[34px] cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#BFD6F2] hover:text-[#2570D3] disabled:pointer-events-none disabled:opacity-45"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <span className="px-1">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || studentsQuery.isPlaceholderData}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex h-[34px] cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#BFD6F2] hover:text-[#2570D3] disabled:pointer-events-none disabled:opacity-45"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {importOpen && (
        <ImportStudentsModal
          onClose={() => setImportOpen(false)}
          onImported={() => {
            // Refresh the directory behind the modal, but stay open: the run
            // report and the "download error report" button live on the last
            // screen, and closing here would throw them away.
            void queryClient.invalidateQueries({ queryKey: ["students"] });
          }}
        />
      )}

      <AddStudentModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onStudentCreated={() => {
          setRefreshKey((k) => k + 1);
          void queryClient.invalidateQueries({ queryKey: ["students"] });
        }}
      />

      <StudentIdCardModal student={idCardStudent} onClose={() => setIdCardStudent(null)} />
    </div>
  );
}
