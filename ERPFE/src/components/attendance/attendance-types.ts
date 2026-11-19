export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "excused"
  | "half_day"
  | "holiday"
  | "weekend";

export interface StudentAttendanceRecord {
  rollNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  avatarUrl?: string;
  status: AttendanceStatus;
  checkInTime?: string;
  remarks?: string;
  guardianPhone?: string;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  name: string;
  role: string;
  department: string;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
}

export interface LeaveRequestRecord {
  id: string;
  applicantName: string;
  applicantRole: "Student" | "Staff";
  classOrDepartment: string;
  leaveType: "Sick Leave" | "Casual Leave" | "Family Emergency" | "Study Leave";
  fromDate: string;
  toDate: string;
  daysCount: number;
  reason: string;
  status: "approved" | "pending" | "rejected";
  appliedOn: string;
}

export interface MonthlyStudentAttendance {
  rollNo: string;
  studentId: string;
  studentName: string;
  days: Record<number, AttendanceStatus>;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  percentage: number;
}
