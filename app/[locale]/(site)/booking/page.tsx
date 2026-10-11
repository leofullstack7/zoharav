import { bookingCategories, bookingCopy } from "@/content/booking";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";
import { setRequestLocale } from "next-intl/server";

export default async function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="content">
      <section className="page-hero">
        <img src="/images/firm/office.jpg" alt="" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">USD {site.booking.amount}</p>
          <h1>{loc(bookingCopy.title, locale)}</h1>
          <p className="hero-lede">{loc(bookingCopy.intro, locale)}</p>
        </div>
      </section>
      <section className="panel">
        <div className="cards-2">
          {bookingCategories.map((category) => (
            <article className="soft-card" key={category.id}>
              <h3>{loc(category.name, locale)}</h3>
              <ul className="diamonds">
                {category.options.map((option) => (
                  <li key={option.id}>{loc(option.label, locale)}</li>
                ))}
              </ul>
              <Link className="text-link" href="/contact">
                {locale === "es" ? "Solicitar esta sesión" : "Request this session"}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
