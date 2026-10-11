import type { Service, ServiceSlug } from "./types";
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

export {
  energyTransition,
  investment,
  mining,
  oilAndEnergy,
  strategic,
  sustainability,
};
