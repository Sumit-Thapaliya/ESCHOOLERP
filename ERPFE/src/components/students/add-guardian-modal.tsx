"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { linkGuardian } from "@/lib/api/school";
import type { GuardianRelation } from "@/lib/api/types";
import { cn } from "cn";

const RELATIONS: { value: GuardianRelation; label: string }[] = [
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "legal_guardian", label: "Legal guardian" },
  { value: "grandparent", label: "Grandparent" },
  { value: "uncle_aunt", label: "Uncle / Aunt" },
  { value: "other", label: "Other" },
];

interface AddGuardianModalProps {
  studentId: string;
  studentName: string;
  /** First guardian on the record becomes primary by default. */
  hasPrimary: boolean;
  onClose: () => void;
}

/**
 * Links a parent to a student with POST /students/{id}/guardians.
 *
 * The guardian is created inline (client + person) in the same call, so one
 * submit produces the person record, the guardian record and the link. Nothing
 * is typed into a second screen and nothing is faked locally: the returned
 * links are the server's, and the profile query is invalidated so the card
 * re-renders from GET /students/{id}.
 */
export function AddGuardianModal({
  studentId,
  studentName,
  hasPrimary,
  onClose,
}: AddGuardianModalProps) {
  const queryClient = useQueryClient();

  const [relation, setRelation] = React.useState<GuardianRelation>("father");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [occupation, setOccupation] = React.useState("");
  const [isPrimary, setIsPrimary] = React.useState(!hasPrimary);
  const [isEmergencyContact, setIsEmergencyContact] = React.useState(!hasPrimary);
  const [canPickup, setCanPickup] = React.useState(true);
  const [canPayFees, setCanPayFees] = React.useState(true);

  const link = useMutation({
    mutationFn: () =>
      linkGuardian(studentId, {
        relation,
        isPrimary,
        isEmergencyContact,
        canPickup,
        canPayFees,
        guardian: {
          occupation: occupation.trim() || null,
          person: {
            firstName: firstName.trim(),
            lastName: lastName.trim() || null,
            contacts: phone.trim()
              ? [{ type: "phone", value: phone.trim().replace(/[\s()-]/g, ""), isPrimary: true }]
              : [],
          },
        },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["student", studentId] });
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(
        `${[firstName, lastName].filter(Boolean).join(" ")} linked to ${studentName}.`,
      );
      onClose();
    },
    onError: (error: Error) =>
      toast.error(error.message || "The guardian could not be linked."),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error("The guardian needs a first name.");
      return;
    }
    if (!/^\+?\d{7,15}$/.test(phone.trim().replace(/[\s()-]/g, ""))) {
      toast.error("Phone: 7-15 digits, optional leading +.");
      return;
    }
    link.mutate();
  };

  const label = "mb-1 block text-[12.5px] font-medium text-slate-700";
  const input =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-[13.5px] outline-hidden focus:border-[#2570D3]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="flex items-center gap-2 text-[14.5px] font-bold tracking-[-0.012em] text-slate-900">
              <UserPlus className="h-4 w-4 text-[#2570D3]" />
              Add a guardian
            </h3>
            <p className="mt-0.5 text-[12px] text-slate-500">Linked to {studentName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Relation</label>
            <select
              className={input}
              value={relation}
              onChange={(e) => setRelation(e.target.value as GuardianRelation)}
            >
              {RELATIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Phone *</label>
            <input
              className={input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+977 98..."
            />
          </div>
          <div>
            <label className={label}>First name *</label>
            <input
              className={input}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Ramesh"
            />
          </div>
          <div>
            <label className={label}>Last name</label>
            <input
              className={input}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Yadav"
            />
          </div>
          <div className="col-span-2">
            <label className={label}>Occupation</label>
            <input
              className={input}
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="optional — e.g. Businessman"
            />
          </div>

          <div className="col-span-2 flex flex-wrap gap-x-4 gap-y-2">
            {(
              [
                { on: isPrimary, set: setIsPrimary, text: "Primary guardian" },
                { on: isEmergencyContact, set: setIsEmergencyContact, text: "Emergency contact" },
                { on: canPickup, set: setCanPickup, text: "Can pick up" },
                { on: canPayFees, set: setCanPayFees, text: "Can pay fees" },
              ] as { on: boolean; set: (v: boolean) => void; text: string }[]
            ).map((flag) => (
              <label
                key={flag.text}
                className="flex cursor-pointer items-center gap-1.5 text-[12.5px] text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={flag.on}
                  onChange={(e) => flag.set(e.target.checked)}
                  className="h-3.5 w-3.5 cursor-pointer accent-[#2570D3]"
                />
                {flag.text}
              </label>
            ))}
          </div>

          {isPrimary && hasPrimary && (
            <p className="col-span-2 rounded-lg bg-amber-50 px-3 py-2 text-[11.5px] leading-relaxed text-amber-800">
              This student already has a primary guardian. Saving will move that flag to this
              guardian.
            </p>
          )}

          <div className="col-span-2 mt-1 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-[13px] text-slate-600 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={link.isPending}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#2570D3] px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1C5BB0]",
                link.isPending && "cursor-progress opacity-60",
              )}
            >
              {link.isPending ? "Linking…" : "Link guardian"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
