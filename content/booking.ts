import type { Localized, ServiceSlug } from "./types";

export type BookingOption = {
  id: string;
  label: Localized;
};

export type BookingCategory = {
  id: ServiceSlug;
  name: Localized;
  image: string;
  options: BookingOption[];
};

/** Session categories. Technology lines from the previous booking flow are not included. */
export const bookingCategories: BookingCategory[] = [
  {
    id: "strategic-operational-consulting",
    name: {
      en: "Strategic & Operational Consulting",
      es: "Consultoría estratégica y operativa",
    },
    image: "/images/services/strategic-operational.jpg",
    options: [
      { id: "business-strategy", label: { en: "Business Strategy & Transformation", es: "Estrategia de negocio y transformación" } },
      { id: "energy-industrial", label: { en: "Energy & Industrial Strategy", es: "Estrategia energética e industrial" } },
      { id: "sustainability-advisory", label: { en: "Sustainability & Energy Transition Advisory", es: "Asesoría en sostenibilidad y transición energética" } },
      { id: "process", label: { en: "Process Optimization", es: "Optimización de procesos" } },
      { id: "supply-chain", label: { en: "Supply Chain Optimization", es: "Optimización de la cadena de suministro" } },
      { id: "assets", label: { en: "Asset Management", es: "Gestión de activos" } },
      { id: "kpi", label: { en: "Performance & KPI Systems", es: "Desempeño y sistemas de indicadores" } },
    ],
  },
  {
    id: "investment-financial-advisory",
    name: {
      en: "Investment & Financial Advisory",
      es: "Asesoría de inversión y finanzas",
    },
    image: "/images/services/investment.jpg",
    options: [
      { id: "valuation", label: { en: "Valuation & Financial Modeling", es: "Valoración y modelación financiera" } },
      { id: "capital", label: { en: "Capital Raising (Debt & Equity)", es: "Levantamiento de capital (deuda y equity)" } },
      { id: "ma", label: { en: "M&A Advisory", es: "Asesoría en fusiones y adquisiciones" } },
      { id: "diligence", label: { en: "Due Diligence & Deal Readiness", es: "Debida diligencia y preparación de la transacción" } },
      { id: "project-finance", label: { en: "Project Finance & PPP Structuring", es: "Project finance y estructuración de APP" } },
      { id: "hedging", label: { en: "Risk Management & Hedging", es: "Gestión de riesgo y cobertura" } },
      { id: "restructuring", label: { en: "Restructuring & Turnaround", es: "Reestructuración y recuperación" } },
      { id: "fpa", label: { en: "FP&A & Reporting", es: "Planeación financiera y reportería" } },
    ],
  },
  {
    id: "energy-transition",
    name: { en: "Energy Transition", es: "Transición energética" },
    image: "/images/services/energy-transition.jpg",
    options: [
      { id: "decarbonization", label: { en: "Decarbonization Strategy", es: "Estrategia de descarbonización" } },
      { id: "og-transition", label: { en: "Oil & Gas Transition Advisory", es: "Asesoría de transición en petróleo y gas" } },
      { id: "renewables", label: { en: "Renewable Integration", es: "Integración de renovables" } },
      { id: "ccs", label: { en: "CCS & Low-Carbon Technologies", es: "CCS y tecnologías de bajo carbono" } },
      { id: "efficiency", label: { en: "Industrial Energy Efficiency", es: "Eficiencia energética industrial" } },
    ],
  },
  {
    id: "oil-and-energy",
    name: { en: "Oil & Energy", es: "Petróleo y energía" },
    image: "/images/services/oil-and-energy.jpg",
    options: [
      { id: "ep", label: { en: "Exploration & Production Advisory", es: "Asesoría en exploración y producción" } },
      { id: "infrastructure", label: { en: "Infrastructure & Logistics", es: "Infraestructura y logística" } },
      { id: "regulatory", label: { en: "Regulatory & Government Relations", es: "Regulación y relaciones con gobiernos" } },
      { id: "transition", label: { en: "Energy Transition & Renewables", es: "Transición energética y renovables" } },
    ],
  },
  {
    id: "mining-natural-resources",
    name: { en: "Mining & Natural Resources", es: "Minería y recursos naturales" },
    image: "/images/services/mining.jpg",
    options: [
      { id: "gold", label: { en: "Gold & Precious Metals", es: "Oro y metales preciosos" } },
      { id: "emeralds", label: { en: "Emeralds & Gemstones", es: "Esmeraldas y gemas" } },
      { id: "development", label: { en: "Exploration & Development Advisory", es: "Asesoría en exploración y desarrollo" } },
      { id: "sustainable", label: { en: "Sustainable Mining Practices", es: "Prácticas mineras sostenibles" } },
      { id: "market-access", label: { en: "Market Access & Global Trade", es: "Acceso a mercado y comercio global" } },
    ],
  },
  {
    id: "sustainability-esg",
    name: { en: "Sustainability & ESG", es: "Sostenibilidad y ESG" },
    image: "/images/services/sustainability.jpg",
    options: [
      { id: "esg", label: { en: "ESG Strategy", es: "Estrategia ESG" } },
      { id: "net-zero", label: { en: "Net-Zero Roadmap", es: "Hoja de ruta de cero neto" } },
      { id: "climate-risk", label: { en: "Climate Risk Assessment", es: "Evaluación de riesgo climático" } },
      { id: "circular", label: { en: "Circular Economy", es: "Economía circular" } },
      { id: "community", label: { en: "Community & Social License", es: "Comunidad y licencia social" } },
    ],
  },
];

export const bookingCopy = {
  title: { en: "Book a Strategic Session", es: "Reserve una sesión estratégica" },
  intro: {
    en: "A 60-minute session with a senior advisor. USD $500, credited toward the full engagement if you proceed. Virtual or in person. Payment is handled securely at checkout.",
    es: "Una sesión de 60 minutos con un asesor senior. USD $500, acreditables al encargo completo si decide continuar. Virtual o presencial. El pago se procesa de forma segura al finalizar.",
  },
  badges: [
    { en: "60-min session", es: "Sesión de 60 min" },
    { en: "Secure payment", es: "Pago seguro" },
    { en: "Virtual or in-person", es: "Virtual o presencial" },
  ] satisfies Localized[],
  productName: {
    en: "Consulting Session – Zoharav Advisory",
    es: "Sesión de consultoría – Zoharav Advisory",
  },
  creditNote: {
    en: "Credited toward the full engagement",
    es: "Acreditable al encargo completo",
  },
};
