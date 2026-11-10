"use client";

import { useState } from "react";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateUserForm } from "@/components/users/create-user-form";
import { UsersTable } from "@/components/users/users-table";
import { useHasPermission } from "@/store/session-store";

/**
 * School-plane user administration: the first real module on top of the auth
 * integration. Guarded by RequireAuth via the (private) layout; inside, every
 * control gates itself on the permission code the server enforces anyway.
 */
export default function UsersPage() {
  const canRead = useHasPermission("user.read");
  const canCreate = useHasPermission("user.create");
  const canAssign = useHasPermission("role.assign");

  const [creating, setCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!canRead) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md rounded-[calc(var(--radius)*2.2)] border border-border/80 bg-card/80 p-6 text-center">
          <Users className="mx-auto size-6 text-muted-foreground" />
          <h1 className="mt-3 text-[20px] font-semibold">Users are not visible to you</h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            This screen needs the <code>user.read</code> permission. Ask an
            administrator if you believe you should have it.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em]">Users</h1>
          <p className="text-[13px] text-muted-foreground">
            Login accounts for this school. Status changes and password resets
            take effect immediately, everywhere.
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setCreating((c) => !c)} className="h-10 gap-2 rounded-xl">
            <UserPlus className="size-4" /> New user
          </Button>
        )}
      </div>

      {creating && (
        <div className="mb-5 max-w-lg rounded-[calc(var(--radius)*2.2)] border border-border/80 bg-card/80 p-5">
          <CreateUserForm
            canAssignRoles={canAssign}
            onCreated={() => {
              setCreating(false);
              setRefreshKey((k) => k + 1);
            }}
            onCancel={() => setCreating(false)}
          />
        </div>
      )}

      <UsersTable refreshKey={refreshKey} />
    </main>
  );
}
