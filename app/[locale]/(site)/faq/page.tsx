import type { Metadata } from "next";
import Image from "next/image";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { homeFaqs } from "@/content/faqs";
import { site } from "@/content/site";
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
    path: "/faq",
    title: "FAQ",
    description: locale === "es" ? site.seo.description.es : site.seo.description.en,
    image: "/images/firm/office.svg",
  });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="content">
      <section className="page-hero">
        <Image src="/images/firm/office.svg" alt="" fill priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <h1>FAQ</h1>
        </div>
      </section>
      <section className="panel">
        <FaqAccordion items={homeFaqs} locale={locale} />
      </section>
    </main>
  );
}
