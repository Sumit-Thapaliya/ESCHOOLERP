import { get, post, put } from "./client";
import type { BrandingInput, PublicTenantConfig, TenantRecord } from "./types";

/** Platform-admin management of schools. Needs a platform access token. */

export function listTenants() {
  return get<TenantRecord[]>("/tenants");
}

export type CreateTenantInput = {
  name: string;
  slug: string;
  adminEmail: string;
  /** 12-128 chars. The admin must change it at first login. */
  adminPassword: string;
};

/** Provisions a dedicated Postgres role + database and runs tenant migrations. */
export function createTenant(input: CreateTenantInput) {
  return post<TenantRecord>("/tenants", input, { timeout: 30_000 });
}

/** PUT semantics: any optional field you omit is RESET to its default. */
export function updateTenantBranding(id: string, input: BrandingInput) {
  return put<PublicTenantConfig>(`/tenants/${id}/branding`, input);
}
