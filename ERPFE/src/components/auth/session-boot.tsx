"use client";

import { useEffect } from "react";
import { restoreSession } from "@/lib/api/auth";
import { useSession } from "@/store/session-store";

/**
 * Once per app load, turn the httpOnly refresh cookie back into an access
 * token, so data hooks and direct API calls work without waiting for a
 * guarded page to mount. Fire-and-forget: pages still gate themselves with
 * RequireAuth, and the server-side rotation guard makes the occasional
 * duplicate call harmless.
 */
export function SessionBoot() {
  useEffect(() => {
    if (!useSession.getState().accessToken) void restoreSession();
  }, []);
  return null;
}
