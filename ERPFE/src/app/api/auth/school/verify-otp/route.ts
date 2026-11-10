import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { backend } from "@/server/backend";
import { isSameOriginRequest, setAuthCookies } from "@/server/auth-cookies";
import { errorResponse, parseBody } from "@/server/route-utils";
import { verifyOtpBodySchema } from "@/lib/schemas/auth";
import { isValidSlug } from "@/lib/tenant-slug";
import type { SchoolVerifyResult } from "@/lib/api/types";


const bodySchema = verifyOtpBodySchema.extend({ slug: z.string() });

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ statusCode: 403, message: "Forbidden" }, { status: 403 });
  }

  const parsed = parseBody(await req.json().catch(() => null), bodySchema);
  if (!parsed.ok) return parsed.response;

  const { slug, challengeId, code } = parsed.value;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ statusCode: 400, message: "Unknown school" }, { status: 400 });
  }

  try {
    const result = await backend<SchoolVerifyResult>("/auth/verify-otp", {
      body: { challengeId, code },
      headers: { "x-tenant-id": slug },
    });

    return setAuthCookies(
      NextResponse.json({
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
