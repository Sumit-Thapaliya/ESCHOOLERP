import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Shown when a PLATFORM session reports mustChangePassword.
 *
 * The backend has no platform change-password endpoint (the tenant plane has
 * POST /auth/change-password, platform-auth.controller.ts has nothing), so
 * there is nothing honest to submit to. This card replaces what would
 * otherwise be a redirect to a school-only route and a 404.
 */
export function PasswordChangeRequired() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-md rounded-[calc(var(--radius)*2.2)] border border-border/80 bg-card/80 p-6 text-center shadow-[0_32px_72px_-34px_rgba(9,32,50,0.42)] backdrop-blur-2xl">
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-amber-500/15 text-amber-600">
          <ShieldAlert className="size-5" />
        </span>
        <h1 className="mt-4 text-[22px] font-semibold tracking-[-0.02em]">
          A password change is required
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
          This account must change its password before first use, but the
          platform change-password endpoint is not available on the backend
          yet. Ask a platform administrator to reset it for you.
        </p>
        <Button asChild className="mt-5 h-11 w-full rounded-xl text-sm font-medium">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    </main>
  );
}
