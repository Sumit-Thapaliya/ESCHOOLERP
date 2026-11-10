"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CredentialsStep } from "@/components/auth/credentials-step";
import { OtpStep } from "@/components/auth/otp-step";
import {
  useAuthFlow,
  useAuthFlowHydrated,
  type Step,
} from "@/store/auth-flow-store";
import { Building2 } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

function StepPills({ step }: { step: Step }) {
  const identifyDone = step === "otp";

  return (
    <div className="mb-5 flex items-center gap-1.5">
      <span
        className={cn(
          "inline-flex h-6.5 select-none items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium transition-all duration-300",
          identifyDone
            ? "border-teal/40 bg-teal/10 text-teal"
            : "border-primary bg-primary text-primary-foreground",
        )}
      >
        <span
          className={cn(
            "grid size-3.75 place-items-center rounded-full text-[9.5px] font-bold",
            identifyDone ? "bg-teal/25" : "bg-white/25",
          )}
        >
          {identifyDone ? "✓" : "1"}
        </span>
        Identify
      </span>

      <span className="h-px min-w-1.5 flex-1 bg-border" />

      <span
        className={cn(
          "inline-flex h-6.5 select-none items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium transition-all duration-300",
          identifyDone
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card/60 text-muted-foreground",
        )}
      >
        <span
          className={cn(
            "grid size-3.75 place-items-center rounded-full text-[9.5px] font-bold",
            identifyDone ? "bg-white/25" : "bg-muted text-muted-foreground",
          )}
        >
          2
        </span>
        Verify
      </span>
    </div>
  );
}

export default function LoginPage() {
  const hydrated = useAuthFlowHydrated();
  const step = useAuthFlow((s) => s.step);

  if (!hydrated) return <div className="min-h-104" aria-hidden />;

  return (
    <div className="w-full">
      <motion.div
        layout
        transition={{ duration: 0.42, ease: EASE }}
        className="grid gap-3.5"
      >
        <motion.div layout className="flex items-center justify-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-[17px] font-semibold tracking-[-0.012em]">
              Baudhika ERP
            </p>
            <p className="text-[11px] text-muted-foreground">Super admin</p>
          </div>
        </motion.div>

        <motion.div
          layout
          transition={{ duration: 0.42, ease: EASE }}
          className="relative overflow-hidden rounded-[calc(var(--radius)*2.2)] border border-border/80 bg-card/80 p-6 shadow-[0_32px_72px_-34px_rgba(9,32,50,0.42),inset_0_1px_0_rgba(255,255,255,0.36)] backdrop-blur-2xl backdrop-saturate-150 dark:border-border dark:bg-card/75 dark:shadow-[0_34px_76px_-30px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <StepPills step={step} />

          <motion.div
            layout
            transition={{ duration: 0.42, ease: EASE }}
            className="relative"
          >
            <AnimatePresence mode="wait" initial={false}>
              {step === "credentials" ? (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.26, ease: EASE }}
                >
                  <CredentialsStep />
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.26, ease: EASE }}
                >
                  <OtpStep />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.p
          layout
          className="text-center text-[11.5px] text-muted-foreground"
        >
          Protected by two-factor authentication
        </motion.p>
      </motion.div>
    </div>
  );
}
