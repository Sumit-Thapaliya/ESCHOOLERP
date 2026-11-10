/**
 * Which school is the browser looking at right now?
 *
 * Two URL shapes reach the same pages:
 *   subdomain  sunrise.localhost:3000/login   (proxy.ts rewrites these)
 *   path       localhost:3000/t/sunrise/login (direct navigation, dev, previews)
 *
 * Callers should never have to know which one they got, so both are handled here.
 * The backend expects the slug in the `x-tenant-id` header on every /auth/* and
 * /users/* call - despite the header name, the value is the SLUG, not a UUID.
 */

/** Must stay in sync with RESERVED in src/proxy.ts. */
const RESERVED = new Set(["www", "app", "api", "admin"]);

export function rootDomain(): string {
  return (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000").split(":")[0];
}

function normalise(slug: string): string | null {
  const s = slug.trim().toLowerCase();
  if (!s || s.includes(".") || RESERVED.has(s)) return null;
  return s;
}

/** Client-only. Returns null on the server and on the marketing (root) domain. */
export function currentTenantSlug(): string | null {
  if (typeof window === "undefined") return null;

  const fromPath = window.location.pathname.match(/^\/t\/([^/]+)/);
  if (fromPath) return normalise(fromPath[1]);

  const host = window.location.hostname;
  const root = rootDomain();
  if (host === root || !host.endsWith(`.${root}`)) return null;
  return normalise(host.slice(0, -(root.length + 1)));
}

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/**
 * Backend rules: 3-30 chars, lowercase letters/digits/hyphens, no leading,
 * trailing or double hyphen, and not a reserved word. Used to validate a slug
 * before it is interpolated into an x-tenant-id header.
 */
export function isValidSlug(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const s = value.trim().toLowerCase();
  return (
    s.length >= 3 &&
    s.length <= 30 &&
    SLUG_RE.test(s) &&
    !s.includes("--") &&
    !RESERVED.has(s)
  );
}

/** True when the school is being reached via its own subdomain. */
export function isSubdomainAccess(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  const root = rootDomain();
  return host !== root && host.endsWith(`.${root}`);
}

/**
 * Where a school page actually lives, given how the user arrived.
 *
 * proxy.ts rewrites `sunrise.localhost:3000/x` to `/t/sunrise/x`, so on a
 * subdomain you must navigate to `/x` - navigating to `/t/sunrise/x` would be
 * rewritten again into `/t/sunrise/t/sunrise/x` and 404. On the root domain
 * (path-based access, used in dev) it is the other way round.
 */
export function schoolPath(slug: string, path: string): string {
  return isSubdomainAccess() ? path : `/t/${slug}${path}`;
}
