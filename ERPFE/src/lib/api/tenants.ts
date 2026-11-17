import { get, post, put } from "./client";
import type { BrandingInput, PublicTenantConfig, TenantRecord } from "./types";

export function listTenants() {
  return get<TenantRecord[]>("/tenants");
}

export type CreateTenantInput = {
  name: string;
  slug: string;
  principalEmail: string;
  principalPassword: string;
};

export function createTenant(input: CreateTenantInput) {
  return post<TenantRecord>("/tenants", input, { timeout: 120_000 });
}

export function updateTenantBranding(id: string, input: BrandingInput) {
  return put<PublicTenantConfig>(`/tenants/${id}/branding`, input);
}
