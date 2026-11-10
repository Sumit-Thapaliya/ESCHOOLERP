"use client";

import * as React from "react";
import {
  Users,
  Briefcase,
  Banknote,
  CalendarCheck2,
  UserCheck,
  Receipt,
  FileCheck2,
  Calendar,
  BookOpen,
} from "lucide-react";
import { cn } from "cn";

interface DashboardContentProps {
  selectedBranchId: string;
  onSelectBranch: (id: string) => void;
}

export function DashboardContent({
  selectedBranchId,
  onSelectBranch,
}: DashboardContentProps) {
  // Chart points across 7 days matching the screenshot
  const days = ["D01", "D02", "D03", "D04", "D05", "D06", "D07"];
  const presentData = [145, 185, 170, 195, 160, 182, 194];
  const absentData = [32, 22, 26, 16, 28, 20, 14];
  const lateData = [14, 18, 12, 10, 17, 13, 8];

  // SVG dimensions for wide & tall attendance chart matching the screenshot
  const width = 850;
  const height = 360;
  const paddingX = 55;
  const paddingY = 40;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;
  const maxY = 220;

  const getPoints = (data: number[]) => {
    return data.map((val, idx) => {
      const x = paddingX + (idx / (data.length - 1)) * graphWidth;
      const y = height - paddingY - (val / maxY) * graphHeight;
      return { x, y, val };
    });
  };

  const presentPoints = getPoints(presentData);
  const absentPoints = getPoints(absentData);

  // Smooth SVG curve generator
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const presentLinePath = createSmoothPath(presentPoints);
  const absentLinePath = createSmoothPath(absentPoints);

  const presentAreaPath = `${presentLinePath} L ${presentPoints[presentPoints.length - 1].x} ${height - paddingY} L ${presentPoints[0].x} ${height - paddingY} Z`;
  const absentAreaPath = `${absentLinePath} L ${absentPoints[absentPoints.length - 1].x} ${height - paddingY} L ${absentPoints[0].x} ${height - paddingY} Z`;

  return (
    <div className="space-y-8 pb-12 w-full font-sans">
      {/* 4 Solid Colorful Large KPI Cards Matching the Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
        {/* Card 1: Total Students (Vibrant Blue) */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1E88E5] to-[#1565C0] p-7 lg:p-8 text-white shadow-md flex flex-col justify-between min-h-[160px] transition-transform hover:-translate-y-0.5">
          <p className="text-sm lg:text-base font-medium text-white/90">
            Total Students
          </p>
          <div className="mt-4">
            <h3 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white leading-none">
              1,248
            </h3>
          </div>
        </div>

        {/* Card 2: Total Staff (Vibrant Emerald Green) */}
        <div className="rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] p-7 lg:p-8 text-white shadow-md flex flex-col justify-between min-h-[160px] transition-transform hover:-translate-y-0.5">
          <p className="text-sm lg:text-base font-medium text-white/90">
            Total Staff
          </p>
          <div className="mt-4">
            <h3 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white leading-none">
              186
            </h3>
          </div>
        </div>

        {/* Card 3: Pending Fees (Vibrant Orange / Amber) */}
        <div className="rounded-2xl bg-gradient-to-br from-[#FB8C00] to-[#E65100] p-7 lg:p-8 text-white shadow-md flex flex-col justify-between min-h-[160px] transition-transform hover:-translate-y-0.5">
          <p className="text-sm lg:text-base font-medium text-white/90">
            Pending Fees
          </p>
          <div className="mt-4">
            <h3 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white leading-none">
              ₹ 3,45,000
            </h3>
          </div>
        </div>

        {/* Card 4: Today's Attendance (Vibrant Purple) */}
        <div className="rounded-2xl bg-gradient-to-br from-[#8E24AA] to-[#6A1B9A] p-7 lg:p-8 text-white shadow-md flex flex-col justify-between min-h-[160px] transition-transform hover:-translate-y-0.5">
          <p className="text-sm lg:text-base font-medium text-white/90">
            Today's Attendance
          </p>
          <div className="mt-4">
            <h3 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white leading-none">
              92%
            </h3>
          </div>
        </div>
      </div>

      {/* Main Lower Section: Attendance Overview (Left) + Recent Activities (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
        {/* Left Column: Attendance Overview Chart Card (~65% width) */}
        <div className="lg:col-span-8 rounded-2xl border border-[#E8EFF7] bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            {/* Card Header with Title and Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0F243E]">
                Attendance Overview
              </h2>

              {/* Legend dots matching the screenshot */}
              <div className="flex items-center gap-5 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#10B981]" />
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
                  <span>Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#FB8C00]" />
                  <span>Late</span>
                </div>
              </div>
            </div>

            {/* Smooth Spline Chart */}
            <div className="mt-6 w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto overflow-visible"
              >
                <defs>
                  {/* Present Green Gradient */}
                  <linearGradient id="presentGradLarge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
                  </linearGradient>

                  {/* Absent Red Gradient */}
                  <linearGradient id="absentGradLarge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid Lines */}
                {[50, 100, 150, 200].map((val) => {
                  const y = height - paddingY - (val / maxY) * graphHeight;
                  return (
                    <g key={val}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={width - paddingX}
                        y2={y}
                        stroke="#F1F5F9"
                        strokeWidth="1.5"
                      />
                      <text
                        x={paddingX - 12}
                        y={y + 4}
                        fill="#94A3B8"
                        fontSize="12"
                        textAnchor="end"
                        fontWeight="500"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Area Fills */}
                <path d={presentAreaPath} fill="url(#presentGradLarge)" />
                <path d={absentAreaPath} fill="url(#absentGradLarge)" />

                {/* Line Strokes */}
                <path
                  d={presentLinePath}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d={absentLinePath}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Present Point Dots */}
                {presentPoints.map((p, i) => (
                  <circle
                    key={`pres-pt-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                ))}

                {/* Absent Point Dots */}
                {absentPoints.map((p, i) => (
                  <circle
                    key={`abs-pt-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="#EF4444"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                ))}

                {/* X-axis Day Labels */}
                {days.map((day, idx) => {
                  const x = paddingX + (idx / (days.length - 1)) * graphWidth;
                  return (
                    <text
                      key={day}
                      x={x}
                      y={height - 10}
                      fill="#64748B"
                      fontSize="13"
                      textAnchor="middle"
                      fontWeight="600"
                    >
                      {day}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Weekly attendance performance</span>
            <span className="text-[#10B981] font-bold">92.4% weekly average</span>
          </div>
        </div>

        {/* Right Column: Recent Activities Card (~35% width) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E8EFF7] bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0F243E]">
                Recent Activities
              </h2>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {/* Activity 1 */}
              <div className="py-4 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EBF3FE] text-[#1E6DEB]">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#0F243E] leading-snug">
                    New admission received
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Class 10th - Aarav Sharma • 10m ago
                  </p>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="py-4 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EBF3FE] text-[#1E6DEB]">
                  <Receipt className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#0F243E] leading-snug">
                    Fee payment received
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Receipt #40291 • ₹ 45,000 • 35m ago
                  </p>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="py-4 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EBF3FE] text-[#1E6DEB]">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#0F243E] leading-snug">
                    Exam result published
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Class 9th Term 1 finalized • 1h ago
                  </p>
                </div>
              </div>

              {/* Activity 4 */}
              <div className="py-4 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EBF3FE] text-[#1E6DEB]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#0F243E] leading-snug">
                    Leave request approved
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Sunil Thapa • 2 days medical leave • 2h ago
                  </p>
                </div>
              </div>

              {/* Activity 5 */}
              <div className="py-4 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EBF3FE] text-[#1E6DEB]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#0F243E] leading-snug">
                    Curriculum update released
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Science Dept • Unit 4 Syllabus • 4h ago
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <span className="text-xs font-semibold text-[#1E6DEB] cursor-pointer hover:underline">
              View all 24 activities &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
