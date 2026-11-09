/**
 * Shared field rules for public (and admin) JSON bodies. Kept free of
 * Next/server imports so the same helpers can be unit-tested with node:test.
 */

export const FIELD_LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  topic: 280,
  company: 160,
  message: 4000,
  category: 120,
  botName: 80,
  adminText: 8000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
}

/** Removes CR/LF so a field cannot split SMTP headers or subjects. */
export function oneLine(value: string): string {
  return stripControlChars(value).replace(/[\r\n]+/g, " ").trim();
}

export function clip(value: string, max: number): string {
  return value.length <= max ? value : value.slice(0, max);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidEmail(value: string): boolean {
  if (value.length > FIELD_LIMITS.email) return false;
  if (value.includes("\n") || value.includes("\r")) return false;
  return EMAIL_RE.test(value);
}

export function readBoundedString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return clip(oneLine(value), max);
}

export function readBoundedMultiline(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return clip(stripControlChars(value).trim(), max);
}
