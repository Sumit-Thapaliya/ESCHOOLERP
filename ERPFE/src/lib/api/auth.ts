import { useSession } from "@/store/session-store";
import { ApiError } from "./errors";
import { mintAccessToken } from "./client";
import type { PlatformChallenge, SessionGranted } from "./types";

/**
 * Authentication from the browser.
 *
 * These call OUR OWN /api/auth routes, never the backend directly, because
 * those are the responses that carry tokens. The route handler keeps the
 * refresh token server-side in an httpOnly cookie and returns only the access
 * token, which we hold in memory.
 *
 * Everything below also writes to the session store, so a screen only has to
 * call the function and then redirect.
 */

/** What a school login can produce: tokens now, or an OTP challenge first. */
export type SchoolLoginOutcome =
  | { status: "authenticated"; granted: SessionGranted }
  | {
      status: "otp_required";
      challengeId: string;
      channel: "email";
      /** Already masked by the backend, e.g. "a***@school.edu". */
      destination: string;
      expiresInSeconds: number;
    };

async function call<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // change-password is authenticated by the access token, which lives here
      // in memory, so forward it when we have one.
      ...(useSession.getState().accessToken
        ? { Authorization: `Bearer ${useSession.getState().accessToken}` }
        : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin",
  });

  if (!res.ok) {
    const raw = (await res.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const msg = raw?.message;
    const details = Array.isArray(msg) ? msg : [];
    throw new ApiError(
      res.status,
      details[0] ?? (typeof msg === "string" ? msg : "") ?? "Request failed",
      { details },
    );
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function grant(g: SessionGranted): SessionGranted {
  const session = useSession.getState();
  session.setPlane(g.plane);
  session.setTokens(g);
  return g;
}

// --- platform (ERP operators) ----------------------------------------------

/** Always followed by an emailed OTP. In dev the code is in the BACKEND log. */
export function platformLogin(email: string, password: string) {
  return call<PlatformChallenge>("/api/auth/platform/login", { email, password });
}

export async function platformVerifyOtp(challengeId: string, code: string) {
  return grant(await call<SessionGranted>("/api/auth/platform/verify-otp", { challengeId, code }));
}

// --- school (tenant) -------------------------------------------------------

export async function schoolLogin(
  slug: string,
  identifier: string,
  password: string,
): Promise<SchoolLoginOutcome> {
  const res = await call<
    | (SessionGranted & { status: "authenticated" })
    | { status: "otp_required"; challengeId: string; channel: "email"; destination: string; expiresInSeconds: number }
  >("/api/auth/school/login", { slug, identifier, password });

  if (res.status === "otp_required") {
    return {
      status: "otp_required",
      challengeId: res.challengeId,
      channel: res.channel,
      destination: res.destination,
      expiresInSeconds: res.expiresInSeconds,
    };
  }
  return { status: "authenticated", granted: grant(res) };
}

export async function schoolVerifyOtp(slug: string, challengeId: string, code: string) {
  return grant(await call<SessionGranted>("/api/auth/school/verify-otp", { slug, challengeId, code }));
}

/** The backend ends every OTHER session and hands back a fresh pair. */
export async function schoolChangePassword(slug: string, currentPassword: string, newPassword: string) {
  return grant(
    await call<SessionGranted>("/api/auth/school/change-password", {
      slug,
      currentPassword,
      newPassword,
    }),
  );
}

// --- session lifecycle -----------------------------------------------------

/**
 * Re-hydrate after a page reload. The access token is gone (memory only) but
 * the httpOnly refresh cookie is still there, so mint a new one.
 * Call this once on app boot, before deciding whether to show the login page.
 */
export function restoreSession(): Promise<SessionGranted | null> {
  return mintAccessToken();
}

/** Ends the session server-side and clears the store. Never throws. */
export async function logout(): Promise<void> {
  try {
    await call<void>("/api/auth/logout");
  } catch {
    /* the store is cleared below regardless */
  }
  useSession.getState().clear();
}
