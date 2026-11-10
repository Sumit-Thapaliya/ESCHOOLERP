"use client";

import * as React from "react";
import {
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Info,
} from "lucide-react";
import {
  MOCK_ATTENDANCE_TREND,
  MOCK_FEE_BREAKDOWN,
} from "./dashboard-mock-data";
import { toast } from "sonner";
import { cn } from "cn";

export function AnalyticsCharts() {
  const [selectedRange, setSelectedRange] = React.useState<"7d" | "30d" | "term">("7d");
  const [activeSegment, setActiveSegment] = React.useState<"all" | "primary" | "secondary">("all");

  const handleExport = (chartName: string) => {
    toast.success(`${chartName} report downloaded (CSV / PDF)`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Attendance Trend Chart (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-[#DDE5F0] bg-white p-5 shadow-2xs">
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-slate-900">
                  Attendance trend analytics
                </h3>
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  94.2% today
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Daily student attendance rates across educational tiers
              </p>
            </div>

            {/* Range Toggle & Export */}
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 text-xs bg-slate-50">
                <button
                  type="button"
                  onClick={() => setSelectedRange("7d")}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                    selectedRange === "7d"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  This week
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRange("30d")}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                    selectedRange === "30d"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  30 days
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleExport("Attendance trend")}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                title="Export attendance data"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2570D3]" />
              <span>Primary (Grades 1-5): 96%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1F9D6B]" />
              <span>Middle (Grades 6-8): 94%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E69A2E]" />
              <span>Secondary (Grades 9-12): 93%</span>
            </div>
          </div>

          {/* Chart Graphic (SVG bar/line composition) */}
          <div className="mt-6">
            <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 pt-4 pb-2">
              {MOCK_ATTENDANCE_TREND.map((point) => {
                const heightPct = (point.average - 80) * 5; // scale 80-100% to 0-100%
                const isToday = point.day === "Today";

                return (
                  <div
                    key={point.day}
                    className="group relative flex flex-col items-center h-full justify-end"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded px-2 py-1 pointer-events-none whitespace-nowrap z-10 shadow-md">
                      Avg: {point.average}% | P: {point.primary}% | S: {point.secondary}%
                    </div>

                    {/* Stacked bar visualization */}
                    <div className="w-full max-w-[40px] flex flex-col justify-end rounded-t-md overflow-hidden bg-slate-100 h-full">
                      <div
                        className={cn(
                          "w-full rounded-t-md transition-all duration-300",
                          isToday ? "bg-[#2570D3]" : "bg-slate-300 group-hover:bg-[#2570D3]/80"
                        )}
                        style={{ height: `${Math.max(heightPct, 20)}%` }}
                      />
                    </div>

                    <span
                      className={cn(
                        "mt-2 text-[11px] font-medium",
                        isToday ? "text-[#2570D3] font-bold" : "text-slate-500"
                      )}
                    >
                      {point.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
              <span>Baseline: 80% minimum threshold</span>
              <span>Institution target: 95.0%</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-[#1F9D6B]" />
            <span>Attendance improved +1.8% over previous 7-day rolling window</span>
          </div>
        </div>
      </div>

      {/* 2. Fee Collection vs Target Breakdown (5 cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-[#DDE5F0] bg-white p-5 shadow-2xs">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-semibold text-sm text-slate-900">
                Fee collections vs dues (MTD)
              </h3>
              <p className="text-xs text-slate-500">
                Month-to-date recovery across fee categories
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleExport("Fee collection")}
              className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
              title="Export revenue report"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>

          {/* Macro Progress */}
          <div className="mt-4 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-xs text-slate-500">Collected MTD</p>
                <p className="text-lg font-bold text-slate-900">
                  NPR 8,450,000
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Target (NPR)</p>
                <p className="text-sm font-semibold text-slate-700">
                  10,300,000
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span className="font-medium text-emerald-700">82.0% achieved</span>
                <span className="text-[#D64545] font-medium">NPR 1,850,000 dues</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden flex">
                <div
                  className="h-full bg-[#1F9D6B] rounded-l-full"
                  style={{ width: "82%" }}
                />
                <div
                  className="h-full bg-[#D64545]/40"
                  style={{ width: "18%" }}
                />
              </div>
            </div>
          </div>

          {/* Categorized Progress Bars */}
          <div className="mt-4 space-y-3">
            <p className="text-xs font-medium text-slate-700">
              Departmental breakdown
            </p>

            {MOCK_FEE_BREAKDOWN.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium">{item.category}</span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    NPR {(item.collectedNpr / 1000000).toFixed(1)}M / {(item.targetNpr / 1000000).toFixed(1)}M ({item.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Final installment due in 7 days</span>
          <span className="font-medium text-[#2570D3] hover:underline cursor-pointer">
            Open fee register →
          </span>
        </div>
      </div>
    </div>
  );
}
