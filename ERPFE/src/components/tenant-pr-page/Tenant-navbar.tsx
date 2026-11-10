"use client";

import Link from "next/link";
import { useTenant } from "@/providers/tenant-provider";
import { TenantLogo } from "@/components/tenant/tenant-logo";
import { ThemeToggler } from "@/components/shared/theme-switcher";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function TenantNavbar() {
  const { tenant } = useTenant();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <TenantLogo className="size-9" />
          <div className="flex flex-col">
            <span className="font-heading text-base font-semibold leading-tight text-foreground sm:text-lg">
              {tenant.name}
            </span>
            {tenant.shortName && tenant.shortName !== tenant.name && (
              <span className="text-xs text-muted-foreground">
                {tenant.shortName}
              </span>
            )}
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="School Navigation">
          <a
            href="#about"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </a>
          <a
            href="#academics"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Academics
          </a>
          <a
            href="#facilities"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Facilities
          </a>
          <a
            href="#dates"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Key Dates
          </a>
          <a
            href="#admissions"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Admissions
          </a>
          <a
            href="#contact"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggler />

          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex gap-1.5 text-muted-foreground hover:text-foreground">
            <Link href="/login">
              <LogIn className="size-3.5" />
              <span>Portal Login</span>
            </Link>
          </Button>

          <Button asChild size="sm">
            <a href="#admissions">Inquire Now</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
