import { Atmosphere } from "@/components/layout/Atmosphere";
import { Bubbles } from "@/components/layout/Bubbles";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <Atmosphere />
      <div className="zh-grain" aria-hidden />
      <Header locale={locale} />
      <div className="stage">{children}</div>
      <Footer locale={locale} />
      <Bubbles locale={locale} />
    </>
  );
}
