export type PlatformSection = "overview" | "schools" | "plans" | "billing" | "reports" | "audit" | "settings";

export type School = {
  id: string;
  name: string;
  slug: string;
  adminEmail: string;
  plan: string;
  branch: string;
  status: "active" | "provisioning" | "suspended" | "failed";
  joined: string;
};

export type Plan = {
  id: string;
  name: string;
  userLimit: string;
  storageLimit: string;
  modules: string[];
};
