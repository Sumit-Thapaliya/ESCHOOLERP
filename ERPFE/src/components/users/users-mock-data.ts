import type { User, UserRoleAssignment } from "@/lib/api/types";

export interface SystemRoleDefinition {
  code: string;
  name: string;
  description: string;
  isSystem: boolean;
  userCount: number;
  permissions: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: "success" | "warning" | "failure";
  details?: string;
}

export const MOCK_ROLES: SystemRoleDefinition[] = [
  {
    code: "super_admin",
    name: "Super Administrator",
    description: "Complete unrestricted access across school plane configuration, users, and audit records.",
    isSystem: true,
    userCount: 2,
    permissions: [
      "user.read", "user.create", "user.update", "user.delete",
      "role.read", "role.create", "role.assign",
      "staff.read", "staff.write", "student.read", "student.write",
      "academic.read", "academic.write", "finance.read", "finance.write",
      "audit.read", "settings.write"
    ],
  },
  {
    code: "school_admin",
    name: "Institutional Administrator",
    description: "Manages day-to-day student records, faculty onboarding, notices, and operational schedules.",
    isSystem: true,
    userCount: 4,
    permissions: [
      "user.read", "user.create",
      "staff.read", "staff.write", "student.read", "student.write",
      "academic.read", "academic.write", "attendance.read", "attendance.write",
      "communication.write"
    ],
  },
  {
    code: "teacher",
    name: "Teaching Faculty",
    description: "Access to assigned classrooms, daily attendance registers, syllabus tracking, and exam grading.",
    isSystem: true,
    userCount: 38,
    permissions: [
      "student.read", "academic.read", "academic.write",
      "attendance.read", "attendance.write",
      "exam.marks.write", "communication.read"
    ],
  },
  {
    code: "accountant",
    name: "Finance & Accounts Officer",
    description: "Manages fee structures, generates fee invoices, records receipts, and views collection ledger.",
    isSystem: true,
    userCount: 3,
    permissions: [
      "finance.read", "finance.write", "student.read", "reports.finance"
    ],
  },
  {
    code: "librarian",
    name: "Librarian & Media Specialist",
    description: "Manages catalog, book borrowing/returns, issue penalties, and digital learning assets.",
    isSystem: true,
    userCount: 2,
    permissions: [
      "library.read", "library.write", "student.read", "staff.read"
    ],
  },
  {
    code: "driver",
    name: "Transport Driver",
    description: "Bus trip check-in, student transit boarding scans, and vehicle telemetry status.",
    isSystem: true,
    userCount: 8,
    permissions: [
      "transport.read", "transport.write", "student.read"
    ],
  },
  {
    code: "guardian",
    name: "Parent / Guardian",
    description: "Parent portal access for child attendance tracking, term report cards, notices, and fee payment.",
    isSystem: true,
    userCount: 940,
    permissions: [
      "portal.student.read", "portal.attendance.read", "portal.finance.read", "portal.finance.pay"
    ],
  },
  {
    code: "student",
    name: "Student",
    description: "Student portal access to class timetable, homework submissions, and exam results.",
    isSystem: true,
    userCount: 1240,
    permissions: [
      "portal.timetable.read", "portal.marks.read", "portal.library.read"
    ],
  },
];

export const MOCK_USERS_DATA: User[] = [
  {
    id: "usr-001",
    username: "principal.adhikari",
    email: "principal@sunrise.edu.np",
    phone: "+977 9851011111",
    status: "active",
    mustChangePassword: false,
    mfaEnabled: true,
    locale: "en",
    lockedUntil: null,
    lastLoginAt: "2026-11-13T09:15:22Z",
    createdAt: "2023-01-10T08:00:00Z",
    roles: [
      {
        assignmentId: "asg-01",
        code: "super_admin",
        name: "Super Administrator",
        scopeType: "institution",
        scopeId: null,
        validFrom: "2023-01-10",
        validTo: null,
      },
    ],
  },
  {
    id: "usr-002",
    username: "neha.sharma",
    email: "neha.sharma@sunrise.edu.np",
    phone: "+977 9841234581",
    status: "active",
    mustChangePassword: false,
    mfaEnabled: false,
    locale: "en",
    lockedUntil: null,
    lastLoginAt: "2026-11-13T08:45:10Z",
    createdAt: "2023-04-12T09:30:00Z",
    roles: [
      {
        assignmentId: "asg-02",
        code: "teacher",
        name: "Teaching Faculty",
        scopeType: "department",
        scopeId: "dep-01",
        validFrom: "2023-04-12",
        validTo: null,
      },
    ],
  },
  {
    id: "usr-003",
    username: "rohan.singh",
    email: "rohan.singh@sunrise.edu.np",
    phone: "+977 9841987654",
    status: "active",
    mustChangePassword: false,
    mfaEnabled: true,
    locale: "en",
    lockedUntil: null,
    lastLoginAt: "2026-11-12T16:20:00Z",
    createdAt: "2023-06-01T10:00:00Z",
    roles: [
      {
        assignmentId: "asg-03",
        code: "teacher",
        name: "Teaching Faculty",
        scopeType: "department",
        scopeId: "dep-02",
        validFrom: "2023-06-01",
        validTo: null,
      },
    ],
  },
  {
    id: "usr-004",
    username: "kavita.accounts",
    email: "accounts@sunrise.edu.np",
    phone: "+977 9801239845",
    status: "active",
    mustChangePassword: false,
    mfaEnabled: true,
    locale: "en",
    lockedUntil: null,
    lastLoginAt: "2026-11-13T07:55:40Z",
    createdAt: "2023-03-15T11:00:00Z",
    roles: [
      {
        assignmentId: "asg-04",
        code: "accountant",
        name: "Finance & Accounts Officer",
        scopeType: "institution",
        scopeId: null,
        validFrom: "2023-03-15",
        validTo: null,
      },
    ],
  },
  {
    id: "usr-005",
    username: "bir.transport",
    email: "bir.transport@sunrise.edu.np",
    phone: "+977 9811223344",
    status: "active",
    mustChangePassword: false,
    mfaEnabled: false,
    locale: "en",
    lockedUntil: null,
    lastLoginAt: "2026-11-13T06:10:00Z",
    createdAt: "2023-08-20T08:00:00Z",
    roles: [
      {
        assignmentId: "asg-05",
        code: "driver",
        name: "Transport Driver",
        scopeType: "institution",
        scopeId: null,
        validFrom: "2023-08-20",
        validTo: null,
      },
    ],
  },
  {
    id: "usr-006",
    username: "parent.rajesh",
    email: "rajesh.sharma@gmail.com",
    phone: "+977 9851088776",
    status: "active",
    mustChangePassword: false,
    mfaEnabled: false,
    locale: "en",
    lockedUntil: null,
    lastLoginAt: "2026-11-11T19:30:15Z",
    createdAt: "2024-04-05T12:00:00Z",
    roles: [
      {
        assignmentId: "asg-06",
        code: "guardian",
        name: "Parent / Guardian",
        scopeType: "institution",
        scopeId: null,
        validFrom: "2024-04-05",
        validTo: null,
      },
    ],
  },
  {
    id: "usr-007",
    username: "auditor.temp",
    email: "auditor@external-council.gov.np",
    phone: "+977 9841009988",
    status: "suspended",
    mustChangePassword: true,
    mfaEnabled: true,
    locale: "en",
    lockedUntil: "2026-11-20T18:00:00Z",
    lastLoginAt: "2026-11-05T14:10:00Z",
    createdAt: "2024-10-01T09:00:00Z",
    roles: [
      {
        assignmentId: "asg-07",
        code: "school_admin",
        name: "Institutional Administrator",
        scopeType: "campus",
        scopeId: "cam-01",
        validFrom: "2024-10-01",
        validTo: "2024-11-15",
      },
    ],
  },
  {
    id: "usr-008",
    username: "former.staff",
    email: "former.officer@sunrise.edu.np",
    phone: "+977 9841882233",
    status: "disabled",
    mustChangePassword: false,
    mfaEnabled: false,
    locale: "en",
    lockedUntil: null,
    lastLoginAt: "2024-08-30T16:45:00Z",
    createdAt: "2022-05-10T10:00:00Z",
    roles: [
      {
        assignmentId: "asg-08",
        code: "teacher",
        name: "Teaching Faculty",
        scopeType: "institution",
        scopeId: null,
        validFrom: "2022-05-10",
        validTo: "2024-08-31",
      },
    ],
  },
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud-01",
    timestamp: "2026-11-13 11:20:15",
    actor: "principal.adhikari",
    actorRole: "Super Administrator",
    action: "ROLE_GRANTED",
    resource: "User usr-003: added role 'teacher'",
    ipAddress: "192.168.1.104",
    status: "success",
  },
  {
    id: "aud-02",
    timestamp: "2026-11-13 10:45:30",
    actor: "kavita.accounts",
    actorRole: "Finance Officer",
    action: "FEE_PAYMENT_COLLECTED",
    resource: "Receipt REC-2025-0422 (Rs. 9,000)",
    ipAddress: "192.168.1.118",
    status: "success",
  },
  {
    id: "aud-03",
    timestamp: "2026-11-13 09:15:22",
    actor: "principal.adhikari",
    actorRole: "Super Administrator",
    action: "AUTH_LOGIN_SUCCESS",
    resource: "Session started with MFA verified",
    ipAddress: "192.168.1.104",
    status: "success",
  },
  {
    id: "aud-04",
    timestamp: "2026-11-12 18:30:11",
    actor: "auditor.temp",
    actorRole: "External Auditor",
    action: "ACCOUNT_SUSPENDED",
    resource: "User account suspended by security policy",
    ipAddress: "27.34.20.91",
    status: "warning",
    details: "Exceeded 5 failed login attempts",
  },
  {
    id: "aud-05",
    timestamp: "2026-11-12 15:10:04",
    actor: "neha.sharma",
    actorRole: "Teaching Faculty",
    action: "EXAM_MARKS_SUBMITTED",
    resource: "Mid Term: Grade 8 Mathematics (32 students)",
    ipAddress: "192.168.1.142",
    status: "success",
  },
  {
    id: "aud-06",
    timestamp: "2026-11-12 08:02:19",
    actor: "system_cron",
    actorRole: "System Automator",
    action: "ATTENDANCE_SMS_TRIGGERED",
    resource: "Absentee notifications sent to 14 parents",
    ipAddress: "127.0.0.1",
    status: "success",
  },
];
