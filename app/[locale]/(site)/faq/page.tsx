import { homeFaqs } from "@/content/faqs";
import { loc } from "@/lib/i18n/loc";
import { setRequestLocale } from "next-intl/server";

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="content">
      <section className="page-hero">
        <img src="/images/firm/office.jpg" alt="" />
        <div className="veil" />
        <div className="copy">
          <h1>FAQ</h1>
        </div>
      </section>
      <section className="panel">
        <div className="subgrid">
          {homeFaqs.map((item) => (
            <article key={item.id}>
              <h2>{loc(item.question, locale)}</h2>
              <p>{loc(item.answer, locale)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
