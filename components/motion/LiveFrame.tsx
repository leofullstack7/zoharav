"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/motion/gsap";

/** Slow Ken Burns plus scroll drift, with a closer crop on hover. GSAP owns the motion. */
export function LiveFrame({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  const frame = useRef<HTMLElement>(null);
  const photo = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const box = frame.current;
    const image = photo.current;
    if (!box || !image) return;
    registerGsap();
    if (prefersReducedMotion()) return;

    gsap.set(image, { scale: 1.08, transformOrigin: "50% 45%" });

    const drift = gsap.to(image, {
      scale: 1.16,
      xPercent: 2.2,
      duration: 16,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    const shift = gsap.fromTo(
      image,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: box,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      },
    );

    const enter = () => {
      drift.pause();
      gsap.to(image, { scale: 1.22, duration: 0.7, ease: "power3.out", overwrite: "auto" });
    };
    const leave = () => {
      gsap.to(image, {
        scale: 1.08,
        xPercent: 0,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => drift.restart(),
      });
    };

    box.addEventListener("pointerenter", enter);
    box.addEventListener("pointerleave", leave);
    return () => {
      box.removeEventListener("pointerenter", enter);
      box.removeEventListener("pointerleave", leave);
      drift.kill();
      shift.scrollTrigger?.kill();
      shift.kill();
    };
  }, []);

  return (
    <figure className="firm-photo live" ref={frame}>
      <img ref={photo} src={src} alt={alt} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
