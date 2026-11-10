import { create } from "zustand";
import type { Plane, Role, SessionGranted } from "@/lib/api/types";

export type { Plane };

export type SessionUser = {
  /** Null on the platform plane: it has no /me endpoint, so the id is unknown. */
  id: string | null;
  email: string | null;
  username?: string | null;
  name?: string | null;
  roles: Role[];
  /** Institution-scoped permission codes from GET /auth/me. */
  permissions: string[];
  /** School plane only. */
  tenantSlug?: string;
  mustChangePassword?: boolean;
};

type SessionState = {
  plane: Plane | null;
  /** Short-lived (15 min). Held in memory only - see the note below. */
  accessToken: string | null;
  /** Epoch ms, set 30s short so a request never races the exact expiry. */
  expiresAt: number | null;
  /** School plane only; the platform plane has no slug. */
  slug: string | null;
  user: SessionUser | null;

  setPlane: (plane: Plane) => void;
  setTokens: (granted: SessionGranted) => void;
  setUser: (user: SessionUser) => void;
  setMustChangePassword: (value: boolean) => void;
  clear: () => void;
};

const EMPTY = {
  plane: null,
  accessToken: null,
  expiresAt: null,
  slug: null,
  user: null,
} as const;

/**
 * The authenticated session. NOT PERSISTED - no `persist`, no localStorage,
 * no sessionStorage.
 *
 * Where the two credentials live, and why they differ:
 *
 *   refreshToken  httpOnly cookie set by our own /api/auth routes (server side).
 *                 Browser JS cannot read it. Survives a reload, so a reload
 *                 does NOT sign the user out - `restoreSession()` mints a new
 *                 access token from it on boot.
 *   accessToken   here, in memory. 15 minutes, sent as `Authorization: Bearer`.
 *                 Never written to any storage.
 *
 * The backend itself uses no cookies (main.ts: `credentials: false`), so the
 * Next server extracts the tokens from its JSON response and sets the cookie.
 * That is what makes httpOnly possible without any backend change.
 *
 * Outside React, read it with `useSession.getState()` - the API client does.
 */
export const useSession = create<SessionState>()((set) => ({
  ...EMPTY,

  setPlane: (plane) => set({ plane }),

  setTokens: ({ accessToken, expiresIn, slug, plane }) =>
    set((s) => ({
      accessToken,
      expiresAt: Date.now() + Math.max(0, expiresIn - 30) * 1000,
      // Only overwrite these when the caller actually supplied them.
      ...(plane ? { plane } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(s ? {} : {}),
    })),

  setUser: (user) => set({ user }),

  setMustChangePassword: (value) =>
    set((s) => (s.user ? { user: { ...s.user, mustChangePassword: value } } : s)),

  clear: () => set({ ...EMPTY }),
}));

// ---------------------------------------------------------------------------
// Selectors. Prefer these over reading the whole store: a component that needs
// one boolean should not re-render when an unrelated field changes.
// ---------------------------------------------------------------------------

export const useIsAuthenticated = () => useSession((s) => s.accessToken !== null);

export const useSessionPlane = () => useSession((s) => s.plane);

export const useSessionSlug = () => useSession((s) => s.slug);

export const useMustChangePassword = () =>
  useSession((s) => s.user?.mustChangePassword === true);

export const useCurrentUser = () => useSession((s) => s.user);

/** Gate one control: `useHasPermission("user.create")` */
export function useHasPermission(code: string) {
  return useSession((s) => s.user?.permissions.includes(code) ?? false);
}

export function useHasAnyPermission(codes: string[]) {
  return useSession((s) => codes.some((c) => s.user?.permissions.includes(c)));
}

export function useHasRole(code: string) {
  return useSession((s) => s.user?.roles.some((r) => r.code === code) ?? false);
}
