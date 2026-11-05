import type { Metadata } from "next";
import { ServiceExperience } from "@/components/services/ServiceExperience";
import { getOffer, getService, services } from "@/content/services";
import { loc } from "@/lib/i18n/loc";
import { getSiteImagePhoto } from "@/lib/images/getSiteImage";
import { buildPageMetadata, trimCopy } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

/**
 * Legacy deep links `/services/[slug]/[item]` keep working by rendering
 * the unified service page with that practice opened in the modal.
 * New navigation uses `/services/[slug]#item` only.
 */
export function generateStaticParams() {
  return services.flatMap((service) =>
    service.subServices.map((sub) => ({ slug: service.slug, item: sub.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; item: string }>;
}): Promise<Metadata> {
  const { locale, slug, item } = await params;
  const offer = getOffer(slug, item);
  if (!offer) return {};
  const { service, subService } = offer;

  return buildPageMetadata({
    locale,
    path: `/services/${slug}`,
    title: `${loc(subService.title, locale)} · ${loc(service.name, locale)}`,
    description: trimCopy(loc(subService.body, locale)),
    image: service.image,
  });
}

export default async function ServiceItemPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; item: string }>;
}) {
  const { locale, slug, item } = await params;
  setRequestLocale(locale);
  const offer = getOffer(slug, item);
  const service = getService(slug);
  if (!offer || !service) notFound();
  const coverPhoto = await getSiteImagePhoto(`services.${service.slug}.cover`);

  return (
    <ServiceExperience
      service={service}
      locale={locale}
      coverPhoto={coverPhoto}
      initialSubId={item}
    />
  );
}
