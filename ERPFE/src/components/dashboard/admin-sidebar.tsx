"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TenantLogo } from "@/components/tenant/tenant-logo";
import { useOptionalTenant } from "@/providers/tenant-provider";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  FileSpreadsheet,
  WalletCards,
  MessageSquareText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  School,
  Users,
  Briefcase,
  HeartHandshake,
  X,
  UsersRound,
} from "lucide-react";
import { cn } from "cn";
import { useSession } from "@/store/session-store";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /**
   * Permission code required to SEE the item. Omitted while a module is a
   * design prototype (no backend yet) or while its codes are unseeded -
   * hiding those would make working screens vanish from the nav.
   */
  permission?: string;
}

const NAV_MODULES: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  // Students: gate on "student.read" once the backend seeds student.* codes.
  // Until then no role holds it and the item would disappear for everyone;
  // the in-page card explains the missing permission instead.
  { title: "Students", href: "/students", icon: GraduationCap },
  { title: "Guardians", href: "/guardians", icon: HeartHandshake },
  { title: "Staff", href: "/staff", icon: Briefcase },
  { title: "Academics", href: "/academics", icon: BookOpen },
  { title: "Users", href: "/users", icon: UsersRound, permission: "user.read" },
  { title: "Attendance", href: "/attendance", icon: CalendarCheck },
  { title: "Exams", href: "/examinations", icon: FileSpreadsheet },
  { title: "Fees", href: "/finance", icon: WalletCards },
  { title: "Communication", href: "/communication", icon: MessageSquareText },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const tenantContext = useOptionalTenant();

  // School portal URLs are /t/<slug>/...; the platform plane has no prefix.
  // Deriving it from the URL keeps one sidebar correct in both planes.
  const tenantPrefix = React.useMemo(() => {
    const m = /^\/t\/[^/]+/.exec(pathname ?? "");
    return m ? m[0] : "";
  }, [pathname]);

  // Stable reference (not a fresh array) so the store selector stays cheap.
  const user = useSession((s) => s.user);
  const canSee = (item: NavItem) =>
    !item.permission || (user?.permissions.includes(item.permission) ?? false);

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") {
      return (
        pathname === "/dashboard" ||
        pathname.endsWith("/dashboard") ||
        pathname === "/"
      );
    }
    return pathname.includes(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar overlay"
          onClick={onCloseMobile}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onCloseMobile();
          }}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden cursor-pointer"
        />
      )}

      {/* Sidebar container (Deep dark navy matching the screenshot concept) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0D1E36] text-white transition-all duration-200 ease-in-out border-r border-[#162D4D]",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header: School ERP with Graduation Cap Icon */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
          <Link
            href={`${tenantPrefix}/dashboard`}
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white shadow-xs">
              {tenantContext ? (
                <TenantLogo className="h-10 w-10" />
              ) : (
                <School className="h-5 w-5 text-white" />
              )}
            </div>
            {!collapsed && (
              <span className="font-bold text-lg tracking-tight text-white whitespace-nowrap">
                School ERP
              </span>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 text-white/70 hover:text-white lg:hidden rounded-md hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Permission-filtered, tenant-prefixed navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {NAV_MODULES.filter(canSee).map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href);

            return (
              <Link
                key={item.title}
                href={tenantPrefix + item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.title : undefined}
                className={cn(
                  "group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-[#1E6DEB] text-white font-semibold shadow-md"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    active ? "text-white" : "text-white/60 group-hover:text-white"
                  )}
                />
                {!collapsed && (
                  <span className="truncate text-[13px]">{item.title}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer collapse toggle */}
        <div className="border-t border-white/5 p-4">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              "hidden lg:flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors cursor-pointer",
              collapsed && "justify-center"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse menu</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}