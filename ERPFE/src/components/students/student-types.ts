export type StudentStatus = "Active" | "On leave" | "Suspended" | "Alumni";

export type FeeStatus = "Paid" | "Partial" | "Overdue";

export interface GuardianInfo {
  relation: "Father" | "Mother" | "Guardian";
  name: string;
  phone: string;
  email?: string;
  occupation?: string;
  isEmergencyContact: boolean;
}

export interface StudentDocument {
  id: string;
  title: string;
  category: "Birth Certificate" | "Transfer Certificate" | "Character Certificate" | "Medical Report" | "National ID / NID";
  fileName: string;
  uploadedAt: string;
  fileSize: string;
  verified: boolean;
}

export interface TermResult {
  term: string;
  session: string;
  gpa: number;
  percentage: number;
  rank: string;
  attendancePct: number;
  subjects: {
    name: string;
    fullMarks: number;
    passMarks: number;
    obtainedMarks: number;
    grade: string;
  }[];
  remarks: string;
}

export interface StudentFeeLedgerItem {
  id: string;
  date: string;
  title: string;
  amountNpr: number;
  status: "Paid" | "Pending" | "Overdue";
  receiptNo?: string;
  dueDate?: string;
}

export interface StudentTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "admission" | "promotion" | "achievement" | "disciplinary" | "attendance";
}

export interface Student {
  id: string;
  admissionNo: string;
  rollNo: string;
  fullName: string;
  gender: "Male" | "Female" | "Other";
  dobBS: string;
  dobAD: string;
  bloodGroup: string;
  campusId: "ktm" | "lal" | "pkr";
  campusName: string;
  grade: string;
  section: string;
  status: StudentStatus;
  avatarUrl?: string;
  joinedDate: string;
  address: {
    street: string;
    ward: string;
    municipality: string;
    district: string;
  };
  transportRoute?: string;
  busStop?: string;
  guardians: GuardianInfo[];
  attendancePct: number;
  totalPresentDays: number;
  totalSchoolDays: number;
  feeStatus: FeeStatus;
  pendingDueNpr: number;
  documents: StudentDocument[];
  results: TermResult[];
  feeLedger: StudentFeeLedgerItem[];
  timeline: StudentTimelineEvent[];
}

export interface StudentFilters {
  search: string;
  grade: string;
  section: string;
  status: string;
  campusId: string;
  feeStatus: string;
}
