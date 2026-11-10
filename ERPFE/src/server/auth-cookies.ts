/**
 * SERVER-ONLY. The refresh token lives in an httpOnly cookie set by THIS server.
 *
 * The backend returns tokens in the JSON body and sets no cookies itself
 * (main.ts: `credentials: false, // bearer tokens only, no cookies`), so the
 * Next server extracts them and stores them here. Browser JS can never read
 * this cookie - that is the entire point.
 */
import { NextResponse, type NextRequest } from "next/server";
import type { Plane } from "@/lib/api/types";

export const RT_COOKIE = "erp_rt";
export const PLANE_COOKIE = "erp_plane";
export const SLUG_COOKIE = "erp_slug";

/** Backend: REFRESH_TTL_MS = 7 days sliding, SESSION_MAX_MS = 30 days absolute. */
const MAX_AGE = 7 * 24 * 60 * 60;

/**
 * path:"/api/auth" means the browser only ever sends these to our own auth
 * routes - never to other API routes, never to the backend, never as a
 * third-party request. `secure` is production-only so http://localhost works.
 * SameSite=Strict plus the Origin check in isSameOriginRequest() is our CSRF
 * defence, since these routes are authenticated by cookie alone.
 */
const base = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/api/auth",
  maxAge: MAX_AGE,
};

export type AuthCookies = {
  refreshToken: string | null;
  plane: Plane | null;
  slug: string | null;
};

export function readAuthCookies(req: NextRequest): AuthCookies {
  const plane = req.cookies.get(PLANE_COOKIE)?.value;
  return {
    refreshToken: req.cookies.get(RT_COOKIE)?.value ?? null,
    plane: plane === "platform" || plane === "school" ? plane : null,
    slug: req.cookies.get(SLUG_COOKIE)?.value ?? null,
  };
}

export function setAuthCookies(
  res: NextResponse,
  opts: { refreshToken: string; plane: Plane; slug?: string | null },
): NextResponse {
  res.cookies.set(RT_COOKIE, opts.refreshToken, base);
  res.cookies.set(PLANE_COOKIE, opts.plane, base);
  if (opts.slug) res.cookies.set(SLUG_COOKIE, opts.slug, base);
  else res.cookies.set(SLUG_COOKIE, "", { ...base, maxAge: 0 });
  return res;
}

export function clearAuthCookies(res: NextResponse): NextResponse {
  for (const name of [RT_COOKIE, PLANE_COOKIE, SLUG_COOKIE]) {
    res.cookies.set(name, "", { ...base, maxAge: 0 });
  }
  return res;
}

/** Cookie-authenticated routes must reject cross-origin callers. */
export function isSameOriginRequest(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // curl, server-to-server, or a browser that omitted it
  const host = req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
