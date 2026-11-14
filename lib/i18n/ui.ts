/**
 * UI strings that live outside content/*.ts (components, chat, booking chrome).
 * Arabic values resolve through ar-catalog.json when keyed by English source text.
 */
import arCatalog from "@/content/translations/ar-catalog.json";
import type { Localized } from "@/content/types";

const catalog = arCatalog as Record<string, string>;

function L(en: string, es: string): Localized {
  return { en, es };
}

export const ui = {
  bookConsultation: L("Book a consultation", "Reservar consulta"),
  bookShort: L("Book", "Reservar"),
  reserveSession: L("Reserve a session", "Reservar sesión"),
  whyTrust: L("Why the trust holds", "Por qué confiar"),
  beforePitch: L("Before the pitch", "Antes del discurso"),
  whatTrustRests: L("What the trust rests on", "Lo que sostiene la confianza"),
  professional: L("Professional", "Soporte"),
  support: L("Support", "profesional"),
  contact: L("Contact", "Contacto"),
  ourCompany: L("Our company", "La firma"),
  aboutFirm: L("About the firm", "Conocer la firma"),
  sixLinesOne: L("Six lines. One judgment.", "Seis líneas. Un criterio."),
  services: L("Services", "Servicios"),
  sixLines: L("Six lines", "Seis líneas"),
  viewAdvisory: L("View the advisory", "Ver la asesoría"),
  viewMining: L("View mining", "Ver minería"),
  viewSustainability: L("View sustainability", "Ver sostenibilidad"),
  viewInvestment: L("View investment", "Ver inversión"),
  getInTouch: L("Get in touch", "Conversemos"),
  communicationKey: L("Communication is key", "La comunicación es la clave"),
  backInsights: L("Back to Insights", "Volver a Perspectivas"),
  closeMenu: L("Close menu", "Cerrar menú"),
  openMenu: L("Open menu", "Abrir menú"),
  subservices: L("Subservices", "Subservicios"),
  theLine: L("The line", "La línea"),
  howWorkLands: L("How the work lands", "Cómo se siente el trabajo"),
  practices: L("Practices", "Prácticas"),
  eachPractice: L("Each practice, on its own terms", "Cada práctica, a su medida"),
  readMore: L("Read more", "Leer más"),
  methodology: L("Methodology", "Metodología"),
  readyMandate: L("Ready for the next mandate?", "¿Listos para el siguiente mandato?"),
  close: L("Close", "Cerrar"),
  bookThisPractice: L("Book this practice", "Agendar esta práctica"),
  viewPractices: L("View practices", "Ver prácticas"),
  company: L("Company", "Firma"),
  supportNav: L("Support", "Soporte"),
  insightsBy: L("Insights by Zoharav", "Perspectivas de Zoharav"),
  offices: L("Offices", "Oficinas"),
  rights: L("All rights reserved.", "Todos los derechos reservados."),
  practiceStep: L("Practice", "Práctica"),
  bookingSelectPractice: L("Choose a practice", "Elija una práctica"),
  bookingSelectLine: L("Choose a line", "Elija una línea"),
  openPracticeLede: L(
    "Open the detail of each sub-service, or book that consultation at once.",
    "Abra el detalle de cada subservicio o reserve esa consulta de inmediato.",
  ),
  practiceDeliverables: L("What this engagement delivers", "Qué entrega este encargo"),
  sessionCredit: L(
    "Sixty minutes with a senior advisor. The retainer credits to the engagement if you continue.",
    "Sesenta minutos con un asesor senior. La reserva se acredita al encargo si continúan.",
  ),
  newsletterBlurb: L(
    "Get select analysis delivered straight to your inbox.",
    "Reciba análisis selectos directamente en su correo.",
  ),
} satisfies Record<string, Localized>;

export function uiLoc(key: keyof typeof ui, locale: string): string {
  const row = ui[key];
  if (locale === "es") return row.es;
  if (locale === "ar") {
    const ar = catalog[row.en];
    return ar ?? row.es;
  }
  return row.en;
}

export function t3(
  locale: string,
  copy: { en: string; es: string },
): string {
  if (locale === "es") return copy.es;
  if (locale === "ar") {
    const ar = catalog[copy.en];
    return ar ?? copy.es;
  }
  return copy.en;
}