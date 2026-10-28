import fs from "node:fs";
import path from "node:path";

/**
 * Loads the editorial essays authored as MDX source under content/insights/<slug>.<locale>.mdx.
 * Rendered by app/[locale]/(site)/insights/page.tsx (index) and
 * app/[locale]/(site)/insights/[slug]/page.tsx (full article), reusing the same
 * markdown-to-JSX renderer already built for the legal documents
 * (lib/content/renderLegalMarkdown.tsx) rather than adding a second MDX pipeline.
 */

type InsightFrontmatter = {
  title: string;
  slug: string;
  locale: string;
  category: string;
  /** Essays stay unpublished (hidden from the index and from generateStaticParams) until draft is false. */
  draft: boolean;
};

export type Insight = {
  slug: string;
  frontmatter: InsightFrontmatter;
  /** Markdown body with frontmatter stripped. */
  body: string;
  /** First body paragraph, for cards and meta descriptions. */
  excerpt: string;
};

const INSIGHTS_DIR = path.join(process.cwd(), "content", "insights");

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

function listSlugs(): string[] {
  if (!fs.existsSync(INSIGHTS_DIR)) return [];
  const slugs = new Set<string>();
  for (const file of fs.readdirSync(INSIGHTS_DIR)) {
    const match = file.match(/^(.+)\.(en|es)\.mdx$/);
    if (match) slugs.add(match[1]);
  }
  return [...slugs];
}

function readInsight(slug: string, locale: string): Insight | undefined {
  const safeLocale = locale === "es" ? "es" : "en";
  const filePath = path.join(INSIGHTS_DIR, `${slug}.${safeLocale}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf8");
  const { frontmatter, body } = parseFrontmatter(raw);
  const trimmedBody = body.trim();
  const excerpt = trimmedBody.split(/\r?\n\s*\r?\n/)[0]?.trim() ?? "";

  return {
    slug,
    frontmatter: {
      title: frontmatter.title ?? slug,
      slug: frontmatter.slug ?? slug,
      locale: frontmatter.locale ?? safeLocale,
      category: frontmatter.category ?? "",
      draft: frontmatter.draft === "true",
    },
    body: trimmedBody,
    excerpt,
  };
}

/** All essays for a locale, drafts included — for authoring/internal use only. */
export function getAllInsights(locale: string): Insight[] {
  return listSlugs()
    .map((slug) => readInsight(slug, locale))
    .filter((insight): insight is Insight => Boolean(insight));
}

/** Essays cleared for public display (draft: false). Empty until the client approves copy. */
export function getPublishedInsights(locale: string): Insight[] {
  return getAllInsights(locale).filter((insight) => !insight.frontmatter.draft);
}

export function getInsight(slug: string, locale: string): Insight | undefined {
  const insight = readInsight(slug, locale);
  return insight && !insight.frontmatter.draft ? insight : undefined;
}

export function getPublishedSlugs(): string[] {
  return getPublishedInsights("en").map((insight) => insight.slug);
}
