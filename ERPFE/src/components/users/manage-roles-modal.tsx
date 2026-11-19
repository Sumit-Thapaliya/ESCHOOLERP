"use client";

import * as React from "react";
import { ShieldCheck, Trash2, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { assignUserRole, listCampuses, listRoles, removeUserRole } from "@/lib/api/school";
import type { User } from "@/lib/api/types";
import { toast } from "sonner";
import { cn } from "cn";

const input =
  "w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-900 focus:border-[#2570D3] outline-hidden placeholder-slate-400";
const label = "block text-[13px] font-medium text-slate-600 mb-1";

/**
 * Add or revoke role assignments for one login. The catalogue and the campus
 * list both come from the server, so nothing here is invented.
 */
export function ManageRolesModal({
  user,
  onClose,
  onChanged,
}: {
  user: User;
  onClose: () => void;
  onChanged: (updated: User) => void;
}) {
  const rolesQuery = useQuery({ queryKey: ["roles-catalog"], queryFn: listRoles });
  const campusesQuery = useQuery({ queryKey: ["campuses"], queryFn: listCampuses });

  const [roleCode, setRoleCode] = React.useState("");
  const [scope, setScope] = React.useState<"institution" | "campus">("institution");
  const [campusId, setCampusId] = React.useState("");
  const [validTo, setValidTo] = React.useState("");

  const name = user.username ?? user.email ?? user.phone ?? "this login";

  const grantMutation = useMutation({
    mutationFn: () =>
      assignUserRole(user.id, {
        role: roleCode,
        scopeType: scope,
        scopeId: scope === "campus" ? campusId : undefined,
        validTo: validTo || undefined,
      }),
    onSuccess: (updated) => {
      toast.success(`Role added for ${name}.`);
      setRoleCode("");
      setValidTo("");
      onChanged(updated);
    },
    onError: (e: Error) => {
      if (e.message.includes("broader") || e.message.includes("403")) {
        toast.error("You cannot grant a role broader than your own access.");
      } else if (e.message.includes("Already assigned")) {
        toast.error("They already hold that role in that scope.");
      } else {
        toast.error("The role could not be added.");
      }
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (assignmentId: string) => removeUserRole(user.id, assignmentId),
    onSuccess: (updated) => {
      toast.success(`Role removed for ${name}.`);
      onChanged(updated);
    },
    onError: (e: Error) => {
      if (e.message.includes("principal")) {
        toast.error("The last school-wide principal cannot be removed.");
      } else {
        toast.error("The role could not be removed.");
      }
    },
  });

  const heldCodes = new Set(
    user.roles.filter((r) => r.scopeType === "institution").map((r) => r.code),
  );
  const campuses = campusesQuery.data?.items ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#2570D3]" />
            <h3 className="font-semibold text-sm text-slate-900">Roles for {name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="pt-4 space-y-4">
          <div>
            <p className={label}>Holds today</p>
            {user.roles.length === 0 ? (
              <p className="text-[13px] text-slate-400">
                No roles yet - this login can sign in but sees nothing.
              </p>
            ) : (
              <ul className="space-y-2">
                {user.roles.map((r) => (
                  <li
                    key={r.assignmentId}
                    className="flex items-center justify-between rounded-lg border border-[#DDE5F0] bg-slate-50/60 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {r.name}
                        {r.scopeType !== "institution" && (
                          <span className="ml-1 text-xs text-slate-500">
                            · one {r.scopeType}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">
                        {r.scopeType === "institution" ? "Whole school" : "Branch scope"}
                        {r.validTo ? ` · until ${r.validTo}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => revokeMutation.mutate(r.assignmentId)}
                      disabled={revokeMutation.isPending}
                      title="Remove this role"
                      className="rounded-md p-1.5 text-[#D64545] hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-slate-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-[#DDE5F0] bg-slate-50/60 p-3 space-y-3">
            <p className="text-[13px] font-medium text-slate-600">Add a role</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={label}>Role</label>
                <select
                  className={cn(input, "bg-white")}
                  value={roleCode}
                  onChange={(e) => setRoleCode(e.target.value)}
                >
                  <option value="">Choose a role...</option>
                  {(rolesQuery.data ?? [])
                    .filter((r) => !heldCodes.has(r.code))
                    .map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className={label}>Where it applies</label>
                <select
                  className={cn(input, "bg-white")}
                  value={scope}
                  onChange={(e) => setScope(e.target.value as "institution" | "campus")}
                >
                  <option value="institution">Whole school</option>
                  <option value="campus">One campus</option>
                </select>
              </div>
              {scope === "campus" && (
                <div>
                  <label className={label}>Campus</label>
                  <select
                    className={cn(input, "bg-white")}
                    value={campusId}
                    onChange={(e) => setCampusId(e.target.value)}
                  >
                    <option value="">Choose a campus...</option>
                    {campuses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className={label}>Access ends after (optional)</label>
                <input
                  className={input}
                  type="date"
                  value={validTo}
                  onChange={(e) => setValidTo(e.target.value)}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => grantMutation.mutate()}
              disabled={
                !roleCode ||
                (scope === "campus" && !campusId) ||
                grantMutation.isPending ||
                revokeMutation.isPending
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2570D3] px-3.5 py-1.5 text-sm font-medium text-white shadow-xs hover:bg-[#1C5BB0] transition-colors disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <ShieldCheck className="h-4 w-4" />
              {grantMutation.isPending ? "Adding..." : "Add role"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
