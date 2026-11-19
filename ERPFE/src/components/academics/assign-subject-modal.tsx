"use client";

import * as React from "react";
import { X, BookOpen, User, MapPin, Calendar, Clock, Plus, Check } from "lucide-react";
import { SubjectAllocation, SubjectCategory } from "./academic-types";

interface AssignSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: string;
  section: string;
  academicYear: string;
  onAddSubject: (subject: SubjectAllocation) => void;
}

const AVAILABLE_TEACHERS = [
  { id: "tch-1", name: "Ms. Neha Sharma", email: "neha.sharma@sunrise.edu", department: "Mathematics", initials: "NS" },
  { id: "tch-2", name: "Mr. Rohan Singh", email: "rohan.singh@sunrise.edu", department: "General Science", initials: "RS" },
  { id: "tch-3", name: "Ms. Pooja Verma", email: "pooja.verma@sunrise.edu", department: "English Language", initials: "PV" },
  { id: "tch-4", name: "Mr. Amit Kumar", email: "amit.kumar@sunrise.edu", department: "Social Sciences", initials: "AK" },
  { id: "tch-5", name: "Ms. Kavita Joshi", email: "kavita.joshi@sunrise.edu", department: "Languages & Literature", initials: "KJ" },
  { id: "tch-6", name: "Er. Bikash Thapa", email: "bikash.thapa@sunrise.edu", department: "Computer Technology", initials: "BT" },
  { id: "tch-7", name: "Mr. Pradeep Shrestha", email: "pradeep.shrestha@sunrise.edu", department: "Mathematics", initials: "PS" },
  { id: "tch-8", name: "Dr. Sunita Karki", email: "sunita.karki@sunrise.edu", department: "Physics & Chemistry", initials: "SK" },
];

export function AssignSubjectModal({
  isOpen,
  onClose,
  grade,
  section,
  academicYear,
  onAddSubject,
}: AssignSubjectModalProps) {
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [category, setCategory] = React.useState<SubjectCategory>("core");
  const [teacherId, setTeacherId] = React.useState(AVAILABLE_TEACHERS[0].id);
  const [room, setRoom] = React.useState("101");
  const [scheduleDays, setScheduleDays] = React.useState("Mon, Wed, Fri");
  const [timeSlot, setTimeSlot] = React.useState("09:00 - 09:45");
  const [weeklyPeriods, setWeeklyPeriods] = React.useState(5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const teacher = AVAILABLE_TEACHERS.find((t) => t.id === teacherId) || AVAILABLE_TEACHERS[0];
    const newSubject: SubjectAllocation = {
      id: `sub-${Date.now()}`,
      code: code.trim() || `${name.slice(0, 3).toUpperCase()}-800`,
      name: name.trim(),
      category,
      weeklyPeriods: Number(weeklyPeriods) || 5,
      creditHours: 3.5,
      teacher,
      room,
      building: "Main Academic Block",
      scheduleDays,
      timeSlot,
      syllabusProgress: 0,
      totalChapters: 12,
      completedChapters: 0,
    };

    onAddSubject(newSubject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-base text-[#0F243E]">
              Assign Subject to {grade} - Section {section}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Academic Session {academicYear}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Subject Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Environmental Science"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Subject Code
              </label>
              <input
                type="text"
                placeholder="e.g. ENV-808"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Subject Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SubjectCategory)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20 outline-hidden bg-white"
              >
                <option value="core">Core Theory</option>
                <option value="elective">Elective</option>
                <option value="practical">Practical / Lab</option>
                <option value="language">Language</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assigned Teacher <span className="text-red-500">*</span>
              </label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20 outline-hidden bg-white"
              >
                {AVAILABLE_TEACHERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Classroom / Room
              </label>
              <input
                type="text"
                placeholder="e.g. 101, Lab 2"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Days of Week
              </label>
              <select
                value={scheduleDays}
                onChange={(e) => setScheduleDays(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20 outline-hidden bg-white"
              >
                <option value="Mon, Wed, Fri">Mon, Wed, Fri</option>
                <option value="Tue, Thu">Tue, Thu</option>
                <option value="Daily (Mon-Fri)">Daily (Mon-Fri)</option>
                <option value="Mon, Thu">Mon, Thu</option>
                <option value="Wed, Fri">Wed, Fri</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Periods / Week
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={weeklyPeriods}
                onChange={(e) => setWeeklyPeriods(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20 outline-hidden"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#1E6DEB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1858c2] transition-colors cursor-pointer shadow-xs"
            >
              Save Allocation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
