"use client";

import * as React from "react";
import { Loader2, Mail, Phone, ShieldCheck, UserRound, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/api/school";
import { cn } from "cn";

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  suspended: "bg-rose-50 text-rose-700",
  disabled: "bg-slate-100 text-slate-600",
};

function formatWhen(iso: string | null): string {
  if (!iso) return "Never signed in";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Declared outside render so React sees a stable component identity. */
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-[13px] text-slate-500">{label}</span>
      <span className="text-[13px] font-medium text-slate-800 text-right">{value}</span>
    </div>
  );
}

/**
 * Everything the server knows about one login, fetched live from
 * GET /users/{id}. Opens from the user's name in the directory.
 */
export function UserDetailDrawer({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });

  const u = userQuery.data;
  const name = u ? (u.username ?? u.email ?? u.phone ?? "Unnamed login") : "Loading...";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l border-[#DDE5F0] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-[#DDE5F0] bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-[#2570D3]" />
            <h3 className="font-semibold text-sm text-slate-900">{name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {userQuery.isLoading && (
            <p className="flex items-center gap-2 text-[13px] text-slate-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading the login record...
            </p>
          )}

          {userQuery.isError && (
            <div className="rounded-xl border border-[#DDE5F0] bg-slate-50/60 p-4">
              <p className="text-[13px] text-slate-600">This login could not be loaded.</p>
              <button
                type="button"
                onClick={() => void userQuery.refetch()}
                className="mt-3 rounded-lg border border-[#DDE5F0] bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50"
              >
                Try again
              </button>
            </div>
          )}

          {u && (
            <>
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                    STATUS_BADGE[u.status] ?? "bg-slate-100 text-slate-600",
                  )}
                >
                  {u.status}
                </span>
                {u.mfaEnabled && (
                  <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                    email code at sign-in
                  </span>
                )}
                {u.mustChangePassword && (
                  <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                    first login pending
                  </span>
                )}
                {u.lockedUntil !== null && (
                  <span
                    className="inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700"
                    title="Too many wrong passwords; the lockout lifts by itself"
                  >
                    locked until {formatWhen(u.lockedUntil)}
                  </span>
                )}
              </div>

              <div className="rounded-xl border border-[#DDE5F0] bg-white px-4 py-1 shadow-2xs">
                <Row
                  label="Username"
                  value={u.username ?? <span className="text-slate-400">not set</span>}
                />
                <Row
                  label="Email"
                  value={
                    u.email ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-slate-400" />
                        {u.email}
                      </span>
                    ) : (
                      <span className="text-slate-400">not set</span>
                    )
                  }
                />
                <Row
                  label="Phone"
                  value={
                    u.phone ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {u.phone}
                      </span>
                    ) : (
                      <span className="text-slate-400">not set</span>
                    )
                  }
                />
                <Row label="Last sign-in" value={formatWhen(u.lastLoginAt)} />
                <Row label="Account created" value={formatWhen(u.createdAt)} />
                <Row label="Interface language" value={u.locale} />
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2570D3]" />
                  Roles
                </p>
                {u.roles.length === 0 ? (
                  <p className="rounded-xl border border-[#DDE5F0] bg-slate-50/60 p-4 text-[13px] text-slate-500">
                    No roles yet - this login can sign in but sees nothing.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {u.roles.map((r) => (
                      <li
                        key={r.assignmentId}
                        className="rounded-xl border border-[#DDE5F0] bg-slate-50/60 px-4 py-2.5"
                      >
                        <p className="text-[13px] font-medium text-slate-800">{r.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {r.scopeType === "institution" ? "Whole school" : `One ${r.scopeType}`}
                          {r.validFrom ? ` · from ${r.validFrom}` : ""}
                          {r.validTo ? ` · until ${r.validTo}` : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
