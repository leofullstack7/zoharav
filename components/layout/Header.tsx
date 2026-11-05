"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArtOverPhoto } from "@/components/site/ArtOverPhoto";
import { Monogram } from "@/components/brand/Monogram";
import { navigation } from "@/content/navigation";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { Link, usePathname } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";

type ServiceCoverPayload = Record<string, { photoUrl: string | null; art: string }>;

const emptySubscribe = () => () => {};

export function Header({ locale }: { locale: string }) {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [activeService, setActiveService] = useState(services[0].slug);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [serviceCovers, setServiceCovers] = useState<ServiceCoverPayload>({});
  const closeTimer = useRef<number | null>(null);
  const service = services.find((item) => item.slug === activeService) ?? services[0];

  // Resolves the mega-menu thumbnail through the admin's per-service image
  // slot (site_images, slot "services.<slug>.cover") instead of the
  // hardcoded content/lines/*.ts default, so a single admin upload updates
  // this thumbnail everywhere it appears (same ArtOverPhoto layering as
  // the rest of the site: photo behind, darkened; art on top). Fetched
  // client-side (the panel is hidden until hover, so this never competes
  // with the page's own LCP image) rather than baked into the shared
  // layout, which would otherwise force a full-site revalidation on every
  // service-cover upload.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/site-images/services")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data === "object") {
          setServiceCovers(data as ServiceCoverPayload);
        }
      })
      .catch(() => {
        /* keep the content/lines/*.ts default below on any failure */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMega(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(false), 280);
  };

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > last && y > 140);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [pathname]);

  return (
    <>
      <header className={`site-header${solid || mega ? " is-solid" : ""}${hidden && !open && !mega ? " is-hidden" : ""}`}>
        <Link href="/" className="brand">
          <Monogram />
          <span>
            <span className="brand-name">{site.name}</span>
            <span className="brand-sub">{site.descriptor}</span>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {navigation.map((item) =>
            item.id === "services" ? (
              <div
                key={item.id}
                className="nav-services"
                onMouseEnter={openMega}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  className={mounted && pathname.startsWith("/services") ? "is-active" : undefined}
                  aria-expanded={mega}
                  onClick={() => setMega((value) => !value)}
                >
                  {loc(item.label, locale)}
                </button>
                <div
                  className={`mega${mega ? " is-open" : ""}`}
                  role="region"
                  aria-label={loc(item.label, locale)}
                  aria-hidden={!mega}
                  inert={!mega}
                  onMouseEnter={openMega}
                  onMouseLeave={scheduleClose}
                >
                  <div className="mega-side">
                    {services.map((entry) => (
                      <Link
                        key={entry.slug}
                        href={`/services/${entry.slug}`}
                        className={entry.slug === service.slug ? "is-on" : undefined}
                        onMouseEnter={() => setActiveService(entry.slug)}
                        onFocus={() => setActiveService(entry.slug)}
                        onClick={() => setMega(false)}
                      >
                        {loc(entry.name, locale)}
                      </Link>
                    ))}
                  </div>
                  <div className="mega-list">
                    {service.subServices.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/services/${service.slug}#${sub.id}`}
                        onClick={() => setMega(false)}
                      >
                        {loc(sub.title, locale)}
                      </Link>
                    ))}
                    <Link className="mega-line-link" href={`/services/${service.slug}`} onClick={() => setMega(false)}>
                      {loc(service.cardLine, locale)}
                    </Link>
                  </div>
                  <Link className="mega-shot" href={`/services/${service.slug}`} onClick={() => setMega(false)}>
                    <ArtOverPhoto
                      photoUrl={serviceCovers[service.slug]?.photoUrl ?? null}
                      artSrc={serviceCovers[service.slug]?.art ?? service.image}
                      sizes="240px"
                    />
                    <span>{loc(service.name, locale)}</span>
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                key={item.id}
                href={item.href}
                className={mounted && pathname === item.href ? "is-active" : undefined}
              >
                {loc(item.label, locale)}
              </Link>
            ),
          )}
          <Link href="/" locale={locale === "es" ? "en" : "es"} className="lang-link">
            {locale === "es" ? "EN" : "ES"}
          </Link>
          <Link href="/booking" className="btn-gold">
            {locale === "es" ? "Reservar" : "Book"} <span aria-hidden>→</span>
          </Link>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-label={open ? (locale === "es" ? "Cerrar menú" : "Close menu") : locale === "es" ? "Abrir menú" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "×" : "☰"}
        </button>
      </header>
      {open ? (
        <div className="fullscreen-menu">
          {navigation.map((item) =>
            item.id === "services" ? (
              <div key={item.id} className="mobile-services">
                <button type="button" onClick={() => setMobileGroup((value) => (value ? null : services[0].slug))}>
                  {loc(item.label, locale)}
                </button>
                {mobileGroup ? (
                  <div>
                    {services.map((entry) => (
                      <div key={entry.slug}>
                        <div className="mobile-service-row">
                          <Link href={`/services/${entry.slug}`} onClick={() => setOpen(false)}>
                            {loc(entry.name, locale)}
                          </Link>
                          <button type="button" onClick={() => setMobileGroup(entry.slug)} aria-label="Subservices">
                            {mobileGroup === entry.slug ? "−" : "+"}
                          </button>
                        </div>
                        {mobileGroup === entry.slug
                          ? entry.subServices.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/services/${entry.slug}#${sub.id}`}
                                onClick={() => setOpen(false)}
                              >
                                {loc(sub.title, locale)}
                              </Link>
                            ))
                          : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <Link key={item.id} href={item.href}>
                {loc(item.label, locale)}
              </Link>
            ),
          )}
          <Link href="/booking">{locale === "es" ? "Reservar consulta" : "Book a consultation"}</Link>
        </div>
      ) : null}
    </>
  );
}
