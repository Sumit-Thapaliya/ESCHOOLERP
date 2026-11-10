import { z } from "zod";
import { newPasswordPolicy } from "./auth";

/**
 * Create-user form. The backend rules, mirrored field for field:
 *   - at least one of username / email / phone
 *   - username  ^[A-Za-z][A-Za-z0-9._-]{2,49}$
 *   - phone     ^\+?\d{7,15}$ (punctuation stripped server-side)
 *   - password  the shared 8-128 letter+digit policy
 * Empty optional strings are stripped before sending, because the backend
 * rejects unknown/blank-but-present fields with a 400.
 */
export const createUserFormSchema = z
  .object({
    username: z
      .string()
      .trim()
      .regex(/^[A-Za-z][A-Za-z0-9._-]{2,49}$/, "Start with a letter; 3-50 letters, digits, . _ -")
      .optional()
      .or(z.literal("")),
    email: z.string().trim().email("Enter a valid email address.").optional().or(z.literal("")),
    phone: z
      .string()
      .trim()
      .regex(/^\+?\d{7,15}$/, "7-15 digits, optional leading +")
      .optional()
      .or(z.literal("")),
    password: newPasswordPolicy,
    mustChangePassword: z.boolean(),
    mfaEnabled: z.boolean(),
    /** Comma-separated role codes; parsed and validated on submit. */
    roles: z.string().trim(),
  })
  .refine((v) => Boolean(v.username || v.email || v.phone), {
    path: ["username"],
    message: "Give at least one of username, email or phone.",
  });

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

const ROLE_CODE = /^[a-z][a-z0-9_]{1,49}$/;

/** "a, b ,, c" -> ["a","b","c"], rejecting anything that is not a role code. */
export function parseRoleCodes(raw: string): string[] | null {
  const codes = raw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  if (codes.some((c) => !ROLE_CODE.test(c))) return null;
  return [...new Set(codes)];
}
