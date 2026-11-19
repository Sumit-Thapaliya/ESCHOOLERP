"use client";

import * as React from "react";
import Link from "next/link";
import {
  HeartHandshake,
  Users,
  GraduationCap,
  Phone,
  Mail,
  Building,
  Briefcase,
  Search,
  Filter,
  Download,
  Plus,
  CheckCircle2,
  MapPin,
  ChevronRight,
  UserCheck,
  ShieldAlert,
  Award,
  Sparkles,
  X,
  CreditCard,
} from "lucide-react";
import { GuardianRecord, GuardianChild } from "./guardian-types";
import { MOCK_GUARDIANS } from "./guardian-mock-data";
import { CreateGuardianModal } from "./create-guardian-modal";

export function GuardiansView() {
  const [guardians, setGuardians] = React.useState<GuardianRecord[]>(MOCK_GUARDIANS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterRelation, setFilterRelation] = React.useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedGuardian, setSelectedGuardian] = React.useState<GuardianRecord | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Calculations
  const totalGuardians = guardians.length;
  const totalChildrenLinked = guardians.reduce((acc, g) => acc + g.children.length, 0);
  const primaryContactsCount = guardians.filter((g) => g.children.some((c) => c.isPrimary)).length;
  const multiChildFamilies = guardians.filter((g) => g.children.length > 1).length;

  // Filter logic
  const filteredGuardians = React.useMemo(() => {
    return guardians.filter((g) => {
      if (filterRelation !== "all" && !g.children.some((c) => c.relation === filterRelation)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = g.person.displayName.toLowerCase().includes(q);
        const matchesPhone = g.person.primaryPhone?.toLowerCase().includes(q) ?? false;
        const matchesEmail = g.person.email?.toLowerCase().includes(q) ?? false;
        const matchesOcc = g.occupation?.toLowerCase().includes(q) ?? false;
        const matchesChild = g.children.some(
          (c) =>
            c.displayName.toLowerCase().includes(q) ||
            c.admissionNo.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesOcc && !matchesChild) {
          return false;
        }
      }
      return true;
    });
  }, [guardians, filterRelation, searchQuery]);

  const handleExportCSV = () => {
    const headers = [
      "Guardian Name",
      "Phone",
      "Email",
      "Occupation",
      "Employer",
      "Linked Children",
    ];
    const rows = filteredGuardians.map((g) => [
      `"${g.person.displayName}"`,
      `"${g.person.primaryPhone || ""}"`,
      `"${g.person.email || ""}"`,
      `"${g.occupation || ""}"`,
      `"${g.employer || ""}"`,
      `"${g.children.map((c) => `${c.displayName} (${c.grade}-${c.section})`).join("; ")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute(
      "download",
      `guardians_directory_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredGuardians.length} guardian records.`);
  };

  const handleCreateSuccess = (newGuardian: GuardianRecord) => {
    setGuardians((prev) => [newGuardian, ...prev]);
    showToast(`Registered guardian ${newGuardian.person.displayName} successfully.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl animate-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Guardians & Family Directory
            </h1>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#2570D3] border border-blue-100">
              {totalGuardians} Guardians
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Registered parents, emergency contacts, sibling family linkages, and primary billing representatives.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2570D3] px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-[#1E5CB0] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Register Guardian
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Registered Guardians</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2570D3]">
              <HeartHandshake className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalGuardians}</div>
          <div className="mt-1 text-xs text-slate-500">Active parent records</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Wards Enrolled</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-700">{totalChildrenLinked}</div>
          <div className="mt-1 text-xs text-slate-500">Linked student wards</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Primary Contact Ratio</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">
            {Math.round((primaryContactsCount / Math.max(1, totalGuardians)) * 100)}%
          </div>
          <div className="mt-1 text-xs text-slate-500">Designated fee/SMS contact</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Sibling Families</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-700">{multiChildFamilies}</div>
          <div className="mt-1 text-xs text-slate-500">2+ enrolled siblings</div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col gap-3 p-4 border-b border-slate-200 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by parent name, child name, admission no, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20 focus:border-[#2570D3]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterRelation}
              onChange={(e) => setFilterRelation(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
            >
              <option value="all">All Relationships</option>
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="guardian">Legal Guardian</option>
            </select>

            {(searchQuery || filterRelation !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterRelation("all");
                }}
                className="rounded-xl border border-dashed border-slate-300 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Guardians Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50/60 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              <tr>
                <th scope="col" className="py-3 px-4">Guardian Profile</th>
                <th scope="col" className="py-3 px-4">Linked Student Wards</th>
                <th scope="col" className="py-3 px-4">Contact Details</th>
                <th scope="col" className="py-3 px-4">Occupation & Employer</th>
                <th scope="col" className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuardians.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <HeartHandshake className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="font-medium text-slate-700">No guardian records found</p>
                    <p className="text-xs text-slate-400 mt-1">Try modifying your search criteria or register a new parent.</p>
                  </td>
                </tr>
              ) : (
                filteredGuardians.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Guardian Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#12294D] text-white text-xs font-semibold shadow-xs">
                          {g.person.displayName.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Er\.)\s*/, "").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block">
                            {g.person.displayName}
                          </span>
                          <span className="text-xs text-slate-500">
                            {g.qualification || "Guardian"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Linked Children */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        {g.children.length === 0 ? (
                          <span className="text-xs text-slate-400 italic">No linked ward</span>
                        ) : (
                          g.children.map((child) => (
                            <div key={child.studentId} className="flex items-center gap-2">
                              <span className="font-medium text-slate-900 text-xs">
                                {child.displayName}
                              </span>
                              <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#2570D3] border border-blue-100">
                                {child.grade} - {child.section}
                              </span>
                              <span className="capitalize text-[10px] text-slate-500">
                                ({child.relation})
                              </span>
                              {child.isPrimary && (
                                <span className="rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-700 border border-emerald-200">
                                  Primary
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </td>

                    {/* Contacts */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1 text-xs">
                        {g.person.primaryPhone && (
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                            <a href={`tel:${g.person.primaryPhone}`} className="hover:text-[#2570D3]">
                              {g.person.primaryPhone}
                            </a>
                          </div>
                        )}
                        {g.person.email && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[180px]">{g.person.email}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Occupation */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-medium text-slate-800">
                        {g.occupation || "N/A"}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                        {g.employer || "Private / Self"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedGuardian(g)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-[#2570D3] hover:bg-[#2570D3] hover:text-white transition-colors"
                      >
                        Family Card
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer / Modal: Family Card */}
      {selectedGuardian && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-lg p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2570D3]">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {selectedGuardian.person.displayName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedGuardian.occupation} &bull; {selectedGuardian.employer}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuardian(null)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Primary Phone</span>
                  <span className="font-semibold text-slate-900">{selectedGuardian.person.primaryPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Email Address</span>
                  <span className="font-semibold text-slate-900">{selectedGuardian.person.email || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Qualification</span>
                  <span className="font-semibold text-slate-900">{selectedGuardian.qualification || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Address</span>
                  <span className="font-semibold text-slate-900">{selectedGuardian.person.address || "Kathmandu"}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Enrolled Wards in Institution</h4>
                <div className="space-y-2">
                  {selectedGuardian.children.map((child) => (
                    <div
                      key={child.studentId}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-2xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 text-xs">{child.displayName}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {child.admissionNo} &bull; {child.grade} ({child.section})
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-[#2570D3] capitalize">
                          {child.relation}
                        </span>
                        {child.isPrimary && (
                          <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">
                            Primary Contact
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedGuardian(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                Close Family Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register Guardian */}
      <CreateGuardianModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
