"use client";

import { useQuery } from "@tanstack/react-query";
import { listTenants } from "@/lib/api/tenants";
import { useSession } from "@/store/session-store";
import type { TenantRecord } from "@/lib/api/types";
import type { School } from "../types";

export const schoolsQueryKey = ["platform", "schools"] as const;

export function useSchools() {
  const accessToken = useSession((state) => state.accessToken);
  return useQuery({
    queryKey: schoolsQueryKey,
    queryFn: listTenants,
    enabled: Boolean(accessToken),
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });
}

export function toSchool(tenant: TenantRecord): School {
  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    status: tenant.status,
    joined: tenant.createdAt,
    customDomain: tenant.customDomain,
    adminEmail: "Not available",
    plan: "—",
    branch: "—",
  };
}
