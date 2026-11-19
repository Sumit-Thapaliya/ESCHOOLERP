export type PaymentMode = "Online" | "Cash" | "Bank Transfer" | "Cheque" | "eSewa / Khalti";
export type PaymentStatus = "Paid" | "Pending" | "Partially Paid" | "Overdue";

export interface FeeItem {
  id: string;
  name: string;
  amount: number;
  frequency: "Annual" | "Term" | "Monthly" | "One-time";
}

export interface StudentFeeProfile {
  studentId: string;
  studentName: string;
  rollNo: string;
  grade: string;
  section: string;
  admissionNo: string;
  guardianName: string;
  guardianPhone: string;
  fees: FeeItem[];
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  status: PaymentStatus;
}

export interface FeeTransaction {
  id: string;
  transactionRef: string;
  studentId: string;
  studentName: string;
  grade: string;
  date: string;
  mode: PaymentMode;
  amount: number;
  status: "Paid" | "Processing" | "Refunded";
  receiptNo: string;
}

export interface FeeStructurePlan {
  id: string;
  grade: string;
  academicYear: string;
  tuitionFee: number;
  libraryFee: number;
  labFee: number;
  examFee: number;
  transportFee: number;
  totalPerTerm: number;
}
