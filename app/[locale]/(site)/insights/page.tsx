import type { Metadata } from "next";
import { ArtOverPhoto } from "@/components/site/ArtOverPhoto";
import { setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import { getPublishedInsights } from "@/lib/content/insights";
import { getSiteImagePhoto } from "@/lib/images/getSiteImage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const es = locale === "es";
  return buildPageMetadata({
    locale,
    path: "/insights",
    title: es ? "Perspectivas" : "Insights",
    description: es
      ? "Tres ensayos esperan la aprobación del cliente antes de publicarse."
      : "Three essays are waiting for client approval before they are published.",
  });
}

export default async function InsightsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const insights = getPublishedInsights(locale);
  const heroPhoto = await getSiteImagePhoto("insights.hero");

  return (
    <main id="content">
      <section className="page-hero">
        <ArtOverPhoto photoUrl={heroPhoto} artSrc="/images/offices/medellin.svg" priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">{es ? "Borradores" : "Drafts"}</p>
          <h1>{es ? "Perspectivas" : "Insights"}</h1>
          <p className="hero-lede">
            {es
              ? "Tres ensayos esperan la aprobación del cliente antes de publicarse."
              : "Three essays are waiting for client approval before they are published."}
          </p>
        </div>
      </section>
      {insights.length > 0 ? (
        <section className="panel">
          <div className="cards-2">
            {insights.map((insight, index) => (
              <Reveal delay={index * 70} key={insight.slug}>
                <article className="soft-card">
                  <p className="kicker">{insight.frontmatter.category}</p>
                  <h3>{insight.frontmatter.title}</h3>
                  <p>{insight.excerpt}</p>
                  <Link href={`/insights/${insight.slug}`}>
                    {es ? "Leer más" : "Read more"} →
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
