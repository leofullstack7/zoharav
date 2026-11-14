import "server-only";
import type { Service } from "@/content/types";
import { getSiteImage } from "./getSiteImage";
import {
  pillarMediaKey,
  studioDetailKey,
  subServiceMediaKey,
} from "./serviceMedia";

export type ServicePageMedia = {
  subs: Record<string, string>;
  pillars: [string, string, string];
  studioDetails: Record<string, [string, string, string]>;
};

export async function resolveServicePageMedia(service: Service): Promise<ServicePageMedia> {
  const subKeys = service.subServices.map((sub) => subServiceMediaKey(service.slug, sub.id));
  const pillarKeys = [1, 2, 3].map((n) => pillarMediaKey(service.slug, n as 1 | 2 | 3));
  const detailKeys = service.subServices.flatMap((sub) =>
    [1, 2, 3].map((n) => studioDetailKey(service.slug, sub.id, n as 1 | 2 | 3)),
  );

  const resolved = await Promise.all(
    [...subKeys, ...pillarKeys, ...detailKeys].map(async (key) => [key, await getSiteImage(key)] as const),
  );
  const byKey = Object.fromEntries(resolved);

  const subs: Record<string, string> = {};
  const studioDetails: Record<string, [string, string, string]> = {};

  for (const sub of service.subServices) {
    subs[sub.id] = byKey[subServiceMediaKey(service.slug, sub.id)];
    studioDetails[sub.id] = [
      byKey[studioDetailKey(service.slug, sub.id, 1)],
      byKey[studioDetailKey(service.slug, sub.id, 2)],
      byKey[studioDetailKey(service.slug, sub.id, 3)],
    ];
  }

  return {
    subs,
    pillars: [
      byKey[pillarMediaKey(service.slug, 1)],
      byKey[pillarMediaKey(service.slug, 2)],
      byKey[pillarMediaKey(service.slug, 3)],
    ],
    studioDetails,
  };
}