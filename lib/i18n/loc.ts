import type { Localized } from "@/content/types";
import arCatalog from "@/content/translations/ar-catalog.json";

const catalog = arCatalog as Record<string, string>;

export function loc(value: Localized, locale: string): string {
  if (locale === "es") return value.es;
  if (locale === "ar") {
    const keyed = catalog[value.en];
    if (keyed !== undefined && keyed !== "") return keyed;
    return value.en;
  }
  return value.en;
}

export function isFilled(value: string | undefined | null): value is string {
  return Boolean(value && value.trim().length > 0);
}

export function locParagraphs(value: Localized, locale: string): string[] {
  return loc(value, locale)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}