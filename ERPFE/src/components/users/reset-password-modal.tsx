"use client";

import * as React from "react";
import { Eye, EyeOff, KeyRound, Shuffle, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { resetUserPassword } from "@/lib/api/school";
import type { User } from "@/lib/api/types";
import { toast } from "sonner";
import { cn } from "cn";
import { generatePassword } from "./create-user-modal";

const input =
  "w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-900 focus:border-[#2570D3] outline-hidden placeholder-slate-400";
const label = "block text-[13px] font-medium text-slate-600 mb-1";

/**
 * Set a new password for someone else's login. The backend signs them out
 * everywhere and clears any lockout; we say so before, not after.
 */
export function ResetPasswordModal({
  user,
  onClose,
  onDone,
}: {
  user: User;
  onClose: () => void;
  onDone: () => void;
}) {
  const name = user.username ?? user.email ?? user.phone ?? "this login";
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [mustChange, setMustChange] = React.useState(true);

  const mutation = useMutation({
    mutationFn: () => resetUserPassword(user.id, password, mustChange),
    onSuccess: () => {
      toast.success(`Password reset for ${name}. They are signed out everywhere.`);
      onDone();
    },
    onError: () => {
      toast.error("The password could not be reset. It needs 8+ characters, a letter and a number.");
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-[#2570D3]" />
            <h3 className="font-semibold text-sm text-slate-900">Reset password</h3>
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
          <p className="rounded-lg bg-amber-50 p-3 text-[13px] text-amber-800">
            {name} is signed out everywhere and any sign-in lockout is cleared. Share the
            new password with them in person.
          </p>

          <div>
            <label className={label}>New password</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  className={cn(input, "pr-9")}
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters, with a letter and a number"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
                  title={show ? "Hide the password" : "Show the password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPassword(generatePassword());
                  setShow(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5F0] bg-white px-2.5 py-1.5 text-[13px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50"
              >
                <Shuffle className="h-3.5 w-3.5" />
                Generate
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={mustChange}
              onChange={(e) => setMustChange(e.target.checked)}
              className="mt-0.5 accent-[#2570D3]"
            />
            They must choose their own password at next sign-in
          </label>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#DDE5F0] bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 shadow-2xs hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={password.length < 8 || mutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2570D3] px-3.5 py-1.5 text-sm font-medium text-white shadow-xs hover:bg-[#1C5BB0] transition-colors disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <KeyRound className="h-4 w-4" />
              {mutation.isPending ? "Resetting..." : "Reset password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
