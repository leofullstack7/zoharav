"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Service, ServiceImpactSlide, SubService } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";
import { uiLoc } from "@/lib/i18n/ui";
import type { ServicePageMedia } from "@/lib/images/resolveServicePageMedia";
import { gsap, prefersReducedMotion, registerGsap, ScrollTrigger } from "@/lib/motion";

const line = (value: { en: string; es: string }, locale: string) => loc(value, locale);

function asRaster(src: string) {
  return src.replace(/\.svg$/i, ".png");
}

function fallbackSlides(service: Service, media: ServicePageMedia): ServiceImpactSlide[] {
  if (service.impactSlides?.length) {
    return service.impactSlides.map((slide, i) => ({
      ...slide,
      image: slide.image && !slide.image.endsWith(".svg") ? slide.image : media.pillars[i % 3],
    }));
  }
  const source = service.slides?.length
    ? service.slides
    : [{ title: service.heroTitle, body: service.heroIntro }];
  return source.map((slide, i) => ({
    title: slide.title,
    body: slide.body,
    image: media.pillars[i % 3],
  }));
}

function fallbackPillars(service: Service, media: ServicePageMedia) {
  let items: { id: string; title: SubService["title"]; body: SubService["body"]; image?: string }[];
  if (service.pillars?.length) {
    items = service.pillars.map((pillar) => ({
      id: pillar.id,
      title: pillar.title,
      body: pillar.body,
      image: pillar.image,
    }));
  } else if (service.methodologies[0]) {
    const method = service.methodologies[0];
    items = method.phases.slice(0, 3).map((phase) => ({
      id: `${method.id}-${phase.step}`,
      title: phase.title,
      body: phase.body,
    }));
  } else {
    items = service.subServices.slice(0, 3).map((sub) => ({
      id: sub.id,
      title: sub.title,
      body: sub.body,
    }));
  }
  return items.map((pillar, i) => ({
    ...pillar,
    image:
      pillar.image && !pillar.image.endsWith(".svg")
        ? pillar.image
        : media.pillars[i] ?? media.subs[service.subServices[i]?.id ?? ""] ?? asRaster(service.image),
  }));
}

function bookingHref(slug: string, offerId?: string) {
  const params = new URLSearchParams({ line: slug });
  if (offerId) params.set("offer", offerId);
  return `/booking?${params.toString()}`;
}

export function ServiceExperience({
  service,
  locale,
  coverPhoto,
  media,
  initialSubId,
}: {
  service: Service;
  locale: string;
  coverPhoto: string | null;
  media: ServicePageMedia;
  initialSubId?: string;
}) {
  const slides = fallbackSlides(service, media);
  const pillars = fallbackPillars(service, media);
  const methodology = service.methodologies[0] ?? service.methodologies[service.methodologies.length - 1];
  const heroImage = coverPhoto || asRaster(service.image);
  const [active, setActive] = useState<SubService | null>(
    () => service.subServices.find((sub) => sub.id === initialSubId) ?? null,
  );
  const [pulseId, setPulseId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const modalTitleId = useId();
  const pulseTimer = useRef<number | null>(null);
  useEffect(() => {
    setMounted(true);
  }, []);

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
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".svc-hero-copy",
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.15, ease: "power3.out", delay: 0.12 },
      );
      gsap.fromTo(
        ".svc-hero-img",
        { scale: 1.12 },
        { scale: 1, duration: 2.4, ease: "power2.out" },
      );
      gsap.utils.toArray<HTMLElement>(".svc-pillar").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 64, opacity: 0, rotateX: 8 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.05,
            ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>(".svc-offer").forEach((el) => {
        const photo = el.querySelector(".svc-offer-visual");
        gsap.fromTo(
          el,
          { y: 72, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          },
        );
        if (photo) {
          gsap.fromTo(
            photo,
            { scale: 1.16, filter: "blur(16px)" },
            {
              scale: 1,
              filter: "blur(0px)",
              duration: 1.35,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 86%" },
            },
          );
        }
      });
      gsap.utils.toArray<HTMLElement>(".svc-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: "power3.out",
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

  const heroMetrics = slides[0]?.metrics;

  return (
    <main id="content" className="svc-page" ref={rootRef}>
      <section className="svc-hero">
        <div className="svc-hero-slide is-on">
          <Image src={heroImage} alt={media.alts.cover} fill priority sizes="100vw" className="svc-hero-img" />
        </div>
        <div className="svc-hero-veil" />
        <div className="svc-hero-copy">
          <p className="svc-kicker">
            <span>{service.number}</span>
            {line(service.name, locale)}
          </p>
          <h1 className="svc-hero-title">{line(service.heroTitle, locale)}</h1>
          <p className="svc-hero-lede">{line(service.heroIntro, locale)}</p>
          {heroMetrics ? (
            <ul className="svc-metrics">
              {heroMetrics.map((metric) => (
                <li key={metric.value}>
                  <strong>{metric.value}</strong>
                  <span>{line(metric.label, locale)}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="svc-hero-actions">
            <Link className="btn-gold" href={bookingHref(service.slug)}>
              {uiLoc("bookConsultation", locale)} →
            </Link>
            <a className="text-link" href="#subservices">
              {uiLoc("viewPractices", locale)}
            </a>
          </div>
        </div>
      </section>

      <section className="svc-pillars">
        <div className="svc-wrap">
          <header className="svc-section-head svc-reveal">
            <p className="svc-kicker">{uiLoc("theLine", locale)}</p>
            <h2>{uiLoc("howWorkLands", locale)}</h2>
            <p className="svc-lede">{line(service.cardLine, locale)}</p>
          </header>
          <div className="svc-pillar-grid">
            {pillars.map((pillar, index) => (
              <article className="svc-pillar" key={pillar.id}>
                <span className="svc-pillar-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="svc-pillar-media">
                  <Image src={pillar.image} alt={media.alts.pillars[index] ?? ""} fill sizes="(max-width: 900px) 100vw, 33vw" />
                </div>
                <h3>{line(pillar.title, locale)}</h3>
                <p>{line(pillar.body, locale)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-band svc-subs" id="subservices">
        <div className="svc-wrap svc-wrap-wide">
          <header className="svc-section-head svc-reveal">
            <p className="svc-kicker">{uiLoc("practices", locale)}</p>
            <h2>{uiLoc("eachPractice", locale)}</h2>
            <p className="svc-lede">{uiLoc("openPracticeLede", locale)}</p>
          </header>
          <div className="svc-offer-list">
            {service.subServices.map((sub, index) => {
              const image =
                media.subs[sub.id] ??
                (sub.image && !sub.image.endsWith(".svg") ? sub.image : asRaster(service.image));
              const flip = index % 2 === 1;
              return (
                <article
                  key={sub.id}
                  id={sub.id}
                  className={`svc-offer${flip ? " is-flip" : ""}${pulseId === sub.id ? " is-pulse" : ""}`}
                >
                  <div className="svc-offer-copy">
                    <span className="svc-offer-index">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{line(sub.title, locale)}</h3>
                  </div>
                  <div className="svc-offer-visual" aria-hidden>
                    <Image src={image} alt={media.alts.subs[sub.id] ?? ""} fill sizes="(max-width: 900px) 100vw, 46vw" />
                  </div>
                  <p className="svc-offer-body">{line(sub.tagline, locale)}</p>
                  <div className="svc-offer-actions">
                    <button type="button" className="svc-offer-more" onClick={() => openSub(sub)}>
                      {uiLoc("readMore", locale)}
                    </button>
                    <Link className="btn-gold" href={bookingHref(service.slug, sub.id)}>
                      {uiLoc("bookConsultation", locale)}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {methodology ? (
        <section className="svc-method">
          <div className="svc-wrap">
            <header className="svc-section-head svc-reveal">
              <p className="svc-kicker">{uiLoc("methodology", locale)}</p>
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
          <h2>{uiLoc("readyMandate", locale)}</h2>
          <p>{uiLoc("sessionCredit", locale)}</p>
          <Link className="btn-gold" href={bookingHref(service.slug)}>
            {uiLoc("bookConsultation", locale)} →
          </Link>
        </div>
      </section>

      {active && mounted
        ? createPortal(
        <div className="svc-studio" role="dialog" aria-modal="true" aria-labelledby={modalTitleId}>
          <button type="button" className="svc-studio-backdrop" aria-label={uiLoc("close", locale)} onClick={closeSub} />
          <div className="svc-studio-panel">
            <button type="button" className="svc-studio-close" onClick={closeSub} aria-label={uiLoc("close", locale)}>
              ×
            </button>
            <div className="svc-studio-media">
              <Image
                src={
                  media.subs[active.id] ??
                  (active.image && !active.image.endsWith(".svg") ? active.image : asRaster(service.image))
                }
                alt={media.alts.subs[active.id] ?? ""}
                fill
                sizes="100vw"
                className="svc-studio-photo"
              />
            </div>
            <div className="svc-studio-copy">
              <p className="svc-kicker">{line(service.name, locale)}</p>
              <h2 id={modalTitleId}>{line(active.title, locale)}</h2>
              <p className="svc-studio-tag">{line(active.tagline, locale)}</p>
              <p className="svc-studio-body">{line(active.body, locale)}</p>
              <div className="svc-studio-visuals" aria-hidden>
                {(media.studioDetails[active.id] ?? []).map((src, visualIndex) => (
                  <div className="svc-studio-visual" key={`${active.id}-${visualIndex}`}>
                    <Image
                      src={src}
                      alt={(media.alts.studioDetails[active.id] ?? [])[visualIndex] ?? ""}
                      fill
                      sizes="(max-width: 720px) 33vw, 240px"
                    />
                  </div>
                ))}
              </div>
              <ul className="svc-studio-tiles">
                {active.bullets.map((bullet, index) => (
                  <li key={bullet.en} style={{ animationDelay: `${0.08 * index}s` }}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{line(bullet, locale)}</p>
                  </li>
                ))}
              </ul>
              <div className="svc-studio-actions">
                <Link className="btn-gold" href={bookingHref(service.slug, active.id)} onClick={closeSub}>
                  {uiLoc("bookThisPractice", locale)} →
                </Link>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )
        : null}
    </main>
  );
}
