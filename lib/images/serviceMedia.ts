import type { ImageSlot } from "./slots";

export type ServiceSlug =
  | "energy-transition"
  | "oil-and-energy"
  | "mining-natural-resources"
  | "sustainability-esg"
  | "investment-financial-advisory"
  | "strategic-operational-consulting";

/** Practice ids per line — kept in sync with content/lines/*.ts (no runtime import). */
export const SERVICE_PRACTICE_MANIFEST: { slug: ServiceSlug; subIds: string[] }[] = [
  {
    slug: "energy-transition",
    subIds: ["decarbonization-esg", "oil-gas-transformation", "renewable-integration", "ccs", "energy-efficiency"],
  },
  {
    slug: "oil-and-energy",
    subIds: [
      "exploration-production",
      "infrastructure",
      "regulatory",
      "transition-renewables",
      "market-entry",
      "investment-risk",
      "partnerships-ma",
    ],
  },
  {
    slug: "mining-natural-resources",
    subIds: ["diligence", "gold", "emeralds", "development", "sustainable-practice", "market-access"],
  },
  {
    slug: "sustainability-esg",
    subIds: ["esg-strategy", "net-zero", "renewables", "ccs", "circular", "climate-risk", "pillars"],
  },
  {
    slug: "investment-financial-advisory",
    subIds: [
      "capital-structuring",
      "project-evaluation",
      "valuation",
      "capital-raising",
      "ma",
      "diligence",
      "project-finance",
      "risk-hedging",
      "restructuring",
      "fpa",
    ],
  },
  {
    slug: "strategic-operational-consulting",
    subIds: [
      "corporate-strategy",
      "market-intelligence",
      "partnerships",
      "energy-industrial",
      "sustainability-advisory",
      "lean",
      "digital-ops",
      "supply-assets",
      "kpis",
      "risk-compliance",
    ],
  },
];

/** Curated stock paths reused as fallbacks and copy sources. */
export const MEDIA_STOCK = {
  wind: "/images/editorial/wind.jpg",
  boardroom: "/images/editorial/boardroom.jpg",
  oil: "/images/sectors/oil-gas.jpg",
  mining: "/images/sectors/mining.jpg",
  emeralds: "/images/mining/emeralds.png",
  plant: "/images/sustainability/plant.png",
  handshake: "/images/investment/handshake.png",
  firm: "/images/firm/office.png",
  tower: "/images/contact/tower.png",
  yacht: "/images/hero/yacht.png",
  energy: "/images/sectors/energy-utilities.jpg",
  logistics: "/images/sectors/logistics.jpg",
  manufacturing: "/images/sectors/manufacturing.jpg",
  agriculture: "/images/sectors/agriculture.jpg",
  financial: "/images/sectors/financial.jpg",
  public: "/images/sectors/public-sector.jpg",
  miami: "/images/offices/miami.png",
  lean: "/images/services/ops/lean.png",
  digital: "/images/services/ops/hero-digital.jpg",
  impact: "/images/services/ops/hero-impact.jpg",
  supply: "/images/services/ops/digital-supply.png",
  pillars: "/images/services/ops/pillars.png",
  jet: "/images/services/jet.png",
} as const;

export type MediaTheme = keyof typeof MEDIA_STOCK;

const SUB_THEMES: Record<string, MediaTheme> = {
  "energy-transition.decarbonization-esg": "wind",
  "energy-transition.oil-gas-transformation": "oil",
  "energy-transition.renewable-integration": "energy",
  "energy-transition.ccs": "plant",
  "energy-transition.energy-efficiency": "manufacturing",
  "oil-and-energy.exploration-production": "oil",
  "oil-and-energy.infrastructure": "logistics",
  "oil-and-energy.regulatory": "public",
  "oil-and-energy.transition-renewables": "wind",
  "oil-and-energy.market-entry": "tower",
  "oil-and-energy.investment-risk": "handshake",
  "oil-and-energy.partnerships-ma": "boardroom",
  "mining-natural-resources.diligence": "mining",
  "mining-natural-resources.gold": "mining",
  "mining-natural-resources.emeralds": "emeralds",
  "mining-natural-resources.development": "energy",
  "mining-natural-resources.sustainable-practice": "plant",
  "mining-natural-resources.market-access": "handshake",
  "sustainability-esg.esg-strategy": "plant",
  "sustainability-esg.net-zero": "wind",
  "sustainability-esg.renewables": "energy",
  "sustainability-esg.ccs": "plant",
  "sustainability-esg.circular": "manufacturing",
  "sustainability-esg.climate-risk": "public",
  "sustainability-esg.pillars": "boardroom",
  "investment-financial-advisory.capital-structuring": "handshake",
  "investment-financial-advisory.project-evaluation": "tower",
  "investment-financial-advisory.valuation": "boardroom",
  "investment-financial-advisory.capital-raising": "financial",
  "investment-financial-advisory.ma": "yacht",
  "investment-financial-advisory.diligence": "firm",
  "investment-financial-advisory.project-finance": "energy",
  "investment-financial-advisory.risk-hedging": "oil",
  "investment-financial-advisory.restructuring": "boardroom",
  "investment-financial-advisory.fpa": "financial",
  "strategic-operational-consulting.corporate-strategy": "boardroom",
  "strategic-operational-consulting.market-intelligence": "tower",
  "strategic-operational-consulting.partnerships": "handshake",
  "strategic-operational-consulting.energy-industrial": "impact",
  "strategic-operational-consulting.sustainability-advisory": "plant",
  "strategic-operational-consulting.lean": "lean",
  "strategic-operational-consulting.digital-ops": "digital",
  "strategic-operational-consulting.supply-assets": "supply",
  "strategic-operational-consulting.kpis": "pillars",
  "strategic-operational-consulting.risk-compliance": "public",
};

const PILLAR_THEMES: Record<ServiceSlug, [MediaTheme, MediaTheme, MediaTheme]> = {
  "energy-transition": ["wind", "plant", "boardroom"],
  "oil-and-energy": ["oil", "logistics", "wind"],
  "mining-natural-resources": ["mining", "emeralds", "plant"],
  "sustainability-esg": ["plant", "wind", "energy"],
  "investment-financial-advisory": ["handshake", "financial", "tower"],
  "strategic-operational-consulting": ["impact", "lean", "digital"],
};

const STUDIO_DETAIL_ROTATION: MediaTheme[] = [
  "boardroom",
  "firm",
  "tower",
  "energy",
  "logistics",
  "agriculture",
  "miami",
  "jet",
];

export function subServiceMediaKey(slug: ServiceSlug, subId: string) {
  return `services.${slug}.sub.${subId}` as const;
}

export function pillarMediaKey(slug: ServiceSlug, index: 1 | 2 | 3) {
  return `services.${slug}.pillar.0${index}` as const;
}

export function studioDetailKey(slug: ServiceSlug, subId: string, slot: 1 | 2 | 3) {
  return `services.${slug}.sub.${subId}.detail-0${slot}` as const;
}

export function practiceImagePath(slug: ServiceSlug, subId: string) {
  return `/images/services/practices/${slug}/${subId}.jpg`;
}

export function pillarImagePath(slug: ServiceSlug, index: 1 | 2 | 3) {
  return `/images/services/practices/${slug}/pillar-0${index}.jpg`;
}

export function studioDetailPath(slug: ServiceSlug, subId: string, slot: 1 | 2 | 3) {
  return `/images/services/practices/${slug}/${subId}-detail-0${slot}.jpg`;
}

function subTheme(slug: ServiceSlug, subId: string): MediaTheme {
  return SUB_THEMES[`${slug}.${subId}`] ?? "firm";
}

function studioDetailTheme(slug: ServiceSlug, subId: string, slot: 1 | 2 | 3): MediaTheme {
  const base = subTheme(slug, subId);
  const baseIdx = STUDIO_DETAIL_ROTATION.indexOf(base);
  const start = baseIdx >= 0 ? baseIdx : 0;
  return STUDIO_DETAIL_ROTATION[(start + slot) % STUDIO_DETAIL_ROTATION.length];
}

export function fallbackForSub(slug: ServiceSlug, subId: string): string {
  return practiceImagePath(slug, subId);
}

export function fallbackForPillar(slug: ServiceSlug, index: 1 | 2 | 3): string {
  return pillarImagePath(slug, index);
}

export function fallbackForStudioDetail(slug: ServiceSlug, subId: string, slot: 1 | 2 | 3): string {
  return studioDetailPath(slug, subId, slot);
}

/** Copy sources for scripts/sync-service-images.cjs — theme → stock file. */
export function stockSourceForSub(slug: ServiceSlug, subId: string) {
  return MEDIA_STOCK[subTheme(slug, subId)];
}

export function stockSourceForPillar(slug: ServiceSlug, index: 1 | 2 | 3) {
  return MEDIA_STOCK[PILLAR_THEMES[slug][index - 1]];
}

export function stockSourceForStudioDetail(slug: ServiceSlug, subId: string, slot: 1 | 2 | 3) {
  return MEDIA_STOCK[studioDetailTheme(slug, subId, slot)];
}

export function buildServiceMediaSlots(): ImageSlot[] {
  const slots: ImageSlot[] = [];

  for (const { slug, subIds } of SERVICE_PRACTICE_MANIFEST) {
    for (const subId of subIds) {
      slots.push({
        key: subServiceMediaKey(slug, subId),
        label: `Práctica — ${slug} / ${subId}`,
        page: "Servicios",
        recommendedWidth: 1400,
        recommendedHeight: 900,
        fallback: fallbackForSub(slug, subId),
        href: `/es/services/${slug}`,
        anchor: subId,
      });
      for (const detail of [1, 2, 3] as const) {
        slots.push({
          key: studioDetailKey(slug, subId, detail),
          label: `Detalle visual — ${slug} / ${subId} (${detail})`,
          page: "Servicios",
          recommendedWidth: 960,
          recommendedHeight: 640,
          fallback: fallbackForStudioDetail(slug, subId, detail),
          href: `/es/services/${slug}`,
          anchor: subId,
        });
      }
    }

    for (const index of [1, 2, 3] as const) {
      slots.push({
        key: pillarMediaKey(slug, index),
        label: `Pilar — ${slug} (0${index})`,
        page: "Servicios",
        recommendedWidth: 960,
        recommendedHeight: 1200,
        fallback: fallbackForPillar(slug, index),
        href: `/es/services/${slug}`,
        anchor: "content",
      });
    }
  }

  return slots;
}

export function allServiceMediaSlotKeys(): string[] {
  return buildServiceMediaSlots().map((slot) => slot.key);
}