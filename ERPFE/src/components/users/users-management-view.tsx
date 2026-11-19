"use client";

import * as React from "react";
import {
  Users,
  ShieldCheck,
  KeyRound,
  Lock,
  Unlock,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  ShieldAlert,
  X,
  Plus,
  RefreshCw,
  Sliders,
  Check,
  Eye,
  Calendar,
  Smartphone,
  Mail,
  UserX,
} from "lucide-react";
import type { User, UserStatus, UserRoleAssignment } from "@/lib/api/types";
import {
  MOCK_USERS_DATA,
  MOCK_ROLES,
  MOCK_AUDIT_LOGS,
  SystemRoleDefinition,
  AuditLogEntry,
} from "./users-mock-data";

export function UsersManagementView() {
  const [activeTab, setActiveTab] = React.useState<"users" | "roles" | "audit">("users");
  const [users, setUsers] = React.useState<User[]>(MOCK_USERS_DATA);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterRole, setFilterRole] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [resetTargetUser, setResetTargetUser] = React.useState<User | null>(null);
  const [roleAssignTargetUser, setRoleAssignTargetUser] = React.useState<User | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Form states
  const [newUsername, setNewUsername] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newPhone, setNewPhone] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [newRoleCode, setNewRoleCode] = React.useState("teacher");
  const [newMfa, setNewMfa] = React.useState(false);

  // Reset password form state
  const [resetPasswordVal, setResetPasswordVal] = React.useState("");
  const [forceChangeNextLogin, setForceChangeNextLogin] = React.useState(true);

  // Role assign form state
  const [assignRoleCode, setAssignRoleCode] = React.useState("teacher");
  const [assignScopeType, setAssignScopeType] = React.useState<"institution" | "campus" | "department">("institution");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI counts
  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.status === "active").length;
  const suspendedCount = users.filter((u) => u.status === "suspended" || u.status === "disabled").length;
  const mfaCount = users.filter((u) => u.mfaEnabled).length;

  // Filtered users
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      if (filterStatus !== "all" && u.status !== filterStatus) return false;
      if (filterRole !== "all" && !u.roles.some((r) => r.code === filterRole)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesUsername = u.username?.toLowerCase().includes(q) ?? false;
        const matchesEmail = u.email?.toLowerCase().includes(q) ?? false;
        const matchesPhone = u.phone?.toLowerCase().includes(q) ?? false;
        const matchesRole = u.roles.some((r) => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q));
        if (!matchesUsername && !matchesEmail && !matchesPhone && !matchesRole) {
          return false;
        }
      }
      return true;
    });
  }, [users, filterStatus, filterRole, searchQuery]);

  const handleStatusToggle = (user: User, nextStatus: UserStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus, lockedUntil: null } : u))
    );
    showToast(`Account ${user.username ?? user.email} marked as ${nextStatus}.`);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() && !newEmail.trim()) {
      showToast("Please provide either username or email");
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      username: newUsername.trim() || null,
      email: newEmail.trim() || null,
      phone: newPhone.trim() || null,
      status: "active",
      mustChangePassword: true,
      mfaEnabled: newMfa,
      locale: "en",
      lockedUntil: null,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
      roles: [
        {
          assignmentId: `asg-${Date.now()}`,
          code: newRoleCode,
          name: MOCK_ROLES.find((r) => r.code === newRoleCode)?.name || newRoleCode,
          scopeType: "institution",
          scopeId: null,
          validFrom: new Date().toISOString().split("T")[0],
          validTo: null,
        },
      ],
    };

    setUsers([newUser, ...users]);
    setIsCreateOpen(false);
    setNewUsername("");
    setNewEmail("");
    setNewPhone("");
    setNewPassword("");
    showToast(`User account ${newUser.username ?? newUser.email} created successfully.`);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser) return;
    if (resetPasswordVal.length < 8) {
      showToast("Password must be at least 8 characters long");
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === resetTargetUser.id
          ? { ...u, mustChangePassword: forceChangeNextLogin, lockedUntil: null }
          : u
      )
    );
    showToast(`Password successfully reset for ${resetTargetUser.username ?? resetTargetUser.email}.`);
    setResetTargetUser(null);
    setResetPasswordVal("");
  };

  const handleAssignRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleAssignTargetUser) return;

    const roleDef = MOCK_ROLES.find((r) => r.code === assignRoleCode);
    const newAssignment: UserRoleAssignment = {
      assignmentId: `asg-${Date.now()}`,
      code: assignRoleCode,
      name: roleDef?.name || assignRoleCode,
      scopeType: assignScopeType,
      scopeId: null,
      validFrom: new Date().toISOString().split("T")[0],
      validTo: null,
    };

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== roleAssignTargetUser.id) return u;
        // Avoid duplicate assignment of same role
        if (u.roles.some((r) => r.code === assignRoleCode)) return u;
        return { ...u, roles: [...u.roles, newAssignment] };
      })
    );

    showToast(`Assigned role ${roleDef?.name} to ${roleAssignTargetUser.username ?? roleAssignTargetUser.email}.`);
    setRoleAssignTargetUser(null);
  };

  const handleRevokeRole = (user: User, assignmentId: string, roleName: string) => {
    if (user.roles.length <= 1) {
      showToast("A user must have at least one active assigned role.");
      return;
    }
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== user.id) return u;
        return { ...u, roles: u.roles.filter((r) => r.assignmentId !== assignmentId) };
      })
    );
    showToast(`Revoked role ${roleName} from ${user.username ?? user.email}.`);
  };

  const handleExportCSV = () => {
    const headers = ["Username", "Email", "Phone", "Status", "Roles", "MFA", "Last Login"];
    const rows = filteredUsers.map((u) => [
      `"${u.username || ""}"`,
      `"${u.email || ""}"`,
      `"${u.phone || ""}"`,
      u.status,
      `"${u.roles.map((r) => r.name).join(", ")}"`,
      u.mfaEnabled ? "Enabled" : "Disabled",
      u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `school_users_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredUsers.length} user records.`);
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
              Users & Access Control
            </h1>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#2570D3] border border-blue-100">
              {totalUsers} Accounts
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Authentication credentials, multi-factor authorization, institutional role grants, and security audits.
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
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2570D3] px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-[#1E5CB0] transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            New User
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Accounts</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2570D3]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalUsers}</div>
          <div className="mt-1 text-xs text-slate-500">Registered school users</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Accounts</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">{activeCount}</div>
          <div className="mt-1 text-xs text-slate-500">Permitted for login</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">MFA Protected</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <KeyRound className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-700">{mfaCount}</div>
          <div className="mt-1 text-xs text-slate-500">Two-factor enabled</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Suspended / Inactive</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-700">{suspendedCount}</div>
          <div className="mt-1 text-xs text-slate-500">Blocked from access</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/75 px-4 pt-3 gap-2 overflow-x-auto">
          {[
            { id: "users", label: "User Accounts", count: totalUsers },
            { id: "roles", label: "Roles & Permissions", count: MOCK_ROLES.length },
            { id: "audit", label: "Security Audit Logs", count: MOCK_AUDIT_LOGS.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-3 pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#2570D3] text-[#2570D3] font-semibold"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-[#2570D3]"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab 1: User Accounts Table */}
        {activeTab === "users" && (
          <div>
            {/* Filter Bar */}
            <div className="flex flex-col gap-3 p-4 border-b border-slate-200 lg:flex-row lg:items-center lg:justify-between bg-white">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search username, email, phone or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20 focus:border-[#2570D3]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Role filter */}
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
                >
                  <option value="all">All Roles</option>
                  {MOCK_ROLES.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name}
                    </option>
                  ))}
                </select>

                {/* Status filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="disabled">Disabled</option>
                </select>

                {(searchQuery || filterRole !== "all" || filterStatus !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterRole("all");
                      setFilterStatus("all");
                    }}
                    className="rounded-xl border border-dashed border-slate-300 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50/60 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="py-3 px-4">User Identity</th>
                    <th scope="col" className="py-3 px-4">Assigned Roles</th>
                    <th scope="col" className="py-3 px-4">Security & MFA</th>
                    <th scope="col" className="py-3 px-4">Last Activity</th>
                    <th scope="col" className="py-3 px-4">Status</th>
                    <th scope="col" className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <Users className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                        <p className="font-medium text-slate-700">No users match the search filter</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* User Identity */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#12294D] text-white text-xs font-semibold shadow-xs">
                                {(u.username || u.email || "US").slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 block">
                                  {u.username ?? "Anonymous User"}
                                </span>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                  {u.email && <span>{u.email}</span>}
                                  {u.phone && <span>&bull; {u.phone}</span>}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Assigned Roles */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {u.roles.map((r) => (
                                <span
                                  key={r.assignmentId}
                                  className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-[#2570D3] border border-blue-100"
                                >
                                  {r.name}
                                  {u.roles.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRevokeRole(u, r.assignmentId, r.name)}
                                      className="text-blue-400 hover:text-rose-600 transition-colors"
                                      title="Revoke Role"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  )}
                                </span>
                              ))}
                              <button
                                type="button"
                                onClick={() => setRoleAssignTargetUser(u)}
                                className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-1.5 py-0.5 text-[11px] text-slate-500 hover:text-slate-800 hover:border-slate-400"
                                title="Assign Role"
                              >
                                <Plus className="h-3 w-3" />
                                Role
                              </button>
                            </div>
                          </td>

                          {/* Security & MFA */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              {u.mfaEnabled ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                                  <KeyRound className="h-3 w-3 text-emerald-600" />
                                  MFA Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                                  MFA Disabled
                                </span>
                              )}
                              {u.lockedUntil && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-medium">
                                  <Lock className="h-3 w-3" /> Locked
                                </span>
                              )}
                              {u.mustChangePassword && (
                                <span className="text-[10px] text-amber-600 font-medium">
                                  Must change password
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Last Login */}
                          <td className="py-3.5 px-4 text-xs text-slate-500">
                            {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }) : (
                              <span className="text-slate-400 italic">Never logged in</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {u.status === "active" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Active
                              </span>
                            ) : u.status === "suspended" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
                                Suspended
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 border border-rose-200">
                                Disabled
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {u.status === "active" ? (
                                <button
                                  type="button"
                                  onClick={() => handleStatusToggle(u, "suspended")}
                                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-amber-700 hover:bg-amber-50 transition-colors"
                                  title="Suspend account"
                                >
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleStatusToggle(u, "active")}
                                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-50 transition-colors"
                                  title="Activate account"
                                >
                                  Activate
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setResetTargetUser(u);
                                  setResetPasswordVal("");
                                }}
                                className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-[#2570D3] hover:bg-[#2570D3] hover:text-white transition-colors"
                              >
                                Reset Pwd
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
        )}

        {/* Tab 2: Roles & Permissions Catalog */}
        {activeTab === "roles" && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Configured Role Definitions</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Role definitions control functional authorization across the Baudhika school platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_ROLES.map((role) => (
                <div
                  key={role.code}
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-[#2570D3]/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2570D3]">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                        {role.userCount} users
                      </span>
                    </div>

                    <h3 className="mt-3 text-sm font-semibold text-slate-900">{role.name}</h3>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">{role.code}</div>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">{role.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-medium text-slate-600 mb-1.5">
                      Included Permissions ({role.permissions.length}):
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 4).map((perm) => (
                        <span
                          key={perm}
                          className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-700"
                        >
                          {perm}
                        </span>
                      ))}
                      {role.permissions.length > 4 && (
                        <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-500">
                          +{role.permissions.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Security Audit Trail */}
        {activeTab === "audit" && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Security & Authentication Audit</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Immutable record of sign-ins, role modifications, status alterations, and data entries.
                </p>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5" /> Live stream active
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="py-3 px-4">Timestamp</th>
                    <th scope="col" className="py-3 px-4">Actor</th>
                    <th scope="col" className="py-3 px-4">Action</th>
                    <th scope="col" className="py-3 px-4">Target Resource</th>
                    <th scope="col" className="py-3 px-4">IP Address</th>
                    <th scope="col" className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_AUDIT_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors text-xs">
                      <td className="py-3 px-4 font-mono text-slate-500">{log.timestamp}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {log.actor}
                        <span className="block text-[11px] text-slate-400 font-normal">
                          {log.actorRole}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] font-semibold text-slate-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{log.resource}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{log.ipAddress}</td>
                      <td className="py-3 px-4">
                        {log.status === "success" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                            Success
                          </span>
                        ) : log.status === "warning" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200">
                            Warning
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 border border-rose-200">
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create User */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-md p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2570D3]">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Create New User Account</h3>
                  <p className="text-xs text-slate-500">Provision a login credential for the school</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Username <span className="text-slate-400">(optional if email provided)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. rohan.science"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20 focus:border-[#2570D3]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. rohan@sunrise.edu.np"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20 focus:border-[#2570D3]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mobile Number <span className="text-slate-400">(for OTP & SMS alerts)</span>
                </label>
                <input
                  type="text"
                  placeholder="+977 98XXXXXXXX"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20 focus:border-[#2570D3]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Initial Password <span className="text-slate-400">(User forced to change at 1st login)</span>
                </label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20 focus:border-[#2570D3]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Primary Role
                </label>
                <select
                  value={newRoleCode}
                  onChange={(e) => setNewRoleCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
                >
                  {MOCK_ROLES.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="newMfa"
                  checked={newMfa}
                  onChange={(e) => setNewMfa(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#2570D3] focus:ring-[#2570D3]"
                />
                <label htmlFor="newMfa" className="text-xs text-slate-700 font-medium">
                  Enforce Multi-Factor Authentication (MFA) via OTP
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2570D3] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E5CB0] transition-colors"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Password */}
      {resetTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-md p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2570D3]">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Reset User Password</h3>
                  <p className="text-xs text-slate-500">
                    {resetTargetUser.username ?? resetTargetUser.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetTargetUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  New Temporary Password
                </label>
                <input
                  type="password"
                  placeholder="Min 8 characters with letters & numbers"
                  value={resetPasswordVal}
                  onChange={(e) => setResetPasswordVal(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20 focus:border-[#2570D3]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="forceChange"
                  checked={forceChangeNextLogin}
                  onChange={(e) => setForceChangeNextLogin(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#2570D3] focus:ring-[#2570D3]"
                />
                <label htmlFor="forceChange" className="text-xs text-slate-700 font-medium">
                  Require password change on next login
                </label>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                Resetting password invalidates all existing active sessions and unlocks any temporary brute-force lockouts.
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2570D3] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E5CB0] transition-colors"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Role */}
      {roleAssignTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-md p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2570D3]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Grant Role Permission</h3>
                  <p className="text-xs text-slate-500">
                    {roleAssignTargetUser.username ?? roleAssignTargetUser.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRoleAssignTargetUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAssignRole} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Select Role to Assign
                </label>
                <select
                  value={assignRoleCode}
                  onChange={(e) => setAssignRoleCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
                >
                  {MOCK_ROLES.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name} ({r.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Scope of Permission
                </label>
                <select
                  value={assignScopeType}
                  onChange={(e) => setAssignScopeType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2570D3]/20"
                >
                  <option value="institution">Whole Institution (All Campuses)</option>
                  <option value="campus">Single Campus Only</option>
                  <option value="department">Specific Department</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRoleAssignTargetUser(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2570D3] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E5CB0] transition-colors"
                >
                  Assign Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
