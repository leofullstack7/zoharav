import { getImageSlot } from "./slots";

const ALT_MAX = 280;

export function sanitizeAltText(value: string, fallback: string): string {
  const trimmed = value.trim().replace(/\s+/g, " ");
  const base = trimmed.length >= 4 ? trimmed : fallback;
  return base.slice(0, ALT_MAX);
}

export function defaultAltForSlot(slotKey: string): string {
  return getImageSlot(slotKey)?.label ?? "Imagen de Zoharav";
}

export function resolveAltText(slotKey: string, stored: string | null | undefined): string {
  const fallback = defaultAltForSlot(slotKey);
  if (stored?.trim()) return sanitizeAltText(stored, fallback);
  return fallback;
}