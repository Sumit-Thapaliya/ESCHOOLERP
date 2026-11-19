"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, HeartPulse, MapPin, Phone, ShieldAlert } from "lucide-react";
import { getStudent, getStudentStatusHistory } from "@/lib/api/school";
import { authErrorMessage } from "@/lib/api/errors";
import { schoolPath } from "@/lib/tenant-slug";
import { useHasPermission } from "@/store/session-store";

/**
 * GET /students/{id} (+ /status-history) rendered as a real route, replacing
 * the mock in-page drawer: the back button, shareable URLs and prefetching
 * all work because this is a URL, not component state.
 *
 * The health block is permission-gated (student.health.read) and every read
 * of it is audit-logged server-side - so the panel only exists for roles that
 * are allowed to leave that audit trail.
 */
export function StudentProfile({ slug, studentId }: { slug: string; studentId: string }) {
  const canReadHealth = useHasPermission("student.health.read");

  const detail = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => getStudent(studentId),
  });
  const history = useQuery({
    queryKey: ["student", studentId, "status-history"],
    queryFn: () => getStudentStatusHistory(studentId),
  });

  if (detail.error) {
    return (
      <div className="grid gap-3">
        <BackLink slug={slug} />
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-[13px] text-destructive">
          {authErrorMessage(detail.error)}
        </p>
      </div>
    );
  }

  if (!detail.data) {
    return (
      <div className="grid gap-3">
        <BackLink slug={slug} />
        <p className="text-[13px] text-muted-foreground">Loading student…</p>
      </div>
    );
  }

  const s = detail.data;
  const p = s.person;

  return (
    <div className="grid gap-5">
      <BackLink slug={slug} />

      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em]">
            {p.displayName}
          </h1>
          <p className="text-[13px] text-muted-foreground">
            {s.admissionNo}
            {s.emisId ? ` · EMIS ${s.emisId}` : ""} · {s.campus?.name ?? "no campus"} ·
            admitted {s.admissionDate} ({s.admissionType})
          </p>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[12px] font-medium">
          {s.status}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* person */}
        <section className="rounded-xl border p-4">
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
            Person
          </h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
            <Field label="Gender" value={p.gender} />
            <Field label="Date of birth" value={p.dob} />
            <Field label="Blood group" value={p.bloodGroup} />
            <Field label="Nationality" value={p.nationality} />
            <Field label="Mother tongue" value={p.motherTongue} />
            <Field label="Birth place" value={p.birthPlace} />
          </dl>

          <h3 className="mb-1.5 mt-4 flex items-center gap-1.5 text-[12.5px] font-medium">
            <Phone className="size-3.5 text-muted-foreground" /> Contacts
          </h3>
          {p.contacts.length === 0 && (
            <p className="text-[12.5px] text-muted-foreground">None recorded.</p>
          )}
          <ul className="grid gap-1 text-[13px]">
            {p.contacts.map((c) => (
              <li key={c.id}>
                {c.type}: {c.value}
                {c.isPrimary && (
                  <span className="ml-1.5 rounded-full bg-muted px-1.5 text-[11px]">
                    primary
                  </span>
                )}
              </li>
            ))}
          </ul>

          <h3 className="mb-1.5 mt-4 flex items-center gap-1.5 text-[12.5px] font-medium">
            <MapPin className="size-3.5 text-muted-foreground" /> Addresses
          </h3>
          {p.addresses.length === 0 && (
            <p className="text-[12.5px] text-muted-foreground">None recorded.</p>
          )}
          <ul className="grid gap-1.5 text-[13px]">
            {p.addresses.map((a) => (
              <li key={a.id}>
                <span className="font-medium">{a.type}:</span>{" "}
                {[a.line1, a.line2, a.ward, a.municipality, a.district, a.province, a.country]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-5">
          {/* guardians */}
          <section className="rounded-xl border p-4">
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              Guardians
            </h2>
            {s.guardians.length === 0 && (
              <p className="text-[12.5px] text-muted-foreground">
                No guardian linked yet - an applicant needs a primary guardian
                before activation.
              </p>
            )}
            <ul className="grid gap-2 text-[13px]">
              {s.guardians.map((g) => (
                <li key={g.guardianId} className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{g.displayName}</span>
                  <span className="text-muted-foreground">({g.relation})</span>
                  {g.primaryPhone && <span className="text-[12.5px]">{g.primaryPhone}</span>}
                  {g.isPrimary && (
                    <span className="rounded-full bg-muted px-1.5 text-[11px]">primary</span>
                  )}
                  {g.isEmergencyContact && (
                    <span className="rounded-full bg-amber-500/15 px-1.5 text-[11px] text-amber-700 dark:text-amber-400">
                      emergency
                    </span>
                  )}
                  {g.canPickup && (
                    <span className="rounded-full bg-teal-500/15 px-1.5 text-[11px] text-teal-700 dark:text-teal-400">
                      can pick up
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* health, gated */}
          <section className="rounded-xl border p-4">
            <h2 className="mb-3 flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              <HeartPulse className="size-3.5" /> Health
            </h2>
            {!canReadHealth ? (
              <p className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                <ShieldAlert className="size-3.5" />
                Needs <code>student.health.read</code>. Every read is audit-logged.
              </p>
            ) : (
              <HealthPanel studentId={studentId} />
            )}
          </section>
        </div>
      </div>

      {/* status timeline */}
      <section className="rounded-xl border p-4">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
          Status history
        </h2>
        {history.isLoading && <p className="text-[12.5px] text-muted-foreground">Loading…</p>}
        {history.error && (
          <p className="text-[12.5px] text-destructive">{authErrorMessage(history.error)}</p>
        )}
        <ol className="grid gap-2 text-[13px]">
          {history.data?.map((h) => (
            <li key={h.id} className="flex flex-wrap items-baseline gap-2">
              <span className="font-medium">
                {h.fromStatus ?? "—"} → {h.toStatus}
              </span>
              {h.reason && <span className="text-muted-foreground">{h.reason}</span>}
              <span className="ml-auto text-[12px] text-muted-foreground">
                {new Date(h.changedAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function HealthPanel({ studentId }: { studentId: string }) {
  // Imported lazily here so the permission gate above is the only caller.
  const health = useQuery({
    queryKey: ["student", studentId, "health"],
    queryFn: () => import("@/lib/api/school").then((m) => m.getStudentHealth(studentId)),
  });

  if (health.isLoading) return <p className="text-[12.5px] text-muted-foreground">Loading…</p>;
  if (health.error)
    return <p className="text-[12.5px] text-destructive">{authErrorMessage(health.error)}</p>;
  if (!health.data) return null;

  const h = health.data;
  const rows: Array<[string, string | null]> = [
    ["Allergies", h.allergies],
    ["Medical conditions", h.medicalConditions],
    ["Medications", h.medications],
    ["Disability", h.disabilityType],
    ["Doctor", h.doctorName ? `${h.doctorName} ${h.doctorPhone ?? ""}`.trim() : null],
    ["Insurance no", h.insuranceNo],
    ["Emergency instructions", h.emergencyInstructions],
  ];

  return (
    <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-[13px] sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <Field key={label} label={label} value={value} />
      ))}
    </dl>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-[11.5px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd>{value ?? "—"}</dd>
    </div>
  );
}

function BackLink({ slug }: { slug: string }) {
  return (
    <Link
      href={schoolPath(slug, "/students")}
      className="inline-flex w-fit items-center gap-1.5 rounded-lg px-1.5 py-1 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <ArrowLeft className="size-3.5" /> Back to students
    </Link>
  );
}
