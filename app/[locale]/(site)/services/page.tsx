import type { Metadata } from "next";
import { ArtOverPhoto } from "@/components/site/ArtOverPhoto";
import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/content/services";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";
import { getSiteImagePhoto } from "@/lib/images/getSiteImage";
import { buildPageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const es = locale === "es";
  const names = services.map((service) => loc(service.name, locale)).join(", ");
  return buildPageMetadata({
    locale,
    path: "/services",
    title: es ? "Servicios" : "Services",
    description: es
      ? `Seis líneas de asesoría: ${names}.`
      : `Six advisory lines: ${names}.`,
    image: "/images/services/jet.svg",
  });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const heroPhoto = await getSiteImagePhoto("services-index.hero");
  return (
    <main id="content">
      <section className="page-hero">
        <ArtOverPhoto photoUrl={heroPhoto} artSrc="/images/services/jet.svg" priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">{locale === "es" ? "Seis líneas" : "Six lines"}</p>
          <h1>{locale === "es" ? "Servicios" : "Services"}</h1>
        </div>
      </section>
      <section className="offer-index">
        <ol>
          {services.map((service, index) => (
            <li key={service.slug}>
              <Reveal delay={index * 60}>
                <Link href={`/services/${service.slug}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{loc(service.name, locale)}</strong>
                  <em>{loc(service.cardLine, locale)}</em>
                  <i aria-hidden>→</i>
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
