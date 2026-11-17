import { SchoolDetailsRoute } from "@/components/super-admin-dashboard/sections/school-details";

export const instant = false;

export default async function SchoolDetailsPage({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  const { schoolId } = await params;
  return <SchoolDetailsRoute schoolId={schoolId} />;
}
