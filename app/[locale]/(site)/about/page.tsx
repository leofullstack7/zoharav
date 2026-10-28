import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { aboutCopy } from "@/content/home";
import { team, values } from "@/content/team";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";
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

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="content">
      <section className="page-hero">
        <Image src="/images/firm/office.svg" alt="" fill priority sizes="100vw" />
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
        <div className="cards-3" style={{ marginTop: "2.5rem" }}>
          {values.map((value, index) => (
            <Reveal delay={index * 70} key={value.id}>
              <article className="soft-card">
                <h3>{loc(value.title, locale)}</h3>
                <p>{loc(value.line, locale)}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <h2 style={{ marginTop: "3rem" }}>{locale === "es" ? "Equipo" : "Leadership"}</h2>
        <div className="cards-2" style={{ marginTop: "1rem" }}>
          {team
            .filter((member) => !member.placeholder)
            .map((member, index) => (
            <Reveal delay={index * 70} key={member.id}>
              <article className="soft-card">
                <h3>{member.name}</h3>
                <p className="kicker">{loc(member.role, locale)}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="hero-actions">
          <Link className="btn-gold" href="/contact">
            {locale === "es" ? "Conversemos" : "Get in touch"} →
          </Link>
        </div>
      </section>
    </main>
  );
}
