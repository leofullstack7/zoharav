import type { Localized } from "@/content/types";

export function loc(value: Localized, locale: string): string {
  return locale === "es" ? value.es : value.en;
}

export function isFilled(value: string | undefined | null): value is string {
  return Boolean(value && value.trim().length > 0);
}

/**
 * Splits a localized long-form string on blank lines into paragraphs, for
 * fields (like SubService.body) that are written as one string but are
 * meant to render as several <p> elements. A single-paragraph value just
 * comes back as a one-item array, so callers can map() unconditionally.
 */
export function locParagraphs(value: Localized, locale: string): string[] {
  return loc(value, locale)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
