import type { Plan, School } from "../types";

export const sampleSchools: School[] = [
  {
    id: "sample-school-1",
    name: "Evergreen Academy",
    slug: "evergreen-academy",
    adminEmail: "admin@example.com",
    plan: "Standard",
    branch: "Main campus",
    status: "active",
    joined: "2025-08-14",
  },
  {
    id: "sample-school-2",
    name: "Horizon School",
    slug: "horizon-school",
    adminEmail: "admin@example.com",
    plan: "Essential",
    branch: "Main campus",
    status: "active",
    joined: "2025-09-02",
  },
  {
    id: "sample-school-3",
    name: "Summit College",
    slug: "summit-college",
    adminEmail: "admin@example.com",
    plan: "Standard",
    branch: "Main campus",
    status: "provisioning",
    joined: "2025-10-18",
  },
];

export const samplePlans: Plan[] = [
  {
    id: "sample-plan-1",
    name: "Essential",
    userLimit: "100",
    storageLimit: "10 GB",
    modules: ["Students", "Academics", "Attendance"],
  },
  {
    id: "sample-plan-2",
    name: "Standard",
    userLimit: "500",
    storageLimit: "50 GB",
    modules: ["Students", "Academics", "Attendance", "Finance", "Staff"],
  },
];
