import type {
  KpiMetric,
  BranchMetric,
  ExceptionAlert,
  RecentActivity,
  AttendanceDataPoint,
  FeeCategoryBreakdown,
} from "./dashboard-types";

export const MOCK_KPIS: KpiMetric[] = [
  {
    id: "students",
    title: "Total students",
    value: "2,845",
    subtitle: "Enrolled across 12 grades",
    trend: {
      direction: "up",
      value: "+3.4%",
      label: "vs last academic term",
    },
    breakdown: [
      { label: "Girls", count: "1,420" },
      { label: "Boys", count: "1,425" },
    ],
  },
  {
    id: "staff",
    title: "Staff on duty",
    value: "186 / 192",
    subtitle: "96.8% active attendance",
    trend: {
      direction: "neutral",
      value: "6 on leave",
      label: "4 planned, 2 medical",
    },
    breakdown: [
      { label: "Teaching", count: "142" },
      { label: "Admin & Support", count: "44" },
    ],
  },
  {
    id: "attendance",
    title: "Attendance today",
    value: "94.2%",
    subtitle: "2,680 students present",
    trend: {
      direction: "up",
      value: "+1.8%",
      label: "compared to yesterday",
    },
    progress: {
      current: 94.2,
      target: 95.0,
      formatted: "Target: 95.0%",
    },
  },
  {
    id: "fees",
    title: "Fees collected (MTD)",
    value: "NPR 8,450,000",
    subtitle: "82% of monthly target (NPR 10.3M)",
    trend: {
      direction: "up",
      value: "NPR 1,850,000",
      label: "due before month end",
    },
    progress: {
      current: 82,
      target: 100,
      formatted: "82% collected",
    },
  },
  {
    id: "tasks",
    title: "Pending tasks & approvals",
    value: "14",
    subtitle: "Requires executive action",
    trend: {
      direction: "down",
      value: "-4",
      label: "cleared in last 24h",
    },
    breakdown: [
      { label: "Fee waivers", count: "5" },
      { label: "Staff leaves", count: "6" },
      { label: "Marks audit", count: "3" },
    ],
  },
];

export const MOCK_BRANCHES: BranchMetric[] = [
  {
    id: "br-main",
    name: "Main Campus",
    code: "KTM-01",
    city: "Kathmandu (Baneshwor)",
    isMainCampus: true,
    totalStudents: 1540,
    totalStaff: 102,
    attendanceTodayPct: 95.4,
    feeCollectionPct: 86.2,
    monthlyCollectionNpr: "NPR 4,820,000",
    status: "Optimal",
    sparkline: [91, 92, 94, 93, 95, 94, 95.4],
  },
  {
    id: "br-city",
    name: "City Wing",
    code: "LAL-02",
    city: "Lalitpur (Kupondole)",
    totalStudents: 820,
    totalStaff: 56,
    attendanceTodayPct: 93.8,
    feeCollectionPct: 79.5,
    monthlyCollectionNpr: "NPR 2,430,000",
    status: "Attention needed",
    sparkline: [88, 89, 90, 92, 91, 93, 93.8],
  },
  {
    id: "br-west",
    name: "West Campus",
    code: "PKR-03",
    city: "Pokhara (Lakeside)",
    totalStudents: 485,
    totalStaff: 34,
    attendanceTodayPct: 91.6,
    feeCollectionPct: 74.0,
    monthlyCollectionNpr: "NPR 1,200,000",
    status: "Attention needed",
    sparkline: [85, 87, 88, 89, 90, 91, 91.6],
  },
];

export const MOCK_ALERTS: ExceptionAlert[] = [
  {
    id: "alt-1",
    category: "finance",
    severity: "high",
    title: "Grade 10 term dues pending",
    description: "42 students have unpaid second quarter installments overdue by 14 days.",
    timestamp: "25m ago",
    recordId: "REC-FIN-2026-89",
    isRead: false,
    actionLabel: "Review ledger",
  },
  {
    id: "alt-2",
    category: "attendance",
    severity: "medium",
    title: "Grade 8-B attendance drop",
    description: "Daily attendance dropped to 81.4% today due to seasonal transit delays.",
    timestamp: "1h ago",
    recordId: "ATT-G8B-2026",
    isRead: false,
    actionLabel: "View roster",
  },
  {
    id: "alt-3",
    category: "approvals",
    severity: "high",
    title: "5 Merit scholarship waivers",
    description: "Awaiting Principal approval for high school merit fee concessions totaling NPR 145,000.",
    timestamp: "2h ago",
    recordId: "APP-WAV-104",
    isRead: false,
    actionLabel: "Approve waivers",
  },
  {
    id: "alt-4",
    category: "academic",
    severity: "low",
    title: "Term 1 exam marks entry finalized",
    description: "Science department marks verified and signed off for Grades 9 through 12.",
    timestamp: "4h ago",
    recordId: "EXM-T1-VER",
    isRead: true,
    actionLabel: "Open report",
  },
  {
    id: "alt-5",
    category: "finance",
    severity: "medium",
    title: "Transport route #4 fuel variance",
    description: "Monthly fuel billing reported 18% variance above standard route estimate.",
    timestamp: "5h ago",
    recordId: "LOG-BUS-04",
    isRead: true,
    actionLabel: "Inspect log",
  },
];

export const MOCK_ACTIVITY: RecentActivity[] = [
  {
    id: "act-1",
    user: {
      name: "Sita Sharma",
      role: "Accountant",
    },
    action: "recorded fee payment of NPR 48,500",
    target: "Student: Aarav Pradhan (Grade 7-A)",
    timestamp: "12m ago",
    badge: "Receipt #40291",
  },
  {
    id: "act-2",
    user: {
      name: "Ramesh Bhattarai",
      role: "Teacher / Grade Head",
    },
    action: "submitted daily attendance record",
    target: "Grade 11 Science (44 present, 2 absent)",
    timestamp: "45m ago",
  },
  {
    id: "act-3",
    user: {
      name: "Dr. K.P. Adhikari",
      role: "Principal",
    },
    action: "approved leave request",
    target: "Sunil Thapa (Mathematics, 2 days)",
    timestamp: "1h ago",
    badge: "Medical Leave",
  },
  {
    id: "act-4",
    user: {
      name: "Bikash Shrestha",
      role: "Admissions Officer",
    },
    action: "issued enrollment confirmation",
    target: "Pooja Gurung (Grade 1 admission)",
    timestamp: "3h ago",
    badge: "Adm #2026-408",
  },
];

export const MOCK_ATTENDANCE_TREND: AttendanceDataPoint[] = [
  { day: "Mon", primary: 96, middle: 94, secondary: 93, average: 94.3 },
  { day: "Tue", primary: 97, middle: 95, secondary: 92, average: 94.6 },
  { day: "Wed", primary: 95, middle: 93, secondary: 91, average: 93.0 },
  { day: "Thu", primary: 96, middle: 95, secondary: 94, average: 95.0 },
  { day: "Fri", primary: 94, middle: 92, secondary: 90, average: 92.0 },
  { day: "Today", primary: 96, middle: 94, secondary: 93, average: 94.2 },
];

export const MOCK_FEE_BREAKDOWN: FeeCategoryBreakdown[] = [
  {
    category: "Tuition fees",
    collectedNpr: 5200000,
    targetNpr: 6000000,
    percentage: 86.6,
    color: "#2570D3",
  },
  {
    category: "Transport service",
    collectedNpr: 1800000,
    targetNpr: 2300000,
    percentage: 78.2,
    color: "#1F9D6B",
  },
  {
    category: "Laboratory & library",
    collectedNpr: 950000,
    targetNpr: 1200000,
    percentage: 79.1,
    color: "#E69A2E",
  },
  {
    category: "Extracurricular & sports",
    collectedNpr: 500000,
    targetNpr: 800000,
    percentage: 62.5,
    color: "#8B5CF6",
  },
];

export const MOCK_BRANCHES_LIST = [
  { id: "all", name: "All campuses (consolidated)", city: "Nepal" },
  { id: "ktm", name: "Main Campus", city: "Kathmandu (Baneshwor)" },
  { id: "lal", name: "City Wing", city: "Lalitpur (Kupondole)" },
  { id: "pkr", name: "West Campus", city: "Pokhara (Lakeside)" },
];
