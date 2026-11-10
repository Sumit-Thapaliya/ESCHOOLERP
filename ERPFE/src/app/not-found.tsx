import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background p-8 text-center text-foreground">
      <p className="text-6xl font-semibold text-primary">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This school portal or page doesn&apos;t exist. Check the address and try again.
      </p>
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        Go to home
      </Link>
    </main>
  );
}