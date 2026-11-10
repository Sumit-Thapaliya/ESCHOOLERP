import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { backend } from "@/server/backend";
import { isSameOriginRequest, setAuthCookies } from "@/server/auth-cookies";
import { errorResponse, parseBody } from "@/server/route-utils";
import { changePasswordBodySchema } from "@/lib/schemas/auth";
import { isValidSlug } from "@/lib/tenant-slug";
import type { TokenPair } from "@/lib/api/types";


const bodySchema = changePasswordBodySchema.extend({ slug: z.string() });

/**
 * Forced password change. This endpoint is authenticated by the ACCESS token,
 * which lives in the client's memory, so the browser forwards it and we pass it
 * through. The backend ends every other session and returns a fresh pair.
 */
export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ statusCode: 403, message: "Forbidden" }, { status: 403 });
  }

  const parsed = parseBody(await req.json().catch(() => null), bodySchema);
  if (!parsed.ok) return parsed.response;

  const { slug, currentPassword, newPassword } = parsed.value;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ statusCode: 400, message: "Unknown school" }, { status: 400 });
  }

  const authorization = req.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json({ statusCode: 401, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const tokens = await backend<TokenPair>("/auth/change-password", {
      body: { currentPassword, newPassword },
      headers: { "x-tenant-id": slug, authorization },
    });

    return setAuthCookies(
      NextResponse.json({
        plane: "school" as const,
        slug,
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn,
      }),
      { refreshToken: tokens.refreshToken, plane: "school", slug },
    );
  } catch (e) {
    return errorResponse(e);
  }
}
