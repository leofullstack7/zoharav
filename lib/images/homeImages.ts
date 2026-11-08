import "server-only";
import { services } from "@/content/services";
import { activeOffices } from "@/content/offices";
import { team } from "@/content/team";
import { getSiteImagePhoto, getSiteImagePhotos } from "./getSiteImage";

/**
 * Consolidated, home-page-shaped bundle of every admin photo (or raster
 * fallback) the home page composites. Resolved server-side in
 * app/[locale]/(site)/page.tsx and passed into HomeExperience.
 */
export type HomeImages = {
  hero: string | null;
  firm: string | null;
  contactFrame: string | null;
  proSupport: [string | null, string | null, string | null];
  servicesFrame: string | null;
  oil: string | null;
  mining: string | null;
  sustainability: string | null;
  investment: string | null;
  serviceCovers: Record<string, string | null>;
  officeCovers: Record<string, string | null>;
  teamPhotos: Record<string, string | null>;
};

export async function getHomeImages(): Promise<HomeImages> {
  const [
    hero,
    firm,
    contactFrame,
    pro1,
    pro2,
    pro3,
    servicesFrame,
    oil,
    mining,
    sustainability,
    investment,
    serviceCovers,
    officeCovers,
    teamPhotos,
  ] = await Promise.all([
    getSiteImagePhoto("home.hero"),
    getSiteImagePhoto("home.firm"),
    getSiteImagePhoto("home.contact-frame"),
    getSiteImagePhoto("home.pro-support-1"),
    getSiteImagePhoto("home.pro-support-2"),
    getSiteImagePhoto("home.pro-support-3"),
    getSiteImagePhoto("home.services-frame"),
    getSiteImagePhoto("home.oil"),
    getSiteImagePhoto("home.mining"),
    getSiteImagePhoto("home.sustainability"),
    getSiteImagePhoto("home.investment"),
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
    proSupport: [pro1, pro2, pro3],
    servicesFrame,
    oil,
    mining,
    sustainability,
    investment,
    serviceCovers: serviceCoversBySlug,
    officeCovers: officeCoversById,
    teamPhotos: teamPhotosById,
  };
}
