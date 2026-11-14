import type { Metadata } from "next";
import { Bodoni_Moda, Cinzel, Cormorant_Garamond, Manrope } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CookieConsent } from "@/components/site/CookieConsent";
import { site } from "@/content/site";
import { routing } from "@/i18n/routing";
import { loc } from "@/lib/i18n/loc";
import { isRtl, openGraphLocale } from "@/lib/i18n/locale";
import { SmoothScroll } from "@/lib/motion";
import "@/styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-cinzel",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = loc(site.seo.description, locale);
  const title = loc(site.seo.title, locale);
  const ogLocale = openGraphLocale(locale);

  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: "%s · ZOHARAV & CO." },
    description: copy,
    keywords: [...site.seo.keywords],
    openGraph: {
      title,
      description: copy,
      siteName: site.name,
      locale: ogLocale,
      type: "website",
      images: [{ url: "/images/firm/office.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: copy,
      images: ["/images/firm/office.png"],
    },
    robots: { index: true, follow: true },
  };
}

function organizationJsonLd() {
  const sameAs = site.social.map((s) => s.url).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/mark.png`,
    description: site.seo.description.en,
    ...(site.email ? { email: site.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("common");

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${cormorant.variable} ${manrope.variable} ${cinzel.variable} ${bodoni.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        {/* If JS never runs at all, the scroll-reveal content (opacity: 0
            until the Reveal component hydrates) must still be readable. */}
        <noscript>
          <style>{".reveal{opacity:1!important;transform:none!important;filter:none!important;}"}</style>
        </noscript>
        <a className="zh-skip" href="#content">
          {t("skip")}
        </a>
        <NextIntlClientProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <CookieConsent locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
