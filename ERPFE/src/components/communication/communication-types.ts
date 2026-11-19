export type NoticeCategory = "Academic" | "Holiday" | "Examination" | "Sports" | "Administrative" | "Emergency";
export type TargetAudience = "All School" | "All Parents" | "All Teachers" | "Grade 8 - A" | "Grade 10" | "Grade 11 & 12";

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  audience: TargetAudience;
  publishedBy: string;
  publishDate: string;
  isPinned: boolean;
  hasAttachment?: boolean;
  attachmentName?: string;
  viewsCount: number;
}

export interface BroadcastLog {
  id: string;
  campaignTitle: string;
  channel: "SMS" | "App Push Notification" | "Email Broadcast";
  targetGroup: string;
  recipientCount: number;
  sentDate: string;
  deliveredPct: number;
  status: "Delivered" | "Queued" | "Failed";
}
