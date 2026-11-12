"use client";

import { motion } from "framer-motion";
import { BarChart3, CreditCard, Database, FileClock, FileText, Gauge, MessageSquare, Settings2, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyPanel, SectionHeader, StatCards } from "./shared";

const sectionMotion = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } };

export function BillingSection() {
  return <motion.section {...sectionMotion}><SectionHeader title="Billing & usage" description="Monitor subscriptions, invoices and platform consumption." /><StatCards items={[{ label: "Monthly recurring revenue", detail: "Revenue data not connected", icon: Wallet }, { label: "Storage usage", detail: "Storage data not connected", icon: Database }, { label: "SMS usage", detail: "Messaging data not connected", icon: MessageSquare }]} /><div className="mt-8 grid gap-4 lg:grid-cols-5"><div className="lg:col-span-3"><h2 className="mb-4 text-lg font-bold">Invoices</h2><EmptyPanel icon={CreditCard} title="No invoices to display" description="Invoices will appear when billing is connected." action={<Button variant="outline" size="sm" type="button" aria-disabled="true">Export invoices</Button>} /></div><div className="lg:col-span-2"><h2 className="mb-4 text-lg font-bold">Usage meters</h2><div className="rounded-2xl border border-border bg-card p-5 shadow-sm">{[{ label: "Users", icon: Users }, { label: "Storage", icon: Database }, { label: "SMS", icon: MessageSquare }].map(({ label, icon: Icon }) => <div key={label} className="flex items-center gap-3 border-b border-border py-4 last:border-0"><span className="grid size-9 place-items-center rounded-lg bg-secondary text-secondary-foreground"><Icon className="size-4" /></span><span className="flex-1 text-sm font-medium">{label}</span><span className="text-xs text-muted-foreground">—</span></div>)}</div></div></div></motion.section>;
}

export function ReportsSection() {
  return <motion.section {...sectionMotion}><SectionHeader title="Reports" description="View platform-wide reporting and exports." /><div className="mt-7 grid gap-4 md:grid-cols-2"><EmptyPanel icon={BarChart3} title="Platform reports" description="School growth and usage reports will appear when data is connected." /><EmptyPanel icon={FileText} title="Downloads & exports" description="Generated reports and exports will appear here." /></div></motion.section>;
}

export function AuditSection() {
  return <motion.section {...sectionMotion}><SectionHeader title="Platform audit" description="Review platform activity and changes." /><div className="mt-7"><h2 className="mb-4 text-lg font-bold">Audit log</h2><EmptyPanel icon={FileClock} title="No audit data connected" description="Platform audit events will appear here once connected." /></div></motion.section>;
}

export function SettingsSection() {
  const settings = [{ key: "onboarding", title: "School onboarding", detail: "Manage access to school onboarding." }, { key: "notifications", title: "Platform notifications", detail: "Manage platform notifications." }];
  return <motion.section {...sectionMotion}><SectionHeader title="Platform settings" description="Manage global configuration and templates." /><div className="mt-7 grid gap-5 lg:grid-cols-5"><div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-3"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Settings2 className="size-5" /></span><div><h2 className="text-sm font-bold">Feature flags</h2><p className="mt-1 text-xs text-muted-foreground">Settings will be available when connected.</p></div></div><div className="mt-4 divide-y divide-border">{settings.map((item) => <div key={item.key} className="flex items-center justify-between gap-4 py-4"><div><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.detail}</p></div><Button variant="outline" size="sm" type="button" aria-disabled="true">Unavailable</Button></div>)}</div></div><div className="lg:col-span-2"><EmptyPanel icon={Gauge} title="Templates & configuration" description="Platform templates and global configuration will be available when connected." action={<Button variant="outline" size="sm" type="button" aria-disabled="true">Not connected</Button>} /></div></div></motion.section>;
}
