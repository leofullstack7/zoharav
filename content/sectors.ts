import type { Localized, SectorId, ServiceSlug } from "./types";

export type Sector = {
  id: SectorId;
  name: Localized;
  summary: Localized;
  image: string;
  services: ServiceSlug[];
};

/**
 * Introductory copy for the Sectors index. Grounded only in facts already
 * documented elsewhere on the site (content/home.ts, content/site.ts): the
 * six advisory lines in content/services.ts, the "we advise, we do not
 * operate" boundary repeated across the compliance statement and the home
 * banners, and the three-hub presence (Medellín, Miami, Puerto Rico). No
 * new claims, figures, or capabilities are introduced here.
 */
export const sectorsCopy = {
  intro: {
    en: "ZOHARAV & CO. advises across eight sectors where natural resources, capital, and policy meet — oil and gas, mining, energy and utilities, manufacturing, logistics, agriculture, financial services, and the public institutions that regulate them. Every mandate draws on the same six advisory lines — energy transition, oil & energy, mining & natural resources, sustainability & ESG, investment & financial advisory, and strategic & operational consulting — applied to the facts of that sector, not offered as a fixed package.",
    es: "ZOHARAV & CO. asesora en ocho sectores donde se cruzan los recursos naturales, el capital y la política pública: petróleo y gas, minería, energía y servicios públicos, manufactura, logística, agricultura, servicios financieros y las instituciones públicas que los regulan. Cada mandato se apoya en las mismas seis líneas de asesoría —transición energética, petróleo y energía, minería y recursos naturales, sostenibilidad y ESG, asesoría de inversión y finanzas, y consultoría estratégica y operativa— aplicadas a la realidad de cada sector, no como un paquete fijo.",
  } satisfies Localized,
  introSecondary: {
    en: "Our role is counsel, not operation: we read the market, structure the opportunity, and stay through the close, working from Medellín, Miami, and Puerto Rico as one desk for cross-border mandates. The sectors below are where that judgment is engaged today; each links to the advisory lines most relevant to it.",
    es: "Nuestro papel es el consejo, no la operación: leemos el mercado, estructuramos la oportunidad y nos quedamos hasta el cierre, trabajando desde Medellín, Miami y Puerto Rico como una sola mesa para mandatos transfronterizos. Los sectores a continuación son donde ese criterio se aplica hoy; cada uno enlaza a las líneas de asesoría más relevantes.",
  } satisfies Localized,
};

export const sectors: Sector[] = [
  {
    id: "energy-utilities",
    name: { en: "Energy & Utilities", es: "Energía y servicios públicos" },
    summary: {
      en: "Advisory for generators, utilities, and hybrid systems facing decarbonization, regulation, and long-cycle capital decisions.",
      es: "Asesoría para generadores, empresas de servicios públicos y sistemas híbridos ante la descarbonización, la regulación y el capital de ciclo largo.",
    },
    image: "/images/sectors/energy-utilities.jpg",
    services: ["energy-transition", "sustainability-esg", "investment-financial-advisory", "strategic-operational-consulting"],
  },
  {
    id: "oil-gas",
    name: { en: "Oil & Gas", es: "Petróleo y gas" },
    summary: {
      en: "Strategic counsel across the hydrocarbon value chain, from transition planning to partnerships. We advise; we do not operate, sell, or transport.",
      es: "Consejo estratégico a lo largo de la cadena de hidrocarburos, de la planificación de la transición a las alianzas. Asesoramos; no operamos, vendemos ni transportamos.",
    },
    image: "/images/sectors/oil-gas.jpg",
    services: ["oil-and-energy", "energy-transition", "investment-financial-advisory"],
  },
  {
    id: "mining",
    name: { en: "Mining & Natural Resources", es: "Minería y recursos naturales" },
    summary: {
      en: "Investment and development advisory for gold, emeralds, and strategic minerals, with environmental and social discipline.",
      es: "Asesoría de inversión y desarrollo para oro, esmeraldas y minerales estratégicos, con disciplina ambiental y social.",
    },
    image: "/images/sectors/mining.jpg",
    services: ["mining-natural-resources", "sustainability-esg", "investment-financial-advisory"],
  },
  {
    id: "manufacturing",
    name: { en: "Manufacturing & Industrial", es: "Manufactura e industria" },
    summary: {
      en: "Operational and energy strategy for industrial groups reducing cost, risk, and emissions intensity.",
      es: "Estrategia operativa y energética para grupos industriales que buscan reducir costo, riesgo e intensidad de emisiones.",
    },
    image: "/images/sectors/manufacturing.jpg",
    services: ["strategic-operational-consulting", "energy-transition", "sustainability-esg"],
  },
  {
    id: "logistics",
    name: { en: "Transportation & Logistics", es: "Transporte y logística" },
    summary: {
      en: "Advisory on energy use, asset performance, and the supply chains that move resources responsibly.",
      es: "Asesoría sobre uso de energía, desempeño de activos y las cadenas que mueven recursos de forma responsable.",
    },
    image: "/images/sectors/logistics.jpg",
    services: ["strategic-operational-consulting", "oil-and-energy", "energy-transition"],
  },
  {
    id: "agriculture",
    name: { en: "Agriculture & Forestry", es: "Agricultura y silvicultura" },
    summary: {
      en: "Counsel on land-linked resources, long-cycle assets, and the sustainability standards investors now expect.",
      es: "Consejo sobre recursos ligados a la tierra, activos de ciclo largo y los estándares de sostenibilidad que hoy exigen los inversionistas.",
    },
    image: "/images/sectors/agriculture.jpg",
    services: ["sustainability-esg", "investment-financial-advisory", "mining-natural-resources"],
  },
  {
    id: "financial",
    name: { en: "Financial Services & Investors", es: "Servicios financieros e inversionistas" },
    summary: {
      en: "Support for funds, lenders, and sponsors evaluating energy, mining, and sustainable infrastructure.",
      es: "Acompañamiento a fondos, prestamistas y patrocinadores que evalúan energía, minería e infraestructura sostenible.",
    },
    image: "/images/sectors/financial.jpg",
    services: ["investment-financial-advisory", "mining-natural-resources", "energy-transition"],
  },
  {
    id: "public-sector",
    name: { en: "Public Sector & Governments", es: "Sector público y gobiernos" },
    summary: {
      en: "Advisory for public institutions structuring partnerships, concessions, and responsible resource policy. We do not act as an operator.",
      es: "Asesoría para instituciones públicas que estructuran alianzas, concesiones y política responsable de recursos. No actuamos como operador.",
    },
    image: "/images/sectors/public-sector.jpg",
    services: ["strategic-operational-consulting", "investment-financial-advisory", "sustainability-esg"],
  },
];
