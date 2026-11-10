"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser } from "@/lib/api/school";
import { authErrorMessage } from "@/lib/api/errors";
import type { User } from "@/lib/api/types";
import {
  createUserFormSchema,
  parseRoleCodes,
  type CreateUserFormValues,
} from "@/lib/schemas/users";
import { toast } from "sonner";

/**
 * POST /users. Needs user.create; the roles field additionally needs
 * role.assign, so it is only rendered when the session holds it.
 */
export function CreateUserForm({
  canAssignRoles,
  onCreated,
  onCancel,
}: {
  canAssignRoles: boolean;
  onCreated: (user: User) => void;
  onCancel: () => void;
}) {
  const [rootError, setRootError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      mustChangePassword: true,
      mfaEnabled: false,
      roles: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const roles = parseRoleCodes(values.roles);
    if (values.roles && roles === null) {
      setRootError("Role codes: lowercase letters, digits and _ only, comma-separated.");
      return;
    }

    try {
      const user = await createUser({
        // Blank optionals are omitted entirely - the backend 400s on them.
        ...(values.username && { username: values.username }),
        ...(values.email && { email: values.email }),
        ...(values.phone && { phone: values.phone }),
        password: values.password,
        mustChangePassword: values.mustChangePassword,
        mfaEnabled: values.mfaEnabled,
        ...(roles && roles.length > 0 && { roles }),
      });
      toast.success(`Created ${user.username ?? user.email ?? user.phone}`);
      onCreated(user);
    } catch (e) {
      setRootError(authErrorMessage(e));
    }
  });

  const field = (
    name: "username" | "email" | "phone" | "password" | "roles",
    label: string,
    props: { type?: string; placeholder?: string; autoComplete?: string } = {},
  ) => (
    <div className="grid gap-1.5">
      <Label htmlFor={`cu-${name}`} className="text-[12.5px]">
        {label}
      </Label>
      <Input
        id={`cu-${name}`}
        aria-invalid={!!errors[name]}
        className="h-10 rounded-xl"
        {...props}
        {...register(name)}
      />
      {errors[name] && (
        <p className="text-[12px] text-destructive">{errors[name]?.message as string}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="grid gap-3.5" noValidate>
      {field("username", "Username", { placeholder: "ram.teacher" })}
      {field("email", "Email", { type: "email", placeholder: "ram@sunrise.edu" })}
      {field("phone", "Phone", { placeholder: "9841000000" })}
      {field("password", "Temporary password", {
        type: "password",
        autoComplete: "new-password",
        placeholder: "8-128 chars, letter + digit",
      })}

      {canAssignRoles &&
        field("roles", "Roles (comma-separated codes)", { placeholder: "teacher, librarian" })}

      <label className="flex items-center gap-2 text-[13px]">
        <input type="checkbox" className="size-4" {...register("mustChangePassword")} />
        Must change password at first login
      </label>
      <label className="flex items-center gap-2 text-[13px]">
        <input type="checkbox" className="size-4" {...register("mfaEnabled")} />
        Always require email OTP (needs an email address)
      </label>

      <div aria-live="polite" className="min-h-4.25">
        {rootError && <p className="text-[12px] text-destructive">{rootError}</p>}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting} className="h-10 flex-1 gap-2 rounded-xl">
          {isSubmitting ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <UserPlus className="size-4" />
          )}
          Create user
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="h-10 rounded-xl">
          Cancel
        </Button>
      </div>
    </form>
  );
}
