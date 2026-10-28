import type { Metadata } from "next";
import { ArtOverPhoto } from "@/components/site/ArtOverPhoto";
import { Reveal } from "@/components/motion/Reveal";
import { sectors, sectorsCopy } from "@/content/sectors";
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
  const names = sectors.map((sector) => loc(sector.name, locale)).join(", ");
  return buildPageMetadata({
    locale,
    path: "/sectors",
    title: es ? "Sectores" : "Sectors",
    description: es ? `Asesoría para: ${names}.` : `Advisory for: ${names}.`,
    image: "/images/hero/yacht.svg",
  });
}

export default async function SectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const heroPhoto = await getSiteImagePhoto("sectors.hero");
  return (
    <main id="content">
      <section className="page-hero">
        <ArtOverPhoto photoUrl={heroPhoto} artSrc="/images/hero/yacht.svg" priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">{locale === "es" ? "Industrias" : "Industries"}</p>
          <h1>{locale === "es" ? "Sectores" : "Sectors"}</h1>
        </div>
      </section>
      <section className="panel">
        <Reveal>
          <p className="body sector-intro">{loc(sectorsCopy.intro, locale)}</p>
        </Reveal>
        <Reveal delay={60}>
          <p className="body sector-intro">{loc(sectorsCopy.introSecondary, locale)}</p>
        </Reveal>
        <div className="cards-2" style={{ marginTop: "2.2rem" }}>
          {sectors.map((sector, index) => (
            <Reveal delay={index * 70} key={sector.id}>
              <article className="soft-card sector-card">
                <span className="sector-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{loc(sector.name, locale)}</h3>
                <p>{loc(sector.summary, locale)}</p>
                <p className="sector-services">
                  {sector.services.map((slug) => (
                    <Link key={slug} href={`/services/${slug}`}>
                      {slug}
                    </Link>
                  ))}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
