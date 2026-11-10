import { NextResponse, type NextRequest } from "next/server";
import { backend, BackendError } from "@/server/backend";
import { clearAuthCookies, isSameOriginRequest, readAuthCookies, setAuthCookies } from "@/server/auth-cookies";
import { rotateOnce } from "@/server/refresh-guard";
import type { TokenPair } from "@/lib/api/types";


const REFRESH_PATH = { platform: "/platform/auth/refresh", school: "/auth/refresh" } as const;

/**
 * Mint an access token from the httpOnly refresh cookie, rotating it.
 *
 * Called on app boot (so a page reload keeps you signed in) and by the API
 * client when a request comes back 401. Rotation goes through rotateOnce(),
 * which exists because the backend revokes the whole session if it sees the
 * same refresh token twice - see src/server/refresh-guard.ts.
 */
export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ statusCode: 403, message: "Forbidden" }, { status: 403 });
  }

  const { refreshToken, plane, slug } = readAuthCookies(req);
  if (!refreshToken || !plane) {
    return NextResponse.json({ statusCode: 401, message: "No session" }, { status: 401 });
  }

  try {
    const tokens = await rotateOnce(refreshToken, () =>
      backend<TokenPair>(REFRESH_PATH[plane], {
        body: { refreshToken },
        headers: plane === "school" && slug ? { "x-tenant-id": slug } : undefined,
      }),
    );

    return setAuthCookies(
      NextResponse.json({
        plane,
        slug: plane === "school" ? slug : null,
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn,
      }),
      { refreshToken: tokens.refreshToken, plane, slug },
    );
  } catch (e) {
    // Expired, revoked, or the user was deactivated. Clear the cookies so the
    // browser stops retrying with a dead session.
    if (e instanceof BackendError && e.status === 401) {
      return clearAuthCookies(
        NextResponse.json({ statusCode: 401, message: "Invalid refresh token" }, { status: 401 }),
      );
    }
    return NextResponse.json({ statusCode: 500, message: "Unexpected error" }, { status: 500 });
  }
}
