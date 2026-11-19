export type GuardianRelation = "father" | "mother" | "guardian" | "other";

export interface GuardianPersonSummary {
  id: string;
  displayName: string;
  primaryPhone: string | null;
  email?: string | null;
  address?: string | null;
}

export interface GuardianChild {
  studentId: string;
  admissionNo: string;
  displayName: string;
  grade: string;
  section: string;
  status: "enrolled" | "admitted" | "withdrawn" | "graduated";
  relation: GuardianRelation;
  isPrimary: boolean;
}

export interface GuardianRecord {
  id: string;
  personId: string;
  qualification: string | null;
  occupation: string | null;
  employer: string | null;
  annualIncome?: number | null;
  person: GuardianPersonSummary;
  children: GuardianChild[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuardianInput {
  person: {
    firstName: string;
    lastName: string;
    gender?: "male" | "female" | "other";
    contacts: Array<{
      type: "phone" | "email" | "whatsapp";
      value: string;
      isPrimary: boolean;
    }>;
  };
  occupation?: string;
  employer?: string;
  qualification?: string;
  annualIncome?: number;
  studentId?: string;
  relation?: GuardianRelation;
  isPrimary?: boolean;
}
