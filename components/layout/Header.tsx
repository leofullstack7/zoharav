"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArtOverPhoto } from "@/components/site/ArtOverPhoto";
import { Monogram } from "@/components/brand/Monogram";
import { navigation } from "@/content/navigation";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitch } from "@/components/layout/LocaleSwitch";
import { loc } from "@/lib/i18n/loc";
import { uiLoc } from "@/lib/i18n/ui";

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
  const [mobileSub, setMobileSub] = useState<string | null>(null);
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
    setMobileGroup(null);
    setMobileSub(null);
  }, [pathname]);

  // Lock page scroll while the full-screen mobile menu is open, hide the
  // floating widgets that would otherwise sit on top of it, and let Escape
  // close it.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("menu-open");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className={`site-header${solid || mega ? " is-solid" : ""}${hidden && !open && !mega ? " is-hidden" : ""}`}>
        <Link href="/" className="brand">
          <Monogram priority />
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
          <LocaleSwitch locale={locale} />
          <Link href="/booking" className="btn-gold">
            {uiLoc("bookShort", locale)} <span aria-hidden>→</span>
          </Link>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-label={open ? uiLoc("closeMenu", locale) : uiLoc("openMenu", locale)}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`menu-icon${open ? " is-open" : ""}`} aria-hidden>
            <i />
            <i />
            <i />
          </span>
        </button>
      </header>
      {open ? (
        <div className="fullscreen-menu">
          {navigation.map((item) =>
            item.id === "services" ? (
              <div key={item.id} className="mobile-services">
                <button
                  type="button"
                  className="mobile-services-toggle"
                  aria-expanded={Boolean(mobileGroup)}
                  onClick={() => {
                    setMobileGroup((value) => (value ? null : services[0].slug));
                    setMobileSub(null);
                  }}
                >
                  {loc(item.label, locale)}
                  <span aria-hidden>{mobileGroup ? "−" : "+"}</span>
                </button>
                {mobileGroup ? (
                  <div>
                    {services.map((entry) => (
                      <div key={entry.slug}>
                        <div className="mobile-service-row">
                          <Link href={`/services/${entry.slug}`} onClick={() => setOpen(false)}>
                            {loc(entry.name, locale)}
                          </Link>
                          <button
                            type="button"
                            aria-expanded={mobileSub === entry.slug}
                            onClick={() => setMobileSub((value) => (value === entry.slug ? null : entry.slug))}
                            aria-label={uiLoc("subservices", locale)}
                          >
                            {mobileSub === entry.slug ? "−" : "+"}
                          </button>
                        </div>
                        {mobileSub === entry.slug
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
              <Link key={item.id} href={item.href} onClick={() => setOpen(false)}>
                {loc(item.label, locale)}
              </Link>
            ),
          )}
          <Link href="/booking" className="mobile-cta" onClick={() => setOpen(false)}>
            {uiLoc("bookConsultation", locale)}
          </Link>
          <LocaleSwitch locale={locale} className="mobile-lang lang-switch" onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </>
  );
}
