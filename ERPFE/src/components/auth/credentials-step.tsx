"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { platformLogin, schoolLogin } from "@/lib/api/auth";
import { authErrorMessage } from "@/lib/api/errors";
import { completeSignIn } from "@/lib/sign-in";
import {
  credentialsFormSchema,
  type CredentialsFormValues,
} from "@/lib/schemas/auth";
import { useAuthFlow } from "@/store/auth-flow-store";
import { usePendingCredentials } from "@/store/pending-credentials-store";
import { useOptionalTenant } from "@/providers/tenant-provider";
import { toast } from "sonner";

/**
 * Step 1 of login. The SAME component serves both planes:
 *
 *   inside /t/<slug> or on a school subdomain -> school plane, `identifier`
 *   on the marketing root domain              -> platform plane, `email`
 *
 * Which one applies is decided by whether a TenantProvider is above us, so the
 * two login pages need no props and cannot disagree.
 *
 * The old "Keep me signed in" checkbox is gone on purpose: the refresh token
 * now lives in an httpOnly cookie that already survives a reload and slides for
 * 7 days, so the checkbox had nothing left to control.
 */
export function CredentialsStep() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const slug = useOptionalTenant()?.slug ?? null;
  const isSchool = slug !== null;

  const savedIdentifier = useAuthFlow((s) => s.identifier);
  const startOtp = useAuthFlow((s) => s.startOtp);
  const setPending = usePendingCredentials((s) => s.setPending);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsFormSchema(isSchool ? "school" : "platform")),
    defaultValues: { identifier: savedIdentifier, password: "" },
  });

  const onSubmit = handleSubmit(async ({ identifier, password }) => {
    try {
      // ---- school plane: OTP is conditional -------------------------------
      if (isSchool && slug) {
        const outcome = await schoolLogin(slug, identifier, password);

        if (outcome.status === "otp_required") {
          setPending(identifier, password);
          startOtp({
            identifier,
            challengeId: outcome.challengeId,
            destination: outcome.destination,
            ttlSeconds: outcome.expiresInSeconds,
          });
          toast.success("Check your email", {
            description: `We sent a 6-digit code to ${outcome.destination}`,
          });
          return;
        }

        // Non-MFA, non-admin roles get tokens immediately - no OTP step at all.
        const destination = await completeSignIn({
          plane: "school",
          slug,
          identifier,
          mustChangePassword: outcome.granted.mustChangePassword,
        });
        useAuthFlow.getState().clearFlow();
        toast.success("Welcome back!", { description: "Taking you to your dashboard…" });
        router.replace(destination);
        return;
      }

      // ---- platform plane: OTP is always required --------------------------
      const challenge = await platformLogin(identifier, password);
      setPending(identifier, password);
      startOtp({
        identifier,
        challengeId: challenge.challengeId,
        ttlSeconds: challenge.expiresInSeconds,
      });
      toast.success("Check your email", {
        description: "We sent you a 6-digit code.",
      });
    } catch (e) {
      // Covers 401 (wrong credentials OR a locked account - the backend answers
      // identically on purpose), 403 (inactive, or OTP needed without an email)
      // and 429 (10 attempts/min). Never auto-retry: the lockout counts attempts.
      setError("root", { message: authErrorMessage(e) });
    }
  });

  return (
    <div>
      <h2 className="text-[22px] font-semibold tracking-[-0.02em]">
        Welcome back
      </h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {isSchool
          ? "Sign in with your school account to continue."
          : "Sign in with your platform account to continue."}
      </p>

      <form onSubmit={onSubmit} className="mt-5 grid gap-3.5" noValidate>
        <div className="grid gap-1.5">
          <Label htmlFor="login-identifier" className="text-[12.5px]">
            {isSchool ? "Username, email or phone" : "Email address"}
          </Label>
          <div className="relative">
            {isSchool ? (
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            ) : (
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            )}
            <Input
              id="login-identifier"
              type={isSchool ? "text" : "email"}
              inputMode={isSchool ? undefined : "email"}
              autoComplete="username"
              placeholder={isSchool ? "username, email or phone" : "you@school.edu.np"}
              aria-invalid={!!errors.identifier}
              aria-describedby={
                errors.identifier ? "login-identifier-error" : undefined
              }
              className="h-11 rounded-xl pl-10 pr-3"
              {...register("identifier")}
            />
          </div>
          {errors.identifier && (
            <p
              id="login-identifier-error"
              className="text-[12px] text-destructive"
            >
              {errors.identifier.message}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password" className="text-[12.5px]">
              Password
            </Label>
            <button
              type="button"
              className="text-[12px] cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              className="h-11 rounded-xl pl-10 pr-11"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute cursor-pointer right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p
              id="login-password-error"
              className="text-[12px] text-destructive"
            >
              {errors.password.message}
            </p>
          )}
        </div>

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
              Checking credentials
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
