import { RequireAuth } from "@/components/auth/require-auth";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth plane="platform">{children}</RequireAuth>;
}
