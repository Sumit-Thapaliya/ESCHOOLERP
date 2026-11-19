import { StaffDetailRouteView } from "@/components/staff/staff-detail-route-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Staff Profile | Baudhika ERP",
};

export default async function RootStaffDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <StaffDetailRouteView staffId={id} backHref="/staff" />;
}
