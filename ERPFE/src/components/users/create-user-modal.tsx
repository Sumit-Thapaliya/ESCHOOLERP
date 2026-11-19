"use client";

import * as React from "react";
import { Eye, EyeOff, Shuffle, UserPlus, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createUser, listRoles } from "@/lib/api/school";
import { useHasPermission } from "@/store/session-store";
import { toast } from "sonner";
import { cn } from "cn";

const input =
  "w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-900 focus:border-[#2570D3] outline-hidden placeholder-slate-400";
const label = "block text-[13px] font-medium text-slate-600 mb-1";

/** Random password that always satisfies "8+ chars, a letter and a number". */
export function generatePassword(): string {
  const letters = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
  const digits = "23456789";
  const all = letters + digits + "!@#";
  const pick = (set: string) => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return set[buf[0] % set.length];
  };
  let out = "";
  for (let i = 0; i < 10; i += 1) out += pick(all);
  return pick(letters) + pick(digits) + out;
}

/**
 * Create a login account. Roles are offered as checkboxes from the live role
 * catalogue; without role.assign the section explains itself and stays out
 * of the way instead of failing at submit time.
 */
export function CreateUserModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const canAssign = useHasPermission("role.assign");
  const canReadRoles = useHasPermission("role.read");

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [mustChange, setMustChange] = React.useState(true);
  const [mfa, setMfa] = React.useState(false);
  const [roleCodes, setRoleCodes] = React.useState<string[]>([]);

  const rolesQuery = useQuery({
    queryKey: ["roles-catalog"],
    queryFn: listRoles,
    enabled: canAssign && canReadRoles,
  });

  const mutation = useMutation({
    mutationFn: () =>
      createUser({
        username: username.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        password,
        mustChangePassword: mustChange,
        mfaEnabled: mfa,
        roles: roleCodes.length > 0 ? roleCodes : undefined,
      }),
    onSuccess: (created) => {
      toast.success(`Login created for ${created.username ?? created.email ?? created.phone}.`);
      onCreated();
    },
    onError: (e: Error) => {
      if (e.message.includes("already in use")) {
        toast.error("That username, email or phone is already in use.");
      } else if (e.message.includes("password")) {
        toast.error("The password needs at least 8 characters, with a letter and a number.");
      } else {
        toast.error("The login could not be created. Check the highlighted fields.");
      }
    },
  });

  const hasIdentifier =
    Boolean(username.trim()) || Boolean(email.trim()) || Boolean(phone.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-[#2570D3]" />
            <h3 className="font-semibold text-sm text-slate-900">Add a login account</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="pt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={label}>Username</label>
              <input
                className={input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ram.thapa"
              />
            </div>
            <div>
              <label className={label}>Phone</label>
              <input
                className={input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9841000000"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Email</label>
              <input
                className={input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ram@sunrise.edu"
              />
            </div>
          </div>
          <p className="text-[13px] text-slate-500 -mt-2">
            Give at least one of username, email or phone - that is how they sign in.
          </p>

          <div>
            <label className={label}>First password</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  className={cn(input, "pr-9")}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters, with a letter and a number"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
                  title={showPassword ? "Hide the password" : "Show the password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPassword(generatePassword());
                  setShowPassword(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5F0] bg-white px-2.5 py-1.5 text-[13px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50"
              >
                <Shuffle className="h-3.5 w-3.5" />
                Generate
              </button>
            </div>
            <p className="mt-1 text-[13px] text-slate-500">
              Share it with the person once - then they change it themselves.
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={mustChange}
                onChange={(e) => setMustChange(e.target.checked)}
                className="mt-0.5 accent-[#2570D3]"
              />
              They must choose their own password at first login
            </label>
            <label
              className={cn(
                "flex items-start gap-2 text-sm",
                email.trim() ? "text-slate-700" : "text-slate-400",
              )}
              title={email.trim() ? undefined : "Add an email address first"}
            >
              <input
                type="checkbox"
                checked={mfa}
                disabled={!email.trim()}
                onChange={(e) => setMfa(e.target.checked)}
                className="mt-0.5 accent-[#2570D3]"
              />
              Always ask for an email code at sign-in
            </label>
          </div>

          <div className="rounded-xl border border-[#DDE5F0] bg-slate-50/60 p-3">
            <p className="text-[13px] font-medium text-slate-600 mb-2">Roles at this school</p>
            {!canAssign ? (
              <p className="text-[13px] text-slate-500">
                Roles can be added after creation by someone who assigns roles.
              </p>
            ) : rolesQuery.isLoading ? (
              <p className="text-[13px] text-slate-400">Loading the role list...</p>
            ) : rolesQuery.isError ? (
              <p className="text-[13px] text-slate-500">
                The role list could not be loaded. You can still create the login and add
                roles later.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {(rolesQuery.data ?? []).map((r) => {
                  const on = roleCodes.includes(r.code);
                  return (
                    <button
                      key={r.code}
                      type="button"
                      onClick={() =>
                        setRoleCodes((cur) =>
                          on ? cur.filter((c) => c !== r.code) : [...cur, r.code],
                        )
                      }
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[13px] font-medium border transition-colors",
                        on
                          ? "border-[#2570D3] bg-[#2570D3] text-white"
                          : "border-[#DDE5F0] bg-white text-slate-600 hover:bg-slate-50",
                      )}
                      title={`${r.name}${r.requiresMfa ? " - always asks for an email code" : ""}`}
                    >
                      {r.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#DDE5F0] bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 shadow-2xs hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!hasIdentifier || password.length < 8 || mutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2570D3] px-3.5 py-1.5 text-sm font-medium text-white shadow-xs hover:bg-[#1C5BB0] transition-colors disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <UserPlus className="h-4 w-4" />
              {mutation.isPending ? "Creating..." : "Create login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
