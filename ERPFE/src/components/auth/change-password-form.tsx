"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { schoolChangePassword } from "@/lib/api/auth";
import { schoolMe } from "@/lib/api/school";
import { authErrorMessage } from "@/lib/api/errors";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/lib/schemas/auth";
import { schoolPath } from "@/lib/tenant-slug";
import { useSession } from "@/store/session-store";
import { useTenant } from "@/providers/tenant-provider";
import { toast } from "sonner";

const FIELDS = [
  { name: "currentPassword", label: "Current password" },
  { name: "newPassword", label: "New password" },
  { name: "confirmPassword", label: "Confirm new password" },
] as const;

/**
 * Forced password change (school plane). The backend returns a NEW token pair
 * and ends every other session, so afterwards we reload /auth/me and continue
 * to the dashboard.
 */
export function ChangePasswordForm() {
  const router = useRouter();
  const { tenant } = useTenant();
  const [show, setShow] = useState<Record<string, boolean>>({});

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async ({ currentPassword, newPassword }) => {
    try {
      await schoolChangePassword(tenant.slug, currentPassword, newPassword);

      const me = await schoolMe();
      useSession.getState().setUser({
        id: me.id,
        email: me.email,
        username: me.username,
        name: me.username ?? me.email,
        roles: me.roles,
        permissions: me.permissions,
        tenantSlug: me.tenant.slug,
        mustChangePassword: me.mustChangePassword,
      });

      toast.success("Password changed", {
        description: "Every other session was signed out.",
      });
      router.replace(schoolPath(tenant.slug, "/dashboard"));
    } catch (e) {
      // 401 = current password wrong (and it counts toward lockout),
      // 400 = policy violation; the message tells them which rule.
      setError("root", { message: authErrorMessage(e) });
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-3.5" noValidate>
      {FIELDS.map(({ name, label }) => (
        <div key={name} className="grid gap-1.5">
          <Label htmlFor={`cp-${name}`} className="text-[12.5px]">
            {label}
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={`cp-${name}`}
              type={show[name] ? "text" : "password"}
              autoComplete={name === "currentPassword" ? "current-password" : "new-password"}
              placeholder="••••••••"
              aria-invalid={!!errors[name]}
              aria-describedby={errors[name] ? `cp-${name}-error` : undefined}
              className="h-11 rounded-xl pl-10 pr-11"
              {...register(name)}
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, [name]: !s[name] }))}
              aria-label={show[name] ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
              className="absolute cursor-pointer right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {show[name] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors[name] && (
            <p id={`cp-${name}-error`} className="text-[12px] text-destructive">
              {errors[name]?.message}
            </p>
          )}
        </div>
      ))}

      <div aria-live="polite" className="min-h-4.25">
        {errors.root && (
          <p className="text-[12px] text-destructive">{errors.root.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full gap-2 rounded-xl text-sm font-medium"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Changing password
          </>
        ) : (
          "Change password"
        )}
      </Button>
    </form>
  );
}
