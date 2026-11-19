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

/** GET /roles catalogue entry (role.read). Broadest roles first. */
export type RoleCatalog = {
  id: string;
  code: string;
  name: string;
  isSystem: boolean;
  requiresMfa: boolean;
  permissions: string[];
  /** Whether the signed-in user may edit or assign this role. */
  manageable?: boolean;
  /** Users currently holding this role in any scope. */
  userCount?: number;
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

// --- students module -------------------------------------------------------

export type StudentStatus =
  | "applicant"
  | "active"
  | "alumni"
  | "transferred_out"
  | "dropped"
  | "suspended";

export type AdmissionType = "new" | "transfer_in" | "readmission";

export type CampusRef = { id: string; code: string; name: string };

export type PersonSummary = {
  id: string;
  displayName: string;
  gender: string | null;
  dob: string | null;
};

export type StudentListItem = {
  id: string;
  admissionNo: string;
  emisId: string | null;
  status: StudentStatus;
  admissionType: AdmissionType;
  admissionDate: string;
  hasSpecialNeeds: boolean;
  campus: CampusRef | null;
  person: PersonSummary;
  createdAt: string;
};

export type StudentListParams = {
  page?: number;
  limit?: number;
  status?: StudentStatus;
  campusId?: string;
  admissionType?: AdmissionType;
  /** Name contains, or exact admission number / EMIS id. */
  search?: string;
};

export type PersonContact = {
  id: string;
  type: "phone" | "email" | "whatsapp" | string;
  value: string;
  isPrimary: boolean;
  verifiedAt: string | null;
};

export type PersonAddress = {
  id: string;
  type: string;
  line1: string | null;
  line2: string | null;
  ward: string | null;
  municipality: string | null;
  district: string | null;
  province: string | null;
  postalCode: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
};

export type PersonDetail = PersonSummary & {
  userId: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  birthPlace: string | null;
  bloodGroup: string | null;
  nationality: string | null;
  nationalId: string | null;
  motherTongue: string | null;
  religion: string | null;
  ethnicity: string | null;
  photoFileId: string | null;
  createdAt: string;
  updatedAt: string;
  contacts: PersonContact[];
  addresses: PersonAddress[];
};

export type GuardianLink = {
  guardianId: string;
  personId: string;
  displayName: string;
  primaryPhone: string | null;
  relation: string;
  isPrimary: boolean;
  isEmergencyContact: boolean;
  livesWithStudent: boolean;
  canPickup: boolean;
  canViewResults: boolean;
  canPayFees: boolean;
  hasCustody: boolean;
  validFrom: string | null;
  validTo: string | null;
  isActive: boolean;
};

export type StudentDetail = {
  id: string;
  admissionNo: string;
  emisId: string | null;
  status: StudentStatus;
  admissionType: AdmissionType;
  admissionDate: string;
  previousSchoolName: string | null;
  previousSchoolClass: string | null;
  previousTcNo: string | null;
  hasSpecialNeeds: boolean;
  leavingDate: string | null;
  leavingReason: string | null;
  tcIssuedNo: string | null;
  remarks: string | null;
  campus: CampusRef | null;
  person: PersonDetail;
  guardians: GuardianLink[];
  createdAt: string;
  updatedAt: string;
};

export type StudentStatusEntry = {
  id: string;
  fromStatus: StudentStatus | null;
  toStatus: StudentStatus;
  reason: string | null;
  changedBy: string;
  changedAt: string;
};

export type StudentHealth = {
  studentId: string;
  allergies: string | null;
  medicalConditions: string | null;
  medications: string | null;
  disabilityType: string | null;
  disabilityNotes: string | null;
  doctorName: string | null;
  doctorPhone: string | null;
  insuranceNo: string | null;
  emergencyInstructions: string | null;
  /** Null until someone saves a health record: the row is created lazily. */
  updatedAt: string | null;
  updatedBy: string | null;
};

export type CreateStudentInput = {
  person: {
    firstName: string;
    middleName?: string | null;
    lastName?: string | null;
    gender: "male" | "female" | "other";
    dob?: string | null;
    bloodGroup?: string | null;
    birthPlace?: string | null;
    motherTongue?: string | null;
    nationality?: string | null;
    /** SENSITIVE: the server only accepts these with person.sensitive.read. */
    nationalId?: string | null;
    religion?: string | null;
    ethnicity?: string | null;
    contacts?: Array<{ type: string; value: string; isPrimary?: boolean }>;
    addresses?: Array<{
      /** Must match the server enum: current | permanent | work. */
      type: "current" | "permanent" | "work";
      line1?: string | null;
      ward?: string | null;
      municipality?: string | null;
      district?: string | null;
      province?: string | null;
      country?: string;
    }>;
  };
  campusId?: string;
  admissionDate: string;
  admissionType?: AdmissionType;
  emisId?: string | null;
  /** Required by the server when admissionType is transfer_in. */
  previousSchoolName?: string | null;
  previousSchoolClass?: string | null;
  previousTcNo?: string | null;
  remarks?: string | null;
  hasSpecialNeeds?: boolean;
};

// --- guardians --------------------------------------------------------------
// The relation list is the server's enum; anything outside it is rejected.
export type GuardianRelation =
  | "father"
  | "mother"
  | "legal_guardian"
  | "grandparent"
  | "uncle_aunt"
  | "other";

/** First word of the guardian's own details, when creating one inline. */
export type GuardianPersonInput = {
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
  gender?: "male" | "female" | "other" | null;
  contacts?: Array<{ type: string; value: string; isPrimary?: boolean }>;
};

/**
 * POST /guardians body. Send exactly one of `personId` (reuse a person found
 * with GET /persons/lookup) or `person` (create a new person).
 */
export type CreateGuardianInput = {
  personId?: string;
  person?: GuardianPersonInput;
  qualification?: string | null;
  occupation?: string | null;
  employer?: string | null;
  /** SENSITIVE: needs guardian.sensitive.read. */
  annualIncome?: number | null;
};

/** POST /students/{id}/guardians - link, creating the guardian inline if needed. */
export type LinkGuardianInput = {
  guardianId?: string;
  guardian?: CreateGuardianInput;
  relation: GuardianRelation;
  isPrimary?: boolean;
  isEmergencyContact?: boolean;
  livesWithStudent?: boolean;
  canPickup?: boolean;
  canViewResults?: boolean;
  canPayFees?: boolean;
  hasCustody?: boolean;
  validFrom?: string | null;
  validTo?: string | null;
};

/** PATCH /students/{id}/guardians/{guardianId} - flags and validity only. */
export type UpdateGuardianLinkInput = Partial<
  Omit<LinkGuardianInput, "guardianId" | "guardian" | "relation">
> & { relation?: GuardianRelation };

export type GuardianChild = {
  studentId: string;
  admissionNo: string;
  displayName: string;
  status: StudentStatus;
  relation: GuardianRelation;
  isPrimary: boolean;
};

/** GET /guardians/{id} - the guardian plus every child in the caller's scope. */
export type GuardianDetail = {
  id: string;
  personId: string;
  qualification: string | null;
  occupation: string | null;
  employer: string | null;
  annualIncome?: number | null;
  createdAt: string;
  updatedAt: string;
  person: PersonDetail;
  children: GuardianChild[];
};

export type GuardianListItem = Omit<GuardianDetail, "person" | "children"> & {
  person: { id: string; displayName: string; primaryPhone: string | null };
};

export type GuardianListParams = {
  page?: number;
  limit?: number;
  /** Name contains, or exact phone/email. */
  search?: string;
};

/** POST /students/{id}/status - applicant -> active, or an exit status. */
export type ChangeStudentStatusInput = {
  status: StudentStatus;
  reason?: string | null;
  /** Required by the server for alumni, transferred_out and dropped. */
  leavingDate?: string | null;
  leavingReason?: string | null;
  tcIssuedNo?: string | null;
};

// --- dashboard --------------------------------------------------------------

export type CampusCount = {
  campusId: string | null;
  code: string | null;
  name: string | null;
  /** Enrolled students / current staff on this campus. */
  current: number;
  /** All records on this campus, including alumni and departed. */
  total: number;
};

export type StudentKpis = {
  enrolled: number;
  applicants: number;
  total: number;
  byStatus: Record<string, number>;
  byGender: Record<string, number>;
  admissionsThisMonth: number;
  admissionsThisYear: number;
  byCampus: CampusCount[];
};

export type StaffKpis = {
  current: number;
  active: number;
  onLeave: number;
  total: number;
  byType: Record<string, number>;
  byCampus: CampusCount[];
};

/** GET /dashboard/kpis - each block appears only with its permission. */
export type DashboardKpis = {
  scope: "institution" | "campus";
  campusIds: string[] | null;
  generatedAt: string;
  students?: StudentKpis;
  staff?: StaffKpis;
};
