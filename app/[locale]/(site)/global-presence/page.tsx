import { activeOffices } from "@/content/offices";
import { chapters } from "@/content/home";
import { isFilled, loc } from "@/lib/i18n/loc";
import { setRequestLocale } from "next-intl/server";

export default async function PresencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="content">
      <section className="page-hero">
        <img src="/images/offices/miami.jpg" alt="" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">05</p>
          <h1>{loc(chapters.presence.title, locale)}</h1>
          <p className="hero-lede">{loc(chapters.presence.body, locale)}</p>
        </div>
      </section>
      <section className="panel">
        <div className="cards-3">
          {activeOffices.map((office) => (
            <article className="soft-card" key={office.id}>
              <img src={office.image} alt="" style={{ width: "100%", height: 180, objectFit: "cover" }} />
              <h3>{loc(office.city, locale)}</h3>
              <p className="kicker">{loc(office.role, locale)}</p>
              {isFilled(office.address) ? <p>{office.address}</p> : null}
              <p>{office.timezoneLabel}</p>
              {isFilled(office.hours.en) ? <p>{loc(office.hours, locale)}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
