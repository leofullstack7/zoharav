"use client";

import { gsap, registerGsap } from "./gsap";

/** Heavy GSAP plugins stay out of the root bundle until a section asks for them. */
export async function loadSplitText() {
  registerGsap();
  const { SplitText } = await import("gsap/SplitText");
  gsap.registerPlugin(SplitText);
  return SplitText;
}

export async function loadFlip() {
  registerGsap();
  const { Flip } = await import("gsap/Flip");
  gsap.registerPlugin(Flip);
  return Flip;
}

export async function loadDrawSVG() {
  registerGsap();
  const { DrawSVGPlugin } = await import("gsap/DrawSVGPlugin");
  gsap.registerPlugin(DrawSVGPlugin);
  return DrawSVGPlugin;
}
