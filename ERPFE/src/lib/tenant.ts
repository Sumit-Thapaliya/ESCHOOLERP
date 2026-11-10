"use server";

import { cacheLife, cacheTag } from "next/cache";
import type { ApiEnvelope, PublicTenantConfig } from "@/lib/api/types";
import type { Tenant } from "@/types/tenant";

/**
 * Resolve a school from its slug. Server-only, called from the tenant layout.
 *
 * Cached by Next and tagged `tenant-<slug>` so that PUT /tenants/:id/branding
 * can revalidate it on demand (the backend calls FRONTEND_REVALIDATE_URL).
 * The endpoint itself sends Cache-Control: public, max-age=60,
 * stale-while-revalidate=300.
 */
export async function getTenant(slug: string): Promise<Tenant | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`tenant-${slug}`);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  const host = `${slug}.${rootDomain}`;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/public/tenants/resolve?host=${encodeURIComponent(host)}`;
  try {
    const res = await fetch(url);
    if (res.status === 404 || res.status === 400) {
      if (process.env.NODE_ENV !== "production" && slug.startsWith("demo")) {
        return {
          slug,
          name: slug === "demo2" ? "Demo Secondary School" : "Sunrise Public School",
          shortName: slug === "demo2" ? "DSS" : "Sunrise",
          status: "active",
          description: "School ERP Back-office Administration Portal",
          logoUrl: null,
          faviconUrl: null,
          language: "en",
          theme: null,
        };
      }
      return null;
    }
    if (!res.ok) throw new Error(`Tenant lookup failed (${res.status})`);
    const raw = (await res.json()) as ApiEnvelope<PublicTenantConfig> | PublicTenantConfig;
    const data = (raw && "data" in raw ? raw.data : raw) as PublicTenantConfig;
    if (!data) return null;

    const name = data.name?.trim() || data.slug;
    return {
      slug: data.slug,
      status: data.status,
      name,
      shortName: data.shortName?.trim() || name,
      description: data.description ?? null,
      logoUrl: data.logoUrl ?? null,
      faviconUrl: data.faviconUrl ?? null,
      language: data.language || "en",
      theme: data.theme ?? null,
    };
  } catch (err) {
    console.warn(`[getTenant] Backend offline for ${slug}, using local fallback:`, err);
    return {
      slug,
      name: slug === "demo2" ? "Demo Secondary School" : "Sunrise Public School",
      shortName: slug === "demo2" ? "DSS" : "Sunrise",
      status: "active",
      description: "School ERP Back-office Administration Portal",
      logoUrl: null,
      faviconUrl: null,
      language: "en",
      theme: null,
    };
  }
}
