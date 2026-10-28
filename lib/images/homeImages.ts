import "server-only";
import { services } from "@/content/services";
import { activeOffices } from "@/content/offices";
import { team } from "@/content/team";
import { getSiteImagePhoto, getSiteImagePhotos } from "./getSiteImage";

/**
 * Consolidated, home-page-shaped bundle of every raw admin photo (or
 * null) the home page composites via ArtOverPhoto. Resolved server-side
 * in app/[locale]/(site)/page.tsx and passed down as a plain prop into
 * the client component tree (HomeExperience -> LiveFrame / TeamSlider) —
 * none of those client components talk to the database themselves, which
 * keeps the home page's first paint fast (no client-side blocking fetch)
 * while still picking up a fresh upload immediately via
 * lib/images/revalidateSiteImage.ts forcing a re-render of "/" and "/es".
 */
export type HomeImages = {
  hero: string | null;
  firm: string | null;
  contactFrame: string | null;
  serviceCovers: Record<string, string | null>;
  officeCovers: Record<string, string | null>;
  teamPhotos: Record<string, string | null>;
};

export async function getHomeImages(): Promise<HomeImages> {
  const [hero, firm, contactFrame, serviceCovers, officeCovers, teamPhotos] = await Promise.all([
    getSiteImagePhoto("home.hero"),
    getSiteImagePhoto("home.firm"),
    getSiteImagePhoto("home.contact-frame"),
    getSiteImagePhotos(services.map((service) => `services.${service.slug}.cover`)),
    getSiteImagePhotos(activeOffices.map((office) => `offices.${office.id}.cover`)),
    getSiteImagePhotos(team.map((member) => `team.${member.id}.photo`)),
  ]);

  const serviceCoversBySlug: Record<string, string | null> = {};
  for (const service of services) {
    serviceCoversBySlug[service.slug] = serviceCovers[`services.${service.slug}.cover`] ?? null;
  }

  const officeCoversById: Record<string, string | null> = {};
  for (const office of activeOffices) {
    officeCoversById[office.id] = officeCovers[`offices.${office.id}.cover`] ?? null;
  }

  const teamPhotosById: Record<string, string | null> = {};
  for (const member of team) {
    teamPhotosById[member.id] = teamPhotos[`team.${member.id}.photo`] ?? null;
  }

  return {
    hero,
    firm,
    contactFrame,
    serviceCovers: serviceCoversBySlug,
    officeCovers: officeCoversById,
    teamPhotos: teamPhotosById,
  };
}
