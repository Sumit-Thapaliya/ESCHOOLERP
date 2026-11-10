import { del, get, patch, post } from "./client";
import type {
  CreateUserInput,
  GrantRoleInput,
  Page,
  SchoolMe,
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
