"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  BookOpen,
  CircleDollarSign,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  Users,
  Wallet,
} from "lucide-react";
import { EASE } from "@/components/promotional/motion";
import { useReducedMotion } from "@/components/promotional/use-reduced-motion";
import { cn } from "@/lib/utils";

const NAV = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: GraduationCap, label: "Admissions" },
  { icon: CircleDollarSign, label: "Fees" },
  { icon: Wallet, label: "Payroll" },
  { icon: BookOpen, label: "Academics" },
  { icon: MessageSquare, label: "Notices" },
];

const KPIS = [
  { label: "Fees collected", value: "Rs 48.2L", delta: "+12.4%", icon: CircleDollarSign, tone: "text-teal bg-teal/10" },
  { label: "Active students", value: "2,418", delta: "+86", icon: Users, tone: "text-primary bg-primary/10" },
  { label: "Payroll", value: "Posted", delta: "Shrawan", icon: BadgeCheck, tone: "text-highlight bg-highlight/15" },
];

const MONTHS = ["Bai", "Jes", "Asa", "Shr", "Bha", "Aso", "Kar", "Man", "Pou", "Mag", "Fal", "Cha"];
const BARS = [42, 55, 48, 78, 64, 58, 70, 66, 74, 82, 76, 92];

const RECEIPTS = [
  { name: "Aarav Shrestha", grade: "Grade 9 · B", amount: "Rs 18,500" },
  { name: "Sita Gurung", grade: "+2 Science", amount: "Rs 32,000" },
  { name: "Nabin Thapa", grade: "Grade 4 · A", amount: "Rs 12,750" },
];

export function DashboardPreview({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className="absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-[40px] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 30%, color-mix(in srgb, var(--primary) 35%, transparent), transparent 70%), radial-gradient(50% 50% at 75% 60%, color-mix(in srgb, var(--teal) 30%, transparent), transparent 70%)",
        }}
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_40px_80px_-32px_rgba(15,36,51,0.45)] ring-1 ring-black/[0.02]">
        <div className="flex items-center gap-3 border-b border-border bg-muted/70 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex h-6 w-full max-w-[280px] items-center justify-center rounded-md border border-border bg-background text-[11px] text-muted-foreground">
            app.baudhika.com/overview
          </div>
          <span className="w-[42px]" />
        </div>

        <div className="grid text-left md:grid-cols-[180px_1fr]">
          <aside className="hidden border-r border-border bg-muted/40 p-3 md:block">
            <div className="mb-4 flex items-center gap-2 px-2 pt-1">
              <span className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-primary to-teal text-[11px] font-bold text-white">
                B
              </span>
              <span className="text-[12px] font-bold">Pioneer College</span>
            </div>
            {NAV.map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={cn(
                  "mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium",
                  active ? "bg-background text-foreground shadow-sm ring-1 ring-border" : "text-muted-foreground"
                )}
              >
                <Icon className="size-[15px]" />
                {label}
              </div>
            ))}
          </aside>

          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Good morning, Bijay</p>
                <p className="text-[15px] font-bold">Institution overview</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-2.5 py-1 text-[11px] font-semibold text-teal">
                <span className="size-1.5 rounded-full bg-teal" /> All records reconciled
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-3">
              {KPIS.map(({ label, value, delta, icon: Icon, tone }) => (
                <div key={label} className="rounded-xl border border-border bg-background p-2.5 sm:p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-medium text-muted-foreground sm:text-[11px]">{label}</span>
                    <span className={cn("hidden size-6 place-items-center rounded-md sm:grid", tone)}>
                      <Icon className="size-3.5" />
                    </span>
                  </div>
                  <p className="mt-1.5 text-[14px] font-extrabold tabular-nums tracking-[-0.01em] sm:text-[18px]">
                    {value}
                  </p>
                  <p className="text-[10.5px] font-semibold text-teal">{delta}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr_1fr]">
              <div className="rounded-xl border border-border bg-background p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold">Fee collection · 2082/83</p>
                  <p className="text-[10.5px] text-muted-foreground">Monthly</p>
                </div>
                <div className="mt-3 flex h-[110px] items-end gap-1.5">
                  {BARS.map((height, index) => (
                    <div key={MONTHS[index]} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                      <motion.span
                        className={cn(
                          "block w-full rounded-t-[4px]",
                          index === BARS.length - 1 ? "bg-highlight" : "bg-primary/80"
                        )}
                        initial={reduce ? false : { height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6 + index * 0.04, ease: EASE }}
                        style={reduce ? { height: `${height}%` } : undefined}
                      />
                      <span className="text-[8.5px] text-muted-foreground">{MONTHS[index]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden rounded-xl border border-border bg-background p-3 sm:block">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold">Recent receipts</p>
                  <Receipt className="size-3.5 text-muted-foreground" />
                </div>
                <div className="mt-2 divide-y divide-border">
                  {RECEIPTS.map((receipt) => (
                    <div key={receipt.name} className="flex items-center gap-2.5 py-2">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {receipt.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11.5px] font-semibold">{receipt.name}</p>
                        <p className="text-[10px] text-muted-foreground">{receipt.grade}</p>
                      </div>
                      <span className="text-[11px] font-bold tabular-nums">{receipt.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.4, ease: EASE }}
        className="absolute -left-4 bottom-10 hidden items-center gap-3 rounded-xl border border-border bg-card/95 p-3 pr-4 text-left shadow-xl backdrop-blur lg:flex"
      >
        <span className="grid size-9 place-items-center rounded-lg bg-teal/15 text-teal">
          <BadgeCheck className="size-5" />
        </span>
        <div>
          <p className="text-[12.5px] font-bold">Receipt #4821 reconciled</p>
          <p className="text-[11px] text-muted-foreground">Matched with bank · just now</p>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.6, ease: EASE }}
        className="absolute -right-6 -top-6 hidden items-center gap-3 rounded-xl border border-border bg-card/95 p-3 pr-4 text-left shadow-xl backdrop-blur lg:flex"
      >
        <span className="grid size-9 place-items-center rounded-lg bg-highlight/15 text-highlight">
          <Wallet className="size-5" />
        </span>
        <div>
          <p className="text-[12.5px] font-bold">Payroll posted</p>
          <p className="text-[11px] text-muted-foreground">64 staff · Shrawan 2082</p>
        </div>
      </motion.div>
    </div>
  );
}
