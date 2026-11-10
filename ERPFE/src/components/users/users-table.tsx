"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, KeyRound, RefreshCw, Search, ShieldPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  assignUserRole,
  listUsers,
  removeUserRole,
  resetUserPassword,
  setUserStatus,
} from "@/lib/api/school";
import { authErrorMessage } from "@/lib/api/errors";
import type { User, UserStatus } from "@/lib/api/types";
import { useHasPermission } from "@/store/session-store";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const STATUS_STYLE: Record<UserStatus, string> = {
  active: "bg-teal-500/15 text-teal-700 dark:text-teal-400",
  suspended: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  disabled: "bg-red-500/15 text-red-700 dark:text-red-400",
};

function label(u: User) {
  return u.username ?? u.email ?? u.phone ?? u.id;
}

/**
 * GET /users with search + status filter + paging, plus the row actions the
 * API exposes: PATCH status, POST reset-password, POST/DELETE roles.
 *
 * Data comes from react-query (the QueryProvider in the root layout): the
 * queryKey holds every filter, so changing one refetches automatically and
 * no useEffect is needed. Every control is hidden unless the session holds
 * its permission code - the server would refuse the call anyway.
 */
export function UsersTable({ refreshKey }: { refreshKey: number }) {
  const canUpdate = useHasPermission("user.update");
  const canAssign = useHasPermission("role.assign");

  const [page, setPage] = useState(1);
  const [searchBox, setSearchBox] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [manageId, setManageId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("");

  const { data, error, isFetching, refetch } = useQuery({
    queryKey: ["users", page, search, status, refreshKey],
    queryFn: () =>
      listUsers({
        page,
        limit: PAGE_SIZE,
        ...(search && { search }),
        ...(status && { status }),
      }),
  });

  const pageCount = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  async function changeStatus(user: User, next: UserStatus) {
    const verb = next === "active" ? "Activate" : next === "suspended" ? "Suspend" : "Disable";
    if (!window.confirm(`${verb} ${label(user)}? They will be logged out everywhere.`)) return;
    try {
      await setUserStatus(user.id, next);
      await refetch();
      toast.success(`${verb}d ${label(user)}`);
    } catch (e) {
      toast.error(authErrorMessage(e));
    }
  }

  async function doResetPassword(user: User) {
    if (newPassword.length < 8) {
      toast.error("Password must be 8-128 characters with a letter and a digit.");
      return;
    }
    try {
      await resetUserPassword(user.id, newPassword, true);
      setNewPassword("");
      toast.success(`Password reset for ${label(user)} - they must change it at next login.`);
    } catch (e) {
      toast.error(authErrorMessage(e));
    }
  }

  async function doGrantRole(user: User) {
    const role = newRole.trim();
    if (!role) return;
    try {
      await assignUserRole(user.id, { role });
      setNewRole("");
      await refetch();
      toast.success(`Granted ${role} to ${label(user)}`);
    } catch (e) {
      toast.error(authErrorMessage(e));
    }
  }

  async function doRevokeRole(user: User, assignmentId: string, code: string) {
    if (!window.confirm(`Revoke ${code} from ${label(user)}?`)) return;
    try {
      await removeUserRole(user.id, assignmentId);
      await refetch();
      toast.success(`Revoked ${code}`);
    } catch (e) {
      toast.error(authErrorMessage(e));
    }
  }

  return (
    <div className="grid gap-3">
      {/* filters */}
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearch(searchBox.trim());
        }}
      >
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchBox}
            onChange={(e) => setSearchBox(e.target.value)}
            placeholder="Search username, email or phone"
            className="h-10 rounded-xl pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as UserStatus | "");
          }}
          className="h-10 rounded-xl border border-input bg-background px-3 text-[13px]"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="active">active</option>
          <option value="suspended">suspended</option>
          <option value="disabled">disabled</option>
        </select>
        <Button type="submit" variant="outline" className="h-10 rounded-xl">
          Filter
        </Button>
      </form>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-[13px] text-destructive">
          {authErrorMessage(error)}
          <Button variant="ghost" size="sm" onClick={() => void refetch()}>
            <RefreshCw className="size-3.5" /> Retry
          </Button>
        </div>
      )}

      {/* table */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-muted/60 text-[12px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5">User</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Roles</th>
              <th className="px-4 py-2.5">Last login</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isFetching && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {!isFetching && data && data.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No users match.
                </td>
              </tr>
            )}
            {!isFetching &&
              data?.items.map((u) => (
                <RowGroup key={u.id}>
                  <tr className="align-top hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <p className="font-medium">{label(u)}</p>
                      <p className="text-[12px] text-muted-foreground">
                        {[u.email, u.phone].filter(Boolean).join(" · ") || "no contact"}
                      </p>
                      {u.lockedUntil && (
                        <p className="text-[12px] text-amber-600">locked until {u.lockedUntil}</p>
                      )}
                      {u.mustChangePassword && (
                        <p className="text-[12px] text-muted-foreground">must change password</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11.5px] font-medium ${STATUS_STYLE[u.status]}`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.length === 0 && (
                          <span className="text-[12px] text-muted-foreground">none</span>
                        )}
                        {u.roles.map((r) => (
                          <span
                            key={r.assignmentId}
                            className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11.5px]"
                          >
                            {r.code}
                            {canAssign && (
                              <button
                                type="button"
                                aria-label={`Revoke ${r.code}`}
                                onClick={() => void doRevokeRole(u, r.assignmentId, r.code)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <X className="size-3" />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "never"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        {canUpdate && u.status !== "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void changeStatus(u, "active")}
                          >
                            Activate
                          </Button>
                        )}
                        {canUpdate && u.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void changeStatus(u, "suspended")}
                          >
                            Suspend
                          </Button>
                        )}
                        {(canUpdate || canAssign) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setManageId((m) => (m === u.id ? null : u.id));
                              setNewPassword("");
                              setNewRole("");
                            }}
                          >
                            Manage
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {manageId === u.id && (
                    <tr className="bg-muted/30">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="flex flex-wrap gap-6">
                          {canUpdate && (
                            <form
                              className="flex items-end gap-2"
                              onSubmit={(e) => {
                                e.preventDefault();
                                void doResetPassword(u);
                              }}
                            >
                              <div className="grid gap-1">
                                <span className="text-[12px] text-muted-foreground">
                                  Reset password (logs them out, clears lockout)
                                </span>
                                <Input
                                  type="password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  placeholder="New temporary password"
                                  className="h-9 w-56 rounded-lg"
                                />
                              </div>
                              <Button type="submit" size="sm" variant="outline" className="h-9">
                                <KeyRound className="size-3.5" /> Reset
                              </Button>
                            </form>
                          )}
                          {canAssign && (
                            <form
                              className="flex items-end gap-2"
                              onSubmit={(e) => {
                                e.preventDefault();
                                void doGrantRole(u);
                              }}
                            >
                              <div className="grid gap-1">
                                <span className="text-[12px] text-muted-foreground">
                                  Grant role (code, institution scope)
                                </span>
                                <Input
                                  value={newRole}
                                  onChange={(e) => setNewRole(e.target.value)}
                                  placeholder="e.g. librarian"
                                  className="h-9 w-44 rounded-lg"
                                />
                              </div>
                              <Button type="submit" size="sm" variant="outline" className="h-9">
                                <ShieldPlus className="size-3.5" /> Grant
                              </Button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </RowGroup>
              ))}
          </tbody>
        </table>
      </div>

      {/* pager */}
      <div className="flex items-center justify-between text-[12.5px] text-muted-foreground">
        <span>
          {data ? `${data.total} user${data.total === 1 ? "" : "s"}` : ""}
          {data ? ` · page ${data.page} of ${pageCount}` : ""}
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="size-3.5" /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pageCount || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Keyed wrapper so a user row and its open Manage panel stay siblings. */
function RowGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
