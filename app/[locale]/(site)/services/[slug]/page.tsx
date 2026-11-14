import type { Metadata } from "next";
import { ServiceExperience } from "@/components/services/ServiceExperience";
import { getService, services } from "@/content/services";
import { loc } from "@/lib/i18n/loc";
import { getSiteImagePhoto } from "@/lib/images/getSiteImage";
import { resolveServicePageMedia } from "@/lib/images/resolveServicePageMedia";
import { buildPageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return buildPageMetadata({
    locale,
    path: `/services/${slug}`,
    title: loc(service.name, locale),
    description: loc(service.heroIntro, locale),
    image: service.image,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = getService(slug);
  if (!service) notFound();
  const [coverPhoto, media] = await Promise.all([
    getSiteImagePhoto(`services.${service.slug}.cover`),
    resolveServicePageMedia(service),
  ]);

  return <ServiceExperience service={service} locale={locale} coverPhoto={coverPhoto} media={media} />;
}
