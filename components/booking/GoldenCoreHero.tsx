"use client";

import { useEffect, useRef, type ReactNode } from "react";

type GoldenCoreInstance = { destroy: () => void };

type GoldenCoreModule = {
  init: (el: HTMLElement | null) => GoldenCoreInstance | undefined;
};

export function GoldenCoreHero({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let inst: GoldenCoreInstance | undefined;
    let alive = true;

    import(/* webpackIgnore: true */ "/esfera.js").then((mod: GoldenCoreModule) => {
      if (!alive || !heroRef.current) return;
      inst = mod.init(heroRef.current);
    });

    return () => {
      alive = false;
      inst?.destroy();
    };
  }, []);

  return (
    <section ref={heroRef} className="page-hero" data-golden-core>
      {children}
    </section>
  );
}
