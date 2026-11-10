import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_10px_28px_-12px_var(--primary)] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-12px_var(--primary)]",
  highlight:
    "bg-highlight text-[#231400] shadow-[0_8px_22px_-10px_rgba(255,167,15,0.9)] hover:-translate-y-0.5 hover:bg-[#f0990a]",
  outline: "border border-border bg-background/60 text-foreground backdrop-blur hover:border-primary/40 hover:bg-muted",
  light: "bg-white text-[#0f2433] hover:-translate-y-0.5 hover:bg-highlight hover:text-[#231400]",
  dark: "bg-[#231400] text-white hover:-translate-y-0.5 hover:bg-black",
  ghostLight: "border border-white/20 text-white hover:border-white/40 hover:bg-white/10",
} as const;

const SIZES = {
  md: "h-11 px-6 text-[14px]",
  lg: "h-[52px] px-8 text-[15px]",
} as const;

type PromoButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  arrow?: boolean;
  shine?: boolean;
  className?: string;
};

export function PromoButton({
  href,
  children,
  variant = "primary",
  size = "lg",
  arrow = false,
  shine = false,
  className,
}: PromoButtonProps) {
  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-semibold transition-all duration-300 active:scale-[0.97]",
    "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    VARIANTS[variant],
    SIZES[size],
    className
  );

  const content = (
    <>
      {children}
      {arrow && <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />}
      {shine && (
        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30 transition-[left] duration-700 group-hover:left-[130%]" />
      )}
    </>
  );

  return href.startsWith("/") ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}
