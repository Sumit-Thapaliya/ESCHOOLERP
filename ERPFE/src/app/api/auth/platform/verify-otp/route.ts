import { NextResponse, type NextRequest } from "next/server";
import { backend } from "@/server/backend";
import { isSameOriginRequest, setAuthCookies } from "@/server/auth-cookies";
import { errorResponse, parseBody } from "@/server/route-utils";
import { verifyOtpBodySchema } from "@/lib/schemas/auth";
import type { TokenPair } from "@/lib/api/types";


const bodySchema = verifyOtpBodySchema;

/** Step 2 of platform login. Tokens stop here - only the cookie reaches the browser. */
export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ statusCode: 403, message: "Forbidden" }, { status: 403 });
  }

  const parsed = parseBody(await req.json().catch(() => null), bodySchema);
  if (!parsed.ok) return parsed.response;

  try {
    const tokens = await backend<TokenPair>("/platform/auth/verify-otp", {
      body: { challengeId: parsed.value.challengeId, code: parsed.value.code },
    });

    // Access token -> response body -> in-memory store.
    // Refresh token -> httpOnly cookie -> never readable by browser JS.
    return setAuthCookies(
      NextResponse.json({
        plane: "platform" as const,
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn,
      }),
      { refreshToken: tokens.refreshToken, plane: "platform" },
    );
  } catch (e) {
    return errorResponse(e);
  }
}
