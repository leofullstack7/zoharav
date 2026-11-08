import type { Metadata } from "next";
import Image from "next/image";
import { ArtOverPhoto } from "@/components/site/ArtOverPhoto";
import { DragSlider } from "@/components/site/DragSlider";
import { TeamSlider } from "@/components/home/TeamSlider";
import { Reveal } from "@/components/motion/Reveal";
import { aboutCopy } from "@/content/home";
import { aboutStats } from "@/content/stats";
import { values } from "@/content/team";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";
import { getSiteImage, getSiteImagePhoto } from "@/lib/images/getSiteImage";
import { getTeamPhotosById } from "@/lib/images/teamImages";
import { buildPageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/about",
    title: loc(aboutCopy.heroTitle, locale),
    description: loc(aboutCopy.heroSubtitle, locale),
    image: "/images/firm/office.svg",
  });
}

/**
 * Redesign notes (owner explicitly rejected the previous pass — light
 * `.soft-card` boxes, disproportionate cards, everything left-aligned,
 * no photography, no sliders, no hover interaction):
 *   - Hero: asymmetric split — a confidently-sized real photo bleeding to
 *     the right edge, a two-line headline staggered across/over it,
 *     instead of a centered line over a dimmed backdrop.
 *   - Mission/Vision: an offset two-column moment (portrait photo one
 *     side, Vision/Mission staggered vertically on the other), never
 *     center-aligned.
 *   - Values: the draggable numbered-card slider (components/site/
 *     DragSlider.tsx), dark glass, "01–05", hover glow/lift — replaces
 *     the old 3-up grid of light `.value-card`s.
 *   - Team: the real TeamSlider (already dark-glass, already a slider)
 *     instead of the manual 2-up `.member-card` knockoff that used to
 *     live in this file.
 *   - Stats: a bold large-number band over a real photo backdrop instead
 *     of plain text on black.
 */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const [heroPhoto, missionPhoto, statsPhoto, teamPhotos] = await Promise.all([
    getSiteImagePhoto("about.hero"),
    getSiteImage("about.mission"),
    getSiteImage("about.stats"),
    getTeamPhotosById(),
  ]);

  const heroTitleWords = es ? ["NUESTRA", "FIRMA"] : ["OUR", "FIRM"];

  return (
    <main id="content">
      <section className="split-hero">
        <div className="split-hero-media">
          <ArtOverPhoto photoUrl={heroPhoto} artSrc="/images/firm/office.svg" priority sizes="55vw" />
        </div>
        <Reveal className="split-hero-copy">
          <p className="eyebrow">{es ? "La firma" : "Our firm"}</p>
          <h1 className="split-hero-title">
            <span>{heroTitleWords[0]}</span>
            <span className="is-accent">{heroTitleWords[1]}</span>
          </h1>
          <p className="hero-lede">{loc(aboutCopy.heroSubtitle, locale)}</p>
        </Reveal>
      </section>

      <section className="panel about-mission" id="mission">
        <div className="about-mission-grid">
          <Reveal className="about-mission-media">
            <Image
              src={missionPhoto}
              alt={es ? "Equipo de Zoharav en una reunión de asesoría" : "Zoharav advisors in session"}
              fill
              sizes="(max-width: 860px) 100vw, 45vw"
            />
          </Reveal>
          <div className="about-mission-copy">
            <Reveal>
              <p className="kicker">{es ? "Quiénes somos" : "Who we are"}</p>
              <p className="body about-mission-intro">{loc(aboutCopy.intro, locale)}</p>
            </Reveal>
            <div className="about-mission-cols">
              <Reveal delay={70} className="about-mission-col about-mission-col--vision">
                <h2>{es ? "Visión" : "Vision"}</h2>
                <p>{loc(aboutCopy.vision, locale)}</p>
              </Reveal>
              <Reveal delay={140} className="about-mission-col about-mission-col--mission">
                <h2>{es ? "Misión" : "Mission"}</h2>
                <p>{loc(aboutCopy.mission, locale)}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="panel about-values" id="values">
        <div className="firm-layout">
          <Reveal>
            <header className="firm-head">
              <p className="firm-kicker">
                <span aria-hidden="true">{"—"}</span>
                {es ? "Lo que nos guía" : "What guides us"}
              </p>
              <h2>{es ? "Nuestros valores" : "Our values"}</h2>
            </header>
          </Reveal>
        </div>
        <DragSlider
          ariaLabel={es ? "Valores de la firma" : "Firm values"}
          hint={es ? "Arrastra para explorar" : "Drag to explore"}
        >
          {values.map((value, index) => (
            <article className="gcard value-slide" key={value.id}>
              <span className="value-slide-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{loc(value.title, locale)}</h3>
              <p>{loc(value.line, locale)}</p>
            </article>
          ))}
        </DragSlider>
      </section>

      <TeamSlider locale={locale} photos={teamPhotos} />

      <section className="about-stats" id="stats">
        <div className="about-stats-media">
          <Image src={statsPhoto} alt="" aria-hidden fill sizes="100vw" />
        </div>
        <div className="about-stats-veil" aria-hidden="true" />
        <Reveal>
          <div className="about-stats-row">
            {aboutStats.map((stat) => (
              <div className="about-stat" key={stat.id}>
                <strong>{stat.value}</strong>
                <p>{loc(stat.label, locale)}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="panel about-cta">
        <Reveal>
          <div className="hero-actions">
            <Link className="btn-gold" href="/contact">
              {es ? "Conversemos" : "Get in touch"} →
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
