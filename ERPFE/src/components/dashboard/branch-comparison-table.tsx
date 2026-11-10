"use client";

import * as React from "react";
import {
  Building2,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  CheckCircle,
  AlertCircle,
  Filter,
} from "lucide-react";
import { MOCK_BRANCHES } from "./dashboard-mock-data";
import type { BranchMetric } from "./dashboard-types";
import { cn } from "cn";

interface BranchComparisonTableProps {
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
}

// Sparkline SVG generator
function Sparkline({ data, isOptimal }: { data: number[]; isOptimal: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 28;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");

  const strokeColor = isOptimal ? "#1F9D6B" : "#E69A2E";

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function BranchComparisonTable({
  selectedBranchId,
  onSelectBranch,
}: BranchComparisonTableProps) {
  const [filterSession, setFilterSession] = React.useState("2026/2027");

  return (
    <section className="rounded-xl border border-[#DDE5F0] bg-white p-5 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-slate-900">
              Multi-branch campus comparison
            </h3>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              3 campuses
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Cross-branch benchmark of enrollment, attendance velocity and fee recovery
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 bg-slate-50">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Session: {filterSession}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-medium">
              <th className="py-2.5 px-3">Campus & Location</th>
              <th className="py-2.5 px-3">Students</th>
              <th className="py-2.5 px-3">Staff</th>
              <th className="py-2.5 px-3">Attendance today</th>
              <th className="py-2.5 px-3">Fee recovery</th>
              <th className="py-2.5 px-3">7-day trend</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {MOCK_BRANCHES.map((branch) => {
              const isSelected =
                (selectedBranchId === "ktm" && branch.id === "br-main") ||
                (selectedBranchId === "lal" && branch.id === "br-city") ||
                (selectedBranchId === "pkr" && branch.id === "br-west");
              const isOptimal = branch.status === "Optimal";

              return (
                <tr
                  key={branch.id}
                  className={cn(
                    "hover:bg-slate-50/80 transition-colors",
                    isSelected && "bg-[#2570D3]/5"
                  )}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-medium text-xs",
                          branch.isMainCampus
                            ? "bg-[#12294D] text-white"
                            : "bg-slate-100 text-slate-700"
                        )}
                      >
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-slate-900">
                            {branch.name}
                          </p>
                          {branch.isMainCampus && (
                            <span className="rounded bg-[#2570D3]/10 px-1.5 py-0.2 text-[10px] font-medium text-[#2570D3]">
                              Main
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {branch.city} • <span className="font-mono">{branch.code}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-900">
                      {branch.totalStudents.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span>{branch.totalStaff}</span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">
                        {branch.attendanceTodayPct}%
                      </span>
                      <div className="h-1.5 w-12 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            branch.attendanceTodayPct >= 94
                              ? "bg-[#1F9D6B]"
                              : "bg-[#E69A2E]"
                          )}
                          style={{ width: `${branch.attendanceTodayPct}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div>
                      <span className="font-semibold text-slate-800">
                        {branch.feeCollectionPct}%
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {branch.monthlyCollectionNpr}
                      </p>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <Sparkline data={branch.sparkline} isOptimal={isOptimal} />
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                        isOptimal
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      )}
                    >
                      {isOptimal ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      {branch.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        onSelectBranch(
                          branch.id === "br-main"
                            ? "ktm"
                            : branch.id === "br-city"
                            ? "lal"
                            : "pkr"
                        )
                      }
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                        isSelected
                          ? "bg-slate-100 text-slate-500 cursor-default"
                          : "bg-white border border-[#DDE5F0] text-[#2570D3] hover:bg-[#2570D3] hover:text-white"
                      )}
                    >
                      {isSelected ? "Active branch" : "Switch view"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
