import type { Metadata } from "next";
import { ArtOverPhoto } from "@/components/site/ArtOverPhoto";
import { BookingForm } from "@/components/booking/BookingForm";
import { Reveal } from "@/components/motion/Reveal";
import { bookingCategories, bookingCopy } from "@/content/booking";
import { site } from "@/content/site";
import { loc } from "@/lib/i18n/loc";
import { getSiteImagePhoto } from "@/lib/images/getSiteImage";
import { buildPageMetadata, trimCopy } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/booking",
    title: loc(bookingCopy.title, locale),
    description: trimCopy(loc(bookingCopy.intro, locale)),
    image: "/images/firm/office.svg",
  });
}

export default async function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seeMore = locale === "es" ? "Ver más" : "See more";
  const heroPhoto = await getSiteImagePhoto("booking.hero");
  return (
    <main id="content">
      <section className="page-hero">
        <ArtOverPhoto photoUrl={heroPhoto} artSrc="/images/firm/office.svg" priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">USD {site.booking.amount}</p>
          <h1>{loc(bookingCopy.title, locale)}</h1>
          <p className="hero-lede">{loc(bookingCopy.intro, locale)}</p>
        </div>
      </section>
      <section className="panel">
        <div className="booking-grid">
          {bookingCategories.map((category, index) => {
            const categoryName = loc(category.name, locale);
            return (
              <Reveal delay={index * 70} key={category.id}>
                {/* Native <details>/<summary> disclosure — same resilient,
                    JS-optional pattern as the FAQ accordion. The category
                    stays collapsed to just its image + name + the diagonal
                    corner button until the visitor opens it; the options
                    list and BookingForm are already in the DOM underneath. */}
                <details className="booking-card">
                  <summary
                    className="booking-card-summary"
                    aria-label={`${seeMore} — ${categoryName}`}
                  >
                    <span
                      className="booking-card-media"
                      aria-hidden="true"
                      style={{ backgroundImage: `url(${category.image})` }}
                    />
                    <span className="booking-card-name">{categoryName}</span>
                    <span className="booking-card-toggle" aria-hidden="true">
                      <span className="booking-card-icon" />
                    </span>
                    <span className="sr-only">{seeMore}</span>
                  </summary>
                  <div className="booking-card-panel">
                    <div>
                      <ul className="diamonds">
                        {category.options.map((option) => (
                          <li key={option.id}>{loc(option.label, locale)}</li>
                        ))}
                      </ul>
                      <BookingForm category={category} locale={locale} />
                    </div>
                  </div>
                </details>
              </Reveal>
            );
          })}
        </div>
      </section>
    </main>
  );
}
