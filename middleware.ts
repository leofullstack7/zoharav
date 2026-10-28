import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/auth/adminSession";

// Admin session verification uses node:crypto (createHmac, timingSafeEqual),
// which isn't available on the default Edge runtime — run this middleware
// on the Node.js runtime instead (stable since Next.js 15.2).
export const runtime = "nodejs";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // `/admin/*` is a standalone, non-locale-prefixed tool (see app/admin/) —
  // branch out early so next-intl never tries to rewrite/redirect it for
  // locale, and gate it on a valid admin session instead. `/admin/login`
  // itself must stay reachable without a session, or no one could ever log
  // in.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const session = verifyAdminSessionCookie(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
