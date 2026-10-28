"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function Parallax({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = photo.current;
    const box = frame.current;
    if (!image || !box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;
    const paint = () => {
      const rect = box.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const shift = Math.max(-48, Math.min(48, center * -0.12));
      image.style.transform = `translate3d(0, ${shift}px, 0) scale(1.14)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className={`parallax${className ? ` ${className}` : ""}`} ref={frame}>
      <Image ref={photo} src={src} alt={alt} fill sizes="100vw" />
    </div>
  );
}
