import { services } from "@/content/services";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";
import { setRequestLocale } from "next-intl/server";

const covers: Record<string, string> = {
  "energy-transition": "/images/hero/yacht.jpg",
  "oil-and-energy": "/images/hero/yacht.jpg",
  "mining-natural-resources": "/images/mining/emeralds.jpg",
  "sustainability-esg": "/images/sustainability/plant.jpg",
  "investment-financial-advisory": "/images/investment/handshake.jpg",
  "strategic-operational-consulting": "/images/services/jet.jpg",
};

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="content">
      <section className="page-hero">
        <img src="/images/services/jet.jpg" alt="" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">{locale === "es" ? "Seis líneas" : "Six lines"}</p>
          <h1>{locale === "es" ? "Servicios" : "Services"}</h1>
        </div>
      </section>
      <section className="panel">
        <div className="cards-2">
          {services.map((service) => (
            <Link className="soft-card" href={`/services/${service.slug}`} key={service.slug}>
              <img src={covers[service.slug]} alt="" style={{ width: "100%", height: 220, objectFit: "cover" }} />
              <h3>{loc(service.name, locale)}</h3>
              <p>{loc(service.cardLine, locale)}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
