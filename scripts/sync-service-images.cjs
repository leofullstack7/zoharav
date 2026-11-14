/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Materializes per-practice / per-pillar image files under public/images/services/practices/
 * by copying from the curated stock paths in lib/images/serviceMedia.ts (via compiled data below).
 *
 * Run: node scripts/sync-service-images.cjs
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const publicRoot = path.join(root, "public");

const STOCK = {
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
};

const SUB_THEMES = {
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

const PILLAR_THEMES = {
  "energy-transition": ["wind", "plant", "boardroom"],
  "oil-and-energy": ["oil", "logistics", "wind"],
  "mining-natural-resources": ["mining", "emeralds", "plant"],
  "sustainability-esg": ["plant", "wind", "energy"],
  "investment-financial-advisory": ["handshake", "financial", "tower"],
  "strategic-operational-consulting": ["impact", "lean", "digital"],
};

const DETAIL_ROTATION = [
  "boardroom",
  "firm",
  "tower",
  "energy",
  "logistics",
  "agriculture",
  "miami",
  "jet",
];

function copyToDest(relDest, themeKey) {
  const srcRel = STOCK[themeKey];
  if (!srcRel) throw new Error(`Unknown theme ${themeKey}`);
  const src = path.join(publicRoot, srcRel.replace(/^\//, ""));
  const dest = path.join(publicRoot, relDest.replace(/^\//, ""));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!fs.existsSync(src)) {
    console.warn("missing source", src);
    return false;
  }
  fs.copyFileSync(src, dest);
  return true;
}

let copied = 0;

for (const [key, theme] of Object.entries(SUB_THEMES)) {
  const dot = key.indexOf(".");
  const slug = key.slice(0, dot);
  const subId = key.slice(dot + 1);
  const dest = `/images/services/practices/${slug}/${subId}.jpg`;
  if (copyToDest(dest, theme)) copied += 1;
  const baseIdx = DETAIL_ROTATION.indexOf(theme);
  const start = baseIdx >= 0 ? baseIdx : 0;
  for (let slot = 1; slot <= 3; slot += 1) {
    const detailTheme = DETAIL_ROTATION[(start + slot) % DETAIL_ROTATION.length];
    const detailDest = `/images/services/practices/${slug}/${subId}-detail-0${slot}.jpg`;
    if (copyToDest(detailDest, detailTheme)) copied += 1;
  }
}

for (const [slug, themes] of Object.entries(PILLAR_THEMES)) {
  themes.forEach((theme, i) => {
    const dest = `/images/services/practices/${slug}/pillar-0${i + 1}.jpg`;
    if (copyToDest(dest, theme)) copied += 1;
  });
}

console.log(`Copied ${copied} practice/pillar image files.`);