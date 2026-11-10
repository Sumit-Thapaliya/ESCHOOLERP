"use client";

import { useTenant } from "@/providers/tenant-provider";

export function TenantLogo({ className = "size-9" }: { className?: string }) {
  const { tenant } = useTenant();

  if (!tenant.logoUrl) {
    return (
      <span
        className={`flex items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground ${className}`}
      >
        {/* {tenant.shortName.slice(0, 1)} */}
         {(tenant.shortName || tenant.name || "?").charAt(0).toUpperCase()}
      </span>
    );
  }

  // plain <img> because logos come from arbitrary hosts, which next/image would need whitelisted
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={tenant.logoUrl} alt={tenant.name} className={`rounded-lg object-contain ${className}`} />;
}