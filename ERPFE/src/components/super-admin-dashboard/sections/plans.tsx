"use client";

import { motion } from "framer-motion";
import { Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { samplePlans } from "../data/sample-data";
import { SectionHeader } from "./shared";

export function PlansSection() {
  return <motion.section initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}><SectionHeader title="Plans & entitlements" description="Define plans, limits and included modules for schools." action={<Button type="button" aria-disabled="true" title="Available when connected"><Plus /> Create plan</Button>} /><div className="mt-7 flex items-center justify-between"><div><h2 className="text-lg font-bold">Plan library</h2><p className="mt-1 text-xs text-muted-foreground">Example plans for layout only.</p></div><span className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">Sample data</span></div><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{samplePlans.map((plan) => <div key={plan.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground"><ShieldCheck className="size-5" /></span><span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground">SAMPLE</span></div><h3 className="mt-4 text-base font-bold">{plan.name}</h3><div className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground"><p className="flex justify-between"><span>User limit</span><strong className="text-foreground">{plan.userLimit}</strong></p><p className="flex justify-between"><span>Storage limit</span><strong className="text-foreground">{plan.storageLimit}</strong></p><p className="pt-2">Modules: {plan.modules.join(", ")}</p></div><Button variant="outline" size="sm" type="button" aria-disabled="true" className="mt-5" title="Available when connected">Edit plan</Button></div>)}</div></motion.section>;
}
