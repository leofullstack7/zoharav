"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, prefersReducedMotion, registerGsap, ScrollTrigger } from "./gsap";

/**
 * Lenis (lerp 0.09) synced to ScrollTrigger.
 * Disabled when the visitor prefers reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return children;
}
