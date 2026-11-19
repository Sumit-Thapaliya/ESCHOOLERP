"use client";

import { useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStudent, listCampuses, listStudents } from "@/lib/api/school";
import { authErrorMessage } from "@/lib/api/errors";
import type { AdmissionType, StudentStatus } from "@/lib/api/types";
import { schoolPath } from "@/lib/tenant-slug";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const STATUS_STYLE: Record<StudentStatus, string> = {
  active: "bg-teal-500/15 text-teal-700 dark:text-teal-400",
  applicant: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  alumni: "bg-muted text-muted-foreground",
  transferred_out: "bg-muted text-muted-foreground",
  dropped: "bg-red-500/15 text-red-700 dark:text-red-400",
  suspended: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const STATUSES: StudentStatus[] = [
  "applicant",
  "active",
  "alumni",
  "transferred_out",
  "dropped",
  "suspended",
];

const ADMISSION_TYPES: AdmissionType[] = ["new", "transfer_in", "readmission"];

/**
 * GET /students against the REAL API (the previous table rendered mock data).
 * Filters mirror exactly what the backend accepts: search (name contains, or
 * exact admission no / EMIS id), status, campusId, admissionType - plus
 * page/limit paging. Grade/section/fee filters from the design prototype do
 * not exist server-side and were removed rather than faked.
 *
 * Navigation stays smooth three ways: rows are next/link (route chunks
 * prefetch), the list query keeps previous data while filters change (no
 * flash of empty table), and hovering a row prefetches that student's detail
 * query so the profile route opens instantly.
 */
export function StudentsTable({ slug }: { slug: string }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchBox, setSearchBox] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StudentStatus | "">("");
  const [admissionType, setAdmissionType] = useState<AdmissionType | "">("");
  const [campusId, setCampusId] = useState("");

  const campuses = useQuery({
    queryKey: ["campuses"],
    queryFn: listCampuses,
    // A role without campus.read simply loses the campus filter, not the page.
    retry: false,
  });

  const { data, error, isFetching, refetch } = useQuery({
    queryKey: ["students", page, search, status, admissionType, campusId],
    queryFn: () =>
      listStudents({
        page,
        limit: PAGE_SIZE,
        ...(search && { search }),
        ...(status && { status }),
        ...(admissionType && { admissionType }),
        ...(campusId && { campusId }),
      }),
    placeholderData: keepPreviousData,
  });

  const pageCount = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  const selectClass =
    "h-10 rounded-xl border border-input bg-background px-3 text-[13px]";

  return (
    <div className="grid gap-3">
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearch(searchBox.trim());
        }}
      >
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchBox}
            onChange={(e) => setSearchBox(e.target.value)}
            placeholder="Name, admission no or EMIS id"
            className="h-10 rounded-xl pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as StudentStatus | "");
          }}
          className={selectClass}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={admissionType}
          onChange={(e) => {
            setPage(1);
            setAdmissionType(e.target.value as AdmissionType | "");
          }}
          className={selectClass}
          aria-label="Filter by admission type"
        >
          <option value="">All admission types</option>
          {ADMISSION_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {campuses.data && campuses.data.items.length > 0 && (
          <select
            value={campusId}
            onChange={(e) => {
              setPage(1);
              setCampusId(e.target.value);
            }}
            className={selectClass}
            aria-label="Filter by campus"
          >
            <option value="">All campuses</option>
            {campuses.data.items.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
        <Button type="submit" variant="outline" className="h-10 rounded-xl">
          Filter
        </Button>
      </form>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-[13px] text-destructive">
          {authErrorMessage(error)}
          <Button variant="ghost" size="sm" onClick={() => void refetch()}>
            <RefreshCw className="size-3.5" /> Retry
          </Button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-muted/60 text-[12px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5">Admission no</th>
              <th className="px-4 py-2.5">Student</th>
              <th className="px-4 py-2.5">Campus</th>
              <th className="px-4 py-2.5">Admitted</th>
              <th className="px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className={cn("divide-y", isFetching && "opacity-60")}>
            {!data && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {data && data.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No students match these filters.
                </td>
              </tr>
            )}
            {data?.items.map((s) => (
              <tr key={s.id} className="hover:bg-muted/40">
                <td className="px-4 py-3">
                  <Link
                    href={schoolPath(slug, `/students/${s.id}`)}
                    className="font-medium underline-offset-4 hover:underline"
                    // Warm the detail query before the click lands.
                    onMouseEnter={() => {
                      void queryClient.prefetchQuery({
                        queryKey: ["student", s.id],
                        queryFn: () => getStudent(s.id),
                      });
                    }}
                  >
                    {s.admissionNo}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{s.person.displayName}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {[s.person.gender, s.person.dob].filter(Boolean).join(" · ") || "—"}
                  </p>
                </td>
                <td className="px-4 py-3 text-[12.5px]">{s.campus?.name ?? "—"}</td>
                <td className="px-4 py-3 text-[12.5px] text-muted-foreground">
                  {s.admissionDate}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11.5px] font-medium ${STATUS_STYLE[s.status]}`}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[12.5px] text-muted-foreground">
        <span>
          {data ? `${data.total} student${data.total === 1 ? "" : "s"}` : ""}
          {data ? ` · page ${data.page} of ${pageCount}` : ""}
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="size-3.5" /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pageCount || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
