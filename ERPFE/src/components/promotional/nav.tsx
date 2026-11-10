"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mail, Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { Magnetic } from "@/components/promotional/motion";
import { ThemeToggle } from "@/components/promotional/theme-toggle";
import { useReducedMotion } from "@/components/promotional/use-reduced-motion";

const LINKS = [
  { href: "#why", label: "Why us" },
  { href: "#system", label: "System" },
  { href: "#stories", label: "Stories" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

// "top" (the hero) clears the highlight when scrolled back up.
const SECTION_IDS = ["top", ...LINKS.map((link) => link.href.slice(1))];

const FOCUS_RING =
  "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// Springy morph borrowed from 21st.dev "Morphing Scroll Navbar".
const MORPH = "duration-500 ease-[cubic-bezier(0.34,1.2,0.5,1)]";

export function PromoNav() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const active = useActiveSection(SECTION_IDS);
  const { atTop, direction } = useScrollDirection();

  // Full-width header at the top, floating capsule once scrolled,
  // and a compact capsule (links tucked away) while scrolling down.
  const floating = !atTop || open;
  const compact = floating && direction === "down" && !open;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <>
      <div className="border-b border-white/5 bg-[#0f2433] text-[12px] text-white/75">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-6 py-2 lg:px-8">
          <p className="flex items-center gap-2">
            <span className="relative flex size-1.5">
              <motion.i
                className="absolute inset-0 rounded-full bg-highlight"
                animate={reduce ? undefined : { scale: [1, 2.4], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <i className="relative block size-1.5 rounded-full bg-highlight" />
            </span>
            <span>
              Admissions open for 2083 — <b className="font-semibold text-white">go live in 7 days.</b>
            </span>
          </p>
          <div className="hidden items-center gap-5 md:flex">
            <a href="tel:+9779812291777" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Phone className="size-3.5" /> +977 9812291777
            </a>
            <span aria-hidden className="h-3 w-px bg-white/15" />
            <a
              href="mailto:support@baudhika.com"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Mail className="size-3.5" /> support@baudhika.com
            </a>
          </div>
        </div>
      </div>

      <header className="pointer-events-none sticky top-0 z-[100] flex h-[72px] justify-center px-3 sm:px-5">
        <div
          className={cn(
            "pointer-events-auto relative flex w-full items-center gap-6 border transition-all",
            MORPH,
            reduce && "duration-0",
            floating
              ? "mt-3 h-[58px] max-w-[1000px] rounded-2xl border-border/70 bg-background/75 pl-4 pr-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_40px_-22px_rgba(0,0,0,0.55)] backdrop-blur-xl backdrop-saturate-150"
              : "mt-0 h-[72px] max-w-[1280px] rounded-none border-transparent bg-transparent px-3 lg:px-3",
            compact && "h-[52px] lg:max-w-[560px]"
          )}
        >
          <a
            href="#top"
            aria-label="Baudhika ERP — back to top"
            className={cn("flex shrink-0 items-center gap-2.5 rounded-lg leading-none", FOCUS_RING)}
          >
            <span
              className={cn(
                "grid place-items-center rounded-[9px] bg-gradient-to-br from-primary to-teal font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-all",
                MORPH,
                compact ? "size-7 text-[13px]" : "size-8 text-[15px]"
              )}
            >
              B
            </span>
            <span className="text-[16px] font-bold tracking-[0.04em]">BAUDHIKA</span>
            <span className="rounded-md bg-highlight/15 px-1.5 py-[3px] text-[10px] font-bold tracking-[0.12em] text-highlight ring-1 ring-highlight/30 ring-inset">
              ERP
            </span>
          </a>

          <nav
            aria-label="Primary"
            aria-hidden={compact || undefined}
            className={cn(
              "ml-auto hidden items-center gap-1 overflow-hidden transition-all lg:flex",
              MORPH,
              compact ? "pointer-events-none max-w-0 -translate-y-2 opacity-0" : "max-w-[560px] opacity-100"
            )}
          >
            {LINKS.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  tabIndex={compact ? -1 : undefined}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative isolate whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    FOCUS_RING
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="promo-nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-muted ring-1 ring-border"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <Link
              href="/login"
              className={cn(
                "hidden h-10 items-center whitespace-nowrap rounded-full px-4 text-[14px] font-medium text-foreground/85 transition-colors hover:bg-muted hover:text-foreground",
                compact ? "lg:hidden" : "lg:inline-flex",
                FOCUS_RING
              )}
            >
              Sign in
            </Link>

            <Magnetic strength={8} className="hidden sm:block">
              <a
                href="#contact"
                className={cn(
                  "group relative inline-flex items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full bg-highlight pl-5 pr-4 text-[14px] font-semibold text-[#231400] shadow-[0_6px_18px_-8px_rgba(255,167,15,0.9)] transition-[background-color,height,transform] hover:bg-[#f0990a] active:scale-[0.97]",
                  compact ? "h-9" : "h-10",
                  FOCUS_RING
                )}
              >
                Get started
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/40 transition-[left] duration-700 group-hover:left-[130%]" />
              </a>
            </Magnetic>

            <span aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="promo-mobile-nav"
              className={cn(
                "grid size-10 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-muted lg:hidden",
                FOCUS_RING
              )}
            >
              {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.nav
                id="promo-mobile-nav"
                aria-label="Mobile"
                initial={reduce ? false : { opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 top-full mt-2 origin-top rounded-2xl border border-border/70 bg-background/95 p-2 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:hidden"
              >
                {LINKS.map((link) => {
                  const isActive = active === link.href.slice(1);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "flex rounded-xl px-4 py-3 text-[15px] font-medium transition-colors hover:bg-muted hover:text-foreground",
                        isActive ? "bg-muted text-foreground" : "text-foreground/80",
                        FOCUS_RING
                      )}
                    >
                      {link.label}
                    </a>
                  );
                })}
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border p-2 pt-4">
                  <Link
                    href="/login"
                    className={cn(
                      "inline-flex h-11 items-center justify-center rounded-full border border-border text-[14px] font-semibold transition-colors hover:bg-muted",
                      FOCUS_RING
                    )}
                  >
                    Sign in
                  </Link>
                  <a
                    href="#contact"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-highlight text-[14px] font-semibold text-[#231400]",
                      FOCUS_RING
                    )}
                  >
                    Get started <ArrowRight className="size-4" />
                  </a>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
