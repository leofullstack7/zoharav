"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    // Anything already at or near the viewport on mount shouldn't wait on an
    // observer callback at all — reveal it immediately so first paint never
    // depends on JS timing. Only content clearly below the fold gets the
    // scroll-triggered entrance.
    const rect = node.getBoundingClientRect();
    const nearViewport = rect.top < window.innerHeight * 1.15;
    if (nearViewport) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);

    // Safety net: if the observer never fires (slow/degraded hydration,
    // a thrown error elsewhere, layout quirks, etc.) the content must not
    // stay invisible forever. Force it visible shortly regardless.
    const fallback = window.setTimeout(() => setVisible(true), 650);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${visible ? " is-in" : ""}${className ? ` ${className}` : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
