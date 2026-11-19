"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion, MotionConfig } from "framer-motion";
import { ArrowLeft, Building2, CalendarDays, Database, Globe2, GraduationCap, Layers3, Mail, MoreHorizontal, Palette, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardShell } from "../shell";
import { BrandingDialog, readBranding } from "../branding-dialog";
import { toSchool, useSchools } from "../hooks/use-schools";
import { toApiError } from "@/lib/api/errors";
import type { School, PlatformSection } from "../types";

function InformationRow({ label, value }: { label: string; value: string }) {
  return <div className="flex flex-wrap items-start justify-between gap-2 py-3.5 text-sm"><dt className="text-muted-foreground">{label}</dt><dd className="max-w-full break-all text-right font-medium sm:max-w-[65%]">{value}</dd></div>;
}

export function SchoolDetails({ school }: { school: School }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [brandingOpen, setBrandingOpen] = useState(false);
  const [failedLogo, setFailedLogo] = useState("");
  const queryClient = useQueryClient();
  const brandingKey = ["platform", "school-branding", school.id, school.slug, school.customDomain] as const;
  const branding = useQuery({
    queryKey: brandingKey,
    queryFn: ({ signal }) => readBranding(school, signal),
    enabled: school.status === "active",
    retry: false,
  });
  const logoUrl = branding.data?.logoUrl;

  function navigate(section: PlatformSection) {
    router.push(section === "overview" ? "/dashboard" : `/dashboard?section=${section}`);
  }

  return <MotionConfig reducedMotion="user"><DashboardShell activeSection="schools" onSelect={navigate} search={search} onSearch={(value) => { setSearch(value); if (value) router.push(`/dashboard?section=schools&q=${encodeURIComponent(value)}`); }}><motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><Link href="/dashboard?section=schools" className="transition-colors hover:text-primary">Schools</Link><span>/</span><span className="font-semibold text-primary">School details</span></div>
    <div className="mt-5 flex flex-wrap items-start justify-between gap-4"><div className="flex min-w-0 items-start gap-4"><span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-secondary text-xl font-bold text-secondary-foreground sm:size-16">{logoUrl && logoUrl !== failedLogo ? <Image src={logoUrl} alt={`${school.name} logo`} width={64} height={64} unoptimized className="size-full object-contain p-1.5" onError={() => setFailedLogo(logoUrl)} /> : school.name.charAt(0)}</span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold tracking-tight sm:text-[30px]">{school.name}</h1></div><p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><span>{school.slug}</span><span>·</span><span className="capitalize">{school.status}</span></p></div></div><Button variant="outline" asChild><Link href="/dashboard?section=schools"><ArrowLeft /> Back to schools</Link></Button></div>

    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[{ label: "Current plan", value: school.plan, icon: Layers3, detail: "Subscription" }, { label: "Branch", value: school.branch, icon: Building2, detail: "Campus" }, { label: "Joined", value: school.joined.slice(0, 10), icon: CalendarDays, detail: "Registration date" }, { label: "Users", value: "—", icon: Users, detail: "Not connected" }].map(({ label, value, icon: Icon, detail }) => <Card key={label} className="gap-0 border border-border bg-gradient-to-br from-secondary/60 to-card p-5 shadow-sm ring-0"><div className="flex items-start justify-between gap-2"><p className="text-xs font-semibold text-muted-foreground">{label}</p><span className="grid size-9 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Icon className="size-4" /></span></div><p className="mt-3 break-words text-lg font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></Card>)}</div>

    <div className="mt-7 grid items-start gap-4 lg:grid-cols-5"><div className="space-y-4 lg:col-span-3"><Card className="gap-0 border border-border p-5 shadow-sm ring-0 sm:p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"><GraduationCap className="size-5" /></span><div><h2 className="text-base font-bold">School information</h2><p className="mt-1 text-xs text-muted-foreground">Identity and account details</p></div></div><dl className="mt-4 divide-y divide-border"><InformationRow label="School name" value={school.name} /><InformationRow label="School ID" value={school.id} /><InformationRow label="School slug" value={school.slug} /><InformationRow label="Status" value={school.status.charAt(0).toUpperCase() + school.status.slice(1)} /><InformationRow label="Joined" value={school.joined.slice(0, 10)} /><InformationRow label="Custom domain" value={school.customDomain || "Not available"} /></dl></Card>
      <Card className="gap-0 border border-border p-5 shadow-sm ring-0 sm:p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Mail className="size-5" /></span><div><h2 className="text-base font-bold">Administrator</h2><p className="mt-1 text-xs text-muted-foreground">Primary school contact</p></div></div><dl className="mt-4 divide-y divide-border"><InformationRow label="Email" value={school.adminEmail} /><InformationRow label="Account details" value="Not connected" /></dl></Card>
      <Card className="gap-0 border border-border p-5 shadow-sm ring-0 sm:p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Building2 className="size-5" /></span><div><h2 className="text-base font-bold">Branches</h2><p className="mt-1 text-xs text-muted-foreground">School campuses</p></div></div><div className="mt-5 flex items-center justify-between rounded-xl border border-border px-4 py-3"><div><p className="text-sm font-semibold">{school.branch}</p><p className="mt-1 text-xs text-muted-foreground">Not connected</p></div><Button variant="outline" size="sm" type="button" aria-disabled="true">Manage</Button></div></Card></div>
      <div className="space-y-4 lg:col-span-2"><Card className="gap-0 border border-border p-5 shadow-sm ring-0 sm:p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"><ShieldCheck className="size-5" /></span><div><h2 className="text-base font-bold">Plan & entitlements</h2><p className="mt-1 text-xs text-muted-foreground">Subscription and included modules</p></div></div><div className="mt-5 rounded-xl border border-border bg-muted/40 p-4"><p className="text-xs text-muted-foreground">Current plan</p><p className="mt-1 text-lg font-bold">{school.plan}</p><dl className="mt-3 divide-y divide-border"><InformationRow label="User limit" value="—" /><InformationRow label="Storage limit" value="—" /></dl></div><p className="mt-4 text-xs font-semibold">Included modules</p><div className="mt-2 text-xs text-muted-foreground">Not connected</div><Button variant="outline" className="mt-5" type="button" aria-disabled="true">Assign plan</Button></Card>
      <Card className="gap-0 border border-border p-5 shadow-sm ring-0 sm:p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Database className="size-5" /></span><div><h2 className="text-base font-bold">Usage</h2><p className="mt-1 text-xs text-muted-foreground">Current platform consumption</p></div></div><dl className="mt-4 divide-y divide-border"><InformationRow label="Active users" value="—" /><InformationRow label="Storage used" value="—" /><InformationRow label="SMS used" value="—" /></dl></Card>
      <Card className="gap-0 border border-border p-5 shadow-sm ring-0 sm:p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Globe2 className="size-5" /></span><div><h2 className="text-base font-bold">School management</h2><p className="mt-1 text-xs text-muted-foreground">Account and branding actions</p></div></div><div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2"><Button type="button" onClick={() => setBrandingOpen(true)}><Palette /> Edit branding</Button><Button variant="outline" type="button" aria-disabled="true"><MoreHorizontal /> Suspend school</Button><Button variant="outline" type="button" aria-disabled="true">Impersonate</Button></div></Card></div></div>
  </motion.div><BrandingDialog school={school} open={brandingOpen} onOpenChange={setBrandingOpen} onPublished={() => { void queryClient.invalidateQueries({ queryKey: brandingKey }); }} /></DashboardShell></MotionConfig>;
}

export function SchoolDetailsRoute({ schoolId }: { schoolId: string }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const schools = useSchools();
  const real = schools.data?.find((school) => school.id === schoolId);
  if (real && !schools.error) return <SchoolDetails school={toSchool(real)} />;
  const error = schools.error ? toApiError(schools.error) : null;
  return <DashboardShell activeSection="schools" onSelect={(section) => router.push(section === "overview" ? "/dashboard" : `/dashboard?section=${section}`)} search={search} onSearch={(value) => { setSearch(value); if (value) router.push(`/dashboard?section=schools&q=${encodeURIComponent(value)}`); }}><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><Card className="items-center border border-border p-8 text-center shadow-sm ring-0"><h1 className="text-lg font-bold">{schools.isPending ? "Loading school…" : error ? "Could not load school" : "School not found"}</h1><p className="text-sm text-muted-foreground">{error ? (error.isNetworkError ? "Cannot reach the backend. Check that the server is running." : error.message) : schools.isPending ? "Please wait." : "This school is not in the current school list."}</p><div className="flex gap-2">{error && <Button variant="outline" onClick={() => { void schools.refetch(); }}>Try again</Button>}<Button variant="outline" asChild><Link href="/dashboard?section=schools"><ArrowLeft /> Back to schools</Link></Button></div></Card></div></DashboardShell>;
}
