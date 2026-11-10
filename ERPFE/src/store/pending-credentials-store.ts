import { create } from "zustand";

type PendingCredentialsState = {
  identifier: string | null;
  password: string | null;
  setPending: (identifier: string, password: string) => void;
  clearPending: () => void;
};

/**
 * Memory-only holding place for the password between login step 1 and the OTP
 * step, so that "Send a new code" can sign in again server-side (the backend
 * has no resend endpoint - a fresh login is the only way to mint a new code).
 *
 * Deliberately NOT persisted: a page reload drops it, and the OTP screen then
 * tells the user to go back and sign in again instead of pretending.
 * Cleared on successful verify and on Back.
 */
export const usePendingCredentials = create<PendingCredentialsState>()((set) => ({
  identifier: null,
  password: null,
  setPending: (identifier, password) => set({ identifier, password }),
  clearPending: () => set({ identifier: null, password: null }),
}));
