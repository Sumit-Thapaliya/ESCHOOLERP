import {
  StudentAttendanceRecord,
  StaffAttendanceRecord,
  LeaveRequestRecord,
  MonthlyStudentAttendance,
  AttendanceStatus,
} from "./attendance-types";

export const ATTENDANCE_CLASSES = [
  { value: "Grade 8 - A", label: "Grade 8 - A" },
  { value: "Grade 8 - B", label: "Grade 8 - B" },
  { value: "Grade 9 - A", label: "Grade 9 - A" },
  { value: "Grade 9 - B", label: "Grade 9 - B" },
  { value: "Grade 10 - A", label: "Grade 10 - A" },
  { value: "Grade 10 - B", label: "Grade 10 - B" },
  { value: "Grade 11 - Science", label: "Grade 11 - Science" },
  { value: "Grade 12 - Science", label: "Grade 12 - Science" },
];

export const MOCK_STUDENT_ATTENDANCE: Record<string, StudentAttendanceRecord[]> = {
  "Grade 8 - A": [
    {
      rollNo: "01",
      studentId: "stu-01",
      studentName: "Aarav Sharma",
      admissionNo: "ADM-2024-001",
      status: "present",
      checkInTime: "08:45 AM",
      guardianPhone: "+977 9841234567",
    },
    {
      rollNo: "02",
      studentId: "stu-02",
      studentName: "Sneha Patel",
      admissionNo: "ADM-2024-002",
      status: "present",
      checkInTime: "08:50 AM",
      guardianPhone: "+977 9841234568",
    },
    {
      rollNo: "03",
      studentId: "stu-03",
      studentName: "Rohan Mehta",
      admissionNo: "ADM-2024-003",
      status: "absent",
      remarks: "Reported fever, doctor note pending",
      guardianPhone: "+977 9841234569",
    },
    {
      rollNo: "04",
      studentId: "stu-04",
      studentName: "Ananya Singh",
      admissionNo: "ADM-2024-004",
      status: "present",
      checkInTime: "08:42 AM",
      guardianPhone: "+977 9841234570",
    },
    {
      rollNo: "05",
      studentId: "stu-05",
      studentName: "Vivaan Kapoor",
      admissionNo: "ADM-2024-005",
      status: "late",
      checkInTime: "09:18 AM",
      remarks: "School bus delay on route 3",
      guardianPhone: "+977 9841234571",
    },
    {
      rollNo: "06",
      studentId: "stu-06",
      studentName: "Sneha Gurung",
      admissionNo: "ADM-2024-006",
      status: "present",
      checkInTime: "08:48 AM",
      guardianPhone: "+977 9841234572",
    },
    {
      rollNo: "07",
      studentId: "stu-07",
      studentName: "Ritik Shrestha",
      admissionNo: "ADM-2024-007",
      status: "present",
      checkInTime: "08:52 AM",
      guardianPhone: "+977 9841234573",
    },
    {
      rollNo: "08",
      studentId: "stu-08",
      studentName: "Pooja Thapa",
      admissionNo: "ADM-2024-008",
      status: "present",
      checkInTime: "08:40 AM",
      guardianPhone: "+977 9841234574",
    },
    {
      rollNo: "09",
      studentId: "stu-09",
      studentName: "Bibek Adhikari",
      admissionNo: "ADM-2024-009",
      status: "excused",
      remarks: "Authorized inter-school athletic meet",
      guardianPhone: "+977 9841234575",
    },
    {
      rollNo: "10",
      studentId: "stu-10",
      studentName: "Sunil Sharma",
      admissionNo: "ADM-2024-010",
      status: "present",
      checkInTime: "08:46 AM",
      guardianPhone: "+977 9841234576",
    },
    {
      rollNo: "11",
      studentId: "stu-11",
      studentName: "Priya Khadka",
      admissionNo: "ADM-2024-011",
      status: "present",
      checkInTime: "08:44 AM",
      guardianPhone: "+977 9841234577",
    },
    {
      rollNo: "12",
      studentId: "stu-12",
      studentName: "Manish Joshi",
      admissionNo: "ADM-2024-012",
      status: "late",
      checkInTime: "09:12 AM",
      remarks: "Traffic at Ring Road",
      guardianPhone: "+977 9841234578",
    },
    {
      rollNo: "13",
      studentId: "stu-13",
      studentName: "Suman Rawat",
      admissionNo: "ADM-2024-013",
      status: "absent",
      remarks: "Unexcused absence, SMS sent to parent",
      guardianPhone: "+977 9841234579",
    },
    {
      rollNo: "14",
      studentId: "stu-14",
      studentName: "Deepa Bhattarai",
      admissionNo: "ADM-2024-014",
      status: "present",
      checkInTime: "08:55 AM",
      guardianPhone: "+977 9841234580",
    },
    {
      rollNo: "15",
      studentId: "stu-15",
      studentName: "Karan Pandey",
      admissionNo: "ADM-2024-015",
      status: "present",
      checkInTime: "08:38 AM",
      guardianPhone: "+977 9841234581",
    },
  ],
  "Grade 8 - B": [
    {
      rollNo: "01",
      studentId: "stu-8b-01",
      studentName: "Alina Karki",
      admissionNo: "ADM-2024-021",
      status: "present",
      checkInTime: "08:45 AM",
    },
    {
      rollNo: "02",
      studentId: "stu-8b-02",
      studentName: "Bishal Rayamajhi",
      admissionNo: "ADM-2024-022",
      status: "present",
      checkInTime: "08:50 AM",
    },
    {
      rollNo: "03",
      studentId: "stu-8b-03",
      studentName: "Deepak Silwal",
      admissionNo: "ADM-2024-023",
      status: "absent",
      remarks: "Informed by parent",
    },
  ],
};

export const MOCK_STAFF_ATTENDANCE: StaffAttendanceRecord[] = [
  {
    id: "stf-1",
    staffId: "EMP-101",
    name: "Dr. K.P. Adhikari",
    role: "School Principal",
    department: "Executive Administration",
    status: "present",
    checkInTime: "08:15 AM",
    checkOutTime: "04:30 PM",
  },
  {
    id: "stf-2",
    staffId: "EMP-102",
    name: "Ms. Neha Sharma",
    role: "Senior Math Teacher",
    department: "Mathematics Faculty",
    status: "present",
    checkInTime: "08:30 AM",
  },
  {
    id: "stf-3",
    staffId: "EMP-103",
    name: "Mr. Rohan Singh",
    role: "Science Coordinator",
    department: "General Science Faculty",
    status: "present",
    checkInTime: "08:35 AM",
  },
  {
    id: "stf-4",
    staffId: "EMP-104",
    name: "Ms. Pooja Verma",
    role: "English Teacher",
    department: "Languages Faculty",
    status: "present",
    checkInTime: "08:40 AM",
  },
  {
    id: "stf-5",
    staffId: "EMP-105",
    name: "Mr. Amit Kumar",
    role: "Social Studies Teacher",
    department: "Social Sciences",
    status: "late",
    checkInTime: "09:05 AM",
    remarks: "Informed school office",
  },
  {
    id: "stf-6",
    staffId: "EMP-106",
    name: "Ms. Kavita Joshi",
    role: "Nepali Language Head",
    department: "Languages Faculty",
    status: "absent",
    remarks: "Approved medical leave",
  },
  {
    id: "stf-7",
    staffId: "EMP-107",
    name: "Er. Bikash Thapa",
    role: "IT & Computer Instructor",
    department: "Technology Department",
    status: "present",
    checkInTime: "08:25 AM",
  },
  {
    id: "stf-8",
    staffId: "EMP-108",
    name: "Ms. Sharmila Rai",
    role: "Head Librarian",
    department: "Library & Information",
    status: "present",
    checkInTime: "08:30 AM",
  },
];

export const MOCK_LEAVE_REQUESTS: LeaveRequestRecord[] = [
  {
    id: "lv-1",
    applicantName: "Rohan Mehta",
    applicantRole: "Student",
    classOrDepartment: "Grade 8 - A",
    leaveType: "Sick Leave",
    fromDate: "2025-04-22",
    toDate: "2025-04-24",
    daysCount: 3,
    reason: "Severe viral fever and flu, advised complete bed rest by family physician.",
    status: "approved",
    appliedOn: "2025-04-22",
  },
  {
    id: "lv-2",
    applicantName: "Ms. Kavita Joshi",
    applicantRole: "Staff",
    classOrDepartment: "Languages Faculty",
    leaveType: "Casual Leave",
    fromDate: "2025-04-22",
    toDate: "2025-04-23",
    daysCount: 2,
    reason: "Attending sister's wedding ceremony outside the valley.",
    status: "approved",
    appliedOn: "2025-04-20",
  },
  {
    id: "lv-3",
    applicantName: "Bibek Adhikari",
    applicantRole: "Student",
    classOrDepartment: "Grade 8 - A",
    leaveType: "Study Leave",
    fromDate: "2025-04-22",
    toDate: "2025-04-22",
    daysCount: 1,
    reason: "Representing school at the National Interschool Athletic Meet.",
    status: "approved",
    appliedOn: "2025-04-21",
  },
  {
    id: "lv-4",
    applicantName: "Suman Rawat",
    applicantRole: "Student",
    classOrDepartment: "Grade 8 - A",
    leaveType: "Family Emergency",
    fromDate: "2025-04-23",
    toDate: "2025-04-25",
    daysCount: 3,
    reason: "Urgent family travel to ancestral hometown.",
    status: "pending",
    appliedOn: "2025-04-22",
  },
];

export const MOCK_MONTHLY_ATTENDANCE: MonthlyStudentAttendance[] = (
  MOCK_STUDENT_ATTENDANCE["Grade 8 - A"] || []
).map((student, idx) => {
  const days: Record<number, AttendanceStatus> = {};
  let present = 0;
  let absent = 0;
  let late = 0;

  for (let d = 1; d <= 30; d++) {
    // Sundays: 6, 13, 20, 27
    if (d === 6 || d === 13 || d === 20 || d === 27) {
      days[d] = "weekend";
      continue;
    }
    // Specific student historical pattern
    if (student.rollNo === "03" && (d === 21 || d === 22 || d === 23)) {
      days[d] = "absent";
      absent++;
    } else if (student.rollNo === "05" && (d === 4 || d === 15 || d === 22)) {
      days[d] = "late";
      late++;
    } else if (student.rollNo === "09" && (d === 10 || d === 22)) {
      days[d] = "excused";
      present++;
    } else if (student.rollNo === "13" && (d === 8 || d === 17 || d === 22)) {
      days[d] = "absent";
      absent++;
    } else {
      // Deterministic realistic attendance
      const pseudoHash = (idx * 31 + d * 7) % 100;
      if (pseudoHash > 95) {
        days[d] = "absent";
        absent++;
      } else if (pseudoHash > 88) {
        days[d] = "late";
        late++;
      } else {
        days[d] = "present";
        present++;
      }
    }
  }

  const workingDays = 30 - 4; // 26 working days
  const percentage = Math.round(((present + late * 0.8) / workingDays) * 100);

  return {
    rollNo: student.rollNo,
    studentId: student.studentId,
    studentName: student.studentName,
    days,
    presentCount: present,
    absentCount: absent,
    lateCount: late,
    percentage,
  };
});
