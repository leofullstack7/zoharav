import type { Localized } from "./types";

export type NavItem = {
  id: string;
  href: string;
  label: Localized;
};

export const navigation: NavItem[] = [
  { id: "home", href: "/", label: { en: "Home", es: "Inicio" } },
  { id: "about", href: "/about", label: { en: "About", es: "La firma" } },
  { id: "services", href: "/services", label: { en: "Services", es: "Servicios" } },
  { id: "sectors", href: "/sectors", label: { en: "Sectors", es: "Sectores" } },
  {
    id: "global",
    href: "/global-presence",
    label: { en: "Global Presence", es: "Presencia global" },
  },
  { id: "insights", href: "/insights", label: { en: "Insights", es: "Perspectivas" } },
  { id: "contact", href: "/contact", label: { en: "Contact", es: "Contacto" } },
];

export const footerNav = {
  company: [
    { href: "/about", label: { en: "About", es: "La firma" } },
    { href: "/services", label: { en: "Services", es: "Servicios" } },
    { href: "/global-presence", label: { en: "Global Presence", es: "Presencia global" } },
    { href: "/insights", label: { en: "Insights", es: "Perspectivas" } },
  ],
  support: [
    { href: "/contact", label: { en: "Contact", es: "Contacto" } },
    { href: "/faq", label: { en: "FAQ", es: "Preguntas" } },
    { href: "/booking", label: { en: "Book a Consultation", es: "Reservar una consulta" } },
  ],
  legal: [
    { href: "/legal/privacy", label: { en: "Privacy", es: "Privacidad" } },
    { href: "/legal/terms", label: { en: "Terms", es: "Términos" } },
    { href: "/legal/refund", label: { en: "Refund", es: "Reembolsos" } },
    { href: "/legal/damage", label: { en: "Damage", es: "Daños" } },
  ],
} as const;

export const homePillars = [
  {
    id: "oil-and-energy",
    href: "/services/oil-and-energy",
    title: { en: "Oil & Energy", es: "Petróleo y energía" },
    lines: {
      en: "Exploration & Production Advisory. Development Advisory. Strategic Partnerships.",
      es: "Asesoría en exploración y producción. Asesoría en desarrollo. Alianzas estratégicas.",
    },
    image: "/images/pillars/oil-energy.jpg",
    icon: "derrick",
  },
  {
    id: "mining",
    href: "/services/mining-natural-resources",
    title: { en: "Mining", es: "Minería" },
    lines: {
      en: "Gold, Emeralds & Strategic Minerals. Sustainable Growth.",
      es: "Oro, esmeraldas y minerales estratégicos. Crecimiento sostenible.",
    },
    image: "/images/pillars/mining.jpg",
    icon: "gem",
  },
  {
    id: "investment",
    href: "/services/investment-financial-advisory",
    title: { en: "Investment & Advisory", es: "Inversión y asesoría" },
    lines: {
      en: "Global Opportunities. Local Expertise.",
      es: "Oportunidades globales. Criterio local.",
    },
    image: "/images/pillars/investment.jpg",
    icon: "chart",
  },
  {
    id: "sustainability",
    href: "/services/sustainability-esg",
    title: { en: "Sustainability", es: "Sostenibilidad" },
    lines: {
      en: "People. Environment. Long-Term Value.",
      es: "Personas. Entorno. Valor de largo plazo.",
    },
    image: "/images/pillars/sustainability.jpg",
    icon: "leaf",
  },
] as const;

/** Four editorial services on the home brochure — not the six route-level lines. */
export const homeServiceCards = [
  {
    id: "strategic-advisory",
    title: { en: "Strategic Advisory", es: "Asesoría estratégica" },
    body: {
      en: "Market entry, regulatory guidance, and feasibility analysis.",
      es: "Entrada a mercados, orientación regulatoria y análisis de factibilidad.",
    },
    icon: "compass",
  },
  {
    id: "investment-structuring",
    title: { en: "Investment Structuring", es: "Estructuración de inversión" },
    body: {
      en: "Joint ventures, project financing, M&A support.",
      es: "Empresas conjuntas, financiamiento de proyectos y apoyo en fusiones y adquisiciones.",
    },
    icon: "handshake",
  },
  {
    id: "operational-consulting",
    title: { en: "Operational Consulting", es: "Consultoría operativa" },
    body: {
      en: "Optimization and risk management.",
      es: "Optimización y gestión de riesgo.",
    },
    icon: "balance",
  },
  {
    id: "sustainability-compliance",
    title: { en: "Sustainability & Compliance", es: "Sostenibilidad y cumplimiento" },
    body: {
      en: "ESG strategies and responsible development.",
      es: "Estrategias ESG y desarrollo responsable.",
    },
    icon: "shield",
  },
] as const;
