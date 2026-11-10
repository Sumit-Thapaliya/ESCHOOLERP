"use client";

import * as React from "react";
import {
  Users,
  Briefcase,
  CalendarCheck2,
  Banknote,
  ClipboardList,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { MOCK_KPIS } from "./dashboard-mock-data";
import type { KpiMetric } from "./dashboard-types";
import { cn } from "cn";

interface KpiSummaryCardsProps {
  onSelectKpi?: (kpiId: string) => void;
}

export function KpiSummaryCards({ onSelectKpi }: KpiSummaryCardsProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case "students":
        return Users;
      case "staff":
        return Briefcase;
      case "attendance":
        return CalendarCheck2;
      case "fees":
        return Banknote;
      case "tasks":
      default:
        return ClipboardList;
    }
  };

  const getAccentColor = (id: string) => {
    switch (id) {
      case "students":
        return {
          bg: "bg-[#2570D3]/10",
          text: "text-[#2570D3]",
          border: "border-l-4 border-l-[#2570D3]",
        };
      case "staff":
        return {
          bg: "bg-teal-50",
          text: "text-[#129896]",
          border: "border-l-4 border-l-[#129896]",
        };
      case "attendance":
        return {
          bg: "bg-emerald-50",
          text: "text-[#1F9D6B]",
          border: "border-l-4 border-l-[#1F9D6B]",
        };
      case "fees":
        return {
          bg: "bg-amber-50",
          text: "text-[#E69A2E]",
          border: "border-l-4 border-l-[#E69A2E]",
        };
      case "tasks":
      default:
        return {
          bg: "bg-rose-50",
          text: "text-[#D64545]",
          border: "border-l-4 border-l-[#D64545]",
        };
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Institutional pulse
          </h2>
          <p className="text-xs text-slate-500">
            Real-time enrollment, staff duty, attendance and revenue health
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {MOCK_KPIS.map((kpi) => {
          const Icon = getIcon(kpi.id);
          const colors = getAccentColor(kpi.id);

          return (
            <div
              key={kpi.id}
              onClick={() => onSelectKpi?.(kpi.id)}
              className={cn(
                "group relative flex flex-col justify-between rounded-xl border border-[#DDE5F0] bg-white p-4 shadow-2xs hover:shadow-md transition-all duration-150 cursor-pointer",
                colors.border
              )}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-medium text-slate-600 line-clamp-1">
                    {kpi.title}
                  </span>
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      colors.bg,
                      colors.text
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-xl font-bold tracking-tight text-slate-900">
                    {kpi.value}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">
                    {kpi.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                {/* Progress bar if present */}
                {kpi.progress ? (
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>{kpi.progress.formatted}</span>
                      <span className="font-medium text-slate-700">
                        {kpi.progress.current}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          kpi.id === "attendance"
                            ? "bg-[#1F9D6B]"
                            : "bg-[#2570D3]"
                        )}
                        style={{
                          width: `${Math.min(kpi.progress.current, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : kpi.breakdown ? (
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    {kpi.breakdown.map((item, idx) => (
                      <span key={item.label} className="truncate">
                        <span className="text-slate-400">{item.label}: </span>
                        <strong className="font-semibold text-slate-800">
                          {item.count}
                        </strong>
                        {idx < (kpi.breakdown?.length ?? 0) - 1 && (
                          <span className="mx-1 text-slate-300">/</span>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px]">
                    {kpi.trend.direction === "up" ? (
                      <span className="inline-flex items-center text-[#1F9D6B] font-semibold">
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        {kpi.trend.value}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[#2570D3] font-semibold">
                        {kpi.trend.value}
                      </span>
                    )}
                    <span className="text-slate-400 truncate">
                      {kpi.trend.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
