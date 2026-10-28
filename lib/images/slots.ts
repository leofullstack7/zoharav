/**
 * Single source of truth for every uploadable image slot on the public
 * site. This one array drives three things so the slot list is never
 * defined twice:
 *   1. The `site_images` seed in scripts/migrate-site-images.ts
 *   2. The admin UI at /admin/images (labels, grouping, recommended size)
 *   3. The public lookup helper lib/images/getSiteImage.ts (fallback paths)
 *
 * Deliberately plain data (no framework imports) so this file can be
 * required both by the Next.js app and by the standalone migration script.
 *
 * `fallback` is the path rendered on the public site while `image_url` is
 * still null in the database — either the hand-built SVG that replaced the
 * original photography, or (for a few slots) the one photo that was never
 * deleted (`/images/firm/office.jpg`). `seedSource` is only read by the
 * migration script: the relative path, under the recovered-originals
 * directory, of the real photo to optimize and upload the first time the
 * slot is seeded. Slots with no real photo available (the team portraits)
 * omit it and stay `image_url = null` until an admin uploads one.
 */

export type ImageSlot = {
  /** Stable primary key, also the `site_images.slot_key` column value. */
  key: string;
  /** Spanish label shown in the admin UI (the business owner's language). */
  label: string;
  /** Group heading the admin UI sorts this slot under. */
  page: string;
  recommendedWidth: number;
  recommendedHeight: number;
  /** Path rendered on the public site when no admin upload exists yet. */
  fallback: string;
  /** Relative path under scripts/.seed-images/ used only by the seed script. */
  seedSource?: string;
};

export const IMAGE_SLOTS: ImageSlot[] = [
  {
    key: "home.hero",
    label: "Inicio — Imagen principal (hero)",
    page: "Inicio",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/hero/yacht.svg",
    seedSource: "hero/yacht.jpg",
  },
  {
    key: "home.firm",
    label: "Inicio — Sección de la firma",
    page: "Inicio",
    recommendedWidth: 1600,
    recommendedHeight: 1200,
    fallback: "/images/firm/office.svg",
    seedSource: "firm/office.jpg",
  },
  {
    key: "home.contact-frame",
    label: "Inicio — Marco editorial de contacto",
    page: "Inicio",
    recommendedWidth: 1600,
    recommendedHeight: 1200,
    fallback: "/images/contact/tower.svg",
    seedSource: "contact/tower.jpg",
  },
  {
    key: "about.hero",
    label: "La Firma — Imagen principal",
    page: "La Firma (About)",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/firm/office.svg",
    seedSource: "firm/office.jpg",
  },
  {
    key: "booking.hero",
    label: "Reservas — Imagen principal",
    page: "Reservas (Booking)",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/firm/office.svg",
    seedSource: "firm/office.jpg",
  },
  {
    key: "contact.hero",
    label: "Contacto — Imagen principal",
    page: "Contacto",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/contact/tower.svg",
    seedSource: "contact/tower.jpg",
  },
  {
    key: "faq.hero",
    label: "FAQ — Imagen principal",
    page: "FAQ",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/firm/office.svg",
    seedSource: "firm/office.jpg",
  },
  {
    key: "not-found.hero",
    label: "Página 404 — Imagen principal",
    page: "404",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/firm/office.svg",
    seedSource: "firm/office.jpg",
  },
  {
    key: "legal.hero",
    label: "Legal — Imagen principal",
    page: "Legal (Privacidad/Términos/etc.)",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/firm/office.jpg",
    seedSource: "firm/office.jpg",
  },
  {
    key: "sectors.hero",
    label: "Sectores — Imagen principal",
    page: "Sectores",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/hero/yacht.svg",
    seedSource: "hero/yacht.jpg",
  },
  {
    key: "services-index.hero",
    label: "Servicios — Imagen principal",
    page: "Servicios (índice)",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/services/jet.svg",
    seedSource: "services/jet.jpg",
  },
  {
    key: "insights.hero",
    label: "Insights — Imagen principal",
    page: "Insights",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/offices/medellin.svg",
    seedSource: "offices/medellin.jpg",
  },
  {
    key: "global-presence.hero",
    label: "Presencia Global — Imagen principal",
    page: "Presencia Global",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/offices/miami.svg",
    seedSource: "offices/miami.jpg",
  },
  {
    key: "services.energy-transition.cover",
    label: "Servicio — Transición Energética",
    page: "Servicios",
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    fallback: "/images/hero/yacht.svg",
    seedSource: "hero/yacht.jpg",
  },
  {
    key: "services.oil-and-energy.cover",
    label: "Servicio — Petróleo y Energía",
    page: "Servicios",
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    fallback: "/images/pillars/oil-energy.svg",
    seedSource: "pillars/oil-energy.jpg",
  },
  {
    key: "services.mining-natural-resources.cover",
    label: "Servicio — Minería y Recursos Naturales",
    page: "Servicios",
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    fallback: "/images/mining/emeralds.svg",
    seedSource: "mining/emeralds.jpg",
  },
  {
    key: "services.sustainability-esg.cover",
    label: "Servicio — Sostenibilidad y ESG",
    page: "Servicios",
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    fallback: "/images/sustainability/plant.svg",
    seedSource: "sustainability/plant.jpg",
  },
  {
    key: "services.investment-financial-advisory.cover",
    label: "Servicio — Inversión y Asesoría Financiera",
    page: "Servicios",
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    fallback: "/images/investment/handshake.svg",
    seedSource: "investment/handshake.jpg",
  },
  {
    key: "services.strategic-operational-consulting.cover",
    label: "Servicio — Consultoría Estratégica y Operativa",
    page: "Servicios",
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    fallback: "/images/services/jet.svg",
    seedSource: "services/jet.jpg",
  },
  {
    key: "offices.medellin.cover",
    label: "Oficina — Medellín",
    page: "Oficinas",
    recommendedWidth: 1200,
    recommendedHeight: 900,
    fallback: "/images/offices/medellin.svg",
    seedSource: "offices/medellin.jpg",
  },
  {
    key: "offices.miami.cover",
    label: "Oficina — Miami",
    page: "Oficinas",
    recommendedWidth: 1200,
    recommendedHeight: 900,
    fallback: "/images/offices/miami.svg",
    seedSource: "offices/miami.jpg",
  },
  {
    key: "offices.puerto-rico.cover",
    label: "Oficina — Puerto Rico",
    page: "Oficinas",
    recommendedWidth: 1200,
    recommendedHeight: 900,
    fallback: "/images/offices/san-juan.svg",
    seedSource: "offices/san-juan.jpg",
  },
  // Team portraits: one slot per content/team.ts entry, confirmed (both
  // placeholder and confirmed seats render through TeamSlider's CSS
  // monogram/initials tile today — no photo file exists for anyone yet).
  // No seedSource: these intentionally start at image_url = null so the
  // placeholder keeps showing until a real photo is uploaded.
  {
    key: "team.d-de-jesus.photo",
    label: "Equipo — D. De Jesús (Director general)",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 800,
    fallback: "",
  },
  {
    key: "team.leandro-garces.photo",
    label: "Equipo — Leandro Garcés (Director de operaciones)",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 800,
    fallback: "",
  },
  {
    key: "team.andres-pineda.photo",
    label: "Equipo — Andrés Pineda (Ingeniero industrial | Estratega de crecimiento)",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 800,
    fallback: "",
  },
  {
    key: "team.seat-oil-energy.photo",
    label: "Equipo — Vacante: Asesor senior, Petróleo y energía",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 800,
    fallback: "",
  },
  {
    key: "team.seat-mining.photo",
    label: "Equipo — Vacante: Asesor senior, Minería y recursos naturales",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 800,
    fallback: "",
  },
  {
    key: "team.seat-sustainability.photo",
    label: "Equipo — Vacante: Asesor senior, Sostenibilidad y ESG",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 800,
    fallback: "",
  },
  {
    key: "team.seat-investment.photo",
    label: "Equipo — Vacante: Asesor senior, Inversión y asesoría financiera",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 800,
    fallback: "",
  },
  {
    key: "team.seat-strategy.photo",
    label: "Equipo — Vacante: Asesor senior, Consultoría estratégica y operativa",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 800,
    fallback: "",
  },
  {
    key: "team.seat-presence-miami.photo",
    label: "Equipo — Vacante: Asesor senior, Mesa Miami",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 800,
    fallback: "",
  },
  {
    key: "team.seat-presence-puerto-rico.photo",
    label: "Equipo — Vacante: Asesor senior, Mesa Puerto Rico",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 800,
    fallback: "",
  },
];

export function getImageSlot(key: string): ImageSlot | undefined {
  return IMAGE_SLOTS.find((slot) => slot.key === key);
}

export function groupImageSlotsByPage(): Array<{ page: string; slots: ImageSlot[] }> {
  const order: string[] = [];
  const groups = new Map<string, ImageSlot[]>();
  for (const slot of IMAGE_SLOTS) {
    if (!groups.has(slot.page)) {
      groups.set(slot.page, []);
      order.push(slot.page);
    }
    groups.get(slot.page)!.push(slot);
  }
  return order.map((page) => ({ page, slots: groups.get(page)! }));
}
