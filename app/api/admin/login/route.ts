import { scryptSync, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionCookieValue,
  timingSafeEqualString,
} from "@/lib/auth/adminSession";

/**
 * Admin login. Reads ADMIN_USERNAME / ADMIN_PASSWORD_HASH from the
 * environment only — credentials are never hardcoded, never logged.
 *
 * Request body (JSON): { username: string; password: string }
 *
 * Responses:
 * - 200 { ok: true }                     — credentials valid, session cookie set
 * - 400 { error: string }                — malformed request body
 * - 401 { error: string }                — invalid credentials (generic — never
 *                                           reveals whether username or password
 *                                           was the problem)
 * - 500 { error: string }                — server misconfiguration (e.g. missing
 *                                           env vars) or unexpected error
 *
 * Password verification: ADMIN_PASSWORD_HASH is `salt:hashHex`, where
 * hashHex is `crypto.scryptSync(password, salt, 64)` hex-encoded. On login we
 * recompute scrypt over the submitted password with the stored salt and
 * compare the two 64-byte digests with `crypto.timingSafeEqual` — never a
 * plain `===` string compare — so response timing can't leak how many
 * leading bytes matched.
 */

const GENERIC_INVALID_CREDENTIALS = { error: "Credenciales inválidas." };

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  const username =
    typeof body === "object" && body !== null && "username" in body && typeof body.username === "string"
      ? body.username
      : "";
  const password =
    typeof body === "object" && body !== null && "password" in body && typeof body.password === "string"
      ? body.password
      : "";

  if (!username || !password) {
    return NextResponse.json(GENERIC_INVALID_CREDENTIALS, { status: 401 });
  }

  const expectedUsername = process.env.ADMIN_USERNAME;
  const passwordHashEnv = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedUsername || !passwordHashEnv) {
    console.error("Admin login misconfigured: ADMIN_USERNAME or ADMIN_PASSWORD_HASH is not set.");
    return NextResponse.json({ error: "El panel de administración no está configurado." }, { status: 500 });
  }

  const sepIndex = passwordHashEnv.indexOf(":");
  if (sepIndex < 1) {
    console.error("Admin login misconfigured: ADMIN_PASSWORD_HASH is not in 'salt:hash' format.");
    return NextResponse.json({ error: "El panel de administración no está configurado." }, { status: 500 });
  }
  const salt = passwordHashEnv.slice(0, sepIndex);
  const storedHashHex = passwordHashEnv.slice(sepIndex + 1);

  // Always run both checks (don't short-circuit on the username) so a
  // failed-username request takes roughly the same time as a
  // failed-password one — and always return the same generic error either
  // way.
  const usernameOk = timingSafeEqualString(username, expectedUsername);

  let passwordOk = false;
  try {
    const storedHash = Buffer.from(storedHashHex, "hex");
    const computedHash = scryptSync(password, salt, 64);
    passwordOk = storedHash.length === computedHash.length && timingSafeEqual(storedHash, computedHash);
  } catch (err) {
    console.error("Error verifying admin password:", err);
    passwordOk = false;
  }

  if (!usernameOk || !passwordOk) {
    return NextResponse.json(GENERIC_INVALID_CREDENTIALS, { status: 401 });
  }

  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionCookieValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
  return response;
}
