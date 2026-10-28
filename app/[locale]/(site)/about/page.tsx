import type { Metadata } from "next";
import { ArtOverPhoto } from "@/components/site/ArtOverPhoto";
import { Monogram } from "@/components/brand/Monogram";
import { Reveal } from "@/components/motion/Reveal";
import { aboutCopy } from "@/content/home";
import { aboutStats } from "@/content/stats";
import { team, values } from "@/content/team";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";
import { getSiteImagePhoto } from "@/lib/images/getSiteImage";
import { buildPageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

/** Same initials rule as components/home/TeamSlider.tsx's TeamCard, kept
 * local here since this is a server component and that helper isn't
 * exported from a "use client" module. */
function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Z&";
  return parts
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const heroPhoto = await getSiteImagePhoto("about.hero");
  return (
    <main id="content">
      <section className="page-hero">
        <ArtOverPhoto photoUrl={heroPhoto} artSrc="/images/firm/office.svg" priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">{locale === "es" ? "La firma" : "Our firm"}</p>
          <h1>{loc(aboutCopy.heroTitle, locale)}</h1>
          <p className="hero-lede">{loc(aboutCopy.heroSubtitle, locale)}</p>
        </div>
      </section>
      <section className="panel">
        <div className="subgrid">
          <p className="body">{loc(aboutCopy.intro, locale)}</p>
          <article>
            <h2>{locale === "es" ? "Visión" : "Vision"}</h2>
            <p>{loc(aboutCopy.vision, locale)}</p>
          </article>
          <article>
            <h2>{locale === "es" ? "Misión" : "Mission"}</h2>
            <p>{loc(aboutCopy.mission, locale)}</p>
          </article>
        </div>
        <Reveal>
          <div className="stat-row trust-stats" style={{ marginTop: "2.8rem" }}>
            {aboutStats.map((stat) => (
              <article key={stat.id}>
                <strong>{stat.value}</strong>
                <p>{loc(stat.label, locale)}</p>
              </article>
            ))}
          </div>
        </Reveal>
        <h2 style={{ marginTop: "3.2rem" }}>{locale === "es" ? "Nuestros valores" : "Our values"}</h2>
        <div className="cards-3" style={{ marginTop: "1.4rem" }}>
          {values.map((value, index) => (
            <Reveal delay={index * 70} key={value.id}>
              <article className="soft-card value-card">
                <span className="value-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{loc(value.title, locale)}</h3>
                <p>{loc(value.line, locale)}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <h2 style={{ marginTop: "3rem" }}>{locale === "es" ? "Equipo" : "Leadership"}</h2>
        <div className="cards-2" style={{ marginTop: "1.4rem" }}>
          {team
            .filter((member) => !member.placeholder)
            .map((member, index) => (
            <Reveal delay={index * 70} key={member.id}>
              <article className="soft-card member-card">
                <span className="member-portrait" aria-hidden="true">
                  {member.placeholder ? (
                    <Monogram className="member-monogram" />
                  ) : (
                    <span className="member-initials">{initials(member.name)}</span>
                  )}
                </span>
                <div>
                  <h3>{member.name}</h3>
                  <p className="kicker">{loc(member.role, locale)}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="hero-actions" style={{ marginTop: "2.6rem" }}>
          <Link className="btn-gold" href="/contact">
            {locale === "es" ? "Conversemos" : "Get in touch"} →
          </Link>
        </div>
      </section>
    </main>
  );
}
