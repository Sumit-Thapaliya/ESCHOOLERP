import * as React from "react";
import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardLayoutShell } from "@/components/dashboard/dashboard-layout-shell";

export default function TenantPrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth plane="school">
      <DashboardLayoutShell>{children}</DashboardLayoutShell>
    </RequireAuth>
  );
}
