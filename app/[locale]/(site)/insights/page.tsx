import { setRequestLocale } from "next-intl/server";

export default async function InsightsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  return (
    <main id="content">
      <section className="page-hero">
        <img src="/images/offices/medellin.jpg" alt="" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">{es ? "Borradores" : "Drafts"}</p>
          <h1>{es ? "Perspectivas" : "Insights"}</h1>
          <p className="hero-lede">
            {es
              ? "Tres ensayos esperan la aprobación del cliente antes de publicarse."
              : "Three essays are waiting for client approval before they are published."}
          </p>
        </div>
      </section>
    </main>
  );
}
