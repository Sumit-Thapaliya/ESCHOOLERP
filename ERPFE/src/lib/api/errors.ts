import { isAxiosError } from "axios";
import type { ApiErrorBody } from "./types";

/**
 * The single error type used across the app. Anything thrown by the API layer
 * is an ApiError, so screens have one shape to handle.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  /** 400 validation returns several messages; we keep all of them. */
  readonly details: string[];
  /** Seconds to wait, from Retry-After on 429. */
  readonly retryAfter?: number;

  constructor(
    status: number,
    message: string,
    opts: { code?: string; details?: string[]; retryAfter?: number } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = opts.code;
    this.details = opts.details ?? [];
    this.retryAfter = opts.retryAfter;
  }

  /** No response at all: offline, DNS, CORS, or the API is down. */
  get isNetworkError(): boolean {
    return this.status === 0;
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

/** Normalise anything thrown into an ApiError. */
export function toApiError(value: unknown): ApiError {
  if (value instanceof ApiError) return value;

  if (isAxiosError(value)) {
    const status = value.response?.status ?? 0;
    const body = value.response?.data as ApiErrorBody | undefined;
    const raw = body?.message;
    const details = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const retryAfter = Number(value.response?.headers?.["retry-after"]) || undefined;

    return new ApiError(status, details[0] ?? value.message ?? "Something went wrong", {
      code: body?.code,
      details,
      retryAfter,
    });
  }

  return new ApiError(0, value instanceof Error ? value.message : "Something went wrong");
}

/**
 * Message to show on a login/OTP screen.
 *
 * Note on 401: the backend answers "Invalid credentials" for an unknown email, a
 * wrong password AND a locked account - deliberately identical, so that the API
 * cannot be used to discover which addresses exist. We therefore cannot be more
 * specific without leaking that information, and must not try.
 */
export function authErrorMessage(value: unknown): string {
  const err = toApiError(value);

  if (err.isNetworkError) {
    return "Can't reach the server. Check your connection and try again.";
  }
  if (err.status === 429) {
    return err.retryAfter
      ? `Too many attempts. Please try again in ${err.retryAfter} seconds.`
      : "Too many attempts. Please wait a minute before trying again.";
  }
  return err.message;
}
