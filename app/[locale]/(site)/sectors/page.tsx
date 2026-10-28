import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { sectors } from "@/content/sectors";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";
import { buildPageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const es = locale === "es";
  const names = sectors.map((sector) => loc(sector.name, locale)).join(", ");
  return buildPageMetadata({
    locale,
    path: "/sectors",
    title: es ? "Sectores" : "Sectors",
    description: es ? `Asesoría para: ${names}.` : `Advisory for: ${names}.`,
    image: "/images/hero/yacht.svg",
  });
}

export default async function SectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="content">
      <section className="page-hero">
        <Image src="/images/hero/yacht.svg" alt="" fill priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">{locale === "es" ? "Industrias" : "Industries"}</p>
          <h1>{locale === "es" ? "Sectores" : "Sectors"}</h1>
        </div>
      </section>
      <section className="panel">
        <div className="cards-2">
          {sectors.map((sector, index) => (
            <Reveal delay={index * 70} key={sector.id}>
              <article className="soft-card">
                <h3>{loc(sector.name, locale)}</h3>
                <p>{loc(sector.summary, locale)}</p>
                <p className="kicker">
                  {sector.services.map((slug) => (
                    <Link key={slug} href={`/services/${slug}`} style={{ marginRight: "0.8rem" }}>
                      {slug}
                    </Link>
                  ))}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
