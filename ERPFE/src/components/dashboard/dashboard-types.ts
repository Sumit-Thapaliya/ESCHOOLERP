export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  trend: {
    direction: "up" | "down" | "neutral";
    value: string;
    label: string;
  };
  breakdown?: { label: string; count: string }[];
  progress?: {
    current: number;
    target: number;
    formatted: string;
  };
}

export interface BranchMetric {
  id: string;
  name: string;
  code: string;
  city: string;
  isMainCampus?: boolean;
  totalStudents: number;
  totalStaff: number;
  attendanceTodayPct: number;
  feeCollectionPct: number;
  monthlyCollectionNpr: string;
  status: "Optimal" | "Attention needed" | "Critical";
  sparkline: number[];
}

export interface ExceptionAlert {
  id: string;
  category: "finance" | "attendance" | "approvals" | "academic";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  timestamp: string;
  recordId?: string;
  isRead: boolean;
  actionLabel?: string;
}

export interface RecentActivity {
  id: string;
  user: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  badge?: string;
}

export interface AttendanceDataPoint {
  day: string;
  primary: number;
  middle: number;
  secondary: number;
  average: number;
}

export interface FeeCategoryBreakdown {
  category: string;
  collectedNpr: number;
  targetNpr: number;
  percentage: number;
  color: string;
}
