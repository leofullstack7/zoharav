"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { gsap, loadDraggable, prefersReducedMotion } from "@/lib/motion";
import styles from "./DragSlider.module.css";

type DraggableInstance = ReturnType<Awaited<ReturnType<typeof loadDraggable>>["create"]>[number];

/**
 * Generic momentum drag-slider, mechanically identical to
 * components/home/TeamSlider.tsx (GSAP Draggable + InertiaPlugin,
 * autoplay drift that pauses on interaction and resumes after an idle
 * delay, lazy-loaded only once the slider nears the viewport) but
 * decoupled from team-card markup so any card shape can ride it: About's
 * numbered value cards, the Sectors spotlight carousel, a sub-service's
 * methodology-phase stepper, and its sibling sub-service rail.
 *
 * `dragClickables: true` matters here specifically because several
 * callers (sector cards' service-line chips, sibling sub-service cards
 * that are themselves <Link>s) put real anchors inside each slide — GSAP
 * Draggable would otherwise refuse to start a drag on a clickable
 * descendant at all. With it enabled, Draggable's own click-vs-drag
 * disambiguation (it swallows the synthetic click once pointer movement
 * clears its threshold) keeps a real drag from also firing navigation.
 *
 * `prefers-reduced-motion` (or a visitor who never gets to move the
 * mouse, i.e. anything server-rendered before hydration) renders the
 * exact same cards in a plain static grid instead — never a JS-gated
 * empty slider.
 */
export function DragSlider<T>({
  items,
  getKey,
  renderItem,
  ariaLabel,
  hint,
  autoplayDuration = 42,
  className = "",
  gridClassName = "",
}: {
  items: readonly T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
  ariaLabel: string;
  hint?: string;
  autoplayDuration?: number;
  className?: string;
  gridClassName?: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(true);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

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
        duration: autoplayDuration,
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
        dragClickables: true,
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
  }, [reduced, inView, autoplayDuration]);

  if (reduced) {
    return (
      <div className={`${styles.staticGrid} ${gridClassName}`} role="list" aria-label={ariaLabel}>
        {items.map((item, i) => (
          <div className={styles.staticItem} role="listitem" key={getKey(item, i)}>
            {renderItem(item, i)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <Reveal>
      <div className={`${styles.viewport} ${className}`} ref={viewportRef} role="list" aria-label={ariaLabel}>
        <div className={styles.track} ref={trackRef}>
          {items.map((item, i) => (
            <div className={styles.item} role="listitem" key={getKey(item, i)}>
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>
      {hint ? <p className={styles.hint}>{hint}</p> : null}
    </Reveal>
  );
}
