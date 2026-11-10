export type Tenant = {
  slug: string;
  status: "active" | "suspended" | "inactive" | string;
  // name: string;
  // shortName: string;
  // description?: string;
  // logoUrl?: string;
  // faviconUrl?: string;
  // language?: string;
  // theme?: {
  //   primary?: string;
  //   primaryForeground?: string;
  //   secondary?: string;
  //   secondaryForeground?: string;
  // };
  name: string;
  shortName: string;
  description?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  language?: string | null;
  theme?: {
    primary?: string | null;
    primaryForeground?: string | null;
    secondary?: string | null;
    secondaryForeground?: string | null;
  } | null;
};
