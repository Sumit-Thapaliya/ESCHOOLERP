/**
 * SERVER-ONLY. Talks to erp-backend from Next route handlers.
 * Never import this from a client component.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class BackendError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details: string[] = [],
  ) {
    super(message);
    this.name = "BackendError";
  }
}

type Init = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

/** Unwraps the { statusCode, message, data } envelope, or throws BackendError. */
export async function backend<T>(path: string, init: Init = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: init.method ?? (init.body !== undefined ? "POST" : "GET"),
    headers: { "Content-Type": "application/json", ...init.headers },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });

  if (res.status === 204) return undefined as T;

  const raw = (await res.json().catch(() => null)) as Record<string, unknown> | null;

  if (!res.ok) {
    const msg = raw?.message;
    const details = Array.isArray(msg) ? (msg as string[]) : [];
    const fallback = typeof msg === "string" ? msg : (raw?.error as string | undefined);
    throw new BackendError(res.status, details[0] ?? fallback ?? "Request failed", details);
  }

  // Success bodies are wrapped as { statusCode, message, data }; 204 has none.
  return (raw && "data" in raw ? raw.data : raw) as T;
}
