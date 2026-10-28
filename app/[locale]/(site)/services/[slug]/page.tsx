import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { getService, services } from "@/content/services";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";
import { buildPageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return buildPageMetadata({
    locale,
    path: `/services/${slug}`,
    title: loc(service.name, locale),
    description: loc(service.heroIntro, locale),
    image: service.image,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = getService(slug);
  if (!service) notFound();

  return (
    <main id="content">
      <section className="page-hero">
        <Image src={service.image} alt="" fill priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <h1>{loc(service.heroTitle, locale)}</h1>
          <p className="hero-lede">{loc(service.heroIntro, locale)}</p>
          <div className="hero-actions">
            <Link className="btn-gold" href="/booking">
              {locale === "es" ? "Reservar consulta" : "Book a consultation"} →
            </Link>
          </div>
        </div>
      </section>
      <section className="panel">
        <div className="subgrid">
          {service.subServices.map((item, index) => (
            <Reveal delay={Math.min(index, 4) * 60} key={item.id}>
              <article id={item.id}>
                <p className="kicker">{loc(item.tagline, locale)}</p>
                <h2>{loc(item.title, locale)}</h2>
                <p>{loc(item.body, locale)}</p>
                <ul className="diamonds">
                  {item.bullets.map((bullet) => (
                    <li key={bullet.en}>{loc(bullet, locale)}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
