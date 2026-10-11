export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export type Localized = {
  en: string;
  es: string;
};

export type ServiceSlug =
  | "energy-transition"
  | "oil-and-energy"
  | "mining-natural-resources"
  | "sustainability-esg"
  | "investment-financial-advisory"
  | "strategic-operational-consulting";

export type SectorId =
  | "energy-utilities"
  | "oil-gas"
  | "mining"
  | "manufacturing"
  | "logistics"
  | "agriculture"
  | "financial"
  | "public-sector";

export type SubService = {
  id: string;
  title: Localized;
  tagline: Localized;
  hover: Localized;
  body: Localized;
  bullets: Localized[];
  cta: Localized;
};

export type MethodPhase = {
  step: string;
  title: Localized;
  body: Localized;
};

export type Methodology = {
  id: string;
  name: Localized;
  intro: Localized;
  phases: MethodPhase[];
};

export type FaqItem = {
  id: string;
  category: "firm" | "booking" | "method" | "confidentiality" | "energy" | "geography" | "service";
  service?: ServiceSlug;
  showOnHome: boolean;
  question: Localized;
  answer: Localized;
};

export type Service = {
  slug: ServiceSlug;
  number: string;
  name: Localized;
  cardLine: Localized;
  heroTitle: Localized;
  heroIntro: Localized;
  image: string;
  subServices: SubService[];
  methodologies: Methodology[];
  industries: SectorId[];
  faqs: FaqItem[];
  slides?: { title: Localized; body: Localized }[];
};
