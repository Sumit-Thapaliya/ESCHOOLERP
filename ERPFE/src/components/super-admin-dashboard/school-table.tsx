"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownUp,
  ArrowRight,
  Building2,
  Eye,
  SearchX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { rootDomain } from "@/lib/tenant-slug";
import type { ApiEnvelope, PublicTenantConfig } from "@/lib/api/types";
import type { School } from "./types";

function SchoolLogo({ school }: { school: School }) {
  const [failedUrl, setFailedUrl] = useState("");

  const { data: url } = useQuery({
    queryKey: [
      "platform",
      "school-logo",
      school.id,
      school.slug,
      school.customDomain,
    ],
    enabled: school.status === "active",
    retry: false,
    queryFn: async ({ signal }) => {
      const host = school.customDomain || `${school.slug}.${rootDomain()}`;
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
      ).replace(/\/+$/, "");

      const response = await fetch(
        `${baseUrl}/public/tenants/resolve?host=${encodeURIComponent(host)}`,
        {
          cache: "no-store",
          credentials: "omit",
          signal,
        }
      );

      if (!response.ok) {
        throw new Error("Could not load school logo");
      }

      const { data } =
        (await response.json()) as ApiEnvelope<PublicTenantConfig>;

      return data?.slug === school.slug && data.status === "active"
        ? data.logoUrl ?? null
        : null;
    },
  });

  return (
    <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary text-sm font-semibold text-secondary-foreground">
      {url && url !== failedUrl ? (
        <Image
          src={url}
          alt={`${school.name} logo`}
          width={36}
          height={36}
          unoptimized
          className="size-full object-contain p-1"
          onError={() => setFailedUrl(url)}
        />
      ) : (
        school.name.charAt(0)
      )}
    </span>
  );
}

export function SchoolTable({
  schools,
  total,
  query,
  statusFilter,
  onStatusFilter,
  sortAscending,
  onSort,
  overview = false,
  loading = false,
  error,
  onRetry,
  onAdd,
}: {
  schools: School[];
  total: number;
  query: string;
  statusFilter: string;
  onStatusFilter: (value: string) => void;
  sortAscending: boolean;
  onSort: () => void;
  overview?: boolean;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onAdd?: () => void;
}) {
  const filtered = Boolean(query) || statusFilter !== "all";

  return (
    <section id="schools" className="scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight">
            {overview ? "Recent school signups" : "School directory"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Schools registered on the platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
            {loading || error ? "—" : total}{" "}
            {total === 1 ? "school" : "schools"}
          </span>

          {overview && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard?section=schools">
                View more <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
          <p className="text-sm font-semibold text-foreground">
            {query ? `Search results for “${query}”` : "School directory"}
          </p>

          <div className="flex items-center gap-2">
            <select
              aria-label="Filter by school status"
              value={statusFilter}
              onChange={(event) => onStatusFilter(event.target.value)}
              className="h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="provisioning">Provisioning</option>
              <option value="suspended">Suspended</option>
              <option value="failed">Failed</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={onSort}
              aria-label={`Sort schools by name ${
                sortAscending ? "descending" : "ascending"
              }`}
            >
              <ArrowDownUp /> Name {sortAscending ? "A–Z" : "Z–A"}
            </Button>
          </div>
        </div>

        {loading ? (
          <div role="status" className="space-y-3 p-5">
            <span className="sr-only">Loading schools</span>
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : error ? (
          <div
            role="alert"
            className="flex min-h-44 flex-col items-center justify-center px-4 py-8 text-center"
          >
            <p className="text-sm font-semibold">Could not load schools</p>
            <p className="mt-1 max-w-md text-xs text-muted-foreground">
              {error}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={onRetry}
            >
              Try again
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead className="bg-muted/70 text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">
                      School
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Plan
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Branch
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Usage
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Joined
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-medium"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {schools.map((school) => (
                    <tr
                      key={school.id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <SchoolLogo school={school} />

                          <span>
                            <span className="block max-w-48 truncate font-semibold">
                              {school.name}
                            </span>
                            <span className="mt-0.5 block text-[11px] text-muted-foreground">
                              {school.slug}
                            </span>
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-muted-foreground">
                        {school.plan}
                      </td>

                      <td className="px-4 py-3.5 text-muted-foreground">
                        {school.branch}
                      </td>

                      <td className="px-4 py-3.5 text-muted-foreground">—</td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-secondary-foreground">
                          <span className="size-1.5 rounded-full bg-secondary-foreground" />
                          <span className="capitalize">{school.status}</span>
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                        {school.joined.slice(0, 10)}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/dashboard/schools/${encodeURIComponent(school.id)}`}
                          >
                            <Eye /> Details
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {schools.length === 0 && (
              <div className="flex min-h-48 flex-col items-center justify-center px-4 py-8 text-center">
                <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                  {filtered ? (
                    <SearchX className="size-5" />
                  ) : (
                    <Building2 className="size-5" />
                  )}
                </span>

                <p className="mt-3 text-sm font-semibold">
                  {filtered ? "No matching schools" : "No schools yet"}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {filtered
                    ? "Try a different search or filter."
                    : "Create a school to get started."}
                </p>

                {!filtered && onAdd && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={onAdd}
                  >
                    Add school
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}