import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/site/ContactForm";
import { chapters } from "@/content/home";
import { site } from "@/content/site";
import { loc } from "@/lib/i18n/loc";
import { buildPageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const es = locale === "es";
  return buildPageMetadata({
    locale,
    path: "/contact",
    title: es ? "Contacto" : "Contact",
    description: loc(chapters.contact.body, locale),
    image: "/images/contact/tower.svg",
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="content">
      <section className="page-hero">
        <Image src="/images/contact/tower.svg" alt="" fill priority sizes="100vw" />
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
