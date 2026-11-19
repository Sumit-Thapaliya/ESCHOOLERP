import { del, get, patch, post, put } from "./client";
import type { Page } from "./types";
import {
  StaffMember,
  StaffKind,
  StaffStatus,
  NamedRef,
  CampusRef,
  Qualification,
} from "@/components/staff/staff-types";

export interface ListStaffParams {
  page?: number;
  limit?: number;
  staffType?: StaffKind;
  status?: StaffStatus;
  campusId?: string;
  departmentId?: string;
  designationId?: string;
  search?: string;
}

export interface CreateStaffInput {
  personId?: string;
  campusId?: string;
  staffType: StaffKind;
  departmentId?: string | null;
  designationId?: string | null;
  reportsTo?: string | null;
  employmentType?: string | null;
  joiningDate: string;
  probationEndDate?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  person?: {
    firstName: string;
    lastName?: string;
    gender?: string;
    dob?: string;
    bloodGroup?: string;
    contacts?: Array<{ type: string; value: string; isPrimary?: boolean }>;
    addresses?: Array<{ type: string; line1?: string; municipality?: string; district?: string; country: string }>;
  };
  teacherProfile?: {
    highestQualification?: string;
    specialization?: string;
    experienceYears?: number;
    maxWeeklyPeriods?: number;
    teachingLicenseNo?: string;
  };
  driverProfile?: {
    licenseNo: string;
    licenseClass?: string;
    licenseExpiry: string;
  };
}

export interface ChangeStaffStatusInput {
  status: StaffStatus;
  leavingDate?: string | null;
  leavingReason?: string | null;
}

/** GET /staff - paged, filterable by department, type, status. Needs staff.read. */
export function listStaff(params: ListStaffParams = {}) {
  return get<Page<StaffMember>>("/staff", { params });
}

/** GET /staff/{id} - full profile with person and qualifications. Needs staff.read. */
export function getStaff(id: string) {
  return get<StaffMember>(`/staff/${id}`);
}

/** POST /staff - Onboard a new employee. Needs staff.create. */
export function createStaff(input: CreateStaffInput) {
  return post<StaffMember>("/staff", input);
}

/** PATCH /staff/{id} - Update employment details. Needs staff.update. */
export function updateStaff(id: string, input: Partial<CreateStaffInput>) {
  return patch<StaffMember>(`/staff/${id}`, input);
}

/** POST /staff/{id}/status - Change status (active, on_leave, resigned). Needs staff.update. */
export function changeStaffStatus(id: string, input: ChangeStaffStatusInput) {
  return post<StaffMember>(`/staff/${id}/status`, input);
}

/** PUT /staff/{id}/teacher-profile - Specialization & teaching license. Needs staff.update. */
export function putTeacherProfile(id: string, profile: Record<string, unknown>) {
  return put<StaffMember>(`/staff/${id}/teacher-profile`, profile);
}

/** POST /staff/{id}/qualifications - Add a degree/certificate. Needs staff.update. */
export function addStaffQualification(id: string, qualification: Omit<Qualification, "id">) {
  return post<Qualification>(`/staff/${id}/qualifications`, qualification);
}

/** DELETE /staff/{id} - Remove mistaken staff entry. Needs staff.delete. */
export function deleteStaff(id: string) {
  return del<void>(`/staff/${id}`);
}

/** GET /departments - Reference list for department assignments. */
export function listDepartments() {
  return get<NamedRef[]>("/departments");
}

/** GET /designations - Reference list for job positions. */
export function listDesignations() {
  return get<NamedRef[]>("/designations");
}

/** GET /campuses - Reference list for school campuses. */
export function listCampuses() {
  return get<CampusRef[]>("/campuses");
}
