"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { restoreSession } from "@/lib/api/auth";
import { schoolMe } from "@/lib/api/school";
import { PasswordChangeRequired } from "@/components/auth/password-change-required";
import { currentTenantSlug, schoolPath } from "@/lib/tenant-slug";
import { useSession } from "@/store/session-store";
import type { Plane } from "@/lib/api/types";

/**
 * Client-side gate for the (private) route groups.
 *
 * On mount: if there is no access token in memory, mint one from the httpOnly
 * refresh cookie - that single call is what makes a page reload keep you
 * signed in. If it fails there is genuinely no session, so send the user to
 * the login page for whichever plane they are on.
 */
export function RequireAuth({
  plane,
  children,
}: {
  plane: Plane;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const slug = useSession((s) => s.slug) ?? currentTenantSlug();
  const mustChangePassword = useSession((s) => s.user?.mustChangePassword === true);

  useEffect(() => {
    let alive = true;
    void (async () => {
      if (!useSession.getState().accessToken) await restoreSession();
      if (!alive) return;

      if (!useSession.getState().accessToken) {
        router.replace(
          plane === "school" && slug ? schoolPath(slug, "/login") : "/login",
        );
        return;
      }

      // The refresh cookie survives a reload; the user object does not.
      // Re-mint the identity card (name, roles, permissions) from /auth/me
      // so a reloaded page knows WHO holds the key, not just that a key exists.
      if (plane === "school" && !useSession.getState().user) {
        try {
          const me = await schoolMe();
          if (!alive) return;
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
        } catch {
          // /auth/me unreachable: the gates below will explain honestly.
        }
      }

      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [plane, slug, router]);

  // A pending forced change blocks everything except the change screen.
  useEffect(() => {
    if (ready && mustChangePassword && plane === "school") {
      router.replace(
        plane === "school" && slug
          ? schoolPath(slug, "/change-password")
          : "/change-password",
      );
    }
  }, [ready, mustChangePassword, plane, slug, router]);

  // Shown for the moment between "the code was accepted" and "the guarded page
  // is ready". It says what is happening instead of flashing an empty screen.
  const spinner = (
    <main className="grid min-h-screen place-items-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Signing you in…</p>
      </div>
    </main>
  );

  if (!ready) return spinner;

  // School: the redirect effect above is already navigating away.
  // Platform: there is no change-password endpoint, so explain instead of 404.
  if (mustChangePassword) {
    return plane === "platform" ? <PasswordChangeRequired /> : spinner;
  }

  return <>{children}</>;
}
