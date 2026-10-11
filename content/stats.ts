import type { Localized } from "./types";

export type Stat = {
  id: string;
  /** Display string. Do not invent or enlarge these figures. */
  value: string;
  label: Localized;
  /** company = a Zoharav claim; context = a market milestone from the previous site, not a firm KPI. */
  kind: "company" | "context";
  placement: "home" | "energy" | "about" | "hold";
  // VERIFY: the client must confirm every figure before it is treated as final.
  verify: true;
};

// VERIFY — legacy and market figures. Do not add new numbers. Do not round them up.
export const stats: Stat[] = [
  {
    id: "projects",
    value: "500+",
    label: { en: "Projects", es: "Proyectos" },
    kind: "company",
    placement: "home",
    verify: true,
  },
  {
    id: "continents",
    value: "3",
    label: { en: "Continents", es: "Continentes" },
    kind: "company",
    placement: "home",
    verify: true,
  },
  {
    id: "support",
    value: "24/7",
    label: { en: "Support", es: "Acompañamiento" },
    kind: "company",
    placement: "home",
    verify: true,
  },
  {
    id: "net-zero-year",
    value: "2050",
    label: { en: "Net-Zero Target", es: "Meta de cero neto" },
    kind: "context",
    placement: "home",
    verify: true,
  },
  {
    id: "net-zero-countries",
    value: "130+",
    label: {
      en: "Countries Committed to Net-Zero",
      es: "Países comprometidos con el cero neto",
    },
    kind: "context",
    placement: "home",
    verify: true,
  },
  {
    id: "renewable-capacity",
    value: "5,000 GW",
    label: {
      en: "Global Renewable Capacity",
      es: "Capacidad renovable global",
    },
    kind: "context",
    placement: "home",
    verify: true,
  },
  {
    id: "annual-investment",
    value: "$4T+",
    label: { en: "Annual Energy Investment", es: "Inversión anual en energía" },
    kind: "context",
    placement: "energy",
    verify: true,
  },
  {
    id: "renewable-growth",
    value: "80%",
    label: { en: "Renewable Capacity Growth", es: "Crecimiento de capacidad renovable" },
    kind: "context",
    placement: "energy",
    verify: true,
  },
  {
    id: "efficiency",
    value: "98%",
    label: { en: "Efficiency", es: "Eficiencia" },
    kind: "company",
    placement: "hold",
    verify: true,
  },
  {
    id: "support-locations",
    value: "35+",
    label: { en: "Support Locations", es: "Puntos de apoyo" },
    kind: "company",
    placement: "about",
    verify: true,
  },
  {
    id: "support-continents",
    value: "5",
    label: { en: "Continents", es: "Continentes" },
    kind: "company",
    placement: "about",
    verify: true,
  },
  {
    id: "languages",
    value: "15+",
    label: { en: "Languages", es: "Idiomas" },
    kind: "company",
    placement: "about",
    verify: true,
  },
];

export const homeStats = stats.filter((stat) => stat.placement === "home");
export const energyStats = stats.filter((stat) => stat.placement === "energy");
export const aboutStats = stats.filter((stat) => stat.placement === "about");
