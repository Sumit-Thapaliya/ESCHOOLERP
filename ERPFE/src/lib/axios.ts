import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { currentTenantSlug } from "@/lib/tenant-slug";
import { toApiError } from "@/lib/api/errors";
import { useSession } from "@/store/session-store";
import type { ApiEnvelope, SessionGranted } from "@/lib/api/types";

/**
 * The ONE axios instance the browser uses to talk to the ERP backend.
 *
 * Everything cross-cutting lives here so no call site repeats itself:
 *
 *   baseURL         NEXT_PUBLIC_API_URL - the single place the backend
 *                   address is configured for browser-side calls
 *   x-tenant-id     added for school-plane calls, derived from the address
 *                   bar (or overridden per request with `tenantSlug`)
 *   Authorization   Bearer <access token> from the in-memory session store
 *   envelope unwrap { statusCode, message, data } -> callers receive `data`
 *   401 recovery    refresh ONCE through our own /api/auth/token, then replay
 *
 * Authentication itself does NOT go through this instance. Login, OTP verify,
 * refresh and logout call our same-origin Next route handlers with plain
 * fetch (see "@/lib/api/auth"), because those are the responses that carry
 * tokens and they must set the httpOnly cookie server-side.
 */

/** Per-request extras on top of axios' own options. */
declare module "axios" {
  export interface AxiosRequestConfig {
    /** Send this slug as x-tenant-id instead of deriving it from the URL. */
    tenantSlug?: string;
    /** Don't attach Authorization (public routes). */
    anonymous?: boolean;
    /** Don't retry on 401. Set on the replayed request so it can never loop. */
    skipAuthRefresh?: boolean;
  }
}

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
  // The backend sets no cookies and serves CORS with credentials:false,
  // so the browser must not try to send or store any.
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  const slug = config.tenantSlug ?? currentTenantSlug();
  if (slug) config.headers.set("x-tenant-id", slug);

  if (!config.anonymous) {
    const token = useSession.getState().accessToken;
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

/**
 * Exchange the httpOnly refresh cookie for a fresh access token.
 * Returns null when there is no session (or it has died), and clears the store
 * in that case so subscribed components re-render into the logged-out state.
 */
export async function mintAccessToken(): Promise<SessionGranted | null> {
  try {
    const res = await fetch("/api/auth/token", {
      method: "POST",
      credentials: "same-origin", // sends the erp_rt cookie
    });

    if (!res.ok) {
      if (res.status === 401) useSession.getState().clear();
      return null;
    }

    const granted = (await res.json()) as SessionGranted;
    const session = useSession.getState();
    session.setPlane(granted.plane);
    session.setTokens(granted);
    return granted;
  } catch {
    return null;
  }
}

/**
 * At most one refresh at a time. The backend's refresh token is single-use and
 * presenting a used one revokes the whole session, so a screen that fires five
 * requests with an expired token must produce ONE refresh, not five.
 * (The server has its own guard for the cross-tab case - see refresh-guard.ts.)
 */
let refreshInFlight: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  refreshInFlight ??= mintAccessToken()
    .then((granted) => granted !== null)
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

http.interceptors.response.use(
  (res) => {
    // Unwrap { statusCode, message, data } so callers receive `data` directly.
    // 204 No Content has no body, so it falls through untouched.
    const body = res.data as ApiEnvelope<unknown> | undefined;
    if (body && typeof body === "object" && "statusCode" in body && "data" in body) {
      res.data = body.data;
    }
    return res;
  },
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig | undefined;
    const canRetry =
      config !== undefined &&
      !config.skipAuthRefresh &&
      error.response?.status === 401 &&
      !config.anonymous;

    if (canRetry && (await refreshSession())) {
      config.skipAuthRefresh = true; // never loop more than once
      // The request interceptor re-reads the store, so the new token is attached.
      return http.request(config);
    }

    const apiError = toApiError(error);
    if (apiError.status === 401 && !config?.anonymous) useSession.getState().clear();
    return Promise.reject(apiError);
  },
);
