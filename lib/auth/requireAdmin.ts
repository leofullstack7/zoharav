import "server-only";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionCookie,
  type AdminSessionPayload,
} from "@/lib/auth/adminSession";

/**
 * Route Handler / Server Component helper: reads the admin session cookie
 * via `next/headers` and verifies it. Returns the decoded payload when the
 * caller holds a valid session, or `null` otherwise.
 *
 * `middleware.ts` already redirects unauthenticated requests away from
 * `/admin/*` pages, but every `/api/admin/*` Route Handler must call this
 * itself (middleware's matcher excludes `/api/**`, matching the rest of the
 * app's API routes) and return 401 when it's `null` — see any route under
 * `app/api/admin/`.
 */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const store = await cookies();
  return verifyAdminSessionCookie(store.get(ADMIN_SESSION_COOKIE)?.value);
}
