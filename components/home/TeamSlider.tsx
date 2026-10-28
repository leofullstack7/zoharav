"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Monogram } from "@/components/brand/Monogram";
import { Reveal } from "@/components/motion/Reveal";
import { team, type TeamMember } from "@/content/team";
import { gsap, loadDraggable, prefersReducedMotion } from "@/lib/motion";
import { loc } from "@/lib/i18n/loc";
import styles from "./TeamSlider.module.css";

type DraggableInstance = ReturnType<Awaited<ReturnType<typeof loadDraggable>>["create"]>[number];

const copy = {
  kicker: { en: "The people in the room", es: "Quiénes están en la mesa" },
  title: { en: "Our Team", es: "Nuestro equipo" },
  hint: { en: "Drag to explore the desk", es: "Arrastra para recorrer la mesa" },
  openSeat: { en: "Open Seat", es: "Vacante" },
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Z&";
  return parts
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TeamCard({
  member,
  locale,
  photoUrl,
}: {
  member: TeamMember;
  locale: string;
  photoUrl?: string | null;
}) {
  const displayName = member.placeholder ? loc(copy.openSeat, locale) : member.name;
  return (
    <article className={styles.card}>
      <div className={styles.portrait}>
        {photoUrl ? (
          // A real admin-uploaded photo exists for this seat — show it
          // plainly (no SVG art ever existed for team portraits, so there
          // is nothing to layer it behind, unlike the rest of the site's
          // ArtOverPhoto treatment).
          <Image src={photoUrl} alt={displayName} fill sizes="200px" style={{ objectFit: "cover" }} />
        ) : (
          <>
            <span className={styles.portraitSheen} aria-hidden />
            {member.placeholder ? (
              <Monogram className={styles.monogram} />
            ) : (
              <span className={styles.initials} aria-hidden>
                {initials(member.name)}
              </span>
            )}
          </>
        )}
      </div>
      <h3 className={styles.name}>{displayName}</h3>
      <p className={styles.role}>{loc(member.role, locale)}</p>
    </article>
  );
}

export function TeamSlider({
  locale,
  photos,
}: {
  locale: string;
  photos?: Record<string, string | null>;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(true);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  // The Draggable + InertiaPlugin bundle is only worth fetching once this
  // section is actually about to be seen — not unconditionally on mount,
  // which would add dragging-library weight to every first load even when
  // the slider is still below the fold.
  useEffect(() => {
    if (reduced) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced || !inView) return;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    let cancelled = false;
    let draggableInstance: DraggableInstance | undefined;
    let autoplay: ReturnType<typeof gsap.to> | undefined;
    let idleTimer: number | undefined;

    const maxScroll = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

    const startAutoplay = () => {
      autoplay?.kill();
      const bound = maxScroll();
      if (bound <= 0) return;
      const current = Number(gsap.getProperty(track, "x"));
      const goingForward = current > -bound / 2;
      autoplay = gsap.to(track, {
        x: goingForward ? -bound : 0,
        duration: 46,
        ease: "sine.inOut",
        onComplete: startAutoplay,
      });
    };

    const scheduleResume = () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(startAutoplay, 2600);
    };

    const stopAutoplay = () => {
      autoplay?.kill();
      if (idleTimer) window.clearTimeout(idleTimer);
    };

    const handleResize = () => {
      draggableInstance?.applyBounds({ minX: -maxScroll(), maxX: 0 });
    };

    (async () => {
      const Draggable = await loadDraggable();
      if (cancelled || !viewport || !track) return;

      draggableInstance = Draggable.create(track, {
        type: "x",
        inertia: true,
        edgeResistance: 0.65,
        bounds: { minX: -maxScroll(), maxX: 0 },
        onPressInit: stopAutoplay,
        onDragEnd: scheduleResume,
        onThrowComplete: scheduleResume,
      })[0];

      window.addEventListener("resize", handleResize);
      startAutoplay();
    })();

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
      if (idleTimer) window.clearTimeout(idleTimer);
      autoplay?.kill();
      draggableInstance?.kill();
    };
  }, [reduced, inView]);

  return (
    <section className={`chapter ${styles.section}`} id="team" aria-labelledby="team-heading">
      <div className={styles.glow} aria-hidden />
      <div className="firm-layout">
        <Reveal>
          <header className="firm-head">
            <p className="firm-kicker">
              <span aria-hidden>{"—"}</span>
              {loc(copy.kicker, locale)}
            </p>
            <h2 id="team-heading">{loc(copy.title, locale)}</h2>
          </header>
        </Reveal>
      </div>

      {reduced ? (
        <div className={styles.staticGrid}>
          {team.map((member) => (
            <TeamCard key={member.id} member={member} locale={locale} photoUrl={photos?.[member.id]} />
          ))}
        </div>
      ) : (
        <Reveal>
          <div className={styles.viewport} ref={viewportRef}>
            <div className={styles.track} ref={trackRef}>
              {team.map((member) => (
                <TeamCard key={member.id} member={member} locale={locale} photoUrl={photos?.[member.id]} />
              ))}
            </div>
          </div>
          <p className={styles.hint}>{loc(copy.hint, locale)}</p>
        </Reveal>
      )}
    </section>
  );
}
