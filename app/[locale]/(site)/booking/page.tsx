import type { Metadata } from "next";
import Image from "next/image";
import { BookingForm } from "@/components/booking/BookingForm";
import { Reveal } from "@/components/motion/Reveal";
import { bookingCategories, bookingCopy } from "@/content/booking";
import { site } from "@/content/site";
import { loc } from "@/lib/i18n/loc";
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
  return (
    <main id="content">
      <section className="page-hero">
        <Image src="/images/firm/office.svg" alt="" fill priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">USD {site.booking.amount}</p>
          <h1>{loc(bookingCopy.title, locale)}</h1>
          <p className="hero-lede">{loc(bookingCopy.intro, locale)}</p>
        </div>
      </section>
      <section className="panel">
        <div className="cards-2">
          {bookingCategories.map((category, index) => (
            <Reveal delay={index * 70} key={category.id}>
              <article className="soft-card">
                <h3>{loc(category.name, locale)}</h3>
                <ul className="diamonds">
                  {category.options.map((option) => (
                    <li key={option.id}>{loc(option.label, locale)}</li>
                  ))}
                </ul>
                <BookingForm category={category} locale={locale} />
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
