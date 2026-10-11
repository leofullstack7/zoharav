import type { Localized } from "./types";

export const site = {
  name: "ZOHARAV & CO.",
  descriptor: "GLOBAL CONSULTING & INVESTMENTS",
  signature: "Global Expertise, Local Impact",
  url: "https://www.zoharav.com",
  email: "info@zoharav.com",
  supportEmail: "support@zoharav.com",
  /**
   * TODO: client to provide real phone numbers.
   * Mockup numbers (555-0123) are fictional and must not be published.
   * Empty values are hidden in the UI.
   */
  phones: {
    main: "",
    whatsapp: "",
  },
  /** Empty URL = icon hidden. Do not use "#". */
  social: [
    { id: "linkedin", label: "LinkedIn", url: "" },
    { id: "instagram", label: "Instagram", url: "" },
    { id: "x", label: "X", url: "" },
    { id: "facebook", label: "Facebook", url: "" },
  ],
  booking: {
    amount: 500,
    currency: "USD",
    durationMinutes: 60,
  },
  taglines: [
    "Natural Resources. Global Impact.",
    "Natural Resources. Real Impact.",
    "Global Consulting for a Stronger Tomorrow",
    "Connecting Natural Wealth with a Stronger Tomorrow",
    "Resources Today. A Stronger Tomorrow.",
    "Natural Resources. Extraordinary Opportunities.",
    "Global Vision. Natural Wealth. Lasting Impact.",
    "Bridging Opportunities Across Continents.",
    "Strategy. Capital. Expertise. Real Impact.",
  ] as const,
  seo: {
    title: {
      en: "ZOHARAV & CO. | Global Consulting & Investments",
      es: "ZOHARAV & CO. | Consultoría e inversión global",
    } satisfies Localized,
    description: {
      en: "Strategic advisory in oil and energy, mining, natural resources, sustainability, and responsible investment. Zoharav advises. We do not trade, extract, or transport resources.",
      es: "Asesoría estratégica en petróleo y energía, minería, recursos naturales, sostenibilidad e inversión responsable. Zoharav asesora. No comercializamos, extraemos ni transportamos recursos.",
    } satisfies Localized,
    keywords: [
      "natural resources consulting",
      "energy transition advisory",
      "decarbonization strategy",
      "ESG advisory",
      "mining investment advisory",
      "oil and gas advisory",
      "project finance energy",
      "sustainable mining consulting",
    ],
  },
} as const;

/**
 * English is the controlling legal text, kept verbatim from the previous site.
 * Spanish is a professional translation for the ES locale.
 */
export const compliance = {
  legalSource: "en" as const,
  title: {
    en: "Compliance Statement",
    es: "Declaración de cumplimiento",
  } satisfies Localized,
  paragraphs: [
    {
      en: "Zoharav is a business consulting firm. We do not engage in the sale, distribution, supply, marketing, trading, or brokerage of petroleum, gas, or energy products. Furthermore, we do not participate in any activities involving the exploration, extraction, refining, or transportation of petroleum or gas.",
      es: "Zoharav es una firma de consultoría empresarial. No participamos en la venta, distribución, suministro, comercialización, negociación ni intermediación de petróleo, gas o productos energéticos. Tampoco participamos en actividades de exploración, extracción, refinación o transporte de petróleo o gas.",
    },
    {
      en: "Our services are strictly limited to strategic and operational consulting for businesses. Zoharav operates solely within the consulting sector and conducts all activities remotely. We do not operate in, nor are we affiliated with, any industry or entity subject to international sanctions, including those pertaining to the petroleum or fuel distribution sectors. We trust this provides the necessary clarification regarding our company's operations. Should you require any additional information or supporting documentation, please do not hesitate to contact us.",
      es: "Nuestros servicios se limitan estrictamente a la consultoría estratégica y operativa para empresas. Zoharav actúa únicamente en el sector de la consultoría y desarrolla todas sus actividades de forma remota. No operamos ni estamos afiliados a ninguna industria o entidad sujeta a sanciones internacionales, incluidas las relativas a la distribución de petróleo o combustibles. Confiamos en que esta declaración aclare el alcance de nuestras operaciones. Si necesita información adicional o documentación de soporte, no dude en contactarnos.",
    },
  ] satisfies Localized[],
  footerLine: {
    en: "Zoharav is a business consulting firm. We do not trade, sell or transport energy products.",
    es: "Zoharav es una firma de consultoría empresarial. No comercializamos, vendemos ni transportamos productos energéticos.",
  } satisfies Localized,
};
