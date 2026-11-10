"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api/auth";
import { currentTenantSlug, schoolPath } from "@/lib/tenant-slug";
import { useOptionalTenant } from "@/providers/tenant-provider";
import { useSession } from "@/store/session-store";

/** Ends the session server-side, clears the cookie and the store, then leaves. */
export function LogoutButton() {
  const router = useRouter();
  const tenantSlug = useOptionalTenant()?.slug;
  const sessionSlug = useSession((s) => s.slug);
  const slug = tenantSlug ?? sessionSlug ?? currentTenantSlug();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        await logout();
        router.replace(slug ? schoolPath(slug, "/login") : "/login");
      }}
    >
      <LogOut className="size-4" />
      Sign out
    </Button>
  );
}
