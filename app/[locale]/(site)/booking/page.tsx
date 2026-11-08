import type { Metadata } from "next";
import { ArtOverPhoto } from "@/components/site/ArtOverPhoto";
import { BookingExperience } from "@/components/booking/BookingExperience";
import { GoldenCoreHero } from "@/components/booking/GoldenCoreHero";
import { Reveal } from "@/components/motion/Reveal";
import { bookingCategories, bookingCopy } from "@/content/booking";
import { site } from "@/content/site";
import { loc } from "@/lib/i18n/loc";
import { getSiteImagePhoto, getSiteImagePhotos } from "@/lib/images/getSiteImage";
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
  const [heroPhoto, categoryPhotos] = await Promise.all([
    getSiteImagePhoto("booking.hero"),
    getSiteImagePhotos(bookingCategories.map((category) => `booking.category.${category.id}`)),
  ]);
  return (
    <main id="content">
      <GoldenCoreHero>
        <ArtOverPhoto photoUrl={heroPhoto} artSrc="/images/firm/office.svg" priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">USD {site.booking.amount}</p>
          <h1>{loc(bookingCopy.title, locale)}</h1>
          <p className="hero-lede">{loc(bookingCopy.intro, locale)}</p>
        </div>
      </GoldenCoreHero>
      <section className="panel">
        <Reveal>
          <BookingExperience locale={locale} categories={bookingCategories} photos={categoryPhotos} />
        </Reveal>
      </section>
    </main>
  );
}
