"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { LiveFrame } from "@/components/motion/LiveFrame";
import { Reveal } from "@/components/motion/Reveal";
import { TeamSlider } from "@/components/home/TeamSlider";
import { banners, chapters, trust } from "@/content/home";
import { homeServiceCards } from "@/content/navigation";
import { activeOffices } from "@/content/offices";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/motion";
import { services } from "@/content/services";
import { homeStats } from "@/content/stats";
import { compliance, site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";

const line = (value: { en: string; es: string }, locale: string) => loc(value, locale);

function heroTitle(text: string) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const mark = words.slice(-2).join(" ");
  const rest = words.slice(0, -2);
  const small = rest[0] ?? "";
  const heroWord = rest[1] ?? "";
  const bridge = rest.slice(2).join(" ");
  return { small, heroWord, bridge, mark };
}

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
  "energy-transition": "/images/hero/yacht.svg",
  "oil-and-energy": "/images/hero/yacht.svg",
  "mining-natural-resources": "/images/mining/emeralds.svg",
  "sustainability-esg": "/images/sustainability/plant.svg",
  "investment-financial-advisory": "/images/investment/handshake.svg",
  "strategic-operational-consulting": "/images/services/jet.svg",
};

export function HomeExperience({ locale }: { locale: string }) {
  const slide = banners.mandato;
  const title = heroTitle(line(slide.title, locale));
  const heroRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const sun = sunRef.current;
    if (!hero || !sun) return;
    registerGsap();
    if (prefersReducedMotion()) return;

    // The hero's light recedes and softens as the visitor scrolls past it —
    // ties the "soft moving light" into the act of scrolling itself,
    // instead of only drifting on its own clock.
    const tween = gsap.to(sun, {
      yPercent: 22,
      scale: 1.14,
      opacity: 0.3,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.3,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div className="home-stage">
      <section className="hero hero-mandato" ref={heroRef}>
        <div className="hero-wash" aria-hidden>
          <Image src="/images/hero/yacht.svg" alt="" fill priority sizes="100vw" />
        </div>
        <div className="hero-sun" aria-hidden ref={sunRef}>
          <span className="hero-sun-core" />
          <span className="hero-sun-ray" />
        </div>
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">{line(slide.eyebrow, locale)}</p>
          <h1>
            <span className="hero-small">{title.small}</span>
            <span className="hero-word">{title.heroWord}</span>
            {title.bridge ? <span className="hero-bridge">{title.bridge}</span> : null}
            <span className="hero-mark">{title.mark}</span>
          </h1>
          <p className="hero-lede">{line(slide.lede, locale)}</p>
          <div className="hero-actions">
            <Link className="btn-gold" href="/booking">
              {locale === "es" ? "Reservar sesión" : "Reserve a session"} <span aria-hidden>→</span>
            </Link>
            <a className="text-link" href="#trust">
              {locale === "es" ? "Por qué confiar" : "Why the trust holds"}
            </a>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden>
          SCROLL
          <i />
        </div>
      </section>

      <section className="chapter trust" id="trust">
        <div className="firm-layout">
          <Reveal>
            <header className="firm-head">
              <p className="firm-kicker">
                <span>00</span>
                {locale === "es" ? "Antes del discurso" : "Before the pitch"}
              </p>
              <h2>{locale === "es" ? "Lo que sostiene la confianza" : "What the trust rests on"}</h2>
            </header>
          </Reveal>
          <div className="trust-grid">
            {trust.map((item, index) => (
              <article key={item.id}>
                <span>0{index + 1}</span>
                <h3>{line(item.title, locale)}</h3>
                <p>{line(item.body, locale)}</p>
                <Link href={item.href}>{line(item.cta, locale)}</Link>
              </article>
            ))}
          </div>
          <div className="stat-row trust-stats">
            {homeStats
              .filter((stat) => stat.kind === "company")
              .map((stat) => (
                <article key={stat.id}>
                  <strong>{stat.value}</strong>
                  <p>{line(stat.label, locale)}</p>
                </article>
              ))}
          </div>
        </div>
      </section>

      <TeamSlider locale={locale} />

      <section className="bridge">
        <Reveal>
          <p>{line(chapters.bridge.quote, locale)}</p>
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
              src="/images/firm/office.svg"
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
            <LiveFrame src="/images/services/jet.svg" alt="Two advisors walking toward a private jet at sunset" />
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
                  <Image src={covers[service.slug]} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" />
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
        image="/images/hero/yacht.svg"
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
        image="/images/mining/emeralds.svg"
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
                    <Image src={office.image} alt="" fill sizes="(max-width: 900px) 50vw, 25vw" />
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
        image="/images/sustainability/plant.svg"
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
        image="/images/investment/handshake.svg"
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
            <LiveFrame src="/images/contact/tower.svg" alt="Corporate tower and palms at sunset" />
          </div>
        </div>
      </section>
    </div>
  );
}
