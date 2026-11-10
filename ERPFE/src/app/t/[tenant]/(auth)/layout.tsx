import { AuthBackground } from "@/components/auth/auth-background";
import { ThemeToggler } from "@/components/shared/theme-switcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-10">
      <AuthBackground />

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <ThemeToggler />
      </div>

      <div className="relative z-10 w-full max-w-107.5">{children}</div>
    </div>
  );
}