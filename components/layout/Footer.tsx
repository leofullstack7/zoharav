import { Monogram } from "@/components/brand/Monogram";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { footerNav } from "@/content/navigation";
import { activeOffices } from "@/content/offices";
import { compliance, site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/i18n/loc";

export function Footer({ locale }: { locale: string }) {
  const year = new Date().getFullYear();
  const columns = [
    { title: locale === "es" ? "Firma" : "Company", items: footerNav.company },
    { title: locale === "es" ? "Soporte" : "Support", items: footerNav.support },
    { title: "Legal", items: footerNav.legal },
  ];

  return (
    <footer className="site-footer">
      <Monogram className="mb-4 h-14 w-14" />
      <p className="footer-word">{site.name}</p>
      <div className="footer-newsletter">
        <h3>{locale === "es" ? "Perspectivas de Zoharav" : "Insights by Zoharav"}</h3>
        <p>
          {locale === "es"
            ? "Reciba análisis selectos directamente en su correo."
            : "Get select analysis delivered straight to your inbox."}
        </p>
        <NewsletterForm locale={locale} />
      </div>
      <div className="footer-grid">
        {columns.map((column) => (
          <div key={column.title}>
            <h3>{column.title}</h3>
            <ul>
              {column.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{loc(item.label, locale)}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3>{locale === "es" ? "Oficinas" : "Offices"}</h3>
          <ul>
            {activeOffices.map((office) => (
              <li key={office.id}>{loc(office.city, locale)}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-end">
        <p>
          © {year} {site.name}. {locale === "es" ? "Todos los derechos reservados." : "All rights reserved."}
        </p>
        <p>
          <Link href="/#compliance">{loc(compliance.footerLine, locale)}</Link>
        </p>
      </div>
    </footer>
  );
}
