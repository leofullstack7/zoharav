"use client";

import { useEffect, useState } from "react";
import { LiveFrame } from "@/components/motion/LiveFrame";
import { Reveal } from "@/components/motion/Reveal";
import { chapters, hero } from "@/content/home";
import { homePillars, homeServiceCards } from "@/content/navigation";
import { activeOffices } from "@/content/offices";
import { services } from "@/content/services";
import { homeStats } from "@/content/stats";
import { compliance, site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";

const line = (value: { en: string; es: string }, locale: string) => loc(value, locale);

function Band({
  locale,
  number,
  kicker,
  title,
  lede,
  points,
  href,
  cta,
  image,
  alt,
  flip,
}: {
  locale: string;
  number: string;
  kicker: { en: string; es: string };
  title: { en: string; es: string };
  lede: { en: string; es: string };
  points?: { en: string; es: string }[];
  href: string;
  cta: string;
  image: string;
  alt: string;
  flip?: boolean;
}) {
  return (
    <section className={`chapter studio${flip ? " studio-flip" : ""}`}>
      <div className="firm-layout">
        <Reveal>
          <header className="firm-head">
            <p className="firm-kicker">
              <span>{number}</span>
              {line(kicker, locale)}
            </p>
            <h2>{line(title, locale)}</h2>
          </header>
        </Reveal>
        <div className="studio-main">
          <Reveal>
            <div className="firm-copy">
              <p className="firm-lede">{line(lede, locale)}</p>
              {points ? (
                <ul className="studio-points">
                  {points.map((point) => (
                    <li key={point.en}>{line(point, locale)}</li>
                  ))}
                </ul>
              ) : null}
              <Link className="text-link" href={href}>
                {cta}
              </Link>
            </div>
          </Reveal>
          <LiveFrame src={image} alt={alt} />
        </div>
      </div>
    </section>
  );
}

const covers: Record<string, string> = {
  "energy-transition": "/images/hero/yacht.jpg",
  "oil-and-energy": "/images/hero/yacht.jpg",
  "mining-natural-resources": "/images/mining/emeralds.jpg",
  "sustainability-esg": "/images/sustainability/plant.jpg",
  "investment-financial-advisory": "/images/investment/handshake.jpg",
  "strategic-operational-consulting": "/images/services/jet.jpg",
};

export function HomeExperience({ locale }: { locale: string }) {
  const [impact, setImpact] = useState(0);
  const rotating = hero.titleRotating[impact] ?? hero.titleRotating[0];

  useEffect(() => {
    const id = window.setInterval(() => {
      setImpact((current) => (current + 1) % hero.titleRotating.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-media">
          <img src="/images/hero/yacht.jpg" alt="Offshore platform at sunset, seen from the deck of a yacht" />
          <div className="hero-shade" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">{line(hero.eyebrow, locale)}</p>
          <h1>
            <span className="zh-gold-text">{line(hero.titleGold, locale)}</span>
            <span key={rotating.en}>{line(rotating, locale)}</span>
          </h1>
          <p className="hero-lede">{line(hero.subtitle, locale)}</p>
          <div className="hero-actions">
            <a className="btn-gold" href="#services">
              {locale === "es" ? "Explorar servicios" : "Explore our services"} <span aria-hidden>→</span>
            </a>
            <Link className="text-link" href="/booking">
              {locale === "es" ? "Reservar consulta" : "Book a consultation"}
            </Link>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden>
          SCROLL
          <i />
        </div>
        <div className="pillars">
          {homePillars.map((pillar) => (
            <Link className="pillar" href={pillar.href} key={pillar.id}>
              <img src={pillar.image} alt="" />
              <div>
                <strong>{line(pillar.title, locale)}</strong>
                <p>{line(pillar.lines, locale)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bridge">
        <Reveal>
          <p>{line(chapters.bridge.quote, locale)}</p>
        </Reveal>
      </section>

      <section className="chapter">
        <Reveal>
          <div className="stat-row">
            {homeStats
              .filter((stat) => stat.kind === "company")
              .map((stat) => (
              <article className="glass" key={stat.id}>
                <strong>{stat.value}</strong>
                <p>{line(stat.label, locale)}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="chapter firm" id="firm">
        <div className="firm-layout">
          <Reveal>
            <header className="firm-head">
              <p className="firm-kicker">
                <span>{chapters.firm.number}</span>
                {line(chapters.firm.subtitle, locale)}
              </p>
              <h2>{line(chapters.firm.title, locale)}</h2>
            </header>
          </Reveal>
          <div className="firm-main">
            <Reveal>
              <div className="firm-copy">
                <p className="firm-lede">{line(chapters.firm.lead, locale)}</p>
                <p className="firm-prose">{line(chapters.firm.body, locale)}</p>
                <Link className="text-link" href="/about">
                  {locale === "es" ? "Conocer la firma" : "About the firm"}
                </Link>
              </div>
            </Reveal>
            <LiveFrame
              src="/images/firm/office.jpg"
              alt="Private office overlooking a city skyline at night"
              caption={chapters.firm.signature}
            />
          </div>
          <ol className="firm-rail">
            {chapters.firm.points.map((point, index) => (
              <li key={point.en}>
                <span>0{index + 1}</span>
                <strong>{line(point, locale)}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="chapter studio" id="services">
        <div className="firm-layout">
          <Reveal>
            <header className="firm-head">
              <p className="firm-kicker">
                <span>02</span>
                {locale === "es" ? "Seis líneas. Un criterio." : "Six lines. One judgment."}
              </p>
              <h2>{locale === "es" ? "Servicios" : "Services"}</h2>
            </header>
          </Reveal>
          <div className="studio-main studio-services">
            <LiveFrame src="/images/services/jet.jpg" alt="Two advisors walking toward a private jet at sunset" />
            <ol className="studio-rows">
              {homeServiceCards.map((card, index) => (
                <li key={card.id}>
                  <Link href="/services">
                    <span>0{index + 1}</span>
                    <strong>{line(card.title, locale)}</strong>
                    <p>{line(card.body, locale)}</p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <div className="line-grid">
            {services.map((service, index) => (
              <Reveal delay={index * 70} key={service.slug}>
                <Link className="line-card" href={`/services/${service.slug}`}>
                  <img src={covers[service.slug]} alt="" />
                  <div>
                    <h3>{line(service.name, locale)}</h3>
                    <p>{line(service.cardLine, locale)}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Band
        locale={locale}
        number={chapters.oil.number}
        kicker={chapters.oil.subtitle}
        title={chapters.oil.title}
        lede={chapters.oil.body}
        points={chapters.oil.bullets}
        href="/services/oil-and-energy"
        cta={locale === "es" ? "Ver la asesoría" : "View the advisory"}
        image="/images/hero/yacht.jpg"
        alt="Energy infrastructure at golden hour"
      />

      <Band
        locale={locale}
        number={chapters.mining.number}
        kicker={chapters.mining.subtitle}
        title={chapters.mining.title}
        lede={chapters.mining.body}
        points={chapters.mining.bullets}
        href="/services/mining-natural-resources"
        cta={locale === "es" ? "Ver minería" : "View mining"}
        image="/images/mining/emeralds.jpg"
        alt="Gold and faceted emeralds on dark stone"
        flip
      />

      <section className="chapter studio">
        <div className="firm-layout">
          <Reveal>
            <header className="firm-head">
              <p className="firm-kicker">
                <span>{chapters.presence.number}</span>
                {line(chapters.presence.subtitle, locale)}
              </p>
              <h2>{line(chapters.presence.title, locale)}</h2>
            </header>
            <p className="firm-lede presence-lede">{line(chapters.presence.body, locale)}</p>
          </Reveal>
          <div className="cities">
            {activeOffices.map((office, index) => (
              <Reveal delay={index * 100} key={office.id}>
                <Link className="city" href="/global-presence">
                  <div className="frame">
                    <img src={office.image} alt="" />
                  </div>
                  <h3>{line(office.city, locale)}</h3>
                  <p>{line(office.role, locale)}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Band
        locale={locale}
        number={chapters.sustainability.number}
        kicker={chapters.sustainability.subtitle}
        title={chapters.sustainability.title}
        lede={chapters.sustainability.body}
        points={chapters.sustainability.pillars}
        href="/services/sustainability-esg"
        cta={locale === "es" ? "Ver sostenibilidad" : "View sustainability"}
        image="/images/sustainability/plant.jpg"
        alt="Hands holding soil and a young plant"
      />

      <Band
        locale={locale}
        number={chapters.investment.number}
        kicker={chapters.investment.subtitle}
        title={chapters.investment.title}
        lede={chapters.investment.body}
        points={chapters.investment.bullets}
        href="/services/investment-financial-advisory"
        cta={locale === "es" ? "Ver inversión" : "View investment"}
        image="/images/investment/handshake.jpg"
        alt="Handshake over investment documents"
        flip
      />

      <section className="chapter studio" id="compliance">
        <div className="firm-layout compliance-note">
          <Reveal>
            <p className="firm-kicker">{line(compliance.title, locale)}</p>
            {compliance.paragraphs.map((paragraph) => (
              <p className="firm-prose" key={paragraph.en}>
                {line(paragraph, locale)}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="chapter studio" id="contact">
        <div className="firm-layout">
          <Reveal>
            <header className="firm-head">
              <p className="firm-kicker">
                <span>{chapters.contact.number}</span>
                {line(chapters.contact.subtitle, locale)}
              </p>
              <h2>{line(chapters.contact.title, locale)}</h2>
            </header>
          </Reveal>
          <div className="studio-main">
            <Reveal>
              <div className="firm-copy">
                <p className="firm-lede">{line(chapters.contact.body, locale)}</p>
                <a className="studio-mail" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                <Link className="text-link" href="/contact">
                  {locale === "es" ? "Conversemos" : "Get in touch"}
                </Link>
              </div>
            </Reveal>
            <LiveFrame src="/images/contact/tower.jpg" alt="Corporate tower and palms at sunset" />
          </div>
        </div>
      </section>
    </div>
  );
}
