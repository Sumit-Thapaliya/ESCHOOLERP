"use client";

import type { ReactNode } from "react";

export function BeamCard({
  children,
  className = "",
  accent = "var(--tertiary)",
}: {
  children: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={`group/beam relative overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-500 hover:border-transparent ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-700 group-hover/beam:opacity-100"
      >
        <span
          className="block size-[230%] shrink-0"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, transparent 296deg, ${accent} 324deg, var(--info) 344deg, var(--teal) 356deg, transparent 361deg)`,
            animation: "promo-spin 5.5s linear infinite",
          }}
        />
      </span>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-px rounded-[15px] bg-card"
      />

      <div className="relative h-full">{children}</div>
    </div>
  );
}

export function GradientRule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`promo-pan pointer-events-none absolute inset-x-0 top-0 block h-px ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent, var(--primary), var(--teal), var(--highlight), var(--info), transparent)",
        opacity: 0.55,
      }}
    />
  );
}
