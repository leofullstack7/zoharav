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
      <section className="panel">
        {insights.length > 0 ? (
          <div className="cards-2">
            {insights.map((insight, index) => (
              <Reveal delay={index * 70} key={insight.slug}>
                <article className="soft-card insight-card">
                  <p className="kicker">{insight.frontmatter.category}</p>
                  <h3>{insight.frontmatter.title}</h3>
                  <p className="excerpt">{insight.excerpt}</p>
                  <Link className="text-link" href={`/insights/${insight.slug}`}>
                    {es ? "Leer más" : "Read more"} →
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="insight-empty">
              <p className="kicker">{es ? "En revisión" : "In review"}</p>
              <h2>{es ? "Los próximos ensayos están en camino" : "The next essays are on their way"}</h2>
              <p>
                {es
                  ? "Cada artículo pasa por la aprobación del cliente antes de publicarse, así que esta página se mantiene deliberadamente en blanco hasta entonces. Mientras tanto, puede conocer a la firma y a nuestras líneas de asesoría en las páginas de la firma y los sectores."
                  : "Every essay clears client approval before it is published, so this page stays deliberately quiet until then. In the meantime, the firm and our advisory lines are covered on the About and Sectors pages."}
              </p>
            </div>
          </Reveal>
        )}
      </section>
    </main>
  );
}
