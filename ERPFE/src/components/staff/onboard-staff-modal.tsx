"use client";

import * as React from "react";
import { X, UserPlus, Check, Building, Briefcase, Award } from "lucide-react";
import {
  StaffMember,
  StaffKind,
  EmploymentKind,
} from "./staff-types";
import {
  MOCK_CAMPUSES,
  MOCK_DEPARTMENTS,
  MOCK_DESIGNATIONS,
} from "./staff-mock-data";

interface OnboardStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newStaff: StaffMember) => void;
}

export function OnboardStaffModal({
  isOpen,
  onClose,
  onSuccess,
}: OnboardStaffModalProps) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [gender, setGender] = React.useState<"male" | "female" | "other">("female");
  const [dob, setDob] = React.useState("1990-05-15");
  const [bloodGroup, setBloodGroup] = React.useState("O+");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const [staffType, setStaffType] = React.useState<StaffKind>("teaching");
  const [employmentType, setEmploymentType] = React.useState<EmploymentKind>("permanent");
  const [departmentId, setDepartmentId] = React.useState(MOCK_DEPARTMENTS[0].id);
  const [designationId, setDesignationId] = React.useState(MOCK_DESIGNATIONS[1].id);
  const [joiningDate, setJoiningDate] = React.useState("2025-04-01");

  // Teacher specific
  const [specialization, setSpecialization] = React.useState("Mathematics");
  const [highestQualification, setHighestQualification] = React.useState("M.Ed.");
  const [experienceYears, setExperienceYears] = React.useState(5);

  // Driver specific
  const [licenseNo, setLicenseNo] = React.useState("01-06-88419201");
  const [licenseExpiry, setLicenseExpiry] = React.useState("2030-01-01");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) return;

    const department = MOCK_DEPARTMENTS.find((d) => d.id === departmentId);
    const designation = MOCK_DESIGNATIONS.find((d) => d.id === designationId);

    const generatedCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStaff: StaffMember = {
      id: `stf-${Date.now()}`,
      employeeCode: generatedCode,
      staffType,
      status: "active",
      employmentType,
      joiningDate,
      campus: MOCK_CAMPUSES[0],
      department: department || null,
      designation: designation || null,
      person: {
        id: `per-${Date.now()}`,
        displayName: `${firstName.trim()} ${lastName.trim()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
        dob,
        bloodGroup,
        contacts: [
          ...(email ? [{ type: "email" as const, value: email.trim(), isPrimary: true }] : []),
          ...(phone ? [{ type: "phone" as const, value: phone.trim(), isPrimary: false }] : []),
        ],
      },
      teacherProfile:
        staffType === "teaching"
          ? {
              highestQualification,
              specialization,
              experienceYears: Number(experienceYears),
              maxWeeklyPeriods: 30,
            }
          : null,
      driverProfile:
        staffType === "driver"
          ? {
              licenseNo,
              licenseExpiry,
            }
          : null,
      qualifications:
        highestQualification
          ? [
              {
                id: `q-${Date.now()}`,
                degree: highestQualification,
                institution: "University Board",
                passedYear: 2018,
                grade: "First Division",
              },
            ]
          : [],
    };

    onSuccess(newStaff);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">Onboard New Staff Member</h3>
            <p className="text-xs text-slate-500">
              Implements Swagger API <code>POST /staff</code> with inline person and role profiles
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Section 1: Person Identity */}
          <div className="space-y-3 pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              1. Personal Information (Person Entity)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gita"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rai"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="gita.rai@sunrise.edu.np"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Phone</label>
                <input
                  type="text"
                  placeholder="+977 9841234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Employment Details */}
          <div className="space-y-3 pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              2. Employment Role & Placement
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Staff Classification (StaffKind)</label>
                <select
                  value={staffType}
                  onChange={(e) => setStaffType(e.target.value as StaffKind)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="teaching">Teaching Faculty (Teacher)</option>
                  <option value="admin">Administrative Staff</option>
                  <option value="driver">Transport Bus Driver</option>
                  <option value="support">Support & Operations</option>
                  <option value="management">Executive Management</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employment Terms</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as EmploymentKind)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="permanent">Permanent Appointment</option>
                  <option value="contract">Fixed-Term Contract</option>
                  <option value="visiting">Visiting Faculty</option>
                  <option value="part_time">Part-Time</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Department</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {MOCK_DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Designation</label>
                <select
                  value={designationId}
                  onChange={(e) => setDesignationId(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {MOCK_DESIGNATIONS.map((des) => (
                    <option key={des.id} value={des.id}>
                      {des.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Joining</label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Conditional Profile (Teacher vs Driver) */}
          {staffType === "teaching" && (
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-3">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Teacher Profile (Required for Teaching Staff)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-medium text-blue-900 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-blue-900 mb-1">Highest Degree</label>
                  <input
                    type="text"
                    value={highestQualification}
                    onChange={(e) => setHighestQualification(e.target.value)}
                    placeholder="e.g. M.Ed."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-blue-900 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    step={0.5}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {staffType === "driver" && (
            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Driver Profile (Required for Drivers)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-amber-900 mb-1">Driving License Number</label>
                  <input
                    type="text"
                    required
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    placeholder="01-06-88419201"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-amber-900 mb-1">License Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={licenseExpiry}
                    onChange={(e) => setLicenseExpiry(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold shadow-xs"
            >
              Save & Onboard Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
