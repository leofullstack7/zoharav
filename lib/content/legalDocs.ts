import fs from "node:fs";
import path from "node:path";

/**
 * The four legal documents authored as MDX source under content/legal/<locale>/<id>.mdx.
 * Rendered by app/[locale]/(site)/legal/[doc]/page.tsx.
 */
export const legalDocIds = ["privacy", "terms", "refund", "damage"] as const;
export type LegalDocId = (typeof legalDocIds)[number];

export function isLegalDocId(value: string): value is LegalDocId {
  return (legalDocIds as readonly string[]).includes(value);
}

type LegalFrontmatter = {
  title: string;
  locale: string;
  effective?: string;
};

export type LegalDoc = {
  id: LegalDocId;
  frontmatter: LegalFrontmatter;
  /** Markdown body with frontmatter and the leading H1 stripped (the page hero shows the title). */
  body: string;
};

function parseFrontmatter(raw: string): { frontmatter: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { frontmatter: {}, body: raw };

  const frontmatter: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    frontmatter[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }

  return { frontmatter, body: raw.slice(match[0].length) };
}

export function getLegalDoc(id: LegalDocId, locale: string): LegalDoc {
  const safeLocale = locale === "es" ? "es" : "en";
  const filePath = path.join(process.cwd(), "content", "legal", safeLocale, `${id}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { frontmatter, body } = parseFrontmatter(raw);

  // The MDX source leads with a level-1 heading that restates the title; the page
  // hero already renders that title, so drop it to avoid showing it twice.
  const withoutHeading = body.replace(/^\s*#\s+.+(\r?\n|$)/, "");

  return {
    id,
    frontmatter: {
      title: frontmatter.title ?? id,
      locale: frontmatter.locale ?? safeLocale,
      effective: frontmatter.effective,
    },
    body: withoutHeading,
  };
}
