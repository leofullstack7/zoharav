"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import type { Service, SubService } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { loc, locParagraphs } from "@/lib/i18n/loc";
import { uiLoc } from "@/lib/i18n/ui";
import type { ServicePageMedia } from "@/lib/images/resolveServicePageMedia";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/motion";
import { PracticeModalAccent, practiceBulletIcon } from "./practiceModalIcons";

function line(value: { en: string; es: string }, locale: string) {
  return loc(value, locale);
}

function asRaster(src: string) {
  return src.replace(/\.svg$/i, ".png");
}

function subImage(sub: SubService, service: Service, media: ServicePageMedia) {
  return (
    media.subs[sub.id] ??
    (sub.image && !sub.image.endsWith(".svg") ? sub.image : asRaster(service.image))
  );
}

export function ServicePracticeModal({
  active,
  service,
  locale,
  media,
  onClose,
  bookingHref,
}: {
  active: SubService;
  service: Service;
  locale: string;
  media: ServicePageMedia;
  onClose: () => void;
  bookingHref: (offerId?: string) => string;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const src = subImage(active, service, media);
  const paragraphs = locParagraphs(active.body, locale);
  const studioShots = media.studioDetails[active.id] ?? [];

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".svc-studio-banner__img",
        { scale: 1.12, opacity: 0.85 },
        { scale: 1, opacity: 1, duration: 1.25, ease: "power2.out" },
      );
      gsap.fromTo(
        ".svc-studio-reveal",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          ease: "power3.out",
          stagger: 0.07,
          delay: 0.12,
        },
      );
      gsap.fromTo(
        ".svc-studio-benefit",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.06,
          delay: 0.35,
        },
      );
    }, panel);
    return () => ctx.revert();
  }, [active.id]);

  return (
    <div className="svc-studio" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="svc-studio-backdrop"
        aria-label={uiLoc("close", locale)}
        onClick={onClose}
      />
      <div ref={panelRef} className="svc-studio-panel svc-studio-panel--stack">
        <button type="button" className="svc-studio-close" onClick={onClose} aria-label={uiLoc("close", locale)}>
          ×
        </button>

        <header className="svc-studio-banner">
          <Image
            src={src}
            alt={media.alts.subs[active.id] ?? ""}
            fill
            priority
            sizes="100vw"
            className="svc-studio-banner__img"
          />
          <div className="svc-studio-banner__veil" />
          <div className="svc-studio-banner__copy svc-studio-reveal">
            <p className="svc-kicker">{line(service.name, locale)}</p>
            <h2 id={titleId}>{line(active.title, locale)}</h2>
            <p className="svc-studio-banner__tag">{line(active.tagline, locale)}</p>
          </div>
        </header>

        <div className="svc-studio-body-wrap">
          <div className="svc-studio-inner">
            <PracticeModalAccent />
            <p className="svc-studio-lede svc-studio-reveal">{line(active.hover, locale)}</p>

            <div className="svc-studio-story svc-studio-reveal">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>

            {studioShots.length > 0 ? (
              <div className="svc-studio-gallery svc-studio-reveal" aria-hidden>
                {studioShots.map((shot, visualIndex) => (
                  <figure key={`${active.id}-${visualIndex}`} className="svc-studio-gallery__item">
                    <Image
                      src={shot}
                      alt={(media.alts.studioDetails[active.id] ?? [])[visualIndex] ?? ""}
                      fill
                      sizes="(max-width: 720px) 80vw, 320px"
                    />
                  </figure>
                ))}
              </div>
            ) : null}

            <div className="svc-studio-deliver svc-studio-reveal">
              <p className="svc-studio-deliver__kicker">{uiLoc("practiceDeliverables", locale)}</p>
              <ul className="svc-studio-benefits">
                {active.bullets.map((bullet, index) => (
                  <li className="svc-studio-benefit" key={bullet.en} style={{ animationDelay: `${0.05 * index}s` }}>
                    <span className="svc-studio-benefit__icon">{practiceBulletIcon(index)}</span>
                    <p>{line(bullet, locale)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="svc-studio-offer svc-studio-reveal">
              <svg className="svc-studio-offer__glyph" viewBox="0 0 48 48" aria-hidden>
                <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
                <path
                  d="M16 28l6-12 6 8 4-6 6 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <p className="svc-studio-offer__title">{line(active.cta, locale)}</p>
                <p className="svc-studio-offer__note">{uiLoc("sessionCredit", locale)}</p>
              </div>
              <Link className="btn-gold svc-studio-offer__btn" href={bookingHref(active.id)} onClick={onClose}>
                {uiLoc("bookThisPractice", locale)} →
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}