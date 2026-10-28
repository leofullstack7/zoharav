import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/adminSession";

/** Clears the admin session cookie. No auth check needed — logging out an
 *  already-unauthenticated caller is a harmless no-op. */
export async function POST() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
