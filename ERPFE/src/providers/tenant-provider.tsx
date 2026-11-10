"use client";

import { createContext, useContext } from "react";
import type { Tenant } from "@/types/tenant";

const Ctx = createContext<{ tenant: Tenant; slug: string } | null>(null);

export function TenantProvider({
  tenant,
  children,
}: {
  tenant: Tenant;
  children: React.ReactNode;
}) {
  return (
    <Ctx.Provider value={{ tenant, slug: tenant.slug }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTenant must be used inside <TenantProvider>");
  return ctx;
}


export function useOptionalTenant() {
  return useContext(Ctx);
}