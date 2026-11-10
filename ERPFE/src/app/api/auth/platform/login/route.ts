import { NextResponse, type NextRequest } from "next/server";
import { backend } from "@/server/backend";
import { isSameOriginRequest } from "@/server/auth-cookies";
import { errorResponse, parseBody } from "@/server/route-utils";
import { platformLoginSchema } from "@/lib/schemas/auth";
import type { PlatformChallenge } from "@/lib/api/types";


/** Step 1 of platform login. No tokens yet, so no cookies are set here. */
export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ statusCode: 403, message: "Forbidden" }, { status: 403 });
  }

  const parsed = parseBody(await req.json().catch(() => null), platformLoginSchema);
  if (!parsed.ok) return parsed.response;

  try {
    // The backend always requires an emailed OTP for the platform plane.
    // With MAIL_DRIVER=console the code is printed in the BACKEND log.
    const challenge = await backend<PlatformChallenge>("/platform/auth/login", {
      body: parsed.value,
    });
    return NextResponse.json(challenge);
  } catch (e) {
    return errorResponse(e);
  }
}
