import type { Metadata } from "next";
import { ArtOverPhoto } from "@/components/site/ArtOverPhoto";
import { Reveal } from "@/components/motion/Reveal";
import { getOffer, services } from "@/content/services";
import { Link } from "@/i18n/navigation";
import { loc, locParagraphs } from "@/lib/i18n/loc";
import { getSiteImagePhoto } from "@/lib/images/getSiteImage";
import { buildPageMetadata, trimCopy } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

// Every sub-service across all six lines gets a real, dedicated page —
// generateStaticParams enumerates {slug, item} for all of them (the parent
// [locale] layout's own generateStaticParams supplies the locale half of
// the combination, same pattern as /services/[slug]). Richness of the
// rendered content still comes entirely from content/lines/*.ts: the
// flagship sub-service (decarbonization-esg) has expanded body/bullets,
// the rest render through this same template with their existing (shorter)
// copy, by design — see the task notes in content/lines/energy-transition.ts.
export function generateStaticParams() {
  return services.flatMap((service) =>
    service.subServices.map((sub) => ({ slug: service.slug, item: sub.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; item: string }>;
}): Promise<Metadata> {
  const { locale, slug, item } = await params;
  const offer = getOffer(slug, item);
  if (!offer) return {};
  const { service, subService } = offer;

  return buildPageMetadata({
    locale,
    path: `/services/${slug}/${item}`,
    title: `${loc(subService.title, locale)} · ${loc(service.name, locale)}`,
    description: trimCopy(loc(subService.body, locale)),
    image: service.image,
  });
}

export default async function SubServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; item: string }>;
}) {
  const { locale, slug, item } = await params;
  setRequestLocale(locale);
  const offer = getOffer(slug, item);
  if (!offer) notFound();
  const { service, subService } = offer;
  // Reuses the parent line's own image slot rather than minting a new one
  // per sub-service — same admin upload (services.<slug>.cover) updates
  // the hero everywhere that line's art appears, including here.
  const heroPhoto = await getSiteImagePhoto(`services.${service.slug}.cover`);
  const es = locale === "es";
  const methodology = service.methodologies[0];
  const siblings = service.subServices.filter((sub) => sub.id !== subService.id);

  return (
    <main id="content">
      <section className="page-hero">
        <ArtOverPhoto photoUrl={heroPhoto} artSrc={service.image} priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <nav className="crumbs" aria-label={es ? "Ruta de navegación" : "Breadcrumb"}>
            <Link href="/services">{es ? "Servicios" : "Services"}</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/services/${service.slug}`}>{loc(service.name, locale)}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{loc(subService.title, locale)}</span>
          </nav>
          <p className="eyebrow">{loc(service.name, locale)}</p>
          <h1>{loc(subService.title, locale)}</h1>
          <p className="hero-lede">{loc(subService.tagline, locale)}</p>
          <div className="hero-actions">
            <Link className="btn-gold" href="/booking">
              {loc(subService.cta, locale)} →
            </Link>
            <Link className="text-link" href={`/services/${service.slug}`}>
              {es ? "Volver a" : "Back to"} {loc(service.name, locale)}
            </Link>
          </div>
        </div>
      </section>

      <section className="panel">
        <Reveal>
          <p className="kicker">{es ? "Por qué importa" : "Why this matters"}</p>
          <p className="offer-standfirst">{loc(subService.hover, locale)}</p>
        </Reveal>

        <div className="legal-doc offer-body">
          {locParagraphs(subService.body, locale).map((paragraph, i) => (
            <Reveal key={i} delay={Math.min(i, 3) * 70}>
              <p>{paragraph}</p>
            </Reveal>
          ))}

          <h2>{es ? "Lo que incluye el mandato" : "What the mandate covers"}</h2>
          <ul className="offer-bullets">
            {subService.bullets.map((bullet) => (
              <li key={bullet.en}>{loc(bullet, locale)}</li>
            ))}
          </ul>
        </div>

        {methodology ? (
          <Reveal className="offer-method">
            <p className="kicker">{es ? "Nuestro método" : "Our method"}</p>
            <h2>{es ? "Cómo trabajamos esto" : "How we work this"}</h2>
            <p className="offer-method-intro">{loc(methodology.intro, locale)}</p>
            <ol className="offer-method-grid">
              {methodology.phases.map((phase) => (
                <li key={phase.step}>
                  <span className="offer-method-step">{phase.step}</span>
                  <strong>{loc(phase.title, locale)}</strong>
                  <p>{loc(phase.body, locale)}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        ) : null}

        {siblings.length ? (
          <div className="offer-related">
            <p className="kicker">{es ? "Explorar la línea" : "Explore the line"}</p>
            <h2>{es ? `Más en ${loc(service.name, locale)}` : `More in ${loc(service.name, locale)}`}</h2>
            <ul>
              {siblings.map((sub) => (
                <li key={sub.id}>
                  <Link href={`/services/${service.slug}/${sub.id}`}>
                    <strong>{loc(sub.title, locale)}</strong>
                    <span>{loc(sub.tagline, locale)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="hero-actions offer-cta">
          <Link className="btn-gold" href="/booking">
            {loc(subService.cta, locale)} →
          </Link>
        </div>
      </section>
    </main>
  );
}
