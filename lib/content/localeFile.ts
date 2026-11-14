import fs from "node:fs";
import path from "node:path";

const MDX_LOCALES = ["en", "es", "ar"] as const;
export type MdxLocale = (typeof MDX_LOCALES)[number];

export function resolveMdxLocale(locale: string): MdxLocale {
  if (locale === "es") return "es";
  if (locale === "ar") return "ar";
  return "en";
}

/** Picks the best on-disk MDX locale, falling back to English when Arabic is not authored yet. */
export function mdxFilePath(baseDir: string, fileName: string, locale: string): string {
  const preferred = resolveMdxLocale(locale);
  const order: MdxLocale[] =
    preferred === "en" ? ["en"] : preferred === "es" ? ["es", "en"] : ["ar", "en"];
  for (const loc of order) {
    const candidate = path.join(baseDir, loc, fileName);
    if (fs.existsSync(candidate)) return candidate;
  }
  return path.join(baseDir, "en", fileName);
}