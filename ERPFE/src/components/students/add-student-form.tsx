"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStudent, listCampuses } from "@/lib/api/school";
import { authErrorMessage } from "@/lib/api/errors";
import { createStudentFormSchema, type CreateStudentFormValues } from "@/lib/schemas/students";
import { toast } from "sonner";

/**
 * POST /students with an inline new person. The backend generates the
 * admission number and starts the student as `applicant`; activating them is
 * a separate status call once a primary guardian is linked (per the API
 * reference), so the form says exactly that instead of pretending.
 */
export function AddStudentForm({
  onCreated,
  onCancel,
}: {
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [rootError, setRootError] = useState<string | null>(null);
  const campuses = useQuery({ queryKey: ["campuses"], queryFn: listCampuses, retry: false });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "male",
      dob: "",
      bloodGroup: "",
      campusId: "",
      admissionDate: new Date().toISOString().slice(0, 10),
      admissionType: "new",
      emisId: "",
    },
  });

  const onSubmit = handleSubmit(async (v) => {
    try {
      const student = await createStudent({
        person: {
          firstName: v.firstName,
          ...(v.lastName && { lastName: v.lastName }),
          gender: v.gender,
          ...(v.dob && { dob: v.dob }),
          ...(v.bloodGroup && { bloodGroup: v.bloodGroup }),
        },
        admissionDate: v.admissionDate,
        admissionType: v.admissionType,
        ...(v.campusId && { campusId: v.campusId }),
        ...(v.emisId && { emisId: v.emisId }),
      });
      toast.success(
        `Admitted ${student.person.displayName} as ${student.admissionNo} (applicant)`,
      );
      onCreated();
    } catch (e) {
      setRootError(authErrorMessage(e));
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-3.5" noValidate>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="st-first" className="text-[12.5px]">
            First name *
          </Label>
          <Input id="st-first" className="h-10 rounded-xl" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-[12px] text-destructive">{errors.firstName.message}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="st-last" className="text-[12.5px]">
            Last name
          </Label>
          <Input id="st-last" className="h-10 rounded-xl" {...register("lastName")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="st-gender" className="text-[12.5px]">
            Gender
          </Label>
          <select id="st-gender" className="h-10 rounded-xl border border-input bg-background px-3 text-[13px]" {...register("gender")}>
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="other">other</option>
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="st-dob" className="text-[12.5px]">
            Date of birth
          </Label>
          <Input id="st-dob" type="date" className="h-10 rounded-xl" {...register("dob")} />
          {errors.dob && <p className="text-[12px] text-destructive">{errors.dob.message}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="st-blood" className="text-[12.5px]">
            Blood group
          </Label>
          <select id="st-blood" className="h-10 rounded-xl border border-input bg-background px-3 text-[13px]" {...register("bloodGroup")}>
            <option value="">—</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="st-campus" className="text-[12.5px]">
            Campus
          </Label>
          <select id="st-campus" className="h-10 rounded-xl border border-input bg-background px-3 text-[13px]" {...register("campusId")}>
            <option value="">—</option>
            {campuses.data?.items.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="st-adate" className="text-[12.5px]">
            Admission date *
          </Label>
          <Input id="st-adate" type="date" className="h-10 rounded-xl" {...register("admissionDate")} />
          {errors.admissionDate && (
            <p className="text-[12px] text-destructive">{errors.admissionDate.message}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="st-atype" className="text-[12.5px]">
            Admission type
          </Label>
          <select id="st-atype" className="h-10 rounded-xl border border-input bg-background px-3 text-[13px]" {...register("admissionType")}>
            <option value="new">new</option>
            <option value="transfer_in">transfer_in</option>
            <option value="readmission">readmission</option>
          </select>
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="st-emis" className="text-[12.5px]">
            EMIS id (if issued)
          </Label>
          <Input id="st-emis" className="h-10 rounded-xl" {...register("emisId")} />
        </div>
      </div>

      <div aria-live="polite" className="min-h-4.25">
        {rootError && <p className="text-[12px] text-destructive">{rootError}</p>}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting} className="h-10 flex-1 gap-2 rounded-xl">
          {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
          Admit student
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="h-10 rounded-xl">
          Cancel
        </Button>
      </div>
    </form>
  );
}
