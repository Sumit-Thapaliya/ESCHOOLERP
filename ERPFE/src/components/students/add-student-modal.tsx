"use client";

import * as React from "react";
import { X, Check, ArrowRight, ArrowLeft, Save, UserPlus } from "lucide-react";
import { GRADES_LIST, SECTIONS_LIST } from "./student-mock-data";
import type { Student } from "./student-types";
import { toast } from "sonner";
import { cn } from "cn";

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
  onStudentCreated: (newStudent: Partial<Student>) => void;
}

export function AddStudentModal({
  open,
  onClose,
  onStudentCreated,
}: AddStudentModalProps) {
  const [currentStep, setCurrentStep] = React.useState(1);

  // Form fields state
  const [fullName, setFullName] = React.useState("");
  const [gender, setGender] = React.useState<"Male" | "Female" | "Other">("Male");
  const [dobBS, setDobBS] = React.useState("2072-05-15");
  const [dobAD, setDobAD] = React.useState("2015-08-31");
  const [bloodGroup, setBloodGroup] = React.useState("O+");

  const [grade, setGrade] = React.useState("Grade 1");
  const [section, setSection] = React.useState("A");
  const [rollNo, setRollNo] = React.useState("01-08");
  const [campusId, setCampusId] = React.useState<"ktm" | "lal" | "pkr">("ktm");

  const [guardianName, setGuardianName] = React.useState("");
  const [guardianRelation, setGuardianRelation] = React.useState<"Father" | "Mother" | "Guardian">("Father");
  const [guardianPhone, setGuardianPhone] = React.useState("");
  const [guardianEmail, setGuardianEmail] = React.useState("");

  const [municipality, setMunicipality] = React.useState("Kathmandu Metropolitan");
  const [ward, setWard] = React.useState("Ward 10");
  const [street, setStreet] = React.useState("");
  const [district, setDistrict] = React.useState("Kathmandu");

  if (!open) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1 && !fullName.trim()) {
      toast.error("Please enter the student full name");
      return;
    }
    if (currentStep === 3 && (!guardianName.trim() || !guardianPhone.trim())) {
      toast.error("Please provide guardian name and emergency phone");
      return;
    }
    if (currentStep < 5) {
      setCurrentStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const admissionNo = `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent: Partial<Student> = {
      id: `std-${Date.now()}`,
      admissionNo,
      rollNo,
      fullName,
      gender,
      dobBS,
      dobAD,
      bloodGroup,
      campusId,
      campusName:
        campusId === "ktm"
          ? "Main Campus (Kathmandu)"
          : campusId === "lal"
          ? "City Wing (Lalitpur)"
          : "West Campus (Pokhara)",
      grade,
      section,
      status: "Active",
      joinedDate: "2026-04-15",
      address: {
        street: street || "Main Street",
        ward: ward || "Ward 1",
        municipality,
        district,
      },
      guardians: [
        {
          relation: guardianRelation,
          name: guardianName || "Parent",
          phone: guardianPhone || "+977 9800000000",
          email: guardianEmail || undefined,
          isEmergencyContact: true,
        },
      ],
      attendancePct: 100,
      totalPresentDays: 1,
      totalSchoolDays: 1,
      feeStatus: "Paid",
      pendingDueNpr: 0,
      documents: [],
      results: [],
      feeLedger: [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          date: "2026-04-15",
          title: "Admitted into school",
          description: `Registered in ${grade}-${section} under ${admissionNo}.`,
          type: "admission",
        },
      ],
    };

    onStudentCreated(newStudent);
    toast.success(`Student ${fullName} registered successfully!`);
    onClose();
  };

  const STEPS = [
    { num: 1, title: "Personal" },
    { num: 2, title: "Academic" },
    { num: 3, title: "Guardians" },
    { num: 4, title: "Address" },
    { num: 5, title: "Confirm" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2570D3]/10 text-[#2570D3]">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">
                Enroll new student
              </h3>
              <p className="text-xs text-slate-500">
                Step {currentStep} of 5: {STEPS[currentStep - 1].title} details
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Multi-step Progress Bar */}
        <div className="mt-4 flex items-center justify-between px-2">
          {STEPS.map((step) => (
            <div key={step.num} className="flex items-center gap-1.5 text-xs">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors",
                  currentStep === step.num
                    ? "bg-[#2570D3] text-white"
                    : currentStep > step.num
                    ? "bg-[#1F9D6B] text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {currentStep > step.num ? <Check className="h-3 w-3" /> : step.num}
              </div>
              <span
                className={cn(
                  "hidden sm:inline font-medium text-[11px]",
                  currentStep === step.num
                    ? "text-[#2570D3] font-semibold"
                    : "text-slate-400"
                )}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Step Forms */}
        <form onSubmit={handleNext} className="mt-6 space-y-4 text-xs">
          {/* STEP 1: PERSONAL */}
          {currentStep === 1 && (
            <div className="space-y-3.5">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Full student name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwash Rai"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#2570D3] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Blood group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Date of birth (B.S.)
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={dobBS}
                    onChange={(e) => setDobBS(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Date of birth (A.D.)
                  </label>
                  <input
                    type="date"
                    value={dobAD}
                    onChange={(e) => setDobAD(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ACADEMIC */}
          {currentStep === 2 && (
            <div className="space-y-3.5">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Enrolling campus
                </label>
                <select
                  value={campusId}
                  onChange={(e) => setCampusId(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white"
                >
                  <option value="ktm">Main Campus (Kathmandu)</option>
                  <option value="lal">City Wing (Lalitpur)</option>
                  <option value="pkr">West Campus (Pokhara)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Grade / Class
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    {GRADES_LIST.filter((g) => g !== "All grades").map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    {SECTIONS_LIST.filter((s) => s !== "All sections").map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Assigned roll number
                </label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 3: GUARDIANS */}
          {currentStep === 3 && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Guardian relation
                  </label>
                  <select
                    value={guardianRelation}
                    onChange={(e) => setGuardianRelation(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Local Guardian</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Guardian name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwar Rai"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Primary mobile number (SMS alerts) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+977 98XXXXXXXX"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Email address (optional)
                </label>
                <input
                  type="email"
                  placeholder="parent@example.com"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 4: ADDRESS */}
          {currentStep === 4 && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Municipality / Palika
                  </label>
                  <input
                    type="text"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Ward number
                  </label>
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Street / Tole
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Minbhawan Marga"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMATION */}
          {currentStep === 5 && (
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60 space-y-3">
              <p className="font-semibold text-slate-900">
                Please verify new enrollment details:
              </p>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400">Student:</span>
                  <p className="font-semibold">{fullName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Class & Roll:</span>
                  <p className="font-semibold">
                    {grade} ({section}) • {rollNo}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Guardian:</span>
                  <p className="font-semibold">{guardianName} ({guardianRelation})</p>
                </div>
                <div>
                  <span className="text-slate-400">Contact:</span>
                  <p className="font-semibold">{guardianPhone}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                Admission record and student account will be initialized with status "Active".
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2570D3] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#1C5BB0] transition-colors"
              >
                <span>{currentStep === 5 ? "Confirm & enroll" : "Next step"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
