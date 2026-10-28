import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { legalDocIds } from "@/lib/content/legalDocs";
import { getPublishedInsights } from "@/lib/content/insights";

type Entry = {
  path: string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
};

const staticEntries: Entry[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/about", changeFrequency: "yearly", priority: 0.7 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/sectors", changeFrequency: "monthly", priority: 0.7 },
  { path: "/global-presence", changeFrequency: "yearly", priority: 0.6 },
  { path: "/insights", changeFrequency: "weekly", priority: 0.6 },
  { path: "/booking", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    ...staticEntries,
    ...services.map((service) => ({
      path: `/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...legalDocIds.map((doc) => ({
      path: `/legal/${doc}`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    ...getPublishedInsights("en").map((insight) => ({
      path: `/insights/${insight.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];

  return entries.flatMap(({ path, changeFrequency, priority }) =>
    routing.locales.map((locale) => ({
      url: new URL(getPathname({ href: path, locale }), site.url).toString(),
      changeFrequency,
      priority,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((altLocale) => [
            altLocale,
            new URL(getPathname({ href: path, locale: altLocale }), site.url).toString(),
          ]),
        ),
      },
    })),
  );
}
