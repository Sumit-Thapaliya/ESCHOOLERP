import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
const RESERVED = new Set(["www", "app", "api", "admin"]);

function getTenantSlug(host: string): string | null {
  const hostname = host.split(":")[0];
  const root = ROOT_DOMAIN.split(":")[0];

  if (hostname === root || !hostname.endsWith(`.${root}`)) return null;

  const sub = hostname.slice(0, -(root.length + 1));
  if (!sub || sub.includes(".") || RESERVED.has(sub)) return null;
  return sub;
}

export function proxy(req: NextRequest) {
  const slug = getTenantSlug(req.headers.get("host") ?? "");
  const { pathname } = req.nextUrl;

  // Root domain: the marketing site, plus PATH-BASED school access
  // (/t/<slug>/students/...). Those paths are what schoolPath() builds, and
  // every preview or local deploy runs on a root domain with no subdomain -
  // rewriting them to /404 is what turned "click a student" into a dead end.
  // An unknown or inactive school is still refused by
  // src/app/t/[tenant]/layout.tsx, which calls notFound() itself.
  if (!slug) return NextResponse.next();

  // Tenant subdomain: rewrite to /t/<slug>/<path>
  const url = req.nextUrl.clone();
  url.pathname = `/t/${slug}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};