import type { Metadata } from "next";
import Image from "next/image";
import { OfficeMapSection } from "@/components/site/OfficeMapSection";
import { activeOffices } from "@/content/offices";
import { chapters } from "@/content/home";
import { isFilled, loc } from "@/lib/i18n/loc";
import { buildPageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/global-presence",
    title: loc(chapters.presence.title, locale),
    description: loc(chapters.presence.body, locale),
    image: "/images/offices/miami.svg",
  });
}

export default async function PresencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="content">
      <section className="page-hero">
        <Image src="/images/offices/miami.svg" alt="" fill priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">05</p>
          <h1>{loc(chapters.presence.title, locale)}</h1>
          <p className="hero-lede">{loc(chapters.presence.body, locale)}</p>
        </div>
      </section>
      <section className="panel">
        <OfficeMapSection offices={activeOffices} locale={locale} />

        {/* Always-rendered text directory: SEO content and a no-JS fallback
            for the interactive map above, which only mounts client-side. */}
        <noscript>
          <div className="cards-3">
            {activeOffices.map((office) => (
              <article className="soft-card" key={office.id}>
                <div style={{ position: "relative", width: "100%", height: 180 }}>
                  <Image src={office.image} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                </div>
                <h3>{loc(office.city, locale)}</h3>
                <p className="kicker">{loc(office.role, locale)}</p>
                {isFilled(office.address) ? <p>{office.address}</p> : null}
                <p>{office.timezoneLabel}</p>
                {isFilled(office.hours.en) ? <p>{loc(office.hours, locale)}</p> : null}
              </article>
            ))}
          </div>
        </noscript>
      </section>
    </main>
  );
}
