import type { Plan } from "../types";

export const samplePlans: Plan[] = [
  { id: "sample-plan-1", name: "Essential", userLimit: "100", storageLimit: "10 GB", modules: ["Students", "Academics", "Attendance"] },
  { id: "sample-plan-2", name: "Standard", userLimit: "500", storageLimit: "50 GB", modules: ["Students", "Academics", "Attendance", "Finance", "Staff"] },
];
