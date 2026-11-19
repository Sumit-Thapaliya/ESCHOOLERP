"use client";

import * as React from "react";
import { MOCK_CURRICULUM_DATA, MOCK_SUBJECT_ALLOCATIONS } from "./academic-mock-data";
import { BookOpen, CheckCircle2, Clock, AlertCircle, ChevronRight } from "lucide-react";

interface SyllabusProgressCardProps {
  grade: string;
  section: string;
}

export function SyllabusProgressCard({ grade, section }: SyllabusProgressCardProps) {
  const classKey = `${grade}-${section}`;
  const subjects = MOCK_SUBJECT_ALLOCATIONS[classKey] ?? MOCK_SUBJECT_ALLOCATIONS["Grade 8-A"];
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string>(subjects[0]?.id ?? "");

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) ?? subjects[0];
  const curriculum = MOCK_CURRICULUM_DATA; // mock syllabus units

  const overallProgress = currentSubject ? currentSubject.syllabusProgress : 70;

  return (
    <div className="space-y-6">
      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {subjects.map((sub) => {
          const active = sub.id === currentSubject?.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                active
                  ? "bg-[#12294D] text-white border-[#12294D] shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {sub.name} ({sub.syllabusProgress}%)
            </button>
          );
        })}
      </div>

      {/* Overview Stat Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Syllabus Completion</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F243E]">{overallProgress}%</span>
            <span className="text-xs text-emerald-600 font-medium">On Schedule</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#1E6DEB] transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Chapters Covered</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F243E]">
              {currentSubject?.completedChapters}
            </span>
            <span className="text-xs text-slate-400">
              / {currentSubject?.totalChapters} total units
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Assigned: {currentSubject?.teacher.name}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Teaching Hours Delivered</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F243E]">
              {curriculum.completedHours}h
            </span>
            <span className="text-xs text-slate-400">
              / {curriculum.totalPlannedHours}h planned
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {currentSubject?.weeklyPeriods} periods weekly in Room {currentSubject?.room}
          </p>
        </div>
      </div>

      {/* Chapters Breakdown List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/75 px-5 py-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F243E]">
            {currentSubject?.name} Curriculum Units & Progress
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {grade} • Code: {currentSubject?.code}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {curriculum.chapters.map((ch) => {
            const isCompleted = ch.status === "completed";
            const isInProgress = ch.status === "in_progress";

            return (
              <div
                key={ch.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-800"
                        : isInProgress
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {ch.unitNumber}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 leading-snug">
                      {ch.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {ch.keyTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 sm:self-center">
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-700"
                          : isInProgress
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isCompleted
                        ? "Completed"
                        : isInProgress
                        ? "In Progress"
                        : "Upcoming"}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      {ch.completedHours}/{ch.plannedHours} hrs
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
