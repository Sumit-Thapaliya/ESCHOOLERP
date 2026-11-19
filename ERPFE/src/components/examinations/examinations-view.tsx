"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  FileSpreadsheet,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Search,
  CheckCircle2,
  Award,
  BookOpen,
  Printer,
  Download,
  Filter,
  Check,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Sparkles,
  ChevronRight,
  TrendingUp,
  X,
} from "lucide-react";
import {
  MOCK_EXAMS,
  MOCK_STUDENT_MARKS,
  MOCK_QUESTION_BANK,
} from "./examinations-mock-data";
import {
  ExamRecord,
  StudentExamMark,
  QuestionBankItem,
  ExamType,
} from "./examinations-types";

function ExaminationsInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab") || "create";
  const activeTab: "create" | "schedules" | "marks" | "results" | "questions" =
    ["create", "schedules", "marks", "results", "questions"].includes(rawTab)
      ? (rawTab as any)
      : "create";

  const [exams, setExams] = React.useState<ExamRecord[]>(MOCK_EXAMS);
  const [selectedExamId, setSelectedExamId] = React.useState("ex-01");
  const [marks, setMarks] = React.useState<StudentExamMark[]>(MOCK_STUDENT_MARKS);
  const [questions, setQuestions] = React.useState<QuestionBankItem[]>(MOCK_QUESTION_BANK);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [selectedStudentForMarksheet, setSelectedStudentForMarksheet] = React.useState<StudentExamMark | null>(null);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = React.useState(false);
  const [newQuestionText, setNewQuestionText] = React.useState("");
  const [newQuestionSubject, setNewQuestionSubject] = React.useState("Mathematics");
  const [newQuestionTopic, setNewQuestionTopic] = React.useState("Algebra & Linear Equations");
  const [newQuestionMarks, setNewQuestionMarks] = React.useState(5);
  const [newQuestionDifficulty, setNewQuestionDifficulty] = React.useState<"Easy" | "Medium" | "Hard">("Medium");

  // Form state for "Create Exam" (Matches Page 8 Mockup)
  const [formExamName, setFormExamName] = React.useState("Mid Term Exam");
  const [formClass, setFormClass] = React.useState("Grade 8");
  const [formSubject, setFormSubject] = React.useState("Mathematics");
  const [formExamDate, setFormExamDate] = React.useState("2025-04-24");
  const [formShift, setFormShift] = React.useState("09:30 AM - 12:30 PM");
  const [formRoom, setFormRoom] = React.useState("Main Hall - 101");
  const [formTotalMarks, setFormTotalMarks] = React.useState(100);
  const [formPassMarks, setFormPassMarks] = React.useState(40);

  const updateTab = (newTab: typeof activeTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const newExam: ExamRecord = {
      id: `ex-${Date.now()}`,
      name: formExamName,
      type: "Mid Term",
      academicYear: "2024 - 2025",
      grade: formClass,
      subject: formSubject,
      examDate: formExamDate,
      startTime: formShift.split(" - ")[0] || "09:30 AM",
      endTime: formShift.split(" - ")[1] || "12:30 PM",
      room: formRoom,
      totalMarks: Number(formTotalMarks),
      passMarks: Number(formPassMarks),
      status: "Scheduled",
    };

    setExams([newExam, ...exams]);
    setToastMessage(`Exam "${formExamName} (${formSubject})" created successfully!`);
    setTimeout(() => setToastMessage(null), 4000);
    updateTab("schedules");
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    const newQ: QuestionBankItem = {
      id: `qb-${Date.now()}`,
      grade: "Grade 8",
      subject: newQuestionSubject,
      topic: newQuestionTopic,
      marks: Number(newQuestionMarks),
      difficulty: newQuestionDifficulty,
      questionText: newQuestionText.trim(),
    };
    setQuestions([newQ, ...questions]);
    setIsAddQuestionOpen(false);
    setNewQuestionText("");
    setToastMessage("Question added to repository successfully!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMarkChange = (rollNo: string, field: "theory" | "practical", val: number) => {
    setMarks((prev) =>
      prev.map((item) => {
        if (item.rollNo !== rollNo) return item;
        const theory = field === "theory" ? val : item.theoryMarks;
        const practical = field === "practical" ? val : item.practicalMarks;
        const total = theory + practical;
        const pct = Math.round((total / item.maxMarks) * 100);
        let grade: StudentExamMark["grade"] = "F";
        if (pct >= 90) grade = "A+";
        else if (pct >= 80) grade = "A";
        else if (pct >= 70) grade = "B+";
        else if (pct >= 60) grade = "B";
        else if (pct >= 50) grade = "C+";
        else if (pct >= 40) grade = "C";

        return {
          ...item,
          theoryMarks: theory,
          practicalMarks: practical,
          totalMarks: total,
          percentage: pct,
          grade,
          status: total >= 40 ? "Pass" : "Fail",
        };
      })
    );
  };

  const selectedExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Header (From Page 8 Mockup) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Exam Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Assessment scheduling, question paper configuration, marks entry and marksheet publication.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Academic Session 2024 - 2025
            </span>
          </div>
        </div>

        {/* Sub-Tabs (Create Exam, Question Bank, Results, Analytics) */}
        <div className="flex items-center gap-1 mt-5 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => updateTab("create")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "create"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Plus className="w-4 h-4" />
            Create Exam
          </button>

          <button
            type="button"
            onClick={() => updateTab("schedules")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "schedules"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Exam Schedules ({exams.length})
          </button>

          <button
            type="button"
            onClick={() => updateTab("marks")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "marks"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Marks Entry
          </button>

          <button
            type="button"
            onClick={() => updateTab("results")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "results"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Award className="w-4 h-4" />
            Results & Marksheets
          </button>

          <button
            type="button"
            onClick={() => updateTab("questions")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "questions"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Question Bank
          </button>
        </div>
      </div>

      {/* TAB 1: CREATE EXAM FORM (Exact replica of Page 8 Mockup) */}
      {activeTab === "create" && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="mb-5 pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Create New Examination</h2>
              <p className="text-xs text-slate-500">Configure schedule, subject, and time slots</p>
            </div>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
          </div>

          <form onSubmit={handleCreateExam} className="space-y-4 text-xs">
            {/* Exam Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Exam Name
              </label>
              <input
                type="text"
                required
                value={formExamName}
                onChange={(e) => setFormExamName(e.target.value)}
                placeholder="e.g. Mid Term Exam"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Class & Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class / Grade
                </label>
                <select
                  value={formClass}
                  onChange={(e) => setFormClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject
                </label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="General Science">General Science</option>
                  <option value="English Language & Literature">English Language & Literature</option>
                  <option value="Social Studies & Civic Education">Social Studies & Civic Education</option>
                  <option value="Nepali">Nepali</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>
            </div>

            {/* Exam Date & Shift/Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Exam Date
                </label>
                <input
                  type="date"
                  required
                  value={formExamDate}
                  onChange={(e) => setFormExamDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Time / Shift
                </label>
                <select
                  value={formShift}
                  onChange={(e) => setFormShift(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value="09:30 AM - 12:30 PM">Morning (09:30 AM - 12:30 PM)</option>
                  <option value="01:30 PM - 04:30 PM">Afternoon (01:30 PM - 04:30 PM)</option>
                  <option value="10:00 AM - 11:30 AM">Short Session (10:00 AM - 11:30 AM)</option>
                </select>
              </div>
            </div>

            {/* Room & Marks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Exam Hall / Room
                </label>
                <input
                  type="text"
                  value={formRoom}
                  onChange={(e) => setFormRoom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Marks
                </label>
                <input
                  type="number"
                  value={formTotalMarks}
                  onChange={(e) => setFormTotalMarks(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Passing Marks
                </label>
                <input
                  type="number"
                  value={formPassMarks}
                  onChange={(e) => setFormPassMarks(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Submit Button (From Mockup: Blue primary "Create Exam") */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Create Exam
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: EXAM SCHEDULES */}
      {activeTab === "schedules" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900">Scheduled Examinations</h3>
              <button
                type="button"
                onClick={() => updateTab("create")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Schedule
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="px-5 py-3.5">Exam Name & Subject</th>
                    <th className="px-5 py-3.5">Grade</th>
                    <th className="px-5 py-3.5">Date & Time</th>
                    <th className="px-5 py-3.5">Room</th>
                    <th className="px-5 py-3.5 text-center">Marks</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{exam.name}</div>
                        <div className="text-slate-500 font-medium text-[11px]">{exam.subject}</div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-700">{exam.grade}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-mono text-slate-800">{exam.examDate}</div>
                        <div className="text-[11px] text-slate-400">
                          {exam.startTime} - {exam.endTime}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{exam.room}</td>
                      <td className="px-5 py-3.5 text-center font-mono text-slate-700">
                        {exam.passMarks} / {exam.totalMarks}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            exam.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {exam.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedExamId(exam.id);
                            updateTab("marks");
                          }}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          Enter Marks →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MARKS ENTRY TABLE */}
      {activeTab === "marks" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                {selectedExam.subject.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedExam.name} — {selectedExam.subject}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedExam.grade} • Max Marks: {selectedExam.totalMarks} (Theory: 75, Practical: 25)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setToastMessage("All marks updated and saved to student records!");
                setTimeout(() => setToastMessage(null), 4000);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              Save Marks Register
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="px-5 py-3.5 w-20">Roll</th>
                    <th className="px-5 py-3.5">Student Name</th>
                    <th className="px-5 py-3.5 text-center w-32">Theory (75)</th>
                    <th className="px-5 py-3.5 text-center w-32">Practical (25)</th>
                    <th className="px-5 py-3.5 text-center w-28">Total (100)</th>
                    <th className="px-5 py-3.5 text-center w-20">Grade</th>
                    <th className="px-5 py-3.5">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {marks.map((st) => (
                    <tr key={st.rollNo} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-slate-700">{st.rollNo}</td>
                      <td className="px-5 py-3">
                        <div className="font-semibold text-slate-900">{st.studentName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{st.admissionNo}</div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={75}
                          value={st.theoryMarks}
                          onChange={(e) =>
                            handleMarkChange(st.rollNo, "theory", Number(e.target.value))
                          }
                          className="w-20 px-2 py-1 text-center font-mono text-xs rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                        />
                      </td>
                      <td className="px-5 py-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={25}
                          value={st.practicalMarks}
                          onChange={(e) =>
                            handleMarkChange(st.rollNo, "practical", Number(e.target.value))
                          }
                          className="w-20 px-2 py-1 text-center font-mono text-xs rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                        />
                      </td>
                      <td className="px-5 py-3 text-center font-mono font-bold text-slate-900 text-sm">
                        {st.totalMarks}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`inline-block w-8 py-0.5 rounded text-xs font-bold text-center ${
                            st.grade === "A+"
                              ? "bg-purple-100 text-purple-800"
                              : st.grade === "A"
                              ? "bg-emerald-100 text-emerald-800"
                              : st.grade === "B+" || st.grade === "B"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {st.grade}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs">{st.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESULTS & MARKSHEETS */}
      {activeTab === "results" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marks.slice(0, 6).map((st) => (
              <div
                key={st.rollNo}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{st.studentName}</h4>
                      <p className="text-[11px] text-slate-500">
                        Roll: {st.rollNo} • {st.admissionNo}
                      </p>
                    </div>
                    <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                      {st.grade}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Theory Marks:</span>
                      <strong className="text-slate-800">{st.theoryMarks} / 75</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Practical Marks:</span>
                      <strong className="text-slate-800">{st.practicalMarks} / 25</strong>
                    </div>
                    <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-100">
                      <span>Total Percentage:</span>
                      <span className="text-blue-600">{st.percentage}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passed Exam
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedStudentForMarksheet(st)}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Marksheet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: QUESTION BANK */}
      {activeTab === "questions" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Question Bank Repository</h3>
            <button
              type="button"
              onClick={() => setIsAddQuestionOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Question
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px]">
                    {q.subject} • {q.topic}
                  </span>
                  <span className="font-mono font-bold text-slate-700">{q.marks} Marks</span>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed">{q.questionText}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Difficulty: {q.difficulty}</span>
                  <span className="text-blue-600 hover:underline cursor-pointer">Edit question</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Official Marksheet Preview */}
      {selectedStudentForMarksheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            {/* Header / Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 text-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">
                  Terminal Progress Report
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForMarksheet(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                SUNRISE SECONDARY ENGLISH BOARDING SCHOOL
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Affiliated to National Examination Board (NEB) &bull; Reg: NEB-AFF-88421
              </p>
              <p className="text-[11px] text-slate-500">
                Shantinagar, Ward 31, Kathmandu Metropolitan, Bagmati Province
              </p>
              <div className="mt-3 inline-block bg-slate-900 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Terminal Marksheet &bull; Academic Year 2024 - 2025
              </div>
            </div>

            {/* Student Metadata Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 mt-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Student Name</span>
                <span className="font-bold text-slate-900 text-sm">{selectedStudentForMarksheet.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Roll Number</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{selectedStudentForMarksheet.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Admission No</span>
                <span className="font-mono font-bold text-slate-900">{selectedStudentForMarksheet.admissionNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Class & Section</span>
                <span className="font-bold text-slate-900">Grade 8 - Section A</span>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-2 text-center">Credit</th>
                    <th className="py-2.5 px-2 text-center">Theory (75)</th>
                    <th className="py-2.5 px-2 text-center">Practical (25)</th>
                    <th className="py-2.5 px-2 text-center">Total (100)</th>
                    <th className="py-2.5 px-2 text-center">Grade</th>
                    <th className="py-2.5 px-2 text-center">GP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Mathematics</td>
                    <td className="py-2 px-2 text-center font-mono">4.0</td>
                    <td className="py-2 px-2 text-center font-mono">{selectedStudentForMarksheet.theoryMarks}</td>
                    <td className="py-2 px-2 text-center font-mono">{selectedStudentForMarksheet.practicalMarks}</td>
                    <td className="py-2 px-2 text-center font-mono font-bold">{selectedStudentForMarksheet.totalMarks}</td>
                    <td className="py-2 px-2 text-center font-bold text-purple-700">{selectedStudentForMarksheet.grade}</td>
                    <td className="py-2 px-2 text-center font-mono font-bold">4.0</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">General Science</td>
                    <td className="py-2 px-2 text-center font-mono">4.0</td>
                    <td className="py-2 px-2 text-center font-mono">68</td>
                    <td className="py-2 px-2 text-center font-mono">24</td>
                    <td className="py-2 px-2 text-center font-mono font-bold">92</td>
                    <td className="py-2 px-2 text-center font-bold text-purple-700">A+</td>
                    <td className="py-2 px-2 text-center font-mono font-bold">4.0</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">English Language</td>
                    <td className="py-2 px-2 text-center font-mono">4.0</td>
                    <td className="py-2 px-2 text-center font-mono">64</td>
                    <td className="py-2 px-2 text-center font-mono">22</td>
                    <td className="py-2 px-2 text-center font-mono font-bold">86</td>
                    <td className="py-2 px-2 text-center font-bold text-emerald-700">A</td>
                    <td className="py-2 px-2 text-center font-mono font-bold">3.6</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Social Studies</td>
                    <td className="py-2 px-2 text-center font-mono">4.0</td>
                    <td className="py-2 px-2 text-center font-mono">62</td>
                    <td className="py-2 px-2 text-center font-mono">21</td>
                    <td className="py-2 px-2 text-center font-mono font-bold">83</td>
                    <td className="py-2 px-2 text-center font-bold text-emerald-700">A</td>
                    <td className="py-2 px-2 text-center font-mono font-bold">3.6</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Nepali</td>
                    <td className="py-2 px-2 text-center font-mono">4.0</td>
                    <td className="py-2 px-2 text-center font-mono">60</td>
                    <td className="py-2 px-2 text-center font-mono">22</td>
                    <td className="py-2 px-2 text-center font-mono font-bold">82</td>
                    <td className="py-2 px-2 text-center font-bold text-emerald-700">A</td>
                    <td className="py-2 px-2 text-center font-mono font-bold">3.6</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Computer Science</td>
                    <td className="py-2 px-2 text-center font-mono">3.0</td>
                    <td className="py-2 px-2 text-center font-mono">70</td>
                    <td className="py-2 px-2 text-center font-mono">25</td>
                    <td className="py-2 px-2 text-center font-mono font-bold">95</td>
                    <td className="py-2 px-2 text-center font-bold text-purple-700">A+</td>
                    <td className="py-2 px-2 text-center font-mono font-bold">4.0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Performance Summary Box */}
            <div className="grid grid-cols-4 gap-2 mt-3 bg-blue-50/60 p-3 rounded-xl border border-blue-200/60 text-center text-xs">
              <div>
                <span className="text-[10px] text-blue-800 uppercase font-semibold">Total Marks</span>
                <div className="font-mono font-bold text-blue-900 text-sm">
                  {selectedStudentForMarksheet.totalMarks + 438} / 600
                </div>
              </div>
              <div>
                <span className="text-[10px] text-blue-800 uppercase font-semibold">Percentage</span>
                <div className="font-mono font-bold text-blue-900 text-sm">
                  {Math.round(((selectedStudentForMarksheet.totalMarks + 438) / 600) * 100)}%
                </div>
              </div>
              <div>
                <span className="text-[10px] text-blue-800 uppercase font-semibold">Grade Point (GPA)</span>
                <div className="font-mono font-bold text-blue-900 text-sm">3.80</div>
              </div>
              <div>
                <span className="text-[10px] text-blue-800 uppercase font-semibold">Result Status</span>
                <div className="font-bold text-emerald-700 text-sm">PASSED</div>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-6 pt-10 text-center text-[11px] text-slate-600">
              <div className="border-t border-slate-300 pt-1.5">
                <span className="font-semibold text-slate-800 block">Ms. Neha Sharma</span>
                Class Teacher
              </div>
              <div className="border-t border-slate-300 pt-1.5">
                <span className="font-semibold text-slate-800 block">Exam Controller</span>
                Academic Section
              </div>
              <div className="border-t border-slate-300 pt-1.5">
                <span className="font-semibold text-slate-800 block">Dr. K.P. Adhikari</span>
                Principal (Institutional Seal)
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-5 border-t border-slate-200 mt-6">
              <button
                type="button"
                onClick={() => setSelectedStudentForMarksheet(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 inline-flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Question to Bank */}
      {isAddQuestionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add Question to Repository</h3>
              <button
                type="button"
                onClick={() => setIsAddQuestionOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={newQuestionSubject}
                  onChange={(e) => setNewQuestionSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="General Science">General Science</option>
                  <option value="English">English</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Nepali">Nepali</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Topic / Unit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Linear Equations / Thermodynamics"
                  value={newQuestionTopic}
                  onChange={(e) => setNewQuestionTopic(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Allocated Marks</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newQuestionMarks}
                    onChange={(e) => setNewQuestionMarks(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={newQuestionDifficulty}
                    onChange={(e) => setNewQuestionDifficulty(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question Prompt</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter the full question text with any formulas or constraints..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddQuestionOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Save to Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function ExaminationsView() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 text-xs animate-pulse">
          Loading examinations...
        </div>
      }
    >
      <ExaminationsInner />
    </React.Suspense>
  );
}
