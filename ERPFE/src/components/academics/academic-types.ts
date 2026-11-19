export type SubjectCategory = "core" | "elective" | "practical" | "language";

export interface SubjectAllocation {
  id: string;
  code: string;
  name: string;
  category: SubjectCategory;
  weeklyPeriods: number;
  creditHours: number;
  teacher: {
    id: string;
    name: string;
    email: string;
    department: string;
    initials: string;
    avatarUrl?: string;
  };
  room: string;
  building: string;
  scheduleDays: string; // e.g. "Mon, Wed, Fri"
  timeSlot: string;     // e.g. "09:00 - 09:45"
  syllabusProgress: number; // percentage 0 - 100
  totalChapters: number;
  completedChapters: number;
}

export interface TimetablePeriod {
  periodNumber: number;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  breakLabel?: string;
}

export interface TimetableCell {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  periodNumber: number;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  room: string;
  colorClass: string;
}

export interface CurriculumChapter {
  id: string;
  unitNumber: number;
  title: string;
  plannedHours: number;
  completedHours: number;
  status: "completed" | "in_progress" | "upcoming";
  keyTopics: string[];
}

export interface SubjectCurriculum {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  totalPlannedHours: number;
  completedHours: number;
  chapters: CurriculumChapter[];
}

export interface ClassSectionInfo {
  id: string;
  academicYear: string;
  grade: string;
  section: string;
  classTeacher: {
    name: string;
    department: string;
  };
  assignedRoom: string;
  totalStudents: number;
  capacity: number;
  totalWeeklyPeriods: number;
}
