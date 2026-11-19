"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Hash,
  HeartPulse,
  History,
  Layers,
  Landmark,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Phone,
  Printer,
  RefreshCw,
  ShieldCheck,
  Trophy,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStudent,
  getStudentHealth,
  getStudentStatusHistory,
  unlinkGuardian,
} from "@/lib/api/school";
import { toast } from "sonner";
import { AddGuardianModal } from "./add-guardian-modal";
import { useHasPermission } from "@/store/session-store";
import { useOptionalTenant } from "@/providers/tenant-provider";
import { schoolPath } from "@/lib/tenant-slug";
import { StudentIdCardModal } from "./student-id-card-modal";
import { cn } from "cn";
import { initialsOfName } from "@/lib/initials";

interface StudentProfilePageViewProps {
  studentId: string;
  onBack: () => void;
  /**
   * Where the breadcrumb links back to. Optional on purpose: when a caller
   * omits it, the path is derived from the school in the URL, so an older call
   * site (or a new one) can never break the page with a missing prop.
   */
  directoryHref?: string;
}

type TabId =
  | "overview"
  | "academic"
  | "documents"
  | "health"
  | "fees"
  | "attendance"
  | "exams"
  | "history";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: UserRound },
  { id: "academic", label: "Academic Performance", icon: Trophy },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "health", label: "Health Records", icon: HeartPulse },
  { id: "fees", label: "Fees & Dues", icon: Banknote },
  { id: "attendance", label: "Attendance", icon: CalendarCheck2 },
  { id: "exams", label: "Exam History", icon: FileText },
  { id: "history", label: "Status History", icon: History },
];

const STATUS_STYLE: Record<string, string> = {
  active: "border-[#B4EFD2] bg-[#EAFBF2] text-[#0E9F6E]",
  applicant: "border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1]",
  suspended: "border-rose-200 bg-rose-50 text-rose-700",
  dropped: "border-rose-200 bg-rose-50 text-rose-700",
  transferred_out: "border-slate-200 bg-slate-100 text-slate-700",
  alumni: "border-slate-200 bg-slate-100 text-slate-700",
};

const pretty = (v: string) => v.replace(/_/g, " ").toLowerCase();
const dateTime = (v: string | null) => (v ? new Date(v).toLocaleString() : null);

/** A labelled value in the Personal Information list. */
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  const empty = value === null || value === undefined || value === "";
  return (
    <div className="flex items-baseline gap-3 border-b border-[#F2F6FC] py-[7.5px] last:border-0">
      <span className="w-[118px] shrink-0 text-[13px] leading-snug text-[#7C8DA3]">{label}</span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[13.5px] font-semibold tracking-[-0.005em]",
          empty ? "font-normal text-[#A9B6C5]" : "text-[#1B3049]"
        )}
      >
        {empty ? "Not recorded" : value}
      </span>
    </div>
  );
}

/** One of the three counters beside the hero. */
function MiniStat({
  icon: Icon,
  label,
  value,
  badge,
  caption,
  tone,
  muted,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  badge: string;
  caption: string;
  tone: "blue" | "violet" | "green";
  muted?: boolean;
}) {
  const tones = {
    blue: "bg-[#EFF6FF] text-[#3B82F6]",
    violet: "bg-[#F5F3FF] text-[#8B5CF6]",
    green: "bg-[#ECFDF5] text-[#10B981]",
  } as const;
  return (
    <div className="flex h-full flex-col justify-center gap-3.5 rounded-2xl border border-[#E7EDF6] bg-white px-4 py-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CFDFF3] hover:shadow-xs">
      <div className="flex items-center gap-2">
        <span className={cn("grid h-7 w-7 place-items-center rounded-lg", tones[tone])}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[12.5px] font-bold leading-tight tracking-[-0.004em] text-[#4E6076]">
          {label}
        </span>
      </div>

      <div className="flex flex-col gap-[9px]">
        <p className="text-[26px] font-bold leading-none tracking-[-0.03em] text-[#0D2038] tabular-nums">
          {value}
        </p>
        <div className="flex flex-col items-start gap-1.5">
          <span
            className={cn(
              "inline-flex w-fit items-center rounded-full px-2 py-[3px] text-[11.5px] font-semibold tracking-[0.004em]",
              muted ? "bg-[#F1F5F9] text-[#64748B]" : "bg-[#EAFBF2] text-[#0E9F6E]"
            )}
          >
            {badge}
          </span>
          <p className="text-[11.5px] leading-snug text-[#93A3B6]">{caption}</p>
        </div>
      </div>
    </div>
  );
}

/** Honest panel for a module that has no backend yet. */
function PendingModule({
  icon: Icon,
  title,
  detail,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  detail: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#E1E9F4] bg-white px-6 py-10 text-center shadow-2xs">
      <Icon className="mx-auto h-[30px] w-[30px] text-[#C7D3E1]" />
      <h3 className="mt-3 text-[15px] font-semibold tracking-[-0.012em] text-[#16293F]">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-[450px] text-[13px] leading-[1.65] text-[#6B7C91]">
        {detail}
      </p>
      {action && <div className="mt-4 flex items-center justify-center gap-2">{action}</div>}
    </div>
  );
}

/** Disabled button used inside the honest panels. */
function DisabledAction({
  icon: Icon,
  label,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  title: string;
}) {
  return (
    <button
      type="button"
      disabled
      title={title}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#EDF2F8] px-3 py-1.5 text-[12.5px] font-semibold text-[#C3CDDA]"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

/** The graduation-cap illustration in the hero, drawn inline (no image request). */
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 210 150"
      className="pointer-events-none hidden h-[118px] w-auto shrink-0 sm:block"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6C9BEA" />
          <stop offset="100%" stopColor="#3268C4" />
        </linearGradient>
        <linearGradient id="bookTopGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6FAFF" />
          <stop offset="100%" stopColor="#C9DCF6" />
        </linearGradient>
        <linearGradient id="bookSideGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C3D7F2" />
          <stop offset="100%" stopColor="#9FBCE4" />
        </linearGradient>
      </defs>
      <ellipse cx="105" cy="135" rx="80" ry="8" fill="#C6DAF3" opacity="0.7" />
      <rect x="26" y="104" width="158" height="24" rx="6" fill="url(#bookSideGrad)" />
      <rect x="26" y="100" width="158" height="14" rx="6" fill="url(#bookTopGrad)" />
      <rect x="40" y="84" width="130" height="22" rx="6" fill="#B9D0EE" />
      <rect x="40" y="80" width="130" height="13" rx="6" fill="#E4EEFB" />
      <rect x="54" y="64" width="102" height="20" rx="6" fill="#CFDFF4" />
      <rect x="54" y="60" width="102" height="12" rx="6" fill="#EFF5FE" />
      <path d="M105 18 196 52 105 86 14 52z" fill="url(#capGrad)" />
      <path d="M60 64v22c0 8 20 14 45 14s45-6 45-14V64l-45 18z" fill="#457FD4" />
      <path
        d="M105 18 196 52 105 86 14 52z"
        fill="none"
        stroke="#2E60B4"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="105" cy="52" r="4.6" fill="#F7CD68" />
      <path d="M184 57v20" stroke="#F7CD68" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M184 77l-4.6 9h9.2z" fill="#F7CD68" />
    </svg>
  );
}

/**
 * Student profile, laid out as the school-portal reference:
 * hero with identity + admission facts, three real counters beside it,
 * an icon tab bar, Personal Information + Guardians side by side, and the
 * admission record strip underneath.
 *
 * Every value comes from GET /students/{id}. Where a module has no backend yet
 * (academics, files, fees, attendance, exams) the tab says so instead of
 * inventing numbers.
 */
export function StudentProfilePageView({
  studentId,
  onBack,
  directoryHref,
}: StudentProfilePageViewProps) {
  const tenantCtx = useOptionalTenant();
  // The directory URL this page belongs to. Prefer what the caller passed;
  // otherwise rebuild it from the tenant slug in the current URL.
  const studentsHref = React.useMemo(() => {
    if (directoryHref) return directoryHref;
    const slug = tenantCtx?.slug;
    return slug ? schoolPath(slug, "/students") : "/students";
  }, [directoryHref, tenantCtx?.slug]);

  const [activeTab, setActiveTab] = React.useState<TabId>("overview");
  const [idCardOpen, setIdCardOpen] = React.useState(false);
  const [addGuardianOpen, setAddGuardianOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const canReadHealth = useHasPermission("student.health.read");
  const canReadSensitive = useHasPermission("person.sensitive.read");
  const canUpdateStudent = useHasPermission("student.update");
  const canCreateGuardian = useHasPermission("guardian.create");

  const detail = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => getStudent(studentId),
  });
  const history = useQuery({
    queryKey: ["student-status-history", studentId],
    queryFn: () => getStudentStatusHistory(studentId),
  });
  const health = useQuery({
    queryKey: ["student-health", studentId],
    queryFn: () => getStudentHealth(studentId),
    enabled: canReadHealth,
  });

  // Unlinking leaves the guardian record in place; the server refuses if it
  // would strand an active student without a primary guardian, and that reason
  // is shown exactly as the API words it.
  const unlink = useMutation({
    mutationFn: (guardianId: string) => unlinkGuardian(studentId, guardianId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["student", studentId] });
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Guardian unlinked. The guardian record itself stays on file.");
    },
    onError: (error: Error) =>
      toast.error(error.message || "The guardian could not be unlinked."),
  });

  /* ---------------------------------------------------------------- loading */
  if (detail.isLoading) {
    return (
      <div className="space-y-4 pb-14" aria-busy="true" aria-label="Loading student record">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="h-[148px] animate-pulse rounded-2xl bg-white lg:col-span-6" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[148px] animate-pulse rounded-2xl bg-white lg:col-span-2" />
          ))}
        </div>
        <div className="h-11 animate-pulse rounded-xl bg-white" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-2xl bg-white" />
          <div className="h-72 animate-pulse rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ error */
  if (detail.error || !detail.data) {
    const reason =
      detail.error instanceof Error && detail.error.message
        ? detail.error.message
        : "The record could not be fetched.";
    return (
      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-[#DDE5F0] bg-white p-8 text-center shadow-2xs">
        <AlertCircle className="mx-auto h-8 w-8 text-[#D64545]" />
        <h2 className="mt-3 text-base font-semibold text-slate-900">
          We couldn&apos;t load this student
        </h2>
        <p className="mt-1 text-sm text-slate-500">{reason}</p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => void detail.refetch()}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#2570D3] px-3.5 py-2 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1C5BB0]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer rounded-lg border border-[#DDE5F0] bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
          >
            Back to students
          </button>
        </div>
      </div>
    );
  }

  const student = detail.data;
  const person = student.person;
  const initials = initialsOfName(person.displayName);
  const primaryContact =
    person.contacts.find((c) => c.type === "phone") ?? person.contacts[0] ?? null;
  const emailContact = person.contacts.find((c) => c.type === "email") ?? null;
  const address = person.addresses[0] ?? null;
  const addressLine = address
    ? [address.line1, address.ward, address.municipality, address.district]
        .filter(Boolean)
        .join(", ")
    : null;
  const primaryGuardian = student.guardians.find((g) => g.isPrimary) ?? student.guardians[0] ?? null;

  const statusLabel = pretty(student.status);
  const statusClasses = STATUS_STYLE[student.status] ?? "border-slate-200 bg-slate-100 text-slate-700";
  const admissionYear = student.admissionDate.slice(0, 4);
  const historyCount = history.isLoading ? "—" : String(history.data?.length ?? 0);

  return (
    <div className="space-y-4 pb-14">
      {/* ------------------------------------------------------- breadcrumb row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[13.5px] text-[#5F7186]">
          <Link
            href={studentsHref}
            aria-label="Students home"
            className="grid h-[22px] w-[22px] place-items-center rounded-[7px] bg-[#EAF1FB] text-[#4C6E9E] transition-colors hover:bg-[#DEEAFB] hover:text-[#2570D3]"
          >
            <Layers className="h-3 w-3" />
          </Link>
          <span className="text-[#C6D2E0]">›</span>
          <Link
            href={studentsHref}
            className="font-medium text-[#54677E] transition-colors hover:text-[#2570D3]"
          >
            Students
          </Link>
          <span className="text-[#C6D2E0]">›</span>
          <span className="font-semibold tracking-[-0.005em] text-[#2570D3]">Student Profile</span>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#DCE6F3] bg-white px-3.5 py-[7px] text-[13px] font-semibold tracking-[-0.004em] text-[#3B4C61] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B7D0EF] hover:text-[#2570D3]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Students
        </button>
      </div>

      {/* ------------------------------------------------------- hero + counters */}
      <div className="grid gap-4 lg:grid-cols-12">
        <section className="relative flex flex-col justify-center overflow-hidden rounded-2xl border border-[#E4ECF7] bg-[linear-gradient(103deg,#EFF5FE_0%,#F7FAFF_46%,#E9F1FE_78%,#F3EEFC_100%)] px-5 py-[18px] shadow-2xs lg:col-span-6">
          <div className="flex items-center gap-4">
            <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-2xl border border-[#DCE7F7] bg-[linear-gradient(155deg,#FFFFFF,#E7F0FD)] text-[22px] font-bold tracking-[0.03em] text-[#2A64B8] shadow-[inset_0_1px_0_#fff]">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[24px] font-bold leading-[1.18] tracking-[-0.028em] text-[#0D2038]">
                {person.displayName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3.5px] text-[12px] font-semibold tracking-[0.005em]",
                    statusClasses
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  <span className="capitalize">{statusLabel}</span>
                </span>
                <span
                  className="rounded-full border border-[#DDE7F4] bg-white/85 px-2.5 py-[3.5px] font-mono text-[11.5px] tracking-[0.01em] text-[#4A6382]"
                  title="Admission number"
                >
                  {student.admissionNo}
                </span>
                {student.hasSpecialNeeds && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-[3.5px] text-[12px] font-semibold text-amber-700">
                    special needs
                  </span>
                )}
              </div>
            </div>

            <HeroIllustration />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-[18px] gap-y-2.5 border-t border-[#DCE8F7] pt-3.5 sm:grid-cols-3">
            <div className="flex items-center gap-2 sm:pr-1">
              <CalendarDays className="h-[15px] w-[15px] shrink-0 text-[#5A83BC]" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium leading-[1.35] tracking-[0.012em] text-[#7E90A6]">
                  Enrolled On
                </p>
                <p className="truncate text-[13.5px] font-semibold leading-[1.4] tracking-[-0.006em] text-[#16293F] tabular-nums">
                  {student.admissionDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:border-l sm:border-[#DCE8F7] sm:pl-[18px]">
              <Hash className="h-[15px] w-[15px] shrink-0 text-[#5A83BC]" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium leading-[1.35] tracking-[0.012em] text-[#7E90A6]">
                  Admission
                </p>
                <p className="truncate text-[13.5px] font-semibold capitalize leading-[1.4] tracking-[-0.006em] text-[#16293F]">
                  {pretty(student.admissionType)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:border-l sm:border-[#DCE8F7] sm:pl-[18px]">
              <Users className="h-[15px] w-[15px] shrink-0 text-[#5A83BC]" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium leading-[1.35] tracking-[0.012em] text-[#7E90A6]">
                  Campus
                </p>
                <p
                  className={cn(
                    "truncate text-[13.5px] font-semibold leading-[1.4] tracking-[-0.006em]",
                    student.campus ? "text-[#16293F]" : "font-medium text-[#A2B1C2]"
                  )}
                >
                  {student.campus?.name ?? "Not assigned"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="lg:col-span-2">
          <MiniStat
            icon={Users}
            label="Guardians"
            value={String(student.guardians.length)}
            badge={student.guardians.length ? "linked" : "none"}
            caption="on this record"
            tone="blue"
            muted={student.guardians.length === 0}
          />
        </div>
        <div className="lg:col-span-2">
          <MiniStat
            icon={Phone}
            label="Contacts"
            value={String(person.contacts.length)}
            badge={person.contacts.length ? "on file" : "none"}
            caption="phone and email"
            tone="violet"
            muted={person.contacts.length === 0}
          />
        </div>
        <div className="lg:col-span-2">
          <MiniStat
            icon={History}
            label="Status changes"
            value={historyCount}
            badge="recorded"
            caption="in the audit log"
            tone="green"
            muted={historyCount === "0"}
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------- tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-[#E7EDF6] bg-white p-[5px] shadow-2xs">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={active}
              className={cn(
                "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-2 text-[12.5px] font-semibold tracking-[-0.006em] transition-all duration-200",
                active
                  ? "bg-[linear-gradient(180deg,#2F7BE0,#2570D3)] text-white shadow-xs"
                  : "text-[#5A6B80] hover:bg-[#F1F6FD] hover:text-[#2570D3]"
              )}
            >
              <tab.icon className={cn("h-3.5 w-3.5", active ? "text-white" : "text-[#8FA0B6]")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- OVERVIEW */}
      {activeTab === "overview" && (
        <>
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.42fr)_minmax(0,1fr)]">
            {/* Personal information */}
            <section className="rounded-2xl border border-[#E7EDF6] bg-white p-[18px] shadow-2xs">
              <div className="flex items-center justify-between gap-3 border-b border-[#F0F4FA] pb-3">
                <h2 className="flex items-center gap-2.5 text-[15px] font-bold tracking-[-0.014em] text-[#0F243E]">
                  <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#3B82F6]">
                    <UserRound className="h-3.5 w-3.5" />
                  </span>
                  Personal Information
                </h2>
                <button
                  type="button"
                  disabled
                  title="Editing arrives with the student edit form"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#EDF2F8] px-3 py-1.5 text-[12.5px] font-semibold text-[#C3CDDA]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              </div>

              <div className="mt-3 grid items-start gap-[18px] sm:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)]">
                <div>
                  <Field label="Gender" value={person.gender} />
                  <Field label="Date of Birth" value={person.dob} />
                  <Field label="Blood Group" value={person.bloodGroup} />
                  <Field label="Birth Place" value={person.birthPlace} />
                  <Field label="Mother Tongue" value={person.motherTongue} />
                  <Field label="Nationality" value={person.nationality} />
                  {canReadSensitive && (
                    <>
                      <Field label="Religion" value={person.religion} />
                      <Field label="National ID" value={person.nationalId} />
                    </>
                  )}
                </div>

                <div>
                  <Field label="Phone Number" value={primaryContact?.value ?? null} />
                  <Field label="Email Address" value={emailContact?.value ?? null} />
                  <Field label="Address" value={addressLine} />
                  <Field label="Parent's Contact" value={primaryGuardian?.primaryPhone ?? null} />
                  {!canReadSensitive && (
                    <p className="pt-1.5 text-[12px] leading-relaxed text-[#93A3B6]">
                      National ID, religion and ethnicity need person.sensitive.read.
                    </p>
                  )}

                  <div className="mt-3.5 rounded-xl border border-[#E7EEF7] bg-[linear-gradient(180deg,#FBFDFF,#F5F9FF)] px-3.5 py-3">
                    <p className="mb-1 text-[13.5px] font-bold tracking-[-0.008em] text-[#17293F]">
                      Quick Info
                    </p>
                    {(
                      [
                        ["Admission Year", admissionYear],
                        ["Admission Type", pretty(student.admissionType)],
                        ["EMIS ID", student.emisId ?? "Not issued"],
                        ["Campus", student.campus?.name ?? "Not assigned"],
                        ["Status", statusLabel],
                      ] as [string, string][]
                    ).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between gap-2.5 border-b border-[#EAF0F8] py-[7px] text-[13px] last:border-0 last:pb-px"
                      >
                        <span className="text-[#7C8DA3]">{k}</span>
                        <span className="inline-flex items-center gap-1.5 font-semibold capitalize tracking-[-0.005em] text-[#1B3049]">
                          {k === "Status" && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#12B76A]" />
                          )}
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Guardians */}
            <section className="rounded-2xl border border-[#E7EDF6] bg-white p-[18px] shadow-2xs">
              <div className="flex items-center justify-between gap-3 border-b border-[#F0F4FA] pb-3">
                <h2 className="flex items-center gap-2.5 text-[15px] font-bold tracking-[-0.014em] text-[#0F243E]">
                  <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#3B82F6]">
                    <Users className="h-3.5 w-3.5" />
                  </span>
                  Guardians
                </h2>
                <button
                  type="button"
                  onClick={() => setAddGuardianOpen(true)}
                  disabled={!canUpdateStudent || !canCreateGuardian}
                  title={
                    canUpdateStudent && canCreateGuardian
                      ? "Link a parent or guardian to this student"
                      : "Needs student.update and guardian.create"
                  }
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E1E9F4] bg-white px-3 py-1.5 text-[12.5px] font-semibold text-[#3F5266] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B7D0EF] hover:text-[#2570D3] disabled:cursor-not-allowed disabled:border-[#EDF2F8] disabled:text-[#C3CDDA] disabled:hover:translate-y-0"
                >
                  <Plus className="h-3 w-3" />
                  Add guardian
                </button>
              </div>

              {student.guardians.length === 0 ? (
                <div className="mt-3 rounded-xl border border-dashed border-[#E1E9F4] px-4 py-6 text-center">
                  <Users className="mx-auto h-6 w-6 text-[#C7D3E1]" />
                  <p className="mt-2 text-[13.5px] text-[#5F7186]">No guardians linked yet.</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[#93A3B6]">
                    Add the father, mother or legal guardian from here — one submit creates the
                    guardian and links them to this student.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAddGuardianOpen(true)}
                    disabled={!canUpdateStudent || !canCreateGuardian}
                    className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#2570D3] px-3.5 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#1C5BB0] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add guardian
                  </button>
                </div>
              ) : (
                <ul>
                  {student.guardians.map((g, index) => (
                    <li
                      key={g.guardianId}
                      className="mt-2.5 flex items-stretch gap-3 rounded-xl border border-[#EDF2FA] px-3 py-3 transition-colors first:mt-3 hover:border-[#DCE8F6] hover:bg-[#F9FCFF]"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2.5">
                        <div
                          className={cn(
                            "grid h-10 w-10 shrink-0 place-items-center rounded-full",
                            index % 2 === 0
                              ? "bg-[#E9F1FD] text-[#3B82F6]"
                              : "bg-[#F3EEFE] text-[#8B5CF6]"
                          )}
                        >
                          <UserRound className="h-[18px] w-[18px]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <p className="truncate text-[14px] font-semibold tracking-[-0.008em] text-[#16293F]">
                              {g.displayName}
                            </p>
                            <span className="rounded-md bg-[#EFF6FF] px-2 py-[2px] text-[11px] font-semibold capitalize tracking-[0.004em] text-[#2E74D6]">
                              {pretty(g.relation)}
                            </span>
                          </div>
                          <p className="mt-[5px] flex items-center gap-1.5 text-[12.5px] text-[#75879D]">
                            <Phone className="h-3 w-3" />
                            {g.primaryPhone ?? "No phone on file"}
                          </p>
                        </div>
                      </div>

                      <div className="hidden w-[158px] shrink-0 flex-col justify-center gap-2.5 border-l border-[#EEF3FA] pl-3 sm:flex">
                        <div className="flex items-start gap-1.5 text-[12px] text-[#4A5C72]">
                          <CheckCircle2 className="mt-px h-3.5 w-3.5 text-[#93A2B5]" />
                          <div className="min-w-0">
                            <span className="block text-[10.5px] font-medium leading-[1.3] tracking-[0.006em] text-[#96A5B8]">
                              Primary guardian
                            </span>
                            <span className="block truncate text-[11.5px] font-semibold leading-[1.3] tracking-[-0.004em] text-[#1B3049]">
                              {g.isPrimary ? "Yes" : "No"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start justify-between gap-1.5 text-[12px] text-[#4A5C72]">
                          <div className="flex min-w-0 items-start gap-1.5">
                            <Phone className="mt-px h-3.5 w-3.5 text-[#93A2B5]" />
                            <div className="min-w-0">
                              <span className="block text-[10.5px] font-medium leading-[1.3] tracking-[0.006em] text-[#96A5B8]">
                                Contact
                              </span>
                              <span className="block truncate text-[11.5px] font-semibold leading-[1.3] tracking-[-0.004em] text-[#1B3049] tabular-nums">
                                {g.primaryPhone ?? "—"}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => unlink.mutate(g.guardianId)}
                            disabled={!canUpdateStudent || unlink.isPending}
                            title={
                              canUpdateStudent
                                ? `Unlink ${g.displayName} from this student`
                                : "Needs student.update"
                            }
                            aria-label={`Unlink ${g.displayName}`}
                            className="cursor-pointer rounded-md p-1 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-300"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {student.guardians.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {student.guardians.some((g) => g.isEmergencyContact) && (
                    <span className="rounded-full bg-rose-50 px-2 py-[3px] text-[11px] font-semibold text-rose-700">
                      emergency contact set
                    </span>
                  )}
                  {student.guardians.some((g) => g.canPickup) && (
                    <span className="rounded-full bg-[#F1F5F9] px-2 py-[3px] text-[11px] text-[#4A5C72]">
                      pickup allowed
                    </span>
                  )}
                  {student.guardians.some((g) => g.canPayFees) && (
                    <span className="rounded-full bg-[#F1F5F9] px-2 py-[3px] text-[11px] text-[#4A5C72]">
                      pays fees
                    </span>
                  )}
                  {student.guardians.some((g) => g.hasCustody) && (
                    <span className="rounded-full bg-[#F1F5F9] px-2 py-[3px] text-[11px] text-[#4A5C72]">
                      custody
                    </span>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Admission record strip */}
          <section className="rounded-2xl border border-[#E7EDF6] bg-white p-[18px] shadow-2xs">
            <div className="flex items-center justify-between gap-3 border-b border-[#F0F4FA] pb-3">
              <h2 className="flex items-center gap-2.5 text-[15px] font-bold tracking-[-0.014em] text-[#0F243E]">
                <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#3B82F6]">
                  <Landmark className="h-3.5 w-3.5" />
                </span>
                Admission Record
              </h2>
            </div>

            <div className="mt-3.5 grid items-center gap-4 md:grid-cols-2 xl:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.05fr)] xl:gap-0">
              {[
                { icon: CalendarDays, label: "Admission Date", value: student.admissionDate },
                { icon: Clock, label: "Record Created", value: dateTime(student.createdAt) ?? "—" },
                { icon: RefreshCw, label: "Record Updated", value: dateTime(student.updatedAt) ?? "—" },
              ].map((cell) => (
                <div
                  key={cell.label}
                  className="flex min-w-0 items-center gap-3 xl:border-r xl:border-[#EEF3FA] xl:pr-4 xl:[&:not(:first-child)]:pl-4"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#3B82F6]">
                    <cell.icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium leading-[1.3] tracking-[0.008em] text-[#8595A9]">
                      {cell.label}
                    </p>
                    <p className="truncate text-[13px] font-semibold leading-[1.35] tracking-[-0.004em] text-[#1B3049] tabular-nums">
                      {cell.value}
                    </p>
                  </div>
                </div>
              ))}

              <div className="ml-1 flex items-center justify-center gap-2.5 rounded-xl border border-[#B7EFD2] bg-[#EAFBF2] px-3.5 py-[13px]">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#0E9F6E]" />
                <div>
                  <p className="text-[11px] font-medium leading-[1.3] tracking-[0.008em] text-[#0B8E63]">
                    Admission Status
                  </p>
                  <p className="text-[14px] font-bold capitalize tracking-[-0.01em] text-[#066B45]">
                    {statusLabel}
                  </p>
                </div>
              </div>
            </div>

            {(student.previousSchoolName ||
              student.previousTcNo ||
              student.emisId ||
              student.remarks) && (
              <div className="mt-3.5 grid gap-x-8 border-t border-[#F1F5F9] pt-3.5 sm:grid-cols-2">
                <Field label="Previous school" value={student.previousSchoolName} />
                <Field label="Previous class" value={student.previousSchoolClass} />
                <Field label="Transfer certificate" value={student.previousTcNo} />
                <Field label="EMIS ID" value={student.emisId} />
                <div className="sm:col-span-2">
                  <Field label="Remarks" value={student.remarks} />
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {/* ------------------------------------------------------------- ACADEMIC */}
      {activeTab === "academic" && (
        <PendingModule
          icon={Trophy}
          title="Academic performance arrives with the academics module"
          detail="Grades, sections, roll numbers and results have no backend yet, so nothing is shown here rather than something invented."
          action={
            <DisabledAction
              icon={FileText}
              label="Marksheet PDF"
              title="Waiting on the academics module"
            />
          }
        />
      )}

      {/* ------------------------------------------------------------ DOCUMENTS */}
      {activeTab === "documents" && (
        <PendingModule
          icon={FileText}
          title="Documents arrive with the files module"
          detail="Uploads and verification need a storage backend. The contract only reserves person.photoFileId for now."
          action={
            <DisabledAction
              icon={FileText}
              label="Upload document"
              title="Waiting on the files module"
            />
          }
        />
      )}

      {/* --------------------------------------------------------------- HEALTH */}
      {activeTab === "health" && (
        <section className="rounded-2xl border border-[#E7EDF6] bg-white p-[18px] shadow-2xs">
          <div className="flex items-center justify-between gap-3 border-b border-[#F0F4FA] pb-3">
            <h2 className="flex items-center gap-2.5 text-[15px] font-bold tracking-[-0.014em] text-[#0F243E]">
              <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#3B82F6]">
                <HeartPulse className="h-3.5 w-3.5" />
              </span>
              Health Records
            </h2>
          </div>

          {!canReadHealth ? (
            <p className="flex items-center gap-2 py-4 text-[13.5px] text-[#5F7186]">
              <ShieldCheck className="h-4 w-4 text-[#93A2B5]" />
              Needs student.health.read. Every read of this panel is written to the audit log.
            </p>
          ) : health.isLoading ? (
            <p className="py-4 text-[13.5px] text-[#93A3B6]">Loading health record…</p>
          ) : health.error ? (
            <p className="py-4 text-[13.5px] text-[#D64545]">Could not load the health record.</p>
          ) : (
            <div className="mt-2 grid gap-x-8 sm:grid-cols-2">
              {(
                [
                  ["Allergies", health.data?.allergies],
                  ["Medical conditions", health.data?.medicalConditions],
                  ["Medications", health.data?.medications],
                  ["Disability", health.data?.disabilityType],
                  ["Doctor", health.data?.doctorName],
                  ["Doctor phone", health.data?.doctorPhone],
                  ["Insurance no", health.data?.insuranceNo],
                  ["Emergency instructions", health.data?.emergencyInstructions],
                ] as [string, string | null | undefined][]
              ).map(([label, value]) => (
                <Field key={label} label={label} value={value ?? null} />
              ))}
              <p className="mt-3 border-t border-[#F1F5F9] pt-3 text-[12px] leading-relaxed text-[#93A3B6] sm:col-span-2">
                {health.data?.updatedAt
                  ? `Last updated ${new Date(health.data.updatedAt).toLocaleString()}.`
                  : "No health record saved yet — these fields are empty, not missing."}{" "}
                Opening this panel wrote an audit row.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ----------------------------------------------------------------- FEES */}
      {activeTab === "fees" && (
        <PendingModule
          icon={Banknote}
          title="Fee ledgers arrive with the finance module"
          detail="Dues, payments and receipts have no backend yet, so no balance is shown here."
          action={
            <DisabledAction icon={Banknote} label="Collect fee" title="Waiting on the fees module" />
          }
        />
      )}

      {/* ----------------------------------------------------------- ATTENDANCE */}
      {activeTab === "attendance" && (
        <PendingModule
          icon={CalendarCheck2}
          title="Attendance arrives with the attendance module"
          detail="Daily marking and percentage summaries need a register backend. No percentage appears until one exists."
        />
      )}

      {/* ------------------------------------------------------------- EXAMS */}
      {activeTab === "exams" && (
        <PendingModule
          icon={FileText}
          title="Exam history arrives with the exams module"
          detail="Sittings, marksheets and results have no backend yet, so this tab stays empty."
        />
      )}

      {/* ------------------------------------------------------- STATUS HISTORY */}
      {activeTab === "history" && (
        <section className="rounded-2xl border border-[#E7EDF6] bg-white p-[18px] shadow-2xs">
          <div className="flex items-center justify-between gap-3 border-b border-[#F0F4FA] pb-3">
            <h2 className="flex items-center gap-2.5 text-[15px] font-bold tracking-[-0.014em] text-[#0F243E]">
              <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#3B82F6]">
                <History className="h-3.5 w-3.5" />
              </span>
              Status History
            </h2>
          </div>

          {history.isLoading ? (
            <p className="py-4 text-[13.5px] text-[#93A3B6]">Loading timeline…</p>
          ) : (history.data?.length ?? 0) === 0 ? (
            <p className="py-4 text-[13.5px] text-[#93A3B6]">No status changes recorded.</p>
          ) : (
            <ol className="relative ml-1.5 mt-3.5 border-l border-[#E6EDF7] pl-[18px]">
              {history.data?.map((entry) => (
                <li key={entry.id} className="relative pb-4 last:pb-0">
                  <span className="absolute -left-[24px] top-[5px] grid h-[11px] w-[11px] place-items-center rounded-full border-2 border-white bg-[#2570D3]" />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[13px] font-semibold capitalize tracking-[-0.006em] text-[#1B3049]">
                      {entry.fromStatus ? pretty(entry.fromStatus) : "—"} → {pretty(entry.toStatus)}
                    </span>
                    <span className="text-[11.5px] text-[#93A2B5] tabular-nums">
                      {new Date(entry.changedAt).toLocaleString()}
                    </span>
                  </div>
                  {entry.reason && (
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-[#6B7C91]">
                      {entry.reason}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      {/* ---------------------------------------------------------- quick actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setIdCardOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#E1E9F4] bg-white px-3.5 py-2 text-[13px] font-semibold tracking-[-0.003em] text-[#3F5266] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B7D0EF] hover:text-[#2570D3]"
        >
          <Printer className="h-3.5 w-3.5 text-[#2570D3]" />
          Print ID card
        </button>

        <a
          href={`tel:${primaryContact?.value ?? ""}`}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-[#E1E9F4] bg-white px-3.5 py-2 text-[13px] font-semibold tracking-[-0.003em] text-[#3F5266] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B7D0EF] hover:text-[#2570D3]",
            !primaryContact && "pointer-events-none opacity-45"
          )}
        >
          <Phone className="h-3.5 w-3.5 text-[#2570D3]" />
          Call contact
        </a>

        <a
          href={emailContact ? `mailto:${emailContact.value}` : undefined}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-[#E1E9F4] bg-white px-3.5 py-2 text-[13px] font-semibold tracking-[-0.003em] text-[#3F5266] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B7D0EF] hover:text-[#2570D3]",
            !emailContact && "pointer-events-none opacity-45"
          )}
        >
          <Mail className="h-3.5 w-3.5 text-[#2570D3]" />
          Email
        </a>

        {addressLine && (
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7EDF6] bg-white px-3.5 py-2 text-[12.5px] text-[#5F7186]">
            <MapPin className="h-3.5 w-3.5 text-[#8FA0B6]" />
            {addressLine}
          </span>
        )}

        <span className="inline-flex items-center gap-2 rounded-full border border-[#E7EDF6] bg-white px-3.5 py-2 text-[12.5px] text-[#5F7186]">
          <GraduationCap className="h-3.5 w-3.5 text-[#8FA0B6]" />
          {student.emisId ? `EMIS ${student.emisId}` : "No EMIS issued"}
        </span>
      </div>

      {idCardOpen && (
        <StudentIdCardModal student={student} onClose={() => setIdCardOpen(false)} />
      )}

      {addGuardianOpen && (
        <AddGuardianModal
          studentId={student.id}
          studentName={person.displayName}
          hasPrimary={student.guardians.some((g) => g.isPrimary)}
          onClose={() => setAddGuardianOpen(false)}
        />
      )}
    </div>
  );
}
