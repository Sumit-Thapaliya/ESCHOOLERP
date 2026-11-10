/**
 * Wire types for the backend API.
 * Source of truth: "School ERP API Reference", 2 November 2026.
 */

/** The two planes are completely separate; a token from one is rejected by the other. */
export type Plane = "platform" | "school";

/** Every 2xx body is wrapped by the backend's TransformInterceptor. */
export type ApiEnvelope<T> = {
  statusCode: number;
  message: string;
  data: T;
};

/** Errors are NOT wrapped. `message` is a string, or an array on 400 validation. */
export type ApiErrorBody = {
  statusCode: number;
  error?: string;
  message?: string | string[];
  code?: string;
};

export type TokenPair = {
  accessToken: string;
  /** Opaque "<uuid>.<secret>". SINGLE USE - every refresh returns a new one. */
  refreshToken: string;
  tokenType: "Bearer";
  /** accessToken lifetime in seconds (900 = 15 minutes). */
  expiresIn: number;
};

/** POST /platform/auth/login -> an emailed 6-digit code is always required. */
export type PlatformChallenge = {
  challengeId: string;
  expiresInSeconds: number;
};

/** POST /auth/login -> OTP is only required for MFA users and admin/principal roles. */
export type SchoolLoginAuthenticated = TokenPair & {
  status: "authenticated";
  mustChangePassword: boolean;
};

export type SchoolLoginOtpRequired = {
  status: "otp_required";
  challengeId: string;
  channel: "email";
  /** Already masked by the backend, e.g. "a***@school.edu" - safe to display. */
  destination: string;
  expiresInSeconds: number;
};

export type SchoolLoginResult = SchoolLoginAuthenticated | SchoolLoginOtpRequired;

/** POST /auth/verify-otp */
export type SchoolVerifyResult = TokenPair & { mustChangePassword: boolean };

export type Role = {
  code: string;
  name: string;
  scopeType: "institution" | "campus" | "department" | "class" | "section";
  scopeId: string | null;
};

/** GET /auth/me (school plane). */
export type SchoolMe = {
  id: string;
  username: string | null;
  email: string | null;
  phone: string | null;
  locale: string;
  mfaEnabled: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  roles: Role[];
  /** Institution-scoped permission codes. Use these to show/hide UI. */
  permissions: string[];
  tenant: { slug: string; name: string };
};

/** A school, as returned to platform admins. Connection details are never included. */
export type TenantRecord = {
  id: string;
  slug: string;
  name: string;
  status: "provisioning" | "active" | "suspended" | "failed";
  customDomain: string | null;
  createdAt: string;
  updatedAt: string;
};

/** PUT /tenants/:id/branding - omitted optional fields are RESET to defaults. */
export type BrandingInput = {
  displayName: string;
  shortName?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  language?: string;
};

/** The public branding config returned by resolve and by the branding PUT. */
export type PublicTenantConfig = {
  slug: string;
  status: "active" | "suspended" | string;
  name: string;
  shortName?: string | null;
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

/**
 * What our OWN /api/auth routes return once a session exists.
 * The refresh token is deliberately absent: it never leaves the Next server,
 * it lives only in the httpOnly `erp_rt` cookie.
 */
export type SessionGranted = {
  plane: Plane;
  accessToken: string;
  /** Access token lifetime in seconds (900). */
  expiresIn: number;
  /** School plane only. */
  slug?: string | null;
  mustChangePassword?: boolean;
};

// --- users module ----------------------------------------------------------

export type UserStatus = "active" | "suspended" | "disabled";

/** One role granted to a user. scopeType "campus" limits it to one branch. */
export type UserRoleAssignment = {
  assignmentId: string;
  code: string;
  name: string;
  scopeType: "institution" | "campus" | "department" | string;
  scopeId: string | null;
  validFrom: string | null;
  validTo: string | null;
};

/** A login account. The person behind it may not exist yet (or ever). */
export type User = {
  id: string;
  username: string | null;
  email: string | null;
  phone: string | null;
  status: UserStatus;
  mustChangePassword: boolean;
  mfaEnabled: boolean;
  locale: string;
  lockedUntil: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  roles: UserRoleAssignment[];
};

/**
 * Every GET collection in this API pages the same way:
 * ?page=&limit= (max 100) plus per-endpoint filters, returning this shape.
 */
export type Page<T> = { items: T[]; total: number; page: number; limit: number };

export type UserListParams = {
  page?: number;
  limit?: number;
  /** Matches username, email or phone (contains, case-insensitive). */
  search?: string;
  status?: UserStatus;
};

export type CreateUserInput = {
  username?: string;
  email?: string;
  phone?: string;
  password: string;
  mustChangePassword?: boolean;
  mfaEnabled?: boolean;
  /** Role codes, institution scope. Needs role.assign on top of user.create. */
  roles?: string[];
  locale?: string;
};

export type GrantRoleInput = {
  /** Role CODE, e.g. "teacher". */
  role: string;
  scopeType?: "institution" | "campus" | "department";
  scopeId?: string | null;
  validFrom?: string;
  validTo?: string;
};
