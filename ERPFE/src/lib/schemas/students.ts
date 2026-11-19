import { z } from "zod";

/**
 * Admit-student form, mirroring POST /students: the person needs at least a
 * first name; the backend generates admissionNo and starts the record as
 * `applicant`. Empty optional strings are stripped before sending because
 * the backend rejects unknown/blank-present fields with a 400.
 */
export const createStudentFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(100),
  lastName: z.string().trim().max(100),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD.").or(z.literal("")),
  bloodGroup: z.string(),
  campusId: z.string(),
  admissionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD."),
  admissionType: z.enum(["new", "transfer_in", "readmission"]),
  emisId: z
    .string()
    .trim()
    .regex(/^[0-9A-Za-z-]{1,30}$/, "Max 30 chars: letters, digits, dashes.")
    .or(z.literal("")),
});

export type CreateStudentFormValues = z.infer<typeof createStudentFormSchema>;
