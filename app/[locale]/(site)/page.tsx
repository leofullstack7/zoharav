import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HomeExperience } from "@/components/home/HomeExperience";
import { site } from "@/content/site";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const es = locale === "es";
  return buildPageMetadata({
    locale,
    path: "/",
    absoluteTitle: true,
    title: es ? site.seo.title.es : site.seo.title.en,
    description: es ? site.seo.description.es : site.seo.description.en,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="content">
      <HomeExperience locale={locale} />
    </main>
  );
}
