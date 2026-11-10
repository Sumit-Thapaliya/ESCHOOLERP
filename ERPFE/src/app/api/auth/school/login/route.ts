import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { backend } from "@/server/backend";
import { isSameOriginRequest, setAuthCookies } from "@/server/auth-cookies";
import { errorResponse, parseBody } from "@/server/route-utils";
import { schoolLoginSchema } from "@/lib/schemas/auth";
import { isValidSlug } from "@/lib/tenant-slug";
import type { SchoolLoginResult } from "@/lib/api/types";


const bodySchema = schoolLoginSchema.extend({ slug: z.string() });

/**
 * School login. Two outcomes, and only one of them sets cookies:
 *   otp_required  -> return the challenge, no cookies yet
 *   authenticated -> tokens issued straight away (non-MFA, non-admin roles)
 */
export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ statusCode: 403, message: "Forbidden" }, { status: 403 });
  }

  const parsed = parseBody(await req.json().catch(() => null), bodySchema);
  if (!parsed.ok) return parsed.response;

  const { slug, identifier, password } = parsed.value;
  // The slug is interpolated into a header, so validate it before it leaves here.
  if (!isValidSlug(slug)) {
    return NextResponse.json({ statusCode: 400, message: "Unknown school" }, { status: 400 });
  }

  try {
    const result = await backend<SchoolLoginResult>("/auth/login", {
      body: { identifier, password },
      headers: { "x-tenant-id": slug },
    });

    if (result.status === "otp_required") {
      // `destination` is already masked by the backend ("a***@school.edu").
      return NextResponse.json({
        status: "otp_required" as const,
        challengeId: result.challengeId,
        channel: result.channel,
        destination: result.destination,
        expiresInSeconds: result.expiresInSeconds,
      });
    }

    return setAuthCookies(
      NextResponse.json({
        status: "authenticated" as const,
        plane: "school" as const,
        slug,
        accessToken: result.accessToken,
        expiresIn: result.expiresIn,
        mustChangePassword: result.mustChangePassword,
      }),
      { refreshToken: result.refreshToken, plane: "school", slug },
    );
  } catch (e) {
    return errorResponse(e);
  }
}
