import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { CopyrightYear } from "@/components/shared/copyright-year";

const SYSTEM = [
  { href: "#why", label: "Why us" },
  { href: "#system", label: "The system" },
  { href: "#stories", label: "Stories" },
  { href: "#faq", label: "FAQ" },
];

const LINK = "transition-colors hover:text-white focus:outline-hidden focus-visible:text-white focus-visible:underline";

export function PromoFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#0f2433] text-[14px] text-[#8aa3b5]">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--primary), var(--teal), var(--highlight), transparent)" }}
      />
      <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-6 pb-14 pt-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-[9px] bg-gradient-to-br from-primary to-teal text-[15px] font-bold text-white">
              B
            </span>
            <b className="text-[16px] font-bold tracking-[0.04em] text-white">BAUDHIKA</b>
            <span className="rounded-md bg-highlight/15 px-1.5 py-[3px] text-[10px] font-bold tracking-[0.12em] text-highlight ring-1 ring-highlight/30 ring-inset">
              ERP
            </span>
          </div>
          <p className="mt-5 max-w-[34ch] leading-[1.7]">
            School management, properly built. One reconciled system for admissions, billing, payroll and
            records.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/80">
            <span className="size-1.5 rounded-full bg-teal" /> All systems normal
          </span>
        </div>

        <nav aria-label="System">
          <h4 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white">System</h4>
          <ul className="space-y-3">
            {SYSTEM.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={LINK}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Account">
          <h4 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white">Account</h4>
          <ul className="space-y-3">
            <li>
              <Link href="/login" className={LINK}>
                Sign in
              </Link>
            </li>
            <li>
              <a href="#contact" className={LINK}>
                Get started
              </a>
            </li>
            <li>
              <a href="#contact" className={LINK}>
                Contact us
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h4 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white">Contact</h4>
          <ul className="space-y-3">
            <li>
              <a href="tel:+9779812291777" className={`inline-flex items-center gap-2.5 ${LINK}`}>
                <Phone className="size-4" /> +977 9812291777
              </a>
            </li>
            <li>
              <a href="mailto:support@baudhika.com" className={`inline-flex items-center gap-2.5 ${LINK}`}>
                <Mail className="size-4" /> support@baudhika.com
              </a>
            </li>
            <li className="inline-flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0" /> Babar Mahal, Kathmandu, Bagmati Province
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-2 px-6 py-6 text-[12.5px] sm:flex-row sm:justify-between lg:px-8">
          <span>
            © <CopyrightYear /> Baudhika ERP. All rights reserved.
          </span>
          <span>Made in Nepal, for Nepal.</span>
        </div>
      </div>
    </footer>
  );
}
