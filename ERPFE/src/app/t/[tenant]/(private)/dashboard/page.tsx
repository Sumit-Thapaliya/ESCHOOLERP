"use client";

import * as React from "react";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { useDashboardShell } from "@/components/dashboard/dashboard-layout-shell";

export default function TenantDashboardPage() {
  const { selectedBranchId, setSelectedBranchId } = useDashboardShell();

  return (
    <DashboardContent
      selectedBranchId={selectedBranchId}
      onSelectBranch={setSelectedBranchId}
    />
  );
}
