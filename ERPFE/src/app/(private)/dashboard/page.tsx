import { Suspense } from "react";
import { PlatformDashboard } from "@/components/super-admin-dashboard/platform-dashboard";

export const instant = false;

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <PlatformDashboard />
    </Suspense>
  );
}
