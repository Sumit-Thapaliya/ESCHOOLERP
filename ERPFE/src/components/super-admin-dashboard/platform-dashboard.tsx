"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, MotionConfig } from "framer-motion";
import {
  Building2,
  Database,
  Plus,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardShell } from "./shell";
import { SchoolTable } from "./school-table";
import { AddSchoolDialog } from "./school-dialogs";
import { toApiError } from "@/lib/api/errors";
import { toSchool, useSchools } from "./hooks/use-schools";
import { PlansSection } from "./sections/plans";
import {
  AuditSection,
  BillingSection,
  ReportsSection,
  SettingsSection,
} from "./sections/operations";
import { SectionHeader } from "./sections/shared";
import type { PlatformSection } from "./types";

const metrics = [
  {
    title: "Total schools",
    detail: "Schools on the platform",
    icon: Building2,
    tone: "var(--primary)",
  },
  {
    title: "Active users",
    detail: "Across all schools",
    icon: Users,
    tone: "var(--teal)",
  },
  {
    title: "Monthly revenue",
    detail: "Recurring revenue",
    icon: Wallet,
    tone: "var(--highlight)",
  },
  {
    title: "Storage used",
    detail: "Across all schools",
    icon: Database,
    tone: "var(--tertiary)",
  },
];

export function PlatformDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const sectionParam = searchParams.get("section");
  const sections: PlatformSection[] = [
    "overview",
    "schools",
    "plans",
    "billing",
    "reports",
    "audit",
    "settings",
  ];
  const section = sections.find((item) => item === sectionParam) || "overview";
  function setSection(next: PlatformSection) {
    router.push(
      next === "overview" ? "/dashboard" : `/dashboard?section=${next}`,
    );
  }
  const [addOpen, setAddOpen] = useState(false);
  const schoolsQuery = useSchools();
  const realSchools = useMemo(
    () => (schoolsQuery.data ?? []).map(toSchool),
    [schoolsQuery.data],
  );
  const listError = schoolsQuery.error
    ? toApiError(schoolsQuery.error).isNetworkError
      ? "Cannot reach the backend. Check that the server is running and try again."
      : toApiError(schoolsQuery.error).message
    : undefined;
  const [sortAscending, setSortAscending] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const visibleSchools = useMemo(() => {
    const query = search.trim().toLowerCase();
    return realSchools
      .filter(
        (school) =>
          (statusFilter === "all" || statusFilter === school.status) &&
          (!query ||
            school.name.toLowerCase().includes(query) ||
            school.slug.includes(query)),
      )
      .sort((a, b) =>
        sortAscending
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      );
  }, [realSchools, search, sortAscending, statusFilter]);

  const recentSchools = useMemo(
    () =>
      [...visibleSchools]
        .sort((a, b) => b.joined.localeCompare(a.joined))
        .slice(0, 5)
        .sort((a, b) =>
          sortAscending
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name),
        ),
    [visibleSchools, sortAscending],
  );

  return (
    <MotionConfig reducedMotion="user">
      <DashboardShell
        search={search}
        onSearch={(value) => {
          setSearch(value);
          if (value && section !== "schools") setSection("schools");
        }}
        activeSection={section}
        onSelect={setSection}
      >
        <motion.div
          id="overview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-7 sm:px-6 lg:px-8 lg:py-9"
        >
          {section === "overview" && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                    <span>Platform Super Admin</span>
                    <span>/</span>
                    <span className="font-semibold text-primary">
                      Dashboard
                    </span>
                  </div>
                  <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-[30px]">
                    Welcome back
                  </h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Here’s an overview of your schools and platform.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  size="lg"
                  className="h-10 gap-2 px-4 shadow-sm"
                >
                  <Plus /> Add school
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map(({ title, detail, icon: Icon, tone }, index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                  >
                    <Card
                      className="relative h-full min-h-40 gap-0 border border-border p-5 ring-0 transition-shadow hover:shadow-md sm:p-6"
                      style={{
                        background: `linear-gradient(135deg, color-mix(in srgb, ${tone} 14%, var(--card)), var(--card) 75%)`,
                      }}
                    >
                      <span
                        className="absolute top-0 left-6 h-1 w-12 rounded-b-full"
                        style={{ backgroundColor: tone }}
                        aria-hidden="true"
                      />
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[13px] font-semibold text-foreground">
                          {title}
                        </span>
                        <span
                          className="grid size-10 shrink-0 place-items-center rounded-xl text-foreground"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${tone} 18%, var(--card))`,
                          }}
                        >
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                      </div>
                      <p
                        className="mt-4 text-3xl font-bold tracking-tight tabular-nums"
                        aria-label={
                          title === "Total schools" && schoolsQuery.data
                            ? `${title}: ${realSchools.length}`
                            : `${title}: not connected`
                        }
                      >
                        {title === "Total schools" &&
                        schoolsQuery.data &&
                        !schoolsQuery.error
                          ? realSchools.length
                          : "—"}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {detail}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="mt-9">
                <SchoolTable
                  overview
                  schools={recentSchools}
                  total={realSchools.length}
                  loading={schoolsQuery.isPending}
                  error={listError}
                  onRetry={() => {
                    void schoolsQuery.refetch();
                  }}
                  onAdd={() => setAddOpen(true)}
                  query={search.trim()}
                  statusFilter={statusFilter}
                  onStatusFilter={setStatusFilter}
                  sortAscending={sortAscending}
                  onSort={() => setSortAscending((current) => !current)}
                />
              </div>

              <section className="mt-9" aria-labelledby="activity-heading">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2
                      id="activity-heading"
                      className="text-base font-semibold tracking-tight"
                    >
                      Platform activity
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      A closer look at growth and school status.
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-5">
                  <Card className="gap-0 border border-border p-5 shadow-sm ring-0 lg:col-span-3 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold">
                          School signups
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Schools joining over time
                        </p>
                      </div>
                      <span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                        <TrendingUp className="size-5" />
                      </span>
                    </div>
                    <div
                      className="relative mt-5 flex h-40 flex-col justify-between rounded-lg bg-muted/35 px-3 py-2"
                      aria-label="School signup chart: no data connected"
                    >
                      <span className="border-b border-dashed border-border" />
                      <span className="border-b border-dashed border-border" />
                      <span className="border-b border-dashed border-border" />
                      <span className="border-b border-dashed border-border" />
                      <span className="absolute inset-0 grid place-items-center text-center text-xs text-muted-foreground">
                        Chart available when data is connected
                      </span>
                    </div>
                  </Card>
                  <Card className="gap-0 border border-border p-5 shadow-sm ring-0 lg:col-span-2 sm:p-6">
                    <h3 className="text-sm font-semibold">School status</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Overview of school accounts
                    </p>
                    <div className="mt-4 divide-y divide-border rounded-xl border border-border px-3">
                      {["Active", "Provisioning", "Suspended", "Failed"].map(
                        (status) => (
                          <div
                            key={status}
                            className="flex items-center justify-between py-3 text-xs"
                          >
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <span className="size-2 rounded-full bg-primary/50" />
                              {status}
                            </span>
                            <span className="font-semibold">
                              {schoolsQuery.data && !schoolsQuery.error
                                ? realSchools.filter(
                                    (school) =>
                                      school.status === status.toLowerCase(),
                                  ).length
                                : "—"}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </Card>
                </div>
              </section>
            </>
          )}
          {section === "schools" && (
            <>
              <SectionHeader
                title="Schools"
                description="Browse and manage institutions in your workspace."
                action={
                  <Button type="button" onClick={() => setAddOpen(true)}>
                    <Plus /> Add school
                  </Button>
                }
              />
              <div className="mt-8">
                <SchoolTable
                  schools={visibleSchools}
                  total={realSchools.length}
                  loading={schoolsQuery.isPending}
                  error={listError}
                  onRetry={() => {
                    void schoolsQuery.refetch();
                  }}
                  onAdd={() => setAddOpen(true)}
                  query={search.trim()}
                  statusFilter={statusFilter}
                  onStatusFilter={setStatusFilter}
                  sortAscending={sortAscending}
                  onSort={() => setSortAscending((current) => !current)}
                />
              </div>
            </>
          )}
          {section === "plans" && <PlansSection />}
          {section === "billing" && <BillingSection />}
          {section === "reports" && <ReportsSection />}
          {section === "audit" && <AuditSection />}
          {section === "settings" && <SettingsSection />}
        </motion.div>
        <AddSchoolDialog open={addOpen} onOpenChange={setAddOpen} />
      </DashboardShell>
    </MotionConfig>
  );
}
