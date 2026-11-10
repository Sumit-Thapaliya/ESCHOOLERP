"use client";

import * as React from "react";
import {
  Menu,
  Building2,
  ChevronDown,
  User,
  ShieldCheck,
  LogOut,
  Bell,
} from "lucide-react";
import { MOCK_BRANCHES_LIST } from "./dashboard-mock-data";
import { useOptionalTenant } from "@/providers/tenant-provider";
import { cn } from "cn";

interface AdminTopbarProps {
  onOpenMobileSidebar: () => void;
  selectedBranchId: string;
  onSelectBranch: (id: string) => void;
}

export function AdminTopbar({
  onOpenMobileSidebar,
  selectedBranchId,
  onSelectBranch,
}: AdminTopbarProps) {
  const tenantCtx = useOptionalTenant();
  const [branchMenuOpen, setBranchMenuOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const currentBranch =
    MOCK_BRANCHES_LIST.find((b) => b.id === selectedBranchId) ??
    MOCK_BRANCHES_LIST[0];

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-[#E8EFF7] bg-[#F5F8FC]/90 backdrop-blur-md px-6 lg:px-8">
      {/* Left: Mobile hamburger & Greeting matching screenshot: "Good Morning, Principal" */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-200/60 lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F243E]">
            Good Morning, Principal
          </h1>
        </div>
      </div>

      {/* Right: Branch switcher & User Avatar Circle */}
      <div className="flex items-center gap-3">
        {/* Branch / Campus selector dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setBranchMenuOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="hidden sm:flex items-center gap-2 rounded-xl border border-[#DCE6F2] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Building2 className="h-3.5 w-3.5 text-[#1E6DEB]" />
            <span className="truncate max-w-[140px]">{currentBranch.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {branchMenuOpen && (
            <>
              <div
                role="button"
                tabIndex={0}
                aria-label="Close menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setBranchMenuOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setBranchMenuOpen(false);
                }}
              />
              <div className="absolute right-0 mt-2 z-50 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <p className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Campus Switcher
                </p>
                {MOCK_BRANCHES_LIST.map((branch) => (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => {
                      onSelectBranch(branch.id);
                      setBranchMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors cursor-pointer",
                      branch.id === selectedBranchId
                        ? "bg-[#1E6DEB]/10 text-[#1E6DEB] font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <span>{branch.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User Profile Avatar Circle (Matching the screenshot icon top right) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center rounded-full ring-2 ring-white hover:ring-[#1E6DEB] transition-all cursor-pointer shadow-xs"
            aria-label="User profile"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A3353] text-white font-bold text-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                alt="Principal"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          </button>

          {profileOpen && (
            <>
              <div
                role="button"
                tabIndex={0}
                aria-label="Close menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setProfileOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setProfileOpen(false);
                }}
              />
              <div className="absolute right-0 mt-2 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">Dr. K.P. Adhikari</p>
                  <p className="text-[11px] text-slate-500">School Principal</p>
                </div>
                <div className="py-1">
                  <a
                    href="#profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                  >
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>My profile</span>
                  </a>
                  <a
                    href="#security"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                    <span>Security & 2FA</span>
                  </a>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <a
                    href="/login"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[#D64545] hover:bg-red-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign out</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
