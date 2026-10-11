"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let ready = false;

/** Brand ease: heavy silk. Reveals 0.8–1.4s, hovers 0.25–0.4s. */
export function registerGsap() {
  if (ready || typeof window === "undefined") return gsap;
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  if (!CustomEase.get("zh")) {
    CustomEase.create("zh", "0.7, 0, 0.2, 1");
  }
  ready = true;
  return gsap;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
