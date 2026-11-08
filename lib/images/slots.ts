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
  /** Public path used by the admin scaled preview (Spanish locale). */
  href?: string;
  /** Section id on that page so the preview can jump to the image. */
  anchor?: string;
};

export const IMAGE_SLOTS: ImageSlot[] = [
  {
    key: "home.hero",
    label: "Inicio — Imagen principal (hero)",
    page: "Inicio",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/hero/yacht.png",
    seedSource: "hero/yacht.jpg",
  },
  {
    key: "home.firm",
    label: "Inicio — Sección de la firma",
    page: "Inicio",
    recommendedWidth: 1600,
    recommendedHeight: 1200,
    fallback: "/images/firm/office.png",
    seedSource: "firm/office.jpg",
  },
  {
    key: "home.contact-frame",
    label: "Inicio — Marco editorial de contacto",
    page: "Inicio",
    recommendedWidth: 1600,
    recommendedHeight: 1200,
    fallback: "/images/contact/tower.png",
    seedSource: "contact/tower.jpg",
  },
  {
    key: "home.pro-support-1",
    label: "Inicio — Soporte profesional (columna 1)",
    page: "Inicio",
    recommendedWidth: 720,
    recommendedHeight: 1100,
    fallback: "/images/services/jet.png",
  },
  {
    key: "home.pro-support-2",
    label: "Inicio — Soporte profesional (columna 2)",
    page: "Inicio",
    recommendedWidth: 720,
    recommendedHeight: 1100,
    fallback: "/images/pillars/oil-energy.png",
  },
  {
    key: "home.pro-support-3",
    label: "Inicio — Soporte profesional (columna 3)",
    page: "Inicio",
    recommendedWidth: 720,
    recommendedHeight: 1100,
    fallback: "/images/hero/yacht.png",
  },
  {
    key: "home.services-frame",
    label: "Inicio — Marco de la sección Servicios",
    page: "Inicio",
    recommendedWidth: 1600,
    recommendedHeight: 1200,
    fallback: "/images/services/jet.png",
  },
  {
    key: "home.oil",
    label: "Inicio — Banda Petróleo y energía",
    page: "Inicio",
    recommendedWidth: 1600,
    recommendedHeight: 1200,
    fallback: "/images/hero/yacht.png",
  },
  {
    key: "home.mining",
    label: "Inicio — Banda Minería",
    page: "Inicio",
    recommendedWidth: 1600,
    recommendedHeight: 1200,
    fallback: "/images/mining/emeralds.png",
  },
  {
    key: "home.sustainability",
    label: "Inicio — Banda Sostenibilidad",
    page: "Inicio",
    recommendedWidth: 1600,
    recommendedHeight: 1200,
    fallback: "/images/sustainability/plant.png",
  },
  {
    key: "home.investment",
    label: "Inicio — Banda Inversión",
    page: "Inicio",
    recommendedWidth: 1600,
    recommendedHeight: 1200,
    fallback: "/images/investment/handshake.png",
  },
  {
    key: "about.hero",
    label: "La Firma — Imagen principal",
    page: "La Firma (About)",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/firm/office.png",
    seedSource: "firm/office.jpg",
  },
  {
    key: "about.mission",
    label: "La Firma — Misión y visión",
    page: "La Firma (About)",
    recommendedWidth: 1600,
    recommendedHeight: 1200,
    fallback: "/images/investment/handshake.png",
    seedSource: "pillars/investment.jpg",
  },
  {
    key: "about.stats",
    label: "La Firma — Fondo de la banda de cifras",
    page: "La Firma (About)",
    recommendedWidth: 1920,
    recommendedHeight: 960,
    fallback: "/images/contact/tower.png",
    seedSource: "contact/tower.jpg",
  },
  {
    key: "booking.hero",
    label: "Reservas — Imagen principal",
    page: "Reservas (Booking)",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/editorial/boardroom.jpg",
    seedSource: "firm/office.jpg",
  },
  {
    key: "contact.hero",
    label: "Contacto — Imagen principal",
    page: "Contacto",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/contact/tower.png",
    seedSource: "contact/tower.jpg",
  },
  {
    key: "faq.hero",
    label: "FAQ — Imagen principal",
    page: "FAQ",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/home/references/faq.png",
    seedSource: "firm/office.jpg",
  },
  {
    key: "not-found.hero",
    label: "Página 404 — Imagen principal",
    page: "404",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/firm/office.png",
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
    fallback: "/images/hero/yacht.png",
    seedSource: "hero/yacht.jpg",
  },
  {
    key: "sectors.spotlight",
    label: "Sectores — Imagen de acento (banda intermedia)",
    page: "Sectores",
    recommendedWidth: 1920,
    recommendedHeight: 900,
    fallback: "/images/mining/emeralds.png",
    seedSource: "pillars/mining.jpg",
  },
  {
    key: "sectors.card.energy-utilities",
    label: "Sectores — Energía y servicios públicos",
    page: "Sectores",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    fallback: "/images/sectors/energy-utilities.jpg",
  },
  {
    key: "sectors.card.oil-gas",
    label: "Sectores — Petróleo y gas",
    page: "Sectores",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    fallback: "/images/sectors/oil-gas.jpg",
  },
  {
    key: "sectors.card.mining",
    label: "Sectores — Minería",
    page: "Sectores",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    fallback: "/images/sectors/mining.jpg",
  },
  {
    key: "sectors.card.manufacturing",
    label: "Sectores — Manufactura",
    page: "Sectores",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    fallback: "/images/sectors/manufacturing.jpg",
  },
  {
    key: "sectors.card.logistics",
    label: "Sectores — Logística",
    page: "Sectores",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    fallback: "/images/sectors/logistics.jpg",
  },
  {
    key: "sectors.card.agriculture",
    label: "Sectores — Agricultura",
    page: "Sectores",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    fallback: "/images/sectors/agriculture.jpg",
  },
  {
    key: "sectors.card.financial",
    label: "Sectores — Servicios financieros",
    page: "Sectores",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    fallback: "/images/sectors/financial.jpg",
  },
  {
    key: "sectors.card.public-sector",
    label: "Sectores — Sector público",
    page: "Sectores",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    fallback: "/images/sectors/public-sector.jpg",
  },
  {
    key: "booking.category.strategic-operational-consulting",
    label: "Reservas — Tarjeta Consultoría estratégica",
    page: "Reservas (Booking)",
    recommendedWidth: 1200,
    recommendedHeight: 800,
    fallback: "/images/services/ops/hero-impact.jpg",
  },
  {
    key: "booking.category.investment-financial-advisory",
    label: "Reservas — Tarjeta Inversión",
    page: "Reservas (Booking)",
    recommendedWidth: 1200,
    recommendedHeight: 800,
    fallback: "/images/investment/handshake.png",
  },
  {
    key: "booking.category.energy-transition",
    label: "Reservas — Tarjeta Transición energética",
    page: "Reservas (Booking)",
    recommendedWidth: 1200,
    recommendedHeight: 800,
    fallback: "/images/editorial/wind.jpg",
  },
  {
    key: "booking.category.oil-and-energy",
    label: "Reservas — Tarjeta Petróleo y energía",
    page: "Reservas (Booking)",
    recommendedWidth: 1200,
    recommendedHeight: 800,
    fallback: "/images/sectors/oil-gas.jpg",
  },
  {
    key: "booking.category.mining-natural-resources",
    label: "Reservas — Tarjeta Minería",
    page: "Reservas (Booking)",
    recommendedWidth: 1200,
    recommendedHeight: 800,
    fallback: "/images/sectors/mining.jpg",
  },
  {
    key: "booking.category.sustainability-esg",
    label: "Reservas — Tarjeta Sostenibilidad",
    page: "Reservas (Booking)",
    recommendedWidth: 1200,
    recommendedHeight: 800,
    fallback: "/images/sustainability/plant.png",
  },
  {
    key: "services-index.hero",
    label: "Servicios — Imagen principal",
    page: "Servicios (índice)",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/services/jet.png",
    seedSource: "services/jet.jpg",
  },
  {
    key: "insights.hero",
    label: "Insights — Imagen principal",
    page: "Insights",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/offices/medellin.jpg",
    seedSource: "offices/medellin.jpg",
  },
  {
    key: "global-presence.hero",
    label: "Presencia Global — Imagen principal",
    page: "Presencia Global",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    fallback: "/images/offices/miami.png",
    seedSource: "offices/miami.jpg",
  },
  {
    key: "services.energy-transition.cover",
    label: "Servicio — Transición Energética",
    page: "Servicios",
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    fallback: "/images/editorial/wind.jpg",
    seedSource: "hero/yacht.jpg",
  },
  {
    key: "services.oil-and-energy.cover",
    label: "Servicio — Petróleo y Energía",
    page: "Servicios",
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    fallback: "/images/sectors/oil-gas.jpg",
    seedSource: "pillars/oil-energy.jpg",
  },
  {
    key: "services.mining-natural-resources.cover",
    label: "Servicio — Minería y Recursos Naturales",
    page: "Servicios",
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    fallback: "/images/sectors/mining.jpg",
    seedSource: "mining/emeralds.jpg",
  },
  {
    key: "services.sustainability-esg.cover",
    label: "Servicio — Sostenibilidad y ESG",
    page: "Servicios",
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    fallback: "/images/sustainability/plant.png",
    seedSource: "sustainability/plant.jpg",
  },
  {
    key: "services.investment-financial-advisory.cover",
    label: "Servicio — Inversión y Asesoría Financiera",
    page: "Servicios",
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    fallback: "/images/investment/handshake.png",
    seedSource: "investment/handshake.jpg",
  },
  {
    key: "services.strategic-operational-consulting.cover",
    label: "Servicio — Consultoría Estratégica y Operativa",
    page: "Servicios",
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    fallback: "/images/services/jet.png",
    seedSource: "services/jet.jpg",
  },
  {
    key: "offices.medellin.cover",
    label: "Oficina — Medellín",
    page: "Oficinas",
    recommendedWidth: 1200,
    recommendedHeight: 900,
    fallback: "/images/offices/medellin.jpg",
    seedSource: "offices/medellin.jpg",
  },
  {
    key: "offices.miami.cover",
    label: "Oficina — Miami",
    page: "Oficinas",
    recommendedWidth: 1200,
    recommendedHeight: 900,
    fallback: "/images/offices/miami.png",
    seedSource: "offices/miami.jpg",
  },
  {
    key: "offices.puerto-rico.cover",
    label: "Oficina — Puerto Rico",
    page: "Oficinas",
    recommendedWidth: 1200,
    recommendedHeight: 900,
    fallback: "/images/offices/sanjuan.jpg",
    seedSource: "offices/san-juan.jpg",
  },
  {
    key: "team.d-de-jesus.photo",
    label: "Equipo — D. De Jesús (Director general)",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 1000,
    fallback: "/images/team/CEO.png",
  },
  {
    key: "team.leandro-garces.photo",
    label: "Equipo — Leandro Garcés (Director de operaciones)",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 1000,
    fallback: "/images/team/Leandro.png",
  },
  {
    key: "team.adrian-cole.photo",
    label: "Equipo — Adrian Cole (Principal, Estrategia de crecimiento)",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 1000,
    fallback: "/images/team/personal3.png",
  },
  {
    key: "team.marcus-reid.photo",
    label: "Equipo — Marcus Reid (Director, Mercados de energía)",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 1000,
    fallback: "/images/team/personal4.png",
  },
  {
    key: "team.isabelle-laurent.photo",
    label: "Equipo — Isabelle Laurent (Directora de sostenibilidad y ESG)",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 1000,
    fallback: "/images/team/personal5.png",
  },
  {
    key: "team.natalia-rossi.photo",
    label: "Equipo — Natalia Rossi (Socia, Asesoría financiera)",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 1000,
    fallback: "/images/team/personal6.png",
  },
  {
    key: "team.alexander-grant.photo",
    label: "Equipo — Alexander Grant (Asesor senior, Mesa Miami)",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 1000,
    fallback: "/images/team/personal7.png",
  },
  {
    key: "team.nicolas-moreau.photo",
    label: "Equipo — Nicolas Moreau (Director, Consultoría estratégica)",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 1000,
    fallback: "/images/team/personal8.png",
  },
  {
    key: "team.victoria-hale.photo",
    label: "Equipo — Victoria Hale (Socia, Asesoría de inversión)",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 1000,
    fallback: "/images/team/personal9.png",
  },
  {
    key: "team.thomas-elias.photo",
    label: "Equipo — Thomas Elias (Asesor senior, Mesa Caribe)",
    page: "Equipo",
    recommendedWidth: 800,
    recommendedHeight: 1000,
    fallback: "/images/team/personal10.png",
  },
];

export function isRasterPath(path: string) {
  return /\.(avif|gif|jpe?g|png|webp)$/i.test(path);
}

const HOME_ANCHORS: Record<string, string> = {
  "home.hero": "content",
  "home.pro-support-1": "professional-support",
  "home.pro-support-2": "professional-support",
  "home.pro-support-3": "professional-support",
  "home.firm": "firm",
  "home.services-frame": "services",
  "home.oil": "oil",
  "home.mining": "mining",
  "home.sustainability": "sustainability-home",
  "home.investment": "investment",
  "home.contact-frame": "contact",
};

const PAGE_HREF: Record<string, string> = {
  Inicio: "/es",
  Equipo: "/es#team",
  "La Firma (About)": "/es/about",
  "Reservas (Booking)": "/es/booking",
  Contacto: "/es/contact",
  FAQ: "/es/faq",
  "404": "/es/pagina-inexistente-preview",
  "Legal (Privacidad/Términos/etc.)": "/es/legal/privacy",
  Sectores: "/es/sectors",
  "Servicios (índice)": "/es/services",
  Servicios: "/es/services",
  Insights: "/es/insights",
  "Presencia Global": "/es/global-presence",
  Oficinas: "/es/global-presence",
};

export function previewHrefForPage(page: string) {
  return PAGE_HREF[page] ?? "/es";
}

export function getImageSlot(key: string): ImageSlot | undefined {
  return IMAGE_SLOTS.find((slot) => slot.key === key);
}

/** Where the admin scaled preview should load and which section to jump to. */
export function previewForSlot(slot: ImageSlot): { href: string; anchor?: string } {
  if (slot.href) return { href: slot.href, anchor: slot.anchor };
  if (slot.key.startsWith("team.")) return { href: "/es", anchor: "team" };
  if (slot.key.startsWith("home.")) return { href: "/es", anchor: HOME_ANCHORS[slot.key] };
  if (slot.key.startsWith("about.")) return { href: "/es/about", anchor: slot.key === "about.mission" ? "mission" : slot.key === "about.stats" ? "stats" : undefined };
  if (slot.key.startsWith("sectors.card.")) return { href: "/es/sectors", anchor: "sectors" };
  if (slot.key.startsWith("booking.category.")) return { href: "/es/booking" };
  if (slot.key.startsWith("services.") && slot.key.endsWith(".cover")) {
    const slug = slot.key.slice("services.".length, -".cover".length);
    return { href: `/es/services/${slug}` };
  }
  if (slot.key.startsWith("offices.")) return { href: "/es/global-presence" };
  return { href: PAGE_HREF[slot.page] ?? "/es" };
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
