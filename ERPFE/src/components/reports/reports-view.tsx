"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  Users,
  WalletCards,
  CalendarCheck,
  GraduationCap,
  Download,
  Printer,
  Filter,
  CheckCircle2,
  Building,
  School,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
} from "lucide-react";

function ReportsInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab") || "overview";
  const activeTab: "overview" | "financial" | "academic" | "attendance" =
    ["overview", "financial", "academic", "attendance"].includes(rawTab)
      ? (rawTab as any)
      : "overview";

  const [academicYear, setAcademicYear] = React.useState("2024 - 2025");
  const [selectedTerm, setSelectedTerm] = React.useState("Term 1");

  const updateTab = (newTab: typeof activeTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,Metric,Value,Benchmark,Trend\n" +
      "Total Enrollment,1248,1200,+4.2%\n" +
      "Fee Collection Rate,91.4%,85.0%,+6.4%\n" +
      "Average Attendance,94.2%,90.0%,+4.2%\n" +
      "Exam Pass Rate,97.8%,95.0%,+2.8%\n";
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `institutional_report_${academicYear.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Reports & Business Intelligence
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Institutional performance indicators, financial health, attendance analytics, and board mark distributions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Executive Pack
            </button>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1 mt-5 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => updateTab("overview")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "overview"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Executive Overview
          </button>

          <button
            type="button"
            onClick={() => updateTab("financial")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "financial"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <WalletCards className="w-4 h-4" />
            Fee Collection Analytics
          </button>

          <button
            type="button"
            onClick={() => updateTab("academic")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "academic"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Academic & Pass Rates
          </button>

          <button
            type="button"
            onClick={() => updateTab("attendance")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "attendance"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            Attendance Punctuality
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Enrolled</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">1,248</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4.2%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Across 32 active sections</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Fee Realization Rate</span>
            <WalletCards className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700">91.4%</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" /> +6.4%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">₹ 14.8M collected this term</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Avg Student Attendance</span>
            <CalendarCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">94.2%</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" /> +1.1%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Above mandatory 75% limit</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Exam Pass Percentage</span>
            <GraduationCap className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-purple-700">97.8%</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" /> +2.8%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Based on Mid-Term evaluations</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Class-wise Attendance & Enrollment Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Grade Enrollment & Attendance Summary</h3>
            <span className="text-xs text-slate-400">Term 1 (2024-2025)</span>
          </div>

          <div className="mt-4 divide-y divide-slate-100 text-xs">
            {[
              { grade: "Grade 8", enrolled: 121, capacity: 135, attPct: 96, feesPaid: 94 },
              { grade: "Grade 9", enrolled: 86, capacity: 90, attPct: 92, feesPaid: 88 },
              { grade: "Grade 10", enrolled: 80, capacity: 80, attPct: 98, feesPaid: 96 },
              { grade: "Grade 11 (Science)", enrolled: 94, capacity: 100, attPct: 93, feesPaid: 91 },
              { grade: "Grade 12 (Science)", enrolled: 88, capacity: 90, attPct: 94, feesPaid: 95 },
            ].map((row) => (
              <div key={row.grade} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{row.grade}</div>
                  <div className="text-[11px] text-slate-400">
                    {row.enrolled} / {row.capacity} students ({Math.round((row.enrolled / row.capacity) * 100)}% occupancy)
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Attendance</span>
                    <strong className="text-emerald-700 font-bold">{row.attPct}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Fee Realized</span>
                    <strong className="text-blue-700 font-bold">{row.feesPaid}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Revenue Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Fee Head Revenue Allocation</h3>
            <span className="text-xs text-slate-400">Total: ₹ 16.2M</span>
          </div>

          <div className="mt-4 space-y-3.5 text-xs">
            {[
              { title: "Tuition Fees", amt: "₹ 11,200,000", pct: 69, color: "bg-blue-600" },
              { title: "Transport Services", amt: "₹ 2,400,000", pct: 15, color: "bg-emerald-600" },
              { title: "Laboratories & Technology", amt: "₹ 1,300,000", pct: 8, color: "bg-purple-600" },
              { title: "Examination & Assessment", amt: "₹ 800,000", pct: 5, color: "bg-amber-500" },
              { title: "Library & Athletic Development", amt: "₹ 500,000", pct: 3, color: "bg-cyan-600" },
            ].map((head) => (
              <div key={head.title}>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700">{head.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{head.amt}</span>
                    <span className="text-slate-400 text-[11px]">({head.pct}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${head.color} rounded-full`} style={{ width: `${head.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReportsView() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 text-xs animate-pulse">
          Loading institutional reports...
        </div>
      }
    >
      <ReportsInner />
    </React.Suspense>
  );
}
