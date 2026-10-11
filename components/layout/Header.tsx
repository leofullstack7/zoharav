"use client";

import { useEffect, useState } from "react";
import { Monogram } from "@/components/brand/Monogram";
import { navigation } from "@/content/navigation";
import { site } from "@/content/site";
import { Link, usePathname } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";

export function Header({ locale }: { locale: string }) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

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
  }, [pathname]);

  return (
    <>
      <header className={`site-header${solid ? " is-solid" : ""}${hidden && !open ? " is-hidden" : ""}`}>
        <Link href="/" className="brand">
          <Monogram />
          <span>
            <span className="brand-name">{site.name}</span>
            <span className="brand-sub">{site.descriptor}</span>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {navigation.map((item) => (
            <Link key={item.id} href={item.href} className={pathname === item.href ? "is-active" : ""}>
              {loc(item.label, locale)}
            </Link>
          ))}
          <Link href="/" locale={locale === "es" ? "en" : "es"} className="lang-link">
            {locale === "es" ? "EN" : "ES"}
          </Link>
          <Link href="/booking" className="btn-gold">
            {locale === "es" ? "Reservar" : "Book"} <span aria-hidden>→</span>
          </Link>
        </nav>
        <button className="menu-toggle" type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? "×" : "☰"}
        </button>
      </header>
      {open ? (
        <div className="fullscreen-menu">
          {navigation.map((item) => (
            <Link key={item.id} href={item.href}>
              {loc(item.label, locale)}
            </Link>
          ))}
          <Link href="/booking">{locale === "es" ? "Reservar consulta" : "Book a consultation"}</Link>
        </div>
      ) : null}
    </>
  );
}
