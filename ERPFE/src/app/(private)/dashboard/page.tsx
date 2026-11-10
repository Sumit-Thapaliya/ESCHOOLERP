"use client";

import { LogoutButton } from "@/components/auth/logout-button";
import { useCurrentUser } from "@/store/session-store";

export default function DashboardPage() {
  const user = useCurrentUser();

  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-8 py-4">
        <p className="text-sm font-medium">Baudhika ERP · platform</p>
        <div className="flex items-center gap-3">
          <span className="text-[12.5px] text-muted-foreground">
            {user?.email}
          </span>
          <LogoutButton />
        </div>
      </header>
      <div className="p-8">Platform dashboard</div>
    </main>
  );
}
