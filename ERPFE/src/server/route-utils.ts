/** SERVER-ONLY. Shared response helpers for the /api/auth routes. */
import { NextResponse } from "next/server";
import type { ZodError, ZodType } from "zod";
import { BackendError } from "./backend";

/**
 * Re-emit backend failures in Nest's own error shape, so the browser-side
 * ApiError parsing in src/lib/api/errors.ts works unchanged whether the error
 * came from the backend directly or through one of these routes.
 */
export function errorResponse(e: unknown): NextResponse {
  if (e instanceof BackendError) {
    return NextResponse.json(
      { statusCode: e.status, message: e.details.length ? e.details : e.message },
      { status: e.status },
    );
  }
  console.error("[api/auth] unexpected error", e);
  return NextResponse.json({ statusCode: 500, message: "Unexpected error" }, { status: 500 });
}

/** Validate the request body; returns the parsed value or a 400 response. */
export function parseBody<T>(
  raw: unknown,
  schema: ZodType<T>,
): { ok: true; value: T } | { ok: false; response: NextResponse } {
  try {
    return { ok: true, value: schema.parse(raw) };
  } catch (e) {
    const issues = (e as ZodError).issues?.map((i) => i.message) ?? ["Invalid request"];
    return {
      ok: false,
      response: NextResponse.json({ statusCode: 400, message: issues }, { status: 400 }),
    };
  }
}
