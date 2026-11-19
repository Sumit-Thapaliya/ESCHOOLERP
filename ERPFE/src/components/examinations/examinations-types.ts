export type ExamType = "Terminal" | "Unit Test" | "Mid Term" | "Final Board" | "Practical";

export interface ExamRecord {
  id: string;
  name: string;
  type: ExamType;
  academicYear: string;
  grade: string;
  subject: string;
  examDate: string;
  startTime: string;
  endTime: string;
  room: string;
  totalMarks: number;
  passMarks: number;
  status: "Scheduled" | "Ongoing" | "Completed" | "Published";
}

export interface StudentExamMark {
  rollNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  theoryMarks: number;
  practicalMarks: number;
  totalMarks: number;
  maxMarks: number;
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "F";
  percentage: number;
  remarks: string;
  status: "Pass" | "Fail" | "Absent";
}

export interface QuestionBankItem {
  id: string;
  subject: string;
  grade: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  questionText: string;
}
