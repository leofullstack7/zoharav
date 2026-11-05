import { Atmosphere } from "@/components/layout/Atmosphere";
import { Machinery } from "@/components/layout/Machinery";
import { Bubbles } from "@/components/layout/Bubbles";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ZhvBg } from "@/components/layout/ZhvBg";

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
      <div className="stage">
        <Machinery />
        <ZhvBg start="#firm" end="#investment" ambient={0.6} />
        {children}
      </div>
      <Footer locale={locale} />
      <Bubbles locale={locale} />
    </>
  );
}
