"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, MailPlus, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { OtpInput } from "@/components/auth/otp-input";
import { Button } from "@/components/ui/button";
import { OTP_LENGTH, OTP_TTL_SECONDS } from "@/lib/auth";
import {
  platformLogin,
  platformVerifyOtp,
  schoolLogin,
  schoolVerifyOtp,
} from "@/lib/api/auth";
import { authErrorMessage } from "@/lib/api/errors";
import { completeSignIn } from "@/lib/sign-in";
import { otpSchema, type OtpValues } from "@/lib/schemas/auth";
import { formatClock, useCountdown } from "@/hooks/use-countdown";
import { useAuthFlow } from "@/store/auth-flow-store";
import { usePendingCredentials } from "@/store/pending-credentials-store";
import { useOptionalTenant } from "@/providers/tenant-provider";
import { toast } from "sonner";

type Status = "idle" | "verifying" | "error" | "success";

const RING = 94.2;
const EMPTY_CODE = Array.from({ length: OTP_LENGTH }, () => "");
const RESEND_COOLDOWN_SECONDS = 30;
const NO_LONGER_NEEDS_OTP = "This account no longer needs a code. Go back and sign in.";

/**
 * Step 2 of login: verify the emailed 6-digit code.
 *
 * The backend has no resend endpoint on either plane, so "Send a new code"
 * signs in AGAIN server-side - the only way to mint a fresh challenge and mail
 * a fresh code. The password for that lives in the memory-only pending
 * credentials store: a reload drops it, and the button then says go Back.
 * A 30 s cooldown keeps resend from burning the 10/min login rate limit.
 *
 * A challenge allows 5 attempts and lives 5 minutes. On failure we clear the
 * boxes so a mistyped code cannot be re-submitted by pressing Enter.
 */
export function OtpStep() {
  const router = useRouter();
  const slug = useOptionalTenant()?.slug ?? null;

  const identifier = useAuthFlow((s) => s.identifier);
  const challengeId = useAuthFlow((s) => s.challengeId);
  const destination = useAuthFlow((s) => s.destination);
  const expiresAt = useAuthFlow((s) => s.expiresAt);
  const backToCredentials = useAuthFlow((s) => s.backToCredentials);
  const clearFlow = useAuthFlow((s) => s.clearFlow);

  const expiresIn = useCountdown(expiresAt);
  // State, not a ref: Next 16's react-hooks/refs rule rejects reading a ref
  // inside a callback that is created during render.
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const canResend = usePendingCredentials((s) => s.password !== null);
  const startOtp = useAuthFlow((s) => s.startOtp);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    reset,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: EMPTY_CODE },
  });

  const complete = useWatch({ control, name: "code" }).every(Boolean);

  // Landed here without a challenge (deep link, or the session storage was
  // cleared) - there is nothing to verify, so go back.
  useEffect(() => {
    if (!challengeId) backToCredentials();
  }, [challengeId, backToCredentials]);

  // The code expired while they were typing.
  useEffect(() => {
    if (expiresAt !== null && expiresIn === 0 && !done) {
      setError("root.server", {
        message: "That code has expired. Go back and sign in again for a new one.",
      });
    }
  }, [expiresAt, expiresIn, done, setError]);

  // Client-side cooldown so resend cannot burn the backend's 10/min limit.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  /** "Resend" = a fresh login, because the backend has no resend endpoint. */
  async function resendCode() {
    const { identifier: who, password } = usePendingCredentials.getState();
    if (!who || !password || cooldown > 0 || sending || done) return;

    setSending(true);
    try {
      if (slug) {
        const outcome = await schoolLogin(slug, who, password);
        if (outcome.status !== "otp_required") throw new Error(NO_LONGER_NEEDS_OTP);
        startOtp({
          identifier: who,
          challengeId: outcome.challengeId,
          destination: outcome.destination,
          ttlSeconds: outcome.expiresInSeconds,
        });
      } else {
        const challenge = await platformLogin(who, password);
        startOtp({
          identifier: who,
          challengeId: challenge.challengeId,
          ttlSeconds: challenge.expiresInSeconds,
        });
      }
      reset({ code: EMPTY_CODE });
      clearErrors("root");
      setCooldown(RESEND_COOLDOWN_SECONDS);
      toast.success("A new code is on its way");
    } catch (e) {
      const message =
        e instanceof Error && e.message === NO_LONGER_NEEDS_OTP
          ? e.message
          : authErrorMessage(e);
      setError("root.server", { message });
    } finally {
      setSending(false);
    }
  }

  function handleBack() {
    usePendingCredentials.getState().clearPending();
    backToCredentials();
  }

  const onSubmit = handleSubmit(async ({ code }) => {
    if (done || !challengeId) return;

    try {
      const granted = slug
        ? await schoolVerifyOtp(slug, challengeId, code.join(""))
        : await platformVerifyOtp(challengeId, code.join(""));

      setDone(true);

      const destinationPath = await completeSignIn({
        plane: granted.plane,
        slug: granted.slug ?? slug,
        identifier,
        mustChangePassword: granted.mustChangePassword,
      });

      clearFlow();
      usePendingCredentials.getState().clearPending();
      toast.success(
        granted.mustChangePassword
          ? "You need a new password"
          : "Welcome back!",
        {
          description: granted.mustChangePassword
            ? "Your administrator asked you to change it before continuing."
            : "Taking you to your dashboard…",
        },
      );
      router.replace(destinationPath);
    } catch (e) {
      // 401 = wrong, expired, already used, or 5 attempts exhausted.
      setValue("code", EMPTY_CODE);
      reset({ code: EMPTY_CODE });
      setError("root.server", { message: authErrorMessage(e) });
    }
  });

  const status: Status = isSubmitting
    ? "verifying"
    : done
      ? "success"
      : errors.root?.server
        ? "error"
        : "idle";

  const message = isSubmitting
    ? "Verifying your code…"
    : done
      ? "Verified. Taking you in…"
      : (errors.root?.server?.message ?? "");

  const expired = expiresAt !== null && expiresIn === 0;
  const drain = expiresIn / OTP_TTL_SECONDS;
  // The platform plane does not return a masked destination, so fall back to
  // the identifier they typed.
  const sentTo = destination ?? identifier;

  return (
    <form onSubmit={onSubmit} noValidate>
      <Button
        type="button"
        variant={"ghost"}
        onClick={handleBack}
        className="-ml-1 mb-3 inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back
      </Button>

      <h2 className="text-[22px] font-semibold tracking-[-0.02em]">
        Check your inbox
      </h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        We sent a 6-digit code to{" "}
        <span className="font-medium text-foreground">{sentTo}</span>
      </p>

      <div className="mt-4 flex items-center gap-3">
        <span className="relative grid size-8.5 shrink-0 place-items-center">
          <svg viewBox="0 0 34 34" className="absolute inset-0 -rotate-90">
            <circle
              cx="17"
              cy="17"
              r="15"
              fill="none"
              strokeWidth="2.4"
              className="stroke-border"
            />
            <circle
              cx="17"
              cy="17"
              r="15"
              fill="none"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray={RING}
              strokeDashoffset={RING * (1 - drain)}
              className={cn("stroke-teal", expired && "stroke-destructive")}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <ShieldCheck className="size-3.5 text-muted-foreground" />
        </span>
        <span>
          <strong className="block text-[13px] font-semibold">
            {expired ? "Code expired" : `Code expires in ${formatClock(expiresIn)}`}
          </strong>
          <span className="block text-[11.5px] text-muted-foreground">
            {expired
              ? "Go back and sign in again for a new code"
              : `${OTP_LENGTH} digits, 5 attempts`}
          </span>
        </span>
      </div>

      <div className="mt-4">
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <OtpInput
              key={submitCount}
              value={field.value}
              onChange={field.onChange}
              onComplete={() => void onSubmit()}
              status={status}
              autoFocus
            />
          )}
        />
      </div>

      <div aria-live="polite" className="mt-2.5 min-h-4.25">
        <p
          className={cn(
            "text-[12px]",
            status === "error" && "text-destructive",
            status === "success" && "text-teal",
            (status === "idle" || status === "verifying") &&
              "text-muted-foreground",
          )}
        >
          {message}
        </p>
      </div>

      <div className="mt-3 flex min-h-8 items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => void resendCode()}
          disabled={!canResend || cooldown > 0 || sending || done || expired}
          className="gap-1.5 px-1.5 text-[12.5px] text-muted-foreground hover:text-foreground"
        >
          <MailPlus className="size-3.5" />
          {sending
            ? "Sending…"
            : cooldown > 0
              ? `Send a new code in ${cooldown}s`
              : "Send a new code"}
        </Button>
        {!canResend && (
          <span className="text-[12px] text-muted-foreground">
            Page reloaded? Go back and sign in again for a new code.
          </span>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || done || expired || !complete}
        className="mt-4 h-11 w-full gap-2 rounded-xl text-sm font-medium"
      >
        {status === "verifying" ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Verifying
          </>
        ) : status === "success" ? (
          "Taking you in…"
        ) : (
          "Verify & continue"
        )}
      </Button>
    </form>
  );
}
