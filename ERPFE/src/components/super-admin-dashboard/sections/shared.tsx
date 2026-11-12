"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function SectionHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground"><span>Platform Super Admin</span><span>/</span><span className="font-semibold text-primary">{title}</span></div><h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-[30px]">{title}</h1><p className="mt-1.5 text-sm text-muted-foreground">{description}</p></div>{action}</div>;
}

export function EmptyPanel({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return <Card className="flex min-h-52 flex-col items-center justify-center gap-0 border border-border p-6 text-center shadow-sm ring-0"><span className="grid size-12 place-items-center rounded-2xl bg-secondary text-secondary-foreground"><Icon className="size-5" /></span><h3 className="mt-4 text-sm font-semibold">{title}</h3><p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">{description}</p>{action && <div className="mt-4">{action}</div>}</Card>;
}

export function StatCards({ items }: { items: { label: string; detail: string; icon: LucideIcon }[] }) {
  return <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(({ label, detail, icon: Icon }) => <Card key={label} className="gap-0 border border-border bg-gradient-to-br from-secondary/60 to-card p-5 shadow-sm ring-0"><div className="flex items-start justify-between gap-3"><p className="text-sm font-semibold">{label}</p><span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Icon className="size-5" /></span></div><p className="mt-4 text-3xl font-bold" aria-label={`${label}: not connected`}>—</p><p className="mt-2 text-xs text-muted-foreground">{detail}</p></Card>)}</div>;
}
