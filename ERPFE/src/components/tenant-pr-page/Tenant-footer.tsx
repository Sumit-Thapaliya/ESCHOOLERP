"use client";

import Link from "next/link";
import { useTenant } from "@/providers/tenant-provider";
import { TenantLogo } from "@/components/tenant/tenant-logo";
import { Mail, MapPin, Phone } from "lucide-react";

export function TenantFooter() {
  const { tenant } = useTenant();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* School Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <TenantLogo className="size-8" />
              <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
                {tenant.name}
              </span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {tenant.description ||
                "A community focused on balanced education, personal integrity, and lifelong learning."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Navigation
            </h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <a href="#about" className="transition-colors hover:text-foreground">
                  About Us
                </a>
              </li>
              <li>
                <a href="#academics" className="transition-colors hover:text-foreground">
                  Academic Programs
                </a>
              </li>
              <li>
                <a href="#facilities" className="transition-colors hover:text-foreground">
                  Campus Facilities
                </a>
              </li>
              <li>
                <a href="#dates" className="transition-colors hover:text-foreground">
                  Key Dates
                </a>
              </li>
              <li>
                <a href="#admissions" className="transition-colors hover:text-foreground">
                  Admissions & Inquiries
                </a>
              </li>
              <li className="pt-1">
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Student & Staff Portal →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Admissions & Contact
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 text-primary shrink-0" />
                <span>info@{tenant.slug}.edu</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 text-primary shrink-0" />
                <span>+977 (01) 400-0000</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-3.5 text-primary shrink-0" />
                <span>Main Campus Administrative Office</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {currentYear} {tenant.name}. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">
              Portal Sign In
            </Link>
            <span>•</span>
            <span>{tenant.name} Official Website</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
