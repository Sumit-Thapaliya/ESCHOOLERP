import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { OTP_TTL_SECONDS } from "@/lib/auth";

export type Step = "credentials" | "otp";

/**
 * Login-screen UI state only: which step we are on, what the user typed, and
 * the OTP challenge we are mid-way through.
 *
 * NO TOKENS LIVE HERE. Those belong to src/store/session-store.ts, which is
 * deliberately not persisted. This store is persisted to sessionStorage (not
 * localStorage) purely so that a refresh mid-OTP does not throw away the
 * challenge - it dies with the tab, and holds nothing an attacker could use
 * without also having the emailed code.
 */
type AuthFlowState = {
  step: Step;
  /** Username, email or phone - the identifier the user typed. */
  identifier: string;
  /** From the login response; needed to verify the code. */
  challengeId: string | null;
  /** Masked by the backend, e.g. "a***@school.edu". School plane only. */
  destination: string | null;
  /** Epoch ms. */
  expiresAt: number | null;

  startOtp: (args: {
    identifier: string;
    challengeId: string;
    destination?: string | null;
    ttlSeconds?: number;
  }) => void;
  backToCredentials: () => void;
  clearFlow: () => void;
};

const initial = {
  step: "credentials" as Step,
  identifier: "",
  challengeId: null as string | null,
  destination: null as string | null,
  expiresAt: null as number | null,
};

export const useAuthFlow = create<AuthFlowState>()(
  persist(
    (set) => ({
      ...initial,
      startOtp: ({ identifier, challengeId, destination = null, ttlSeconds = OTP_TTL_SECONDS }) =>
        set({
          step: "otp",
          identifier,
          challengeId,
          destination,
          expiresAt: Date.now() + ttlSeconds * 1000,
        }),
      backToCredentials: () => set({ ...initial }),
      clearFlow: () => set({ ...initial }),
    }),
    {
      name: "auth-flow",
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true, // load after mount to avoid an SSR hydration mismatch
      partialize: ({ step, identifier, challengeId, destination, expiresAt }) => ({
        step,
        identifier,
        challengeId,
        destination,
        expiresAt,
      }),
    },
  ),
);

export function useAuthFlowHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useAuthFlow.persist.onFinishHydration(() => setHydrated(true));
    void useAuthFlow.persist.rehydrate();
    return unsub;
  }, []);
  return hydrated;
}
