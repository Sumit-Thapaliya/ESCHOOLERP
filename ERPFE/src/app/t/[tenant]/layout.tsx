// import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTenant } from "@/lib/tenant";
import { TenantProvider } from "@/providers/tenant-provider";
import { TenantThemeStyle } from "@/components/tenant/tenant-theme-style";
import { connection } from "next/server";

type Props = { params: Promise<{ tenant: string }> };

async function DynamicMarker() {
  await connection();
  return null;
}

async function TenantShell({
  params,
  children,
}: Props & { children: React.ReactNode }) {
  const { tenant: slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) notFound();

  if (tenant.status !== "active") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-8 text-center">
        <h1 className="text-2xl font-semibold">{tenant.name}</h1>
        <p className="text-muted-foreground">
          This portal is currently unavailable. Please contact your
          administrator.
        </p>
      </main>
    );
  }

  return (
    <div lang={tenant.language ?? "en"} className="contents">
      <title>{tenant.name}</title>
      {tenant.description && <meta name="description" content={tenant.description} />}
      {tenant.faviconUrl && <link rel="icon" href={tenant.faviconUrl} />}
      <TenantThemeStyle theme={tenant.theme} />
      <TenantProvider tenant={tenant}>{children}</TenantProvider>
    </div>
  );
}

export default function TenantLayout({
  params,
  children,
}: Props & { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <DynamicMarker />
      <TenantShell params={params}>{children}</TenantShell>
    </Suspense>
  );
}
