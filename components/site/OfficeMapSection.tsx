"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Office } from "@/content/offices";

/**
 * Leaflet needs `window`/the DOM and must never run during SSR or ship in a
 * shared/global bundle. `next/dynamic` with `ssr: false` keeps it out of the
 * server render and out of any route other than the one that mounts this
 * section; the IntersectionObserver gate below additionally defers fetching
 * that chunk until the map is actually about to scroll into view.
 */
const OfficeMap = dynamic(() => import("./OfficeMap"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

function MapSkeleton() {
  return (
    <div className="office-map office-map--skeleton" aria-hidden="true">
      <div className="office-map__canvas office-map__canvas--skeleton" />
      <aside className="office-map__panel office-map__panel--skeleton" />
    </div>
  );
}

export function OfficeMapSection({ offices, locale }: { offices: Office[]; locale: string }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (inView) return;
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <div ref={ref} className="office-map-section">
      {inView ? <OfficeMap offices={offices} locale={locale} /> : <MapSkeleton />}
    </div>
  );
}
