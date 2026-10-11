import { sectors } from "@/content/sectors";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";
import { setRequestLocale } from "next-intl/server";

export default async function SectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="content">
      <section className="page-hero">
        <img src="/images/hero/yacht.jpg" alt="" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">{locale === "es" ? "Industrias" : "Industries"}</p>
          <h1>{locale === "es" ? "Sectores" : "Sectors"}</h1>
        </div>
      </section>
      <section className="panel">
        <div className="cards-2">
          {sectors.map((sector) => (
            <article className="soft-card" key={sector.id}>
              <h3>{loc(sector.name, locale)}</h3>
              <p>{loc(sector.summary, locale)}</p>
              <p className="kicker">
                {sector.services.map((slug) => (
                  <Link key={slug} href={`/services/${slug}`} style={{ marginRight: "0.8rem" }}>
                    {slug}
                  </Link>
                ))}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
