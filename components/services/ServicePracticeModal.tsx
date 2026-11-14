"use client";

import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useRef } from "react";
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

function lockPageScroll() {
  const y = window.scrollY;
  const { body, documentElement } = document;
  body.dataset.svcScrollY = String(y);
  body.style.position = "fixed";
  body.style.top = `-${y}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";
  documentElement.style.overflow = "hidden";
  return y;
}

function unlockPageScroll() {
  const { body, documentElement } = document;
  const y = Number(body.dataset.svcScrollY ?? "0");
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  body.style.overflow = "";
  documentElement.style.overflow = "";
  delete body.dataset.svcScrollY;
  window.scrollTo(0, y);
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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const src = subImage(active, service, media);
  const paragraphs = locParagraphs(active.body, locale);
  const studioShots = media.studioDetails[active.id] ?? [];

  useEffect(() => {
    lockPageScroll();
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTop = 0;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockPageScroll();
    };
  }, [active.id, onClose]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const scroller = scrollerRef.current;
    if (!panel || !scroller) return;

    scroller.scrollTop = 0;

    if (prefersReducedMotion()) {
      panel.classList.add("is-motion-ready");
      return;
    }

    registerGsap();
    const reveal = panel.querySelectorAll<HTMLElement>("[data-reveal]");
    const banner = panel.querySelector<HTMLElement>(".svc-studio-banner__frame");
    const benefits = panel.querySelectorAll<HTMLElement>(".svc-studio-benefit");
    const offer = panel.querySelector<HTMLElement>(".svc-studio-offer");

    gsap.set(panel, { opacity: 0, y: 28, scale: 0.98 });
    if (banner) gsap.set(banner, { scale: 1.14, opacity: 0.5 });
    gsap.set(reveal, { opacity: 0, y: 36 });
    gsap.set(benefits, { opacity: 0, y: 24 });
    gsap.set(offer, { opacity: 0, y: 20, scale: 0.97 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => panel.classList.add("is-motion-ready"),
      });

      tl.to(panel, { opacity: 1, y: 0, scale: 1, duration: 0.65 }, 0)
        .to(
          banner,
          { scale: 1, opacity: 1, duration: 1.1, ease: "power2.out" },
          banner ? 0.05 : 0,
        )
        .to(reveal, { opacity: 1, y: 0, duration: 0.75, stagger: 0.09 }, 0.18)
        .to(benefits, { opacity: 1, y: 0, duration: 0.55, stagger: 0.07 }, "-=0.35")
        .to(offer, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, "-=0.2");

      if (banner) {
        gsap.to(banner, {
          scale: 1.05,
          duration: 9,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.2,
        });
      }
    }, panel);

    return () => {
      ctx.revert();
      panel.classList.remove("is-motion-ready");
    };
  }, [active.id]);

  return (
    <div className="svc-studio" ref={scrollerRef} role="dialog" aria-modal="true" aria-labelledby={titleId}>
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
          <div className="svc-studio-banner__frame">
            <Image
              src={src}
              alt={media.alts.subs[active.id] ?? ""}
              fill
              priority
              sizes="100vw"
              className="svc-studio-banner__img"
            />
          </div>
          <div className="svc-studio-banner__veil" />
          <div className="svc-studio-banner__copy" data-reveal>
            <p className="svc-kicker">{line(service.name, locale)}</p>
            <h2 id={titleId}>{line(active.title, locale)}</h2>
            <p className="svc-studio-banner__tag">{line(active.tagline, locale)}</p>
          </div>
        </header>

        <div className="svc-studio-body-wrap">
          <div className="svc-studio-inner">
            <div data-reveal>
              <PracticeModalAccent />
            </div>
            <p className="svc-studio-lede" data-reveal>
              {line(active.hover, locale)}
            </p>

            <div className="svc-studio-story" data-reveal>
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>

            {studioShots.length > 0 ? (
              <div className="svc-studio-gallery" data-reveal aria-hidden>
                {studioShots.map((shot, visualIndex) => (
                  <figure key={`${active.id}-${visualIndex}`} className="svc-studio-gallery__item">
                    <Image
                      src={shot}
                      alt={(media.alts.studioDetails[active.id] ?? [])[visualIndex] ?? ""}
                      fill
                      sizes="(max-width: 720px) 50vw, 240px"
                    />
                  </figure>
                ))}
              </div>
            ) : null}

            <div className="svc-studio-deliver" data-reveal>
              <p className="svc-studio-deliver__kicker">{uiLoc("practiceDeliverables", locale)}</p>
              <ul className="svc-studio-benefits">
                {active.bullets.map((bullet, index) => (
                  <li className="svc-studio-benefit" key={bullet.en}>
                    <span className="svc-studio-benefit__icon">{practiceBulletIcon(index)}</span>
                    <p>{line(bullet, locale)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="svc-studio-offer">
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