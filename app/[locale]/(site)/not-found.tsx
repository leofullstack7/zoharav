import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function SiteNotFound() {
  const locale = await getLocale();
  const es = locale === "es";

  return (
    <main id="content">
      <section className="page-hero">
        <Image src="/images/firm/office.svg" alt="" fill priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">404</p>
          <h1>{es ? "Esta página no existe" : "This page does not exist"}</h1>
          <p className="hero-lede">
            {es
              ? "El enlace puede haber cambiado o la página ya no está disponible. Vuelva al inicio o explore nuestros servicios."
              : "The link may have moved or the page is no longer available. Return home or explore our services."}
          </p>
          <div className="hero-actions">
            <Link className="btn-gold" href="/">
              {es ? "Ir al inicio" : "Back to home"} →
            </Link>
            <Link className="btn-gold" href="/services">
              {es ? "Ver servicios" : "View services"} →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
