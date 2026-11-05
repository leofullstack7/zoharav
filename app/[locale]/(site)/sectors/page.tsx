import type { Metadata } from "next";
import Image from "next/image";
import { ArtOverPhoto } from "@/components/site/ArtOverPhoto";
import { DragSlider } from "@/components/site/DragSlider";
import { SectorMark } from "@/components/site/SectorMarks";
import { Reveal } from "@/components/motion/Reveal";
import { getService } from "@/content/services";
import { sectors, sectorsCopy } from "@/content/sectors";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";
import { getSiteImage, getSiteImagePhoto } from "@/lib/images/getSiteImage";
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

/**
 * Redesign notes (owner explicitly rejected the previous pass — light
 * `.soft-card` boxes, a uniform vertical stack of identical left-aligned
 * cards, no photography, no sliders):
 *   - Hero: the same asymmetric split-hero treatment as About, staged
 *     around the single word "Sectors" plus a small count detail.
 *   - A full-bleed photo "spotlight" band between the intro copy and the
 *     carousel — a genuine, confidently-sized visual moment, not another
 *     subdued ArtOverPhoto backdrop.
 *   - The sector list becomes the draggable spotlight carousel
 *     (components/site/DragSlider.tsx): dark-glass cards, a small
 *     abstract line-mark per sector (no dedicated sector photography
 *     exists to put there instead), and a hover-revealed set of chips
 *     linking to the real advisory lines that serve that sector.
 */
export default async function SectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const [heroPhoto, spotlightPhoto] = await Promise.all([
    getSiteImagePhoto("sectors.hero"),
    getSiteImage("sectors.spotlight"),
  ]);

  return (
    <main id="content">
      <section className="split-hero split-hero--reverse">
        <div className="split-hero-media">
          <ArtOverPhoto photoUrl={heroPhoto} artSrc="/images/hero/yacht.svg" priority sizes="55vw" />
        </div>
        <Reveal className="split-hero-copy">
          <p className="eyebrow">{es ? "Industrias" : "Industries"}</p>
          <h1 className="split-hero-title">
            <span className="is-accent">{es ? "Sectores" : "Sectors"}</span>
          </h1>
          <p className="split-hero-count">
            — {sectors.length} {es ? "sectores asesorados" : "sectors advised"}
          </p>
        </Reveal>
      </section>

      <section className="panel sectors-intro-panel">
        <div className="sectors-intro-grid">
          <Reveal>
            <p className="kicker">{es ? "Dónde trabajamos" : "Where we work"}</p>
          </Reveal>
          <div>
            <Reveal>
              <p className="body sector-intro">{loc(sectorsCopy.intro, locale)}</p>
            </Reveal>
            <Reveal delay={60}>
              <p className="body sector-intro">{loc(sectorsCopy.introSecondary, locale)}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sectors-spotlight">
        <div className="sectors-spotlight-media">
          <Image src={spotlightPhoto} alt="" aria-hidden fill sizes="100vw" />
        </div>
        <div className="sectors-spotlight-veil" aria-hidden="true" />
        <Reveal className="sectors-spotlight-copy">
          <p className="kicker">{es ? "Un mismo criterio" : "One standard of judgment"}</p>
          <h2>
            {es
              ? "Ocho sectores, seis líneas de asesoría, una sola mesa."
              : "Eight sectors, six advisory lines, one desk."}
          </h2>
        </Reveal>
      </section>

      <section className="panel sectors-carousel" id="sectors">
        <div className="firm-layout">
          <Reveal>
            <header className="firm-head">
              <p className="firm-kicker">
                <span aria-hidden="true">{"—"}</span>
                {es ? "Explorar por sector" : "Explore by sector"}
              </p>
              <h2>{es ? "Sectores" : "Sectors"}</h2>
            </header>
          </Reveal>
        </div>
        <DragSlider
          items={sectors}
          getKey={(sector) => sector.id}
          ariaLabel={es ? "Sectores asesorados" : "Sectors advised"}
          hint={es ? "Arrastra para explorar" : "Drag to explore"}
          renderItem={(sector, index) => (
            <article className="gcard sector-slide">
              <SectorMark id={sector.id} />
              <h3>{loc(sector.name, locale)}</h3>
              <p>{loc(sector.summary, locale)}</p>
              <div className="sector-slide-links">
                {sector.services.map((slug) => {
                  const service = getService(slug);
                  if (!service) return null;
                  return (
                    <Link key={slug} className="sector-slide-link" href={`/services/${slug}`}>
                      {loc(service.name, locale)}
                    </Link>
                  );
                })}
              </div>
              <span className="sector-slide-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")} / {String(sectors.length).padStart(2, "0")}
              </span>
            </article>
          )}
        />
      </section>
    </main>
  );
}
