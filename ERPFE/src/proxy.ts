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

  // Root domain: marketing site. Block direct access to internal tenant routes.
  if (!slug) {
    if (pathname.startsWith("/t/")) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }
    return NextResponse.next();
  }

  // Tenant subdomain: rewrite to /t/<slug>/<path>
  const url = req.nextUrl.clone();
  url.pathname = `/t/${slug}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};