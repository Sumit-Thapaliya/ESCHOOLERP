import { del, get, patch, post } from "./client";
import type {
  ChangeStudentStatusInput,
  CreateGuardianInput,
  DashboardKpis,
  GuardianDetail,
  GuardianLink,
  GuardianListItem,
  GuardianListParams,
  LinkGuardianInput,
  RoleCatalog,
  CampusRef,
  CreateStudentInput,
  CreateUserInput,
  GrantRoleInput,
  Page,
  SchoolMe,
  StudentDetail,
  StudentHealth,
  StudentListItem,
  StudentListParams,
  StudentStatusEntry,
  UpdateGuardianLinkInput,
  User,
  UserListParams,
  UserStatus,
} from "./types";

/**
 * School-plane data calls. The `x-tenant-id` header is attached automatically
 * by the client from the URL, so these need no slug argument.
 */

/** Works even while a password change is pending. */
export function schoolMe() {
  return get<SchoolMe>("/auth/me");
}

/** /users CRUD lands here in Phase 3 - see INTEGRATION.md. */

// --- users -----------------------------------------------------------------
// Permission codes come straight from the API reference; the server enforces
// them on every call, and the UI hides what it cannot do anyway.

/** GET /roles - the role catalogue, broadest first. Needs role.read. */
export function listRoles() {
  return get<RoleCatalog[]>("/roles");
}

/** GET /users - paged, newest first. Needs user.read. */
export function listUsers(params: UserListParams = {}) {
  return get<Page<User>>("/users", { params });
}

/** GET /users/{id}. Needs user.read. */
export function getUser(id: string) {
  return get<User>(`/users/${id}`);
}

/** POST /users - 201. Needs user.create, plus role.assign when roles are sent. */
export function createUser(input: CreateUserInput) {
  return post<User>("/users", input);
}

/**
 * PATCH /users/{id}/status. Needs user.update.
 * Suspending or disabling logs the user out everywhere, immediately.
 */
export function setUserStatus(id: string, status: UserStatus) {
  return patch<User>(`/users/${id}/status`, { status });
}

/**
 * POST /users/{id}/reset-password. Needs user.update.
 * Clears any brute-force lockout and logs the user out everywhere.
 */
export function resetUserPassword(id: string, password: string, mustChangePassword = true) {
  return post<void>(`/users/${id}/reset-password`, { password, mustChangePassword });
}

/** POST /users/{id}/roles. Needs role.assign; you cannot grant what you lack. */
export function assignUserRole(id: string, input: GrantRoleInput) {
  return post<User>(`/users/${id}/roles`, input);
}

/** DELETE /users/{id}/roles/{assignmentId}. The last school-wide principal stays. */
export function removeUserRole(id: string, assignmentId: string) {
  return del<User>(`/users/${id}/roles/${assignmentId}`);
}

// --- campuses & students ---------------------------------------------------

/**
 * GET /campuses - the dropdown source for campus filters and admission.
 * The team endpoint returns a bare array (not a Page) and its query DTO
 * whitelists only isActive/kind, so we send no params and normalise here.
 */
export function listCampuses() {
  return get<CampusRef[] | Page<CampusRef>>("/campuses").then((r) =>
    Array.isArray(r) ? { items: r, total: r.length, page: 1, limit: 100 } : r,
  );
}

/** GET /students - paged; search = name contains or exact admission/EMIS id. */
export function listStudents(params: StudentListParams = {}) {
  return get<Page<StudentListItem>>("/students", { params });
}

/** GET /students/{id} - person, contacts, addresses and guardians in one call. */
export function getStudent(id: string) {
  return get<StudentDetail>(`/students/${id}`);
}

/** GET /students/{id}/status-history - append-only timeline. */
export function getStudentStatusHistory(id: string) {
  return get<StudentStatusEntry[]>(`/students/${id}/status-history`);
}

/** GET /students/{id}/health - sensitive; needs student.health.read; audited. */
export function getStudentHealth(id: string) {
  return get<StudentHealth>(`/students/${id}/health`);
}

/** POST /students - 201; admissionNo generated; starts as applicant. */
export function createStudent(input: CreateStudentInput) {
  return post<StudentDetail>("/students", input);
}

// --- guardians --------------------------------------------------------------
// Guardian records are their own resource; the *link* to a student lives under
// /students/{id}/guardians. Admitting a student and linking a parent are two
// calls, in that order - the server will not accept guardians inside POST
// /students.

/** GET /students/{id}/guardians - every link with its permissions. */
export function getStudentGuardians(id: string) {
  return get<GuardianLink[]>(`/students/${id}/guardians`);
}

/**
 * POST /students/{id}/guardians - 201, returns all links for the student.
 * Send { guardianId } to reuse someone already on file, or { guardian: {...} }
 * to create the guardian (and their person record) in the same call.
 * Needs student.update, plus guardian.create for an inline guardian.
 */
export function linkGuardian(id: string, input: LinkGuardianInput) {
  return post<GuardianLink[]>(`/students/${id}/guardians`, input);
}

/** PATCH /students/{id}/guardians/{guardianId} - flags, relation, validity. */
export function updateGuardianLink(id: string, guardianId: string, input: UpdateGuardianLinkInput) {
  return patch<GuardianLink[]>(`/students/${id}/guardians/${guardianId}`, input);
}

/**
 * DELETE /students/{id}/guardians/{guardianId} - 204. The guardian record stays;
 * the server refuses if this would leave an active student without a primary.
 */
export function unlinkGuardian(id: string, guardianId: string) {
  return del<void>(`/students/${id}/guardians/${guardianId}`);
}

/** GET /guardians - paged directory. Needs guardian.read. */
export function listGuardians(params: GuardianListParams = {}) {
  return get<Page<GuardianListItem>>("/guardians", { params });
}

/** GET /guardians/{id} - guardian plus every linked child. Needs guardian.read. */
export function getGuardian(id: string) {
  return get<GuardianDetail>(`/guardians/${id}`);
}

/** POST /guardians - a guardian with no student yet. Needs guardian.create. */
export function createGuardian(input: CreateGuardianInput) {
  return post<GuardianDetail>("/guardians", input);
}

// --- student lifecycle ------------------------------------------------------

/** POST /students/{id}/status - applicant -> active, suspended, alumni, ... */
export function setStudentStatus(id: string, input: ChangeStudentStatusInput) {
  return post<StudentDetail>(`/students/${id}/status`, input);
}

// --- dashboard --------------------------------------------------------------

/** GET /dashboard/kpis - real counts; each block appears only with its permission. */
export function getDashboardKpis(params: { campusId?: string } = {}) {
  return get<DashboardKpis>("/dashboard/kpis", { params });
}
