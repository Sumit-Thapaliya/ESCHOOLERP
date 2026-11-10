import type { Tenant } from "@/types/tenant";

const HEX = /^#[0-9a-f]{3,8}$/i;

export function TenantThemeStyle({ theme }: { theme?: Tenant["theme"] }) {
  if (!theme) return null;

  const vars: Record<string, string | undefined> = {
    "--primary": theme.primary ?? undefined,
    "--sidebar-primary": theme.primary ?? undefined,
    "--ring": theme.primary ?? undefined,
    "--primary-foreground": theme.primaryForeground ?? undefined,
    "--sidebar-primary-foreground": theme.primaryForeground ?? undefined,
    "--secondary": theme.secondary ?? undefined,
    "--secondary-foreground": theme.secondaryForeground ?? undefined,
  };

  // only accept valid hex values, since this string goes into a <style> tag
  const css = Object.entries(vars)
    .filter(([, v]) => v && HEX.test(v))
    .map(([k, v]) => `${k}:${v};`)
    .join("");

  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: `:root,:root.dark{${css}}` }} />;
}