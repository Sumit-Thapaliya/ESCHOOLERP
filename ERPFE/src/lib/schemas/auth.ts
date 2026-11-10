import { z } from "zod";
import { OTP_LENGTH } from "@/lib/auth";
import type { Plane } from "@/lib/api/types";

/**
 * The two login planes take DIFFERENT request bodies, and the backend rejects
 * unknown fields with a 400 (ValidationPipe forbidNonWhitelisted) - so sending
 * `email` to the school endpoint is an error, not a harmless fallback.
 *
 *   platform  POST /platform/auth/login  { email, password }
 *   school    POST /auth/login           { identifier, password }
 */

const password = z
  .string()
  .min(1, "Password is required.")
  .max(128, "Password is too long.");

const email = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Enter a valid email address.");

/**
 * 3-254 chars: a username, an email OR a phone number. The backend classifies
 * it - contains "@" -> email; 7-15 digits (optional +, spaces/dashes ignored)
 * -> phone; starts with a letter -> username. Validating it as an email here
 * would reject legitimate usernames and phone numbers before they are sent.
 */
const identifier = z
  .string()
  .trim()
  .min(3, "Enter your username, email or phone number.")
  .max(254, "That is too long.");

/** What the BACKEND accepts. Used by the /api/auth route handlers. */
export const platformLoginSchema = z.object({ email, password });
export const schoolLoginSchema = z.object({ identifier, password });

export type PlatformLoginValues = z.infer<typeof platformLoginSchema>;
export type SchoolLoginValues = z.infer<typeof schoolLoginSchema>;

/**
 * What the shared login FORM collects. One component serves both planes, so it
 * always gathers `identifier`; on the platform plane that is validated as an
 * email and sent to the backend under the key `email`.
 */
export function credentialsFormSchema(plane: Plane) {
  return z.object({
    identifier: plane === "school" ? identifier : email,
    password,
  });
}

export type CredentialsFormValues = { identifier: string; password: string };

/** The OTP input renders one box per digit, so the form value is an array. */
export const otpSchema = z.object({
  code: z.array(z.string().regex(/^\d$/)).length(OTP_LENGTH, `Enter all ${OTP_LENGTH} digits.`),
});
export type OtpValues = z.infer<typeof otpSchema>;

/** POST /auth/change-password - the backend enforces exactly this policy. */
const PASSWORD_POLICY = "Password must be 8-128 characters and contain a letter and a digit.";

/** The backend's newPassword policy, shared by the form and the BFF wire schema. */
export const newPasswordPolicy = z
  .string()
  .min(8, PASSWORD_POLICY)
  .max(128, PASSWORD_POLICY)
  .regex(/[A-Za-z]/, PASSWORD_POLICY)
  .regex(/\d/, PASSWORD_POLICY);

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password.").max(128),
    newPassword: newPasswordPolicy,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    path: ["newPassword"],
    message: "New password must differ from the current one.",
  });
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

/**
 * Wire shapes the BFF route handlers accept. They deliberately differ from the
 * FORM schemas above: the client joins the six OTP boxes into one string before
 * sending, and the confirm-password box never leaves the browser.
 */
export const verifyOtpBodySchema = z.object({
  challengeId: z.string().uuid(),
  code: z.string().regex(/^\d{6}$/, `Enter all ${OTP_LENGTH} digits.`),
});

export const changePasswordBodySchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password.").max(128),
  newPassword: newPasswordPolicy,
});
