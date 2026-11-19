"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  GraduationCap,
  Briefcase,
  UserCheck,
  UserPlus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Building,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown,
  Car,
  Award,
  Layers,
  BookOpen,
  Sparkles,
} from "lucide-react";
import {
  StaffMember,
  StaffKind,
  StaffStatus,
} from "./staff-types";
import {
  MOCK_STAFF_MEMBERS,
  MOCK_DEPARTMENTS,
  MOCK_DESIGNATIONS,
  MOCK_CAMPUSES,
} from "./staff-mock-data";
import { OnboardStaffModal } from "./onboard-staff-modal";
import { ChangeStatusModal } from "./change-status-modal";

function StaffViewInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [staffList, setStaffList] = React.useState<StaffMember[]>(MOCK_STAFF_MEMBERS);
  const [selectedTab, setSelectedTab] = React.useState<"all" | "teaching" | "support" | "departments">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterDepartment, setFilterDepartment] = React.useState<string>("all");

  const [isOnboardOpen, setIsOnboardOpen] = React.useState(false);
  const [statusTargetStaff, setStatusTargetStaff] = React.useState<StaffMember | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const getStaffDetailHref = (id: string) => {
    const base = pathname ? pathname.replace(/\/$/, "") : "/staff";
    return `${base}/${id}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Calculations
  const totalStaff = staffList.length;
  const teachingCount = staffList.filter((s) => s.staffType === "teaching").length;
  const adminSupportCount = staffList.filter((s) =>
    ["admin", "non_teaching", "support", "driver", "management"].includes(s.staffType)
  ).length;
  const activeCount = staffList.filter((s) => s.status === "active").length;
  const onLeaveCount = staffList.filter((s) => s.status === "on_leave").length;

  // Filtered staff members
  const filteredStaff = React.useMemo(() => {
    return staffList.filter((staff) => {
      // Tab filter
      if (selectedTab === "teaching" && staff.staffType !== "teaching") {
        return false;
      }
      if (
        selectedTab === "support" &&
        !["support", "driver", "non_teaching", "admin"].includes(staff.staffType)
      ) {
        return false;
      }

      // Dropdown filters
      if (filterType !== "all" && staff.staffType !== filterType) {
        return false;
      }
      if (filterStatus !== "all" && staff.status !== filterStatus) {
        return false;
      }
      if (filterDepartment !== "all" && staff.department?.name !== filterDepartment) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = staff.person.displayName.toLowerCase().includes(q);
        const matchesCode = staff.employeeCode.toLowerCase().includes(q);
        const matchesDept = staff.department?.name.toLowerCase().includes(q) ?? false;
        const matchesDesig = staff.designation?.name.toLowerCase().includes(q) ?? false;
        const matchesSpec = staff.teacherProfile?.specialization?.toLowerCase().includes(q) ?? false;
        if (!matchesName && !matchesCode && !matchesDept && !matchesDesig && !matchesSpec) {
          return false;
        }
      }

      return true;
    });
  }, [staffList, selectedTab, filterType, filterStatus, filterDepartment, searchQuery]);

  const handleOnboardSuccess = (newStaff: StaffMember) => {
    setStaffList((prev) => [newStaff, ...prev]);
    showToast(`Successfully onboarded ${newStaff.person.displayName} (${newStaff.employeeCode})`);
  };

  const handleStatusSave = (
    newStatus: StaffStatus,
    leavingDate?: string,
    leavingReason?: string
  ) => {
    if (!statusTargetStaff) return;
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === statusTargetStaff.id) {
          return {
            ...s,
            status: newStatus,
            leavingDate: leavingDate || s.leavingDate,
            leavingReason: leavingReason || s.leavingReason,
          };
        }
        return s;
      })
    );
    showToast(`Status for ${statusTargetStaff.person.displayName} updated to ${newStatus.replace("_", " ")}.`);
    setStatusTargetStaff(null);
  };

  const handleExportCSV = () => {
    const headers = [
      "Employee Code",
      "Full Name",
      "Staff Type",
      "Designation",
      "Department",
      "Status",
      "Primary Contact",
      "Joining Date",
    ];
    const rows = filteredStaff.map((s) => [
      s.employeeCode,
      `"${s.person.displayName}"`,
      s.staffType,
      `"${s.designation?.name || "N/A"}"`,
      `"${s.department?.name || "N/A"}"`,
      s.status,
      `"${s.person.contacts?.find((c) => c.isPrimary)?.value || s.person.contacts?.[0]?.value || ""}"`,
      s.joiningDate,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `staff_directory_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredStaff.length} staff records to CSV.`);
  };

  const getStatusBadge = (status: StaffStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case "on_leave":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3 text-amber-600" />
            On Leave
          </span>
        );
      case "resigned":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
            Resigned
          </span>
        );
      case "retired":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
            Retired
          </span>
        );
      case "terminated":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 border border-rose-200">
            <ShieldAlert className="h-3 w-3 text-rose-600" />
            Terminated
          </span>
        );
    }
  };

  const getTypeBadge = (type: StaffKind) => {
    switch (type) {
      case "teaching":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-100">
            <GraduationCap className="h-3 w-3" />
            Teaching
          </span>
        );
      case "admin":
      case "management":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700 border border-purple-100">
            <Briefcase className="h-3 w-3" />
            {type === "management" ? "Leadership" : "Admin"}
          </span>
        );
      case "driver":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-100">
            <Car className="h-3 w-3" />
            Driver
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
            Support
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
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
              Staff & Faculty Directory
            </h1>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#2570D3] border border-blue-100">
              {totalStaff} Members
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage teaching faculty, administrative personnel, support staff, and designations per institution structure.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={() => setIsOnboardOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2570D3] px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-[#1E5CB0] transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Onboard Employee
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Staff</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2570D3]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalStaff}</div>
          <div className="mt-1 text-xs text-slate-500">All registered workforce</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Teaching Faculty</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{teachingCount}</div>
          <div className="mt-1 text-xs text-slate-500">Subject teachers & tutors</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Admin & Logistics</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{adminSupportCount}</div>
          <div className="mt-1 text-xs text-slate-500">Operations, drivers, accounts</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active on Duty</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">{activeCount}</div>
          <div className="mt-1 text-xs text-slate-500">
            {onLeaveCount > 0 ? `${onLeaveCount} currently on leave` : "All on active duty"}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/75 px-4 pt-3 gap-2 overflow-x-auto">
          {[
            { id: "all", label: "All Staff", count: totalStaff },
            { id: "teaching", label: "Teaching Faculty", count: teachingCount },
            { id: "support", label: "Support & Drivers", count: adminSupportCount },
            { id: "departments", label: "Departments & Roles", count: MOCK_DEPARTMENTS.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-3 pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
                selectedTab === tab.id
                  ? "border-[#2570D3] text-[#2570D3] font-semibold"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  selectedTab === tab.id
                    ? "bg-blue-100 text-[#2570D3]"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {selectedTab !== "departments" ? (
          <div>
            {/* Filter and Search Bar */}
            <div className="flex flex-col gap-3 p-4 border-b border-slate-200 lg:flex-row lg:items-center lg:justify-between bg-white">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, employee ID, department, specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20 focus:border-[#2570D3]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Staff Type */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
                >
                  <option value="all">All Roles</option>
                  <option value="teaching">Teaching</option>
                  <option value="admin">Administration</option>
                  <option value="driver">Driver</option>
                  <option value="support">Support</option>
                  <option value="management">Management</option>
                </select>

                {/* Status */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="on_leave">On Leave</option>
                  <option value="resigned">Resigned</option>
                  <option value="retired">Retired</option>
                  <option value="terminated">Terminated</option>
                </select>

                {/* Department */}
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
                >
                  <option value="all">All Departments</option>
                  {MOCK_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>

                {(searchQuery || filterType !== "all" || filterStatus !== "all" || filterDepartment !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterType("all");
                      setFilterStatus("all");
                      setFilterDepartment("all");
                    }}
                    className="rounded-xl border border-dashed border-slate-300 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Staff Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50/60 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="py-3 px-4">Employee</th>
                    <th scope="col" className="py-3 px-4">Role & Designation</th>
                    <th scope="col" className="py-3 px-4">Department & Campus</th>
                    <th scope="col" className="py-3 px-4">Contact</th>
                    <th scope="col" className="py-3 px-4">Status</th>
                    <th scope="col" className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <Users className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                        <p className="font-medium text-slate-700">No staff members match the selected filters</p>
                        <p className="text-xs text-slate-400 mt-1">Try clearing your search query or dropdown filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((staff) => {
                      const primaryEmail = staff.person.contacts?.find((c) => c.type === "email")?.value;
                      const primaryPhone = staff.person.contacts?.find((c) => c.type === "phone")?.value;

                      return (
                        <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors group">
                          {/* Employee Identity */}
                          <td className="py-3.5 px-4">
                            <Link
                              href={getStaffDetailHref(staff.id)}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#12294D] text-white text-xs font-semibold shadow-xs">
                                {staff.person.displayName.replace(/^(Dr\.|Ms\.|Mr\.|Er\.)\s*/, "").slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 group-hover:text-[#2570D3] transition-colors flex items-center gap-1.5">
                                  {staff.person.displayName}
                                </span>
                                <span className="text-xs font-mono text-slate-500">
                                  {staff.employeeCode}
                                </span>
                              </div>
                            </Link>
                          </td>

                          {/* Role & Designation */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span className="text-xs font-medium text-slate-800">
                                {staff.designation?.name || "Staff Member"}
                              </span>
                              {getTypeBadge(staff.staffType)}
                            </div>
                          </td>

                          {/* Department & Campus */}
                          <td className="py-3.5 px-4">
                            <div className="text-xs text-slate-800 font-medium flex items-center gap-1">
                              <Building className="h-3 w-3 text-slate-400 shrink-0" />
                              <span>{staff.department?.name || "General"}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                              <span>{staff.campus?.name || "Main Campus"}</span>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="py-3.5 px-4">
                            {primaryEmail && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[180px]">{primaryEmail}</span>
                              </div>
                            )}
                            {primaryPhone && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                                <span>{primaryPhone}</span>
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {getStatusBadge(staff.status)}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={getStaffDetailHref(staff.id)}
                                className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-[#2570D3] hover:bg-[#2570D3] hover:text-white transition-colors"
                              >
                                Profile
                              </Link>
                              <button
                                onClick={() => setStatusTargetStaff(staff)}
                                className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                              >
                                Status
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Departments & Designations Tab */
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Academic & Administrative Departments</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Overview of institution faculties, staff counts, and appointed department heads.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_DEPARTMENTS.map((dept) => {
                const members = staffList.filter((s) => s.department?.id === dept.id);
                return (
                  <div
                    key={dept.id}
                    className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-[#2570D3]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2570D3]">
                        <Building className="h-4 w-4" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {members.length} {members.length === 1 ? "staff" : "staffs"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-sm font-semibold text-slate-900 line-clamp-1">{dept.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">Main Campus &bull; Bagmati</p>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-medium text-slate-500 mb-1">Key Personnel:</div>
                      {members.length > 0 ? (
                        <div className="space-y-1">
                          {members.slice(0, 2).map((m) => (
                            <Link
                              key={m.id}
                              href={getStaffDetailHref(m.id)}
                              className="text-xs text-[#2570D3] hover:underline block truncate"
                            >
                              {m.person.displayName} ({m.designation?.name})
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No assigned staff</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Designations Hierarchy */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h2 className="text-base font-semibold text-slate-900 mb-3">Institutional Designations</h2>
              <div className="flex flex-wrap gap-2">
                {MOCK_DESIGNATIONS.map((desig) => {
                  const count = staffList.filter((s) => s.designation?.id === desig.id).length;
                  return (
                    <div
                      key={desig.id}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs"
                    >
                      <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                      <span className="font-medium text-slate-800">{desig.name}</span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Onboard Staff Modal */}
      <OnboardStaffModal
        isOpen={isOnboardOpen}
        onClose={() => setIsOnboardOpen(false)}
        onSuccess={handleOnboardSuccess}
      />

      {/* Change Status Modal */}
      {statusTargetStaff && (
        <ChangeStatusModal
          staff={statusTargetStaff}
          isOpen={true}
          onClose={() => setStatusTargetStaff(null)}
          onSave={handleStatusSave}
        />
      )}
    </div>
  );
}

export function StaffView() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#2570D3]" />
        </div>
      }
    >
      <StaffViewInner />
    </React.Suspense>
  );
}
