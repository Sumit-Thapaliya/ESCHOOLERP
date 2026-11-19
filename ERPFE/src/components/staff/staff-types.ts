export type StaffKind =
  | "teaching"
  | "non_teaching"
  | "admin"
  | "driver"
  | "support"
  | "management";

export type EmploymentKind = "permanent" | "contract" | "visiting" | "part_time";

export type StaffStatus =
  | "active"
  | "on_leave"
  | "resigned"
  | "terminated"
  | "retired";

export interface CampusRef {
  id: string;
  code: string;
  name: string;
}

export interface NamedRef {
  id: string;
  name: string;
}

export interface PersonContact {
  type: "phone" | "email" | "whatsapp";
  value: string;
  isPrimary: boolean;
}

export interface PersonAddress {
  type: "current" | "permanent" | "work";
  line1?: string;
  ward?: string;
  municipality?: string;
  district?: string;
  province?: string;
  country: string;
}

export interface TeacherProfile {
  highestQualification?: string | null;
  specialization?: string | null;
  experienceYears?: number | null;
  maxWeeklyPeriods?: number | null;
  teachingLicenseNo?: string | null;
}

export interface DriverProfile {
  licenseNo: string;
  licenseClass?: string | null;
  licenseExpiry: string;
  medicalFitnessExpiry?: string | null;
  policeVerificationDate?: string | null;
}

export interface Qualification {
  id: string;
  degree: string;
  institution?: string | null;
  passedYear?: number | null;
  grade?: string | null;
  createdAt?: string;
}

export interface StaffMember {
  id: string;
  employeeCode: string;
  staffType: StaffKind;
  status: StaffStatus;
  employmentType: EmploymentKind | null;
  joiningDate: string;
  probationEndDate?: string | null;
  leavingDate?: string | null;
  leavingReason?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  campus?: CampusRef | null;
  department?: NamedRef | null;
  designation?: NamedRef | null;
  person: {
    id: string;
    displayName: string;
    firstName?: string;
    lastName?: string;
    gender?: "male" | "female" | "other" | null;
    dob?: string | null;
    bloodGroup?: string | null;
    contacts?: PersonContact[];
    addresses?: PersonAddress[];
  };
  teacherProfile?: TeacherProfile | null;
  driverProfile?: DriverProfile | null;
  qualifications?: Qualification[];
  directReports?: number;
}
