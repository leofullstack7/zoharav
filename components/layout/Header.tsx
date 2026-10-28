"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Monogram } from "@/components/brand/Monogram";
import { navigation } from "@/content/navigation";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { Link, usePathname } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";

export function Header({ locale }: { locale: string }) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [activeService, setActiveService] = useState(services[0].slug);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const service = services.find((item) => item.slug === activeService) ?? services[0];

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
    setReady(true);
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
                  className={ready && pathname.startsWith("/services") ? "is-active" : ""}
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
                      <button
                        key={entry.slug}
                        type="button"
                        className={entry.slug === service.slug ? "is-on" : ""}
                        onMouseEnter={() => setActiveService(entry.slug)}
                        onFocus={() => setActiveService(entry.slug)}
                        onClick={() => setActiveService(entry.slug)}
                      >
                        {loc(entry.name, locale)}
                      </button>
                    ))}
                  </div>
                  <div className="mega-list">
                    {service.subServices.map((sub) => (
                      <Link key={sub.id} href={`/services/${service.slug}#${sub.id}`}>
                        {loc(sub.title, locale)}
                      </Link>
                    ))}
                    <p>{loc(service.cardLine, locale)}</p>
                  </div>
                  <Link className="mega-shot" href={`/services/${service.slug}`}>
                    <Image src={service.image} alt="" fill sizes="240px" />
                    <span>{loc(service.name, locale)}</span>
                  </Link>
                </div>
              </div>
            ) : (
              <Link key={item.id} href={item.href} className={ready && pathname === item.href ? "is-active" : ""}>
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
                        <button type="button" onClick={() => setMobileGroup(entry.slug)}>
                          {loc(entry.name, locale)}
                        </button>
                        {mobileGroup === entry.slug
                          ? entry.subServices.map((sub) => (
                              <Link key={sub.id} href={`/services/${entry.slug}#${sub.id}`}>
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
