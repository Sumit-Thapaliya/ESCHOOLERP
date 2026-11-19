"use client";

import * as React from "react";
import { X, UserPlus, HeartHandshake, Phone, Mail, Building, Briefcase, GraduationCap } from "lucide-react";
import { GuardianRecord, GuardianRelation } from "./guardian-types";

interface CreateGuardianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newGuardian: GuardianRecord) => void;
}

export function CreateGuardianModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateGuardianModalProps) {
  const [salutation, setSalutation] = React.useState("Mr.");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [relation, setRelation] = React.useState<GuardianRelation>("father");
  const [isPrimary, setIsPrimary] = React.useState(true);
  const [occupation, setOccupation] = React.useState("");
  const [employer, setEmployer] = React.useState("");
  const [qualification, setQualification] = React.useState("");
  const [studentName, setStudentName] = React.useState("");
  const [gradeSection, setGradeSection] = React.useState("Grade 8 - A");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) return;

    const fullDisplayName = `${salutation} ${firstName.trim()} ${lastName.trim()}`;
    const newRecord: GuardianRecord = {
      id: `grd-${Date.now()}`,
      personId: `per-${Date.now()}`,
      qualification: qualification.trim() || null,
      occupation: occupation.trim() || null,
      employer: employer.trim() || null,
      annualIncome: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      person: {
        id: `per-${Date.now()}`,
        displayName: fullDisplayName,
        primaryPhone: phone.trim(),
        email: email.trim() || null,
        address: "Kathmandu Valley",
      },
      children: studentName.trim()
        ? [
            {
              studentId: `stu-${Date.now()}`,
              admissionNo: `ADM-2026-${Math.floor(10000 + Math.random() * 90000)}`,
              displayName: studentName.trim(),
              grade: gradeSection.split(" - ")[0] || "Grade 8",
              section: gradeSection.split(" - ")[1] || "A",
              status: "enrolled",
              relation: relation,
              isPrimary: isPrimary,
            },
          ]
        : [],
    };

    onSuccess(newRecord);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2570D3]">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Register Parent / Guardian</h3>
              <p className="text-xs text-slate-500">Record guardian details and link with enrolled wards</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Identity */}
          <div className="grid grid-cols-12 gap-2.5">
            <div className="col-span-3">
              <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
              <select
                value={salutation}
                onChange={(e) => setSalutation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
              >
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
                <option value="Er.">Er.</option>
              </select>
            </div>
            <div className="col-span-4">
              <label className="block text-xs font-medium text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
              />
            </div>
            <div className="col-span-5">
              <label className="block text-xs font-medium text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Thapa"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Primary Mobile *</label>
              <input
                type="text"
                required
                placeholder="+977 98XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="parent@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
              />
            </div>
          </div>

          {/* Professional Background */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Occupation</label>
              <input
                type="text"
                placeholder="e.g. Civil Engineer"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Organization / Employer</label>
              <input
                type="text"
                placeholder="e.g. Ministry of Physical Inf."
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Highest Qualification</label>
            <input
              type="text"
              placeholder="e.g. B.E. / Master's / Ph.D."
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
            />
          </div>

          {/* Child Linkage */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-3">
            <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
              <span>Link Student / Ward</span>
              <span className="text-[11px] font-normal text-slate-500">Optional (Can link later)</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Student Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Thapa"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Relationship</label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
                >
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="guardian">Legal Guardian</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrimary"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#2570D3] focus:ring-[#2570D3]"
              />
              <label htmlFor="isPrimary" className="text-xs text-slate-700">
                Primary emergency & billing contact for this student
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#2570D3] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E5CB0] transition-colors"
            >
              Save Guardian Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
