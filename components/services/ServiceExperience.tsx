"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { Service, ServiceSlug, SubService } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";
import { gsap, prefersReducedMotion, registerGsap, ScrollTrigger } from "@/lib/motion";

const line = (value: { en: string; es: string }, locale: string) => loc(value, locale);

const SERVICE_GALLERY: Record<ServiceSlug, string[]> = {
  "energy-transition": [
    "/images/hero/yacht.png",
    "/images/sustainability/plant.png",
    "/images/pillars/oil-energy.png",
    "/images/firm/office.png",
    "/images/services/jet.png",
  ],
  "oil-and-energy": [
    "/images/pillars/oil-energy.png",
    "/images/hero/yacht.png",
    "/images/firm/office.png",
    "/images/services/jet.png",
    "/images/contact/tower.png",
  ],
  "mining-natural-resources": [
    "/images/mining/emeralds.png",
    "/images/firm/office.png",
    "/images/investment/handshake.png",
    "/images/hero/yacht.png",
    "/images/services/jet.png",
  ],
  "sustainability-esg": [
    "/images/sustainability/plant.png",
    "/images/hero/yacht.png",
    "/images/firm/office.png",
    "/images/offices/miami.png",
    "/images/services/jet.png",
  ],
  "investment-financial-advisory": [
    "/images/investment/handshake.png",
    "/images/firm/office.png",
    "/images/services/jet.png",
    "/images/contact/tower.png",
    "/images/hero/yacht.png",
  ],
  "strategic-operational-consulting": [
    "/images/services/ops/hero-impact.jpg",
    "/images/services/ops/hero-digital.jpg",
    "/images/services/jet.png",
    "/images/services/ops/lean.png",
    "/images/services/ops/digital-supply.png",
    "/images/firm/office.png",
  ],
};

function asRaster(src: string) {
  return src.replace(/\.svg$/i, ".png");
}

function galleryFor(service: Service) {
  return SERVICE_GALLERY[service.slug] ?? [asRaster(service.image), "/images/firm/office.png", "/images/services/jet.png"];
}

function pickImage(service: Service, index: number, preferred?: string) {
  if (preferred && !preferred.endsWith(".svg")) return preferred;
  const gallery = galleryFor(service);
  return gallery[index % gallery.length];
}

function fallbackSlides(service: Service) {
  if (service.impactSlides?.length) {
    return service.impactSlides.map((slide, i) => ({
      ...slide,
      image: pickImage(service, i, slide.image),
    }));
  }
  return (service.slides ?? [{ title: service.heroTitle, body: service.heroIntro }]).map((slide, i) => ({
    title: slide.title,
    body: slide.body,
    image: pickImage(service, i),
  }));
}

function fallbackPillars(service: Service) {
  if (service.pillars?.length) {
    return service.pillars.map((pillar, i) => ({
      ...pillar,
      image: pickImage(service, i + 1, pillar.image),
    }));
  }
  return service.subServices.slice(0, 3).map((sub, i) => ({
    id: sub.id,
    title: sub.title,
    body: sub.body,
    image: pickImage(service, i, sub.image),
  }));
}

export function ServiceExperience({
  service,
  locale,
  coverPhoto,
  initialSubId,
}: {
  service: Service;
  locale: string;
  coverPhoto: string | null;
  initialSubId?: string;
}) {
  const slides = fallbackSlides(service);
  const pillars = fallbackPillars(service);
  const methodology = service.methodologies[0] ?? service.methodologies[service.methodologies.length - 1];
  const [slide, setSlide] = useState(0);
  const [active, setActive] = useState<SubService | null>(
    () => service.subServices.find((sub) => sub.id === initialSubId) ?? null,
  );
  const [pulseId, setPulseId] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const modalTitleId = useId();
  const pulseTimer = useRef<number | null>(null);

  const focusSub = (id: string, openModal = false) => {
    const match = service.subServices.find((sub) => sub.id === id);
    if (!match) return;
    if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
    setPulseId(id);
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    if (openModal) {
      window.setTimeout(() => setActive(match), 450);
    }
    pulseTimer.current = window.setTimeout(() => setPulseId(null), 4200);
  };

  useEffect(() => {
    const run = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const target = hash || initialSubId;
      if (!target) return;
      // Hash from the menu → scroll + pulse the practice chip.
      // Legacy /[item] routes still open the modal via initialSubId.
      focusSub(target, Boolean(initialSubId && !hash));
    };
    const timer = window.setTimeout(run, 220);
    const retry = window.setTimeout(run, 700);
    const onHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash) focusSub(hash, false);
    };
    window.addEventListener("hashchange", onHash);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(retry);
      window.removeEventListener("hashchange", onHash);
      if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- focus on mount / hash only
  }, [service.slug, initialSubId]);

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  useEffect(() => {
    if (slides.length < 2 || prefersReducedMotion()) return;
    const timer = window.setInterval(() => {
      setSlide((value) => (value + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".svc-reveal").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: (i % 4) * 0.05,
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>(".svc-method-step").forEach((el, i) => {
        gsap.fromTo(
          el,
          { x: i % 2 ? 40 : -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });
      const rail = root.querySelector(".svc-method-rail");
      if (rail) {
        gsap.fromTo(
          rail,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".svc-method",
              start: "top 70%",
              end: "bottom 40%",
              scrub: true,
            },
          },
        );
      }
    }, root);
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => {
        if (root.contains(t.trigger as Node)) t.kill();
      });
    };
  }, [service.slug]);

  const openSub = (sub: SubService) => {
    setActive(sub);
    window.history.replaceState(null, "", `#${sub.id}`);
  };

  const closeSub = () => {
    setActive(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const current = slides[slide] ?? slides[0];

  return (
    <main id="content" className="svc-page" ref={rootRef}>
      <section className="svc-hero">
        {slides.map((entry, index) => (
          <div
            key={entry.title.en}
            className={`svc-hero-slide${index === slide ? " is-on" : ""}`}
            aria-hidden={index !== slide}
          >
            <Image
              src={index === 0 && coverPhoto ? coverPhoto : entry.image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="svc-hero-img"
            />
          </div>
        ))}
        <div className="svc-hero-veil" />
        <div className="svc-hero-copy">
          <p className="svc-kicker">
            <span>{service.number}</span>
            {line(service.name, locale)}
          </p>
          <h1 key={current.title.en} className="svc-hero-title">
            {line(current.title, locale)}
          </h1>
          <p key={current.body.en} className="svc-hero-lede">
            {line(current.body, locale)}
          </p>
          {current.metrics ? (
            <ul className="svc-metrics">
              {current.metrics.map((metric) => (
                <li key={metric.value}>
                  <strong>{metric.value}</strong>
                  <span>{line(metric.label, locale)}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="svc-hero-actions">
            <Link className="btn-gold" href="/booking">
              {locale === "es" ? "Reservar consulta" : "Book a consultation"} →
            </Link>
            <a className="text-link" href="#subservices">
              {locale === "es" ? "Ver prácticas" : "View practices"}
            </a>
          </div>
        </div>
        {slides.length > 1 ? (
          <>
            <button
              type="button"
              className="svc-hero-nav prev"
              aria-label={locale === "es" ? "Anterior" : "Previous"}
              onClick={() => setSlide((value) => (value - 1 + slides.length) % slides.length)}
            >
              ‹
            </button>
            <button
              type="button"
              className="svc-hero-nav next"
              aria-label={locale === "es" ? "Siguiente" : "Next"}
              onClick={() => setSlide((value) => (value + 1) % slides.length)}
            >
              ›
            </button>
            <div className="svc-hero-dots" role="tablist" aria-label="Slides">
              {slides.map((entry, index) => (
                <button
                  key={entry.title.en}
                  type="button"
                  role="tab"
                  aria-selected={index === slide}
                  className={index === slide ? "is-on" : undefined}
                  onClick={() => setSlide(index)}
                />
              ))}
            </div>
          </>
        ) : null}
      </section>

      <section className="svc-band svc-intro svc-reveal">
        <div className="svc-wrap">
          <p className="svc-kicker">{locale === "es" ? "La línea" : "The line"}</p>
          <h2>{line(service.heroTitle, locale)}</h2>
          <p className="svc-lede">{line(service.heroIntro, locale)}</p>
        </div>
      </section>

      <section className="svc-pillars">
        <div className="svc-wrap">
          <header className="svc-section-head svc-reveal">
            <p className="svc-kicker">{locale === "es" ? "Cómo se siente el trabajo" : "How the work lands"}</p>
            <h2>{locale === "es" ? "Tres focos. Un criterio." : "Three lenses. One judgment."}</h2>
          </header>
          <div className="svc-pillar-grid">
            {pillars.map((pillar, index) => (
              <article className="svc-pillar svc-reveal" key={pillar.id} style={{ transitionDelay: `${index * 80}ms` }}>
                <div className="svc-pillar-media">
                  <Image src={pillar.image} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" />
                </div>
                <h3>{line(pillar.title, locale)}</h3>
                <p>{line(pillar.body, locale)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-band svc-subs" id="subservices">
        <div className="svc-wrap">
          <header className="svc-section-head svc-reveal">
            <p className="svc-kicker">{locale === "es" ? "Prácticas" : "Practices"}</p>
            <h2>{locale === "es" ? "Subservicios de esta línea" : "Sub-services in this line"}</h2>
            <p className="svc-lede">
              {locale === "es"
                ? "Abra cada práctica para ver el detalle, los entregables y una imagen del trabajo."
                : "Open each practice for detail, deliverables, and a visual of the work."}
            </p>
          </header>
          <ul className="svc-sub-rail">
            {service.subServices.map((sub, index) => (
              <li key={sub.id} className="svc-reveal" style={{ transitionDelay: `${index * 40}ms` }}>
                <button
                  type="button"
                  className={`svc-sub-chip${pulseId === sub.id ? " is-pulse" : ""}`}
                  onClick={() => openSub(sub)}
                  id={sub.id}
                >
                  <span className="svc-sub-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="svc-sub-label">{line(sub.title, locale)}</span>
                  <span className="svc-sub-arrow" aria-hidden>
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {methodology ? (
        <section className="svc-method">
          <div className="svc-wrap">
            <header className="svc-section-head svc-reveal">
              <p className="svc-kicker">{locale === "es" ? "Metodología" : "Methodology"}</p>
              <h2>{line(methodology.name, locale)}</h2>
              <p className="svc-lede">{line(methodology.intro, locale)}</p>
            </header>
            <div className="svc-method-track" aria-hidden>
              <i className="svc-method-rail" />
            </div>
            <ol className="svc-method-grid">
              {methodology.phases.map((phase) => (
                <li className="svc-method-step" key={phase.step}>
                  <span className="svc-method-num">{phase.step}</span>
                  <h3>{line(phase.title, locale)}</h3>
                  <p>{line(phase.body, locale)}</p>
                </li>
              ))}
            </ol>
            {service.methodologies.length > 1 ? (
              <div className="svc-method-alt svc-reveal">
                {service.methodologies.slice(1).map((method) => (
                  <div key={method.id}>
                    <h3>{line(method.name, locale)}</h3>
                    <p>{line(method.intro, locale)}</p>
                    <ol>
                      {method.phases.map((phase) => (
                        <li key={phase.step}>
                          <strong>{phase.step}</strong> {line(phase.title, locale)}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="svc-cta svc-reveal">
        <div className="svc-wrap svc-cta-inner">
          <h2>{locale === "es" ? "¿Listos para el siguiente mandato?" : "Ready for the next mandate?"}</h2>
          <p>
            {locale === "es"
              ? "Sesenta minutos con un asesor senior. La reserva se acredita al encargo si continúan."
              : "Sixty minutes with a senior advisor. The retainer credits to the engagement if you continue."}
          </p>
          <Link className="btn-gold" href="/booking">
            {locale === "es" ? "Reservar consulta" : "Book a consultation"} →
          </Link>
        </div>
      </section>

      {active ? (
        <div className="svc-modal" role="dialog" aria-modal="true" aria-labelledby={modalTitleId}>
          <button type="button" className="svc-modal-backdrop" aria-label="Close" onClick={closeSub} />
          <div className="svc-modal-panel">
            <button type="button" className="svc-modal-close" onClick={closeSub} aria-label={locale === "es" ? "Cerrar" : "Close"}>
              ×
            </button>
            <div className="svc-modal-media">
              <Image
                src={pickImage(
                  service,
                  service.subServices.findIndex((sub) => sub.id === active.id),
                  active.image,
                )}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 48vw"
              />
            </div>
            <div className="svc-modal-copy">
              <p className="svc-kicker">{line(service.name, locale)}</p>
              <h2 id={modalTitleId}>{line(active.title, locale)}</h2>
              <p className="svc-modal-tag">{line(active.tagline, locale)}</p>
              <p>{line(active.body, locale)}</p>
              <ul className="svc-modal-bullets">
                {active.bullets.map((bullet) => (
                  <li key={bullet.en}>{line(bullet, locale)}</li>
                ))}
              </ul>
              <Link className="btn-gold" href="/booking" onClick={closeSub}>
                {line(active.cta, locale)} →
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
