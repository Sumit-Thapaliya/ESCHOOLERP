"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Dialog } from "radix-ui";
import { toast } from "sonner";
import { BarChart3, Bell, Building2, CreditCard, FileClock, LayoutDashboard, LifeBuoy, Menu, Search, Settings2, ShieldCheck, X } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { ThemeToggler } from "@/components/shared/theme-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/store/session-store";
import type { PlatformSection } from "./types";

const sections = [
  { name: "Dashboard", icon: LayoutDashboard, id: "overview" },
  { name: "Schools", icon: Building2, id: "schools" },
  { name: "Plans & entitlements", icon: ShieldCheck, id: "plans" },
  { name: "Billing & usage", icon: CreditCard, id: "billing" },
  { name: "Reports", icon: BarChart3, id: "reports" },
  { name: "Platform audit", icon: FileClock, id: "audit" },
  { name: "Platform settings", icon: Settings2, id: "settings" },
];

function Brand({ compact = false, sidebar = false }: { compact?: boolean; sidebar?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className={sidebar ? "grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm" : "grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground"}>B</span>
      <div className={compact ? "hidden min-w-0 leading-tight xl:block" : "min-w-0 leading-tight"}>
        <p className="truncate text-sm font-semibold tracking-tight">Baudhika ERP</p>
        <p className={sidebar ? "mt-0.5 truncate text-[11px] text-surface/65 dark:text-muted-foreground" : "mt-0.5 truncate text-[11px] text-muted-foreground"}>Platform Super Admin</p>
      </div>
    </div>
  );
}

function Navigation({ activeSection, onSelect, onNavigate }: { activeSection: PlatformSection; onSelect: (section: PlatformSection) => void; onNavigate?: () => void }) {
  function navigate(id: string) {
    onNavigate?.();
    onSelect(id as PlatformSection);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <nav aria-label="Platform navigation" className="flex h-full flex-col text-surface dark:text-sidebar-foreground">
      <div className="border-b border-surface/10 px-5 py-5 dark:border-sidebar-border"><Brand sidebar /></div>
      <p className="px-5 pt-6 pb-2 text-[10px] font-semibold tracking-[0.13em] text-surface/55 uppercase dark:text-muted-foreground">Platform Super Admin</p>
      <div className="space-y-1.5 px-3">
        {sections.map(({ name, icon: Icon, id }) => (
          <button
            key={name}
            type="button"
            onClick={() => navigate(id)}
            aria-current={activeSection === id ? "page" : undefined}
            className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring ${activeSection === id ? "bg-primary font-semibold text-primary-foreground shadow-sm" : "text-surface/70 hover:bg-surface/10 hover:text-surface dark:text-muted-foreground dark:hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground"}`}
          >
            <Icon className="size-[17px] shrink-0" aria-hidden="true" />
            <span className="truncate">{name}</span>
          </button>
        ))}
      </div>
      <div className="mt-auto px-3 pb-5 pt-8">
        <div className="mb-3 lg:hidden"><LogoutButton /></div>
        <div className="rounded-2xl border border-surface/10 bg-surface/5 p-4 dark:border-sidebar-border dark:bg-sidebar-accent/40">
          <div className="flex items-center gap-2 text-xs font-semibold"><LifeBuoy className="size-4 text-surface/75 dark:text-primary" /> Super Admin workspace</div>
          <p className="mt-2 text-[11px] leading-relaxed text-surface/65 dark:text-muted-foreground">Manage schools and keep an eye on your platform.</p>
        </div>
      </div>
    </nav>
  );
}

export function DashboardShell({ children, search, onSearch, activeSection, onSelect }: { children: ReactNode; search: string; onSearch: (value: string) => void; activeSection: PlatformSection; onSelect: (section: PlatformSection) => void }) {
  const user = useCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-y-0 left-0 hidden w-60 border-r border-surface/10 bg-navy lg:block dark:border-sidebar-border dark:bg-sidebar"><Navigation activeSection={activeSection} onSelect={onSelect} /></div>
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
              <Dialog.Trigger asChild><Button size="icon" variant="ghost" className="lg:hidden" aria-label="Open navigation"><Menu /></Button></Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40" />
                <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-navy text-surface shadow-xl dark:bg-sidebar dark:text-sidebar-foreground outline-none">
                  <Dialog.Title className="sr-only">Platform navigation</Dialog.Title>
                  <Dialog.Description className="sr-only">Dashboard navigation menu</Dialog.Description>
                  <Dialog.Close asChild><Button size="icon-sm" variant="ghost" className="absolute top-5 right-3 text-surface hover:bg-surface/10 hover:text-surface dark:text-sidebar-foreground" aria-label="Close navigation"><X /></Button></Dialog.Close>
                  <Navigation activeSection={activeSection} onSelect={onSelect} onNavigate={() => setMenuOpen(false)} />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            <div className="shrink-0"><Brand compact /></div>
            <div className="relative w-24 sm:w-48 lg:w-56 xl:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input ref={searchRef} value={search} onChange={(event) => onSearch(event.target.value)} aria-label="Search schools" placeholder="Search schools..." className="h-9 border-border bg-muted/50 pr-3 pl-9 text-xs" />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button size="icon" variant="ghost" className="hidden sm:inline-flex" aria-label="Notifications" onClick={() => toast.info("Notifications are not connected yet.")}><Bell /></Button>
            <ThemeToggler />
            <div className="hidden min-w-0 border-l border-border pl-3 text-right md:block">
              <p className="max-w-44 truncate text-xs font-semibold">{user?.name || "Platform admin"}</p>
              <p className="max-w-44 truncate text-[11px] text-muted-foreground">{user?.email || "Super Admin workspace"}</p>
            </div>
            <span aria-hidden="true" className="hidden size-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground min-[400px]:grid">{(user?.name || user?.email || "A").charAt(0).toUpperCase()}</span>
            <div className="hidden lg:block"><LogoutButton /></div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
