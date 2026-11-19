"use client";

import * as React from "react";
import Link from "next/link";
import {
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  Search,
  ShieldCheck,
  UserPlus,
  UsersRound,
} from "lucide-react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { listUsers, setUserStatus } from "@/lib/api/school";
import { schoolPath } from "@/lib/tenant-slug";
import type { User, UserStatus } from "@/lib/api/types";
import { useHasPermission, useSession } from "@/store/session-store";
import { useTenant } from "@/providers/tenant-provider";
import { toast } from "sonner";
import { cn } from "cn";
import { CreateUserModal } from "./create-user-modal";
import { ManageRolesModal } from "./manage-roles-modal";
import { ResetPasswordModal } from "./reset-password-modal";
import { UserDetailDrawer } from "./user-detail-drawer";

const STATUS_OPTIONS: UserStatus[] = ["active", "suspended", "disabled"];

const STATUS_BADGE: Record<UserStatus, string> = {
  active: "bg-emerald-50 text-emerald-700",
  suspended: "bg-rose-50 text-rose-700",
  disabled: "bg-slate-100 text-slate-600",
};

const PAGE_SIZE = 20;

/**
 * Read once at import, not during render: React renders must stay pure, and
 * a lockout chip only needs minute-level accuracy between page loads.
 */
const NOW_AT_LOAD = Date.now();

function formatWhen(iso: string | null): string {
  if (!iso) return "Never signed in";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Never signed in";
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function displayName(u: User): string {
  return u.username ?? u.email ?? u.phone ?? "Unnamed login";
}

/** Declared outside render so React sees a stable component identity. */
function StatusPill({ status }: { status: UserStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_BADGE[status],
      )}
    >
      {status}
    </span>
  );
}

/** Declared outside render so React sees a stable component identity. */
function ConfirmStatusDialog({
  user,
  to,
  onConfirm,
  onClose,
}: {
  user: User;
  to: UserStatus;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const suspending = to !== "active";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl">
        <h3 className="font-semibold text-sm text-slate-900">
          {suspending ? `Suspend ${displayName(user)}?` : `Reactivate ${displayName(user)}?`}
        </h3>
        <p className="mt-2 text-[13px] text-slate-500">
          {suspending
            ? "They are signed out everywhere and cannot sign in until someone reactivates this login."
            : "They can sign in again straight away, with the roles shown on their row."}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#DDE5F0] bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-white shadow-xs transition-colors",
              suspending
                ? "bg-[#D64545] hover:bg-[#B93A3A]"
                : "bg-[#2570D3] hover:bg-[#1C5BB0]",
            )}
          >
            {suspending ? "Suspend login" : "Reactivate login"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Ritik's directory design, rewired to the real GET /users API: server-side
 * search and status filter, server paging, and every action gated on the
 * permission code the server enforces anyway.
 */
export function UsersTableView() {
  const canCreate = useHasPermission("user.create");
  const canUpdate = useHasPermission("user.update");
  const canAssign = useHasPermission("role.assign");
  const myId = useSession((s) => s.user?.id);
  const { slug } = useTenant();

  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"" | UserStatus>("");
  const [page, setPage] = React.useState(1);

  const [creating, setCreating] = React.useState(false);
  const [detailId, setDetailId] = React.useState<string | null>(null);
  const [manageUser, setManageUser] = React.useState<User | null>(null);
  const [resetUser, setResetUser] = React.useState<User | null>(null);
  const [confirm, setConfirm] = React.useState<{ user: User; to: UserStatus } | null>(null);

  // The server is the only place search happens; wait for a pause in typing.
  React.useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const usersQuery = useQuery({
    queryKey: ["users", { search, status, page }],
    queryFn: () =>
      listUsers({
        search: search || undefined,
        status: status || undefined,
        page,
        limit: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, to }: { id: string; to: UserStatus }) => setUserStatus(id, to),
    onSuccess: (updated) => {
      toast.success(
        updated.status === "active"
          ? `${displayName(updated)} can sign in again.`
          : `${displayName(updated)} is now ${updated.status}.`,
      );
      setConfirm(null);
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (e: Error) => {
      setConfirm(null);
      toast.error(
        e.message.includes("own status")
          ? "You cannot change your own status."
          : "The status could not be changed.",
      );
    },
  });

  const users = usersQuery.data?.items ?? [];
  const total = usersQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const hasFilters = Boolean(search || status);

  return (
    <div className="space-y-6 pb-12">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE5F0] pb-5">
        <div>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 mb-1">
            <Link
              href={schoolPath(slug, "/dashboard")}
              className="font-medium text-slate-700 hover:text-[#2570D3] hover:underline"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-semibold text-[#2570D3]">User administration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            User administration
          </h1>
          <p className="text-sm text-slate-500">
            Login accounts for this school. Status changes and password resets take
            effect immediately, everywhere.
          </p>
        </div>

        {canCreate && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2570D3] px-3.5 py-1.5 text-[13px] font-medium text-white shadow-xs hover:bg-[#1C5BB0] transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add user</span>
          </button>
        )}
      </div>

      {/* Filter and search bar */}
      <div className="rounded-xl border border-[#DDE5F0] bg-white p-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by username, email or phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-1.5 text-sm text-slate-900 focus:border-[#2570D3] outline-hidden placeholder-slate-400"
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as "" | UserStatus);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-hidden"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#DDE5F0] bg-white shadow-2xs overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#DDE5F0] bg-slate-50/60">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                User
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Roles
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Last sign-in
              </th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {usersQuery.isLoading &&
              [0, 1, 2].map((i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3" colSpan={5}>
                    <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  </td>
                </tr>
              ))}

            {usersQuery.isError && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center">
                  <p className="text-sm text-slate-500">We could not load the user list.</p>
                  <button
                    type="button"
                    onClick={() => void usersQuery.refetch()}
                    className="mt-3 rounded-lg border border-[#DDE5F0] bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50"
                  >
                    Try again
                  </button>
                </td>
              </tr>
            )}

            {usersQuery.isSuccess && users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-14 text-center">
                  <UsersRound className="mx-auto h-8 w-8 text-slate-300" />
                  {hasFilters ? (
                    <>
                      <p className="mt-3 text-sm text-slate-500">
                        No users match these filters.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchInput("");
                          setStatus("");
                          setPage(1);
                        }}
                        className="mt-3 rounded-lg border border-[#DDE5F0] bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50"
                      >
                        Clear filters
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="mt-3 text-sm font-medium text-slate-700">
                        No login accounts yet
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Create the first one so staff can sign in.
                      </p>
                    </>
                  )}
                </td>
              </tr>
            )}

            {users.map((u) => {
              const locked =
                u.lockedUntil !== null && new Date(u.lockedUntil).getTime() > NOW_AT_LOAD;
              const isMe = u.id === myId;
              return (
                <tr
                  key={u.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setDetailId(u.id)}
                      title="Open the full login record"
                      className="group text-left"
                    >
                      <p className="text-sm font-medium text-slate-900 group-hover:text-[#2570D3] group-hover:underline">
                        {displayName(u)}
                      </p>
                      <p className="text-[13px] text-slate-500">
                        {[u.email, u.phone].filter(Boolean).join(" · ") || "username login"}
                      </p>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1">
                      <StatusPill status={u.status} />
                      {locked && (
                        <span
                          className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
                          title="Too many wrong passwords; the lockout lifts by itself"
                        >
                          locked
                        </span>
                      )}
                      {u.mustChangePassword && (
                        <span
                          className="inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700"
                          title="They still need to choose their own password"
                        >
                          first login pending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {u.roles.length === 0 ? (
                      <span className="text-[13px] text-slate-400">No roles yet</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <span
                            key={r.assignmentId}
                            className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                            title={
                              r.scopeType === "institution"
                                ? r.validTo
                                  ? `Whole school until ${r.validTo}`
                                  : "Whole school"
                                : `One ${r.scopeType}${r.validTo ? ` until ${r.validTo}` : ""}`
                            }
                          >
                            {r.name}
                            {r.scopeType !== "institution" ? " · branch" : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-slate-500">
                    {formatWhen(u.lastLoginAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setManageUser(u)}
                        disabled={!canAssign}
                        title={
                          canAssign
                            ? "Add or remove roles"
                            : "Only staff who can assign roles may change them"
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-[#DDE5F0] bg-white px-2.5 py-1 text-[13px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Roles
                      </button>
                      <button
                        type="button"
                        onClick={() => setResetUser(u)}
                        disabled={!canUpdate}
                        title={
                          canUpdate
                            ? "Set a new password for them"
                            : "Only staff who manage logins may reset passwords"
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-[#DDE5F0] bg-white px-2.5 py-1 text-[13px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirm({ user: u, to: u.status === "active" ? "suspended" : "active" })
                        }
                        disabled={!canUpdate || isMe || u.status === "disabled"}
                        title={
                          isMe
                            ? "You cannot change your own status"
                            : u.status === "disabled"
                              ? "Disabled logins are re-enabled by a database administrator"
                              : canUpdate
                                ? u.status === "active"
                                  ? "Sign them out everywhere and block sign-in"
                                  : "Let them sign in again"
                                : "Only staff who manage logins may change status"
                        }
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[13px] font-medium shadow-2xs transition-colors",
                          u.status === "active"
                            ? "border border-[#DDE5F0] bg-white text-[#D64545] hover:bg-rose-50"
                            : "border border-[#DDE5F0] bg-white text-emerald-700 hover:bg-emerald-50",
                          "disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white",
                        )}
                      >
                        {u.status === "active" ? (
                          <Ban className="h-3.5 w-3.5" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        {u.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pager */}
      <div className="flex items-center justify-between text-[13px] text-slate-500">
        <span>
          Showing {from}–{to} of {total} users · page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || usersQuery.isFetching}
            className="inline-flex items-center gap-1 rounded-lg border border-[#DDE5F0] bg-white px-2.5 py-1 font-medium text-slate-600 shadow-2xs hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Prev
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || usersQuery.isFetching}
            className="inline-flex items-center gap-1 rounded-lg border border-[#DDE5F0] bg-white px-2.5 py-1 font-medium text-slate-600 shadow-2xs hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {detailId && (
        <UserDetailDrawer userId={detailId} onClose={() => setDetailId(null)} />
      )}

      {creating && (
        <CreateUserModal
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            void queryClient.invalidateQueries({ queryKey: ["users"] });
          }}
        />
      )}

      {manageUser && (
        <ManageRolesModal
          user={manageUser}
          onClose={() => setManageUser(null)}
          onChanged={(updated) => {
            setManageUser(updated);
            void queryClient.invalidateQueries({ queryKey: ["users"] });
          }}
        />
      )}

      {resetUser && (
        <ResetPasswordModal
          user={resetUser}
          onClose={() => setResetUser(null)}
          onDone={() => {
            setResetUser(null);
            void queryClient.invalidateQueries({ queryKey: ["users"] });
          }}
        />
      )}

      {confirm && (
        <ConfirmStatusDialog
          user={confirm.user}
          to={confirm.to}
          onClose={() => setConfirm(null)}
          onConfirm={() =>
            statusMutation.mutate({ id: confirm.user.id, to: confirm.to })
          }
        />
      )}
    </div>
  );
}
