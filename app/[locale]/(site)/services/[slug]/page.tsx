import { getService, services } from "@/content/services";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

const covers: Record<string, string> = {
  "energy-transition": "/images/hero/yacht.jpg",
  "oil-and-energy": "/images/hero/yacht.jpg",
  "mining-natural-resources": "/images/mining/emeralds.jpg",
  "sustainability-esg": "/images/sustainability/plant.jpg",
  "investment-financial-advisory": "/images/investment/handshake.jpg",
  "strategic-operational-consulting": "/images/services/jet.jpg",
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
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
        <img src={covers[service.slug]} alt="" />
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
          {service.subServices.map((item) => (
            <article key={item.id}>
              <p className="kicker">{loc(item.tagline, locale)}</p>
              <h2>{loc(item.title, locale)}</h2>
              <p>{loc(item.body, locale)}</p>
              <ul className="diamonds">
                {item.bullets.map((bullet) => (
                  <li key={bullet.en}>{loc(bullet, locale)}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
