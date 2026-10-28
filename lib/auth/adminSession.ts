import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Core, framework-agnostic admin session cookie: creation + verification.
 *
 * Deliberately has NO dependency on `next/headers` so this module can be
 * imported both from `middleware.ts` (gates `/admin/*` pages) and from
 * Route Handlers (gates `/api/admin/*`) — see `lib/auth/requireAdmin.ts` for
 * the `next/headers`-based wrapper used by Route Handlers / Server
 * Components.
 *
 * Cookie format: `<base64url(JSON payload)>.<base64url(HMAC-SHA256)>`
 * - payload: { sub: "admin", exp: <unix seconds> }
 * - signature: HMAC-SHA256 over the base64url-encoded payload, keyed with
 *   ADMIN_SESSION_SECRET, verified with a timing-safe comparison so an
 *   attacker cannot forge a cookie by probing byte-by-byte timing.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";

/** Session lifetime: ~8 hours, matching the brief. */
export const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;

export type AdminSessionPayload = {
  sub: "admin";
  exp: number;
};

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set; cannot sign/verify admin sessions.");
  }
  return secret;
}

function sign(payloadB64: string): string {
  return createHmac("sha256", getSessionSecret()).update(payloadB64).digest("base64url");
}

/** Builds a fresh, signed session cookie value for a successful login. */
export function createAdminSessionCookieValue(): string {
  const payload: AdminSessionPayload = {
    sub: "admin",
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}

/**
 * Verifies a session cookie value: checks the HMAC signature (timing-safe)
 * and that the session has not expired. Returns the decoded payload on
 * success, or `null` for any failure (missing cookie, malformed value, bad
 * signature, expired session) — callers only ever need the yes/no answer.
 */
export function verifyAdminSessionCookie(value: string | undefined | null): AdminSessionPayload | null {
  if (!value) return null;

  const dot = value.indexOf(".");
  if (dot < 1 || dot === value.length - 1) return null;

  const payloadB64 = value.slice(0, dot);
  const signatureB64 = value.slice(dot + 1);

  let expectedSigBuf: Buffer;
  let actualSigBuf: Buffer;
  try {
    expectedSigBuf = Buffer.from(sign(payloadB64), "base64url");
    actualSigBuf = Buffer.from(signatureB64, "base64url");
  } catch {
    return null;
  }

  if (expectedSigBuf.length !== actualSigBuf.length) return null;
  if (!timingSafeEqual(expectedSigBuf, actualSigBuf)) return null;

  let payload: AdminSessionPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (payload.sub !== "admin" || typeof payload.exp !== "number") return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload;
}

/**
 * Timing-safe equality for short secret-ish strings (e.g. the submitted
 * username against ADMIN_USERNAME). Unequal lengths are treated as a
 * mismatch without ever calling `timingSafeEqual` on buffers of different
 * sizes (it throws in that case).
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}
