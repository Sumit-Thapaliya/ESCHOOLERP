import { NextResponse, type NextRequest } from "next/server";
import { backend } from "@/server/backend";
import { clearAuthCookies, readAuthCookies } from "@/server/auth-cookies";


/**
 * Ends the session. The backend's logout is 204-always, even for an unknown
 * token, so we clear the cookies whatever happens - a logout must never fail
 * from the user's point of view.
 */
export async function POST(req: NextRequest) {
  const { refreshToken, plane, slug } = readAuthCookies(req);

  if (refreshToken && plane) {
    const path = plane === "platform" ? "/platform/auth/logout" : "/auth/logout";
    try {
      await backend<void>(path, {
        body: { refreshToken },
        headers: plane === "school" && slug ? { "x-tenant-id": slug } : undefined,
      });
    } catch {
      /* the cookies are about to be cleared either way */
    }
  }

  return clearAuthCookies(new NextResponse(null, { status: 204 }));
}
