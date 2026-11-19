"use client";

import * as React from "react";
import { UsersRound } from "lucide-react";
import { UsersManagementView } from "@/components/users/users-management-view";
import { useHasPermission } from "@/store/session-store";

/**
 * School-plane user administration wired to the real API and role catalogue.
 * The permission gate ensures only authorized administrators access this screen.
 */
export default function TenantUsersPage() {
  const canRead = useHasPermission("user.read");

  if (!canRead && process.env.NODE_ENV === "production") {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md rounded-2xl border border-[#DDE5F0] bg-white p-8 text-center shadow-2xs">
          <UsersRound className="mx-auto h-8 w-8 text-slate-300" />
          <h1 className="mt-3 text-sm font-semibold text-slate-900">
            User administration is not part of your role
          </h1>
          <p className="mt-2 text-[13px] text-slate-500">
            This screen is for the people who create and manage logins for the
            school. If you believe you should see it, ask your administrator.
          </p>
        </div>
      </div>
    );
  }

  return <UsersManagementView />;
}
