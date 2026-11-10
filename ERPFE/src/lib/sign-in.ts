import { schoolMe } from "@/lib/api/school";
import { schoolPath } from "@/lib/tenant-slug";
import { useSession } from "@/store/session-store";
import type { Plane } from "@/lib/api/types";

/**
 * Last step of a successful sign-in: load the user into the session store and
 * work out where to send them. Shared by the credentials step (school users
 * who need no OTP) and the OTP step (everyone else), so the two cannot drift.
 *
 * Returns a path; the caller does the router.replace().
 */
export async function completeSignIn(opts: {
  plane: Plane;
  slug: string | null;
  identifier: string;
  mustChangePassword?: boolean;
}): Promise<string> {
  const session = useSession.getState();

  // The backend lets /auth/me and /auth/change-password work while a password
  // change is pending, but nothing else. Send them there first.
  if (opts.mustChangePassword) {
    return opts.slug ? schoolPath(opts.slug, "/change-password") : "/change-password";
  }

  if (opts.plane === "school") {
    const me = await schoolMe();
    session.setUser({
      id: me.id,
      email: me.email,
      username: me.username,
      name: me.username ?? me.email,
      roles: me.roles,
      permissions: me.permissions,
      tenantSlug: me.tenant.slug,
      mustChangePassword: me.mustChangePassword,
    });
    return schoolPath(me.tenant.slug, "/dashboard");
  }

  // The platform plane has no /me endpoint, so the email they typed is all we know.
  session.setUser({
    id: null,
    email: opts.identifier,
    name: opts.identifier,
    roles: [],
    permissions: [],
  });
  return "/dashboard";
}
