import { routing, type AppLocale } from "@/i18n/routing";

export const localeLabels: Record<AppLocale, string> = {
  en: "English",
  es: "Español",
  ar: "العربية",
};

export const localeShort: Record<AppLocale, string> = {
  en: "EN",
  es: "ES",
  ar: "ع",
};

export function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

export function isRtl(locale: string): boolean {
  return locale === "ar";
}

/** BCP 47 tag for Intl formatters (dates, numbers). */
export function intlBcp47(locale: string): string {
  if (locale === "es") return "es-CO";
  if (locale === "ar") return "ar-u-nu-latn";
  return "en-US";
}

export function openGraphLocale(locale: string): string {
  if (locale === "es") return "es_ES";
  if (locale === "ar") return "ar_SA";
  return "en_US";
}