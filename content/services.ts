import type { Service, ServiceSlug, SubService } from "./types";
import { energyTransition } from "./lines/energy-transition";
import { investment } from "./lines/investment";
import { mining } from "./lines/mining";
import { oilAndEnergy } from "./lines/oil-and-energy";
import { strategic } from "./lines/strategic";
import { sustainability } from "./lines/sustainability";

export const services: Service[] = [
  energyTransition,
  oilAndEnergy,
  mining,
  sustainability,
  investment,
  strategic,
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getNextService(slug: ServiceSlug): Service {
  const index = services.findIndex((service) => service.slug === slug);
  return services[(index + 1) % services.length] ?? services[0];
}

export type Offer = {
  service: Service;
  subService: SubService;
};

/**
 * Resolves the {slug, item} pair behind `/services/[slug]/[item]` to the
 * parent Service and the specific SubService, mirroring getService's
 * "return undefined, let the caller notFound()" contract. Used by the
 * dedicated sub-service page and by anything that needs to validate a
 * sub-service id against its real parent line.
 */
export function getOffer(slug: string, item: string): Offer | undefined {
  const service = getService(slug);
  if (!service) return undefined;
  const subService = service.subServices.find((sub) => sub.id === item);
  if (!subService) return undefined;
  return { service, subService };
}

export {
  energyTransition,
  investment,
  mining,
  oilAndEnergy,
  strategic,
  sustainability,
};
