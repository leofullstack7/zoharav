import { ContactForm } from "@/components/site/ContactForm";
import { chapters } from "@/content/home";
import { site } from "@/content/site";
import { loc } from "@/lib/i18n/loc";
import { setRequestLocale } from "next-intl/server";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="content">
      <section className="page-hero">
        <img src="/images/contact/tower.jpg" alt="" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">08</p>
          <h1>{locale === "es" ? "La comunicación es la clave" : "Communication is key"}</h1>
          <p className="hero-lede">{loc(chapters.contact.body, locale)}</p>
        </div>
      </section>
      <section className="panel">
        <p className="kicker">{site.email}</p>
        <ContactForm locale={locale} />
      </section>
    </main>
  );
}
