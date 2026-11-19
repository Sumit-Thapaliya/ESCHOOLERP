import { StudentDetailRouteView } from "@/components/students/student-detail-route-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RootStudentDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <StudentDetailRouteView studentId={id} backHref="/students" />;
}
