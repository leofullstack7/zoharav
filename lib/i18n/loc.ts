import type { Localized } from "@/content/types";

export function loc(value: Localized, locale: string): string {
  return locale === "es" ? value.es : value.en;
}

export function isFilled(value: string | undefined | null): value is string {
  return Boolean(value && value.trim().length > 0);
}
