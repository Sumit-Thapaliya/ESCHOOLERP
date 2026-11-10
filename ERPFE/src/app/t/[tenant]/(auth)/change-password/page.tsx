"use client";

import { ChangePasswordForm } from "@/components/auth/change-password-form";

export default function ChangePasswordPage() {
  return (
    <div className="w-full rounded-[calc(var(--radius)*2.2)] border border-border/80 bg-card/80 p-6 shadow-[0_32px_72px_-34px_rgba(9,32,50,0.42)] backdrop-blur-2xl dark:bg-card/75">
      <h2 className="text-[22px] font-semibold tracking-[-0.02em]">
        Choose a new password
      </h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Your administrator requires this before you can continue. Every other
        session will be signed out.
      </p>
      <div className="mt-5">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
