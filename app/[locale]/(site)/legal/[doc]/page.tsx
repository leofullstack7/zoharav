import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getLegalDoc, isLegalDocId, legalDocIds } from "@/lib/content/legalDocs";
import { getSiteImage } from "@/lib/images/getSiteImage";
import { renderLegalMarkdown } from "@/lib/content/renderLegalMarkdown";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => legalDocIds.map((doc) => ({ locale, doc })));
}

export default async function LegalDocPage({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}) {
  const { locale, doc } = await params;
  setRequestLocale(locale);

  if (!isLegalDocId(doc)) notFound();

  const legalDoc = getLegalDoc(doc, locale);
  // No SVG art backs this hero (it always showed the plain photo, even
  // before the SVG-art pass elsewhere) — just resolve the admin's current
  // image for the slot, with /images/firm/office.jpg as the documented
  // fallback. No ArtOverPhoto layering needed here.
  const heroImage = await getSiteImage("legal.hero");

  return (
    <main id="content">
      <section className="page-hero">
        <Image src={heroImage} alt="" fill priority sizes="100vw" />
        <div className="veil" />
        <div className="copy">
          <p className="eyebrow">Legal</p>
          <h1>{legalDoc.frontmatter.title}</h1>
        </div>
      </section>
      <section className="panel">
        <div className="legal-doc">{renderLegalMarkdown(legalDoc.body)}</div>
      </section>
    </main>
  );
}
