import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getInsight, getPublishedSlugs } from "@/lib/content/insights";
import { renderLegalMarkdown } from "@/lib/content/renderLegalMarkdown";
import { buildPageMetadata, trimCopy } from "@/lib/seo";

export function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const insight = getInsight(slug, locale);
  if (!insight) return {};

  return buildPageMetadata({
    locale,
    path: `/insights/${slug}`,
    title: insight.frontmatter.title,
    description: trimCopy(insight.excerpt),
  });
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const insight = getInsight(slug, locale);
  if (!insight) notFound();

  return (
    <main id="content">
      <section className="page-hero">
        <Image src="/images/offices/medellin.svg" alt="" fill priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">{insight.frontmatter.category}</p>
          <h1>{insight.frontmatter.title}</h1>
        </div>
      </section>
      <section className="panel">
        <div className="legal-doc">{renderLegalMarkdown(insight.body)}</div>
        <div className="hero-actions">
          <Link className="btn-gold" href="/insights">
            {locale === "es" ? "Volver a Perspectivas" : "Back to Insights"} →
          </Link>
        </div>
      </section>
    </main>
  );
}
