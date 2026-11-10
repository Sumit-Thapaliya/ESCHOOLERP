"use client";

import { Clock, Mail, Phone } from "lucide-react";
import { PromoButton } from "@/components/promotional/button";
import { Magnetic, Reveal } from "@/components/promotional/motion";

const CONTACTS = [
  { icon: Phone, label: "Call us", value: "+977 9812291777", href: "tel:+9779812291777" },
  { icon: Mail, label: "Email", value: "support@baudhika.com", href: "mailto:support@baudhika.com" },
  { icon: Clock, label: "Response time", value: "Under four hours" },
];

export function Finale() {
  return (
    <section id="contact" className="scroll-mt-28 py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#165c95] to-[#0f3f66] px-8 py-14 text-white sm:px-14 sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                backgroundSize: "44px 44px",
                maskImage: "radial-gradient(ellipse 80% 90% at 100% 0%, #000, transparent 70%)",
                WebkitMaskImage: "radial-gradient(ellipse 80% 90% at 100% 0%, #000, transparent 70%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 size-[380px] rounded-full bg-teal/50 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 left-1/4 size-[300px] rounded-full bg-highlight/25 blur-3xl"
            />

            <div className="relative grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h2 className="text-balance text-[clamp(2.2rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
                  Ready when you are.
                </h2>
                <p className="mt-5 max-w-[48ch] text-[17px] leading-[1.65] opacity-80">
                  One call. We migrate your records, train your staff, and stay until the system runs itself.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Magnetic>
                    <PromoButton href="mailto:support@baudhika.com" variant="highlight" arrow shine>
                      Get started
                    </PromoButton>
                  </Magnetic>
                  <PromoButton href="/login" variant="ghostLight">
                    Sign in
                  </PromoButton>
                </div>
              </div>

              <ul className="grid gap-3">
                {CONTACTS.map(({ icon: Icon, label, value, href }) => {
                  const inner = (
                    <>
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/12 ring-1 ring-white/15">
                        <Icon className="size-5" />
                      </span>
                      <span>
                        <span className="block text-[12px] font-medium uppercase tracking-[0.12em] opacity-65">
                          {label}
                        </span>
                        <span className="block text-[16px] font-semibold">{value}</span>
                      </span>
                    </>
                  );
                  const cardClass =
                    "flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur";
                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          className={`${cardClass} transition-colors hover:bg-white/[0.14] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white`}
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className={cardClass}>{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
