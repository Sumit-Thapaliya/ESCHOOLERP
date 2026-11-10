"use client";

import { Reveal } from "@/components/promotional/motion";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  tone?: "default" | "inverse";
  className?: string;
};

export function Eyebrow({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "inverse" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.16em]",
        tone === "inverse"
          ? "border-white/15 bg-white/5 text-white/80"
          : "border-primary/15 bg-primary/[0.06] text-primary"
      )}
    >
      <span className="size-1.5 rounded-full bg-highlight" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "default",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-[680px] text-center" : "max-w-[560px]", className)}>
      {eyebrow && (
        <Reveal>
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="mt-5 text-balance text-[clamp(1.9rem,3.4vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.025em]">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-4 text-pretty text-[16px] leading-[1.7]",
              tone === "inverse" ? "text-white/65" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
