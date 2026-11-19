import { StaffDetailRouteView } from "@/components/staff/staff-detail-route-view";

interface PageProps {
  params: Promise<{ tenant: string; id: string }>;
}

export const metadata = {
  title: "Staff Profile | Baudhika ERP",
};

export default async function TenantStaffDetailPage({ params }: PageProps) {
  const { tenant, id } = await params;
  return <StaffDetailRouteView staffId={id} backHref={`/t/${tenant}/staff`} />;
}
