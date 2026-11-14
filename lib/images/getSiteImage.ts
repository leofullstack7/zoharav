import "server-only";
import { unstable_cache } from "next/cache";
import { query } from "@/lib/db/client";
import { resolveAltText } from "./slotAlt";
import { getImageSlot, IMAGE_SLOTS, isRasterPath } from "./slots";

/**
 * Single shared cache tag for every `site_images` read. The admin upload
 * route calls `revalidateTag(SITE_IMAGES_CACHE_TAG)` (see
 * lib/images/revalidateSiteImage.ts) whenever a row changes, which busts
 * this Data Cache entry; `revalidatePath()` on the affected public pages
 * then forces those pages to re-render and pick up the fresh value on the
 * very next request, without waiting for the 5-minute TTL below and
 * without a full redeploy.
 */
export const SITE_IMAGES_CACHE_TAG = "site-images";

type SiteImageRow = {
  image_url: string | null;
  alt_text: string | null;
};

const fetchImageRow = unstable_cache(
  async (slotKey: string): Promise<SiteImageRow | null> => {
    const result = await query<SiteImageRow>(
      "select image_url, alt_text from site_images where slot_key = $1",
      [slotKey],
    );
    return result.rows[0] ?? null;
  },
  ["site-image-row"],
  { revalidate: 300, tags: [SITE_IMAGES_CACHE_TAG] },
);

/**
 * Resolves the URL to render for a given image slot: the admin-uploaded
 * WebP from Supabase Storage if one exists, otherwise the slot's
 * registered fallback (a hand-built SVG, or — for a few slots — the one
 * photo that was never removed). Never throws for a transient DB error;
 * callers always get *something* paintable.
 */
export async function getSiteImage(slotKey: string): Promise<string> {
  const slot = getImageSlot(slotKey);
  if (!slot) {
    throw new Error(`getSiteImage: unknown image slot "${slotKey}". Add it to lib/images/slots.ts first.`);
  }

  try {
    const row = await fetchImageRow(slotKey);
    return row?.image_url || slot.fallback;
  } catch (err) {
    console.error(`getSiteImage: failed to resolve "${slotKey}", using fallback.`, err);
    return slot.fallback;
  }
}

export async function getSiteImageAlt(slotKey: string): Promise<string> {
  const slot = getImageSlot(slotKey);
  if (!slot) {
    throw new Error(`getSiteImageAlt: unknown image slot "${slotKey}".`);
  }
  try {
    const row = await fetchImageRow(slotKey);
    return resolveAltText(slotKey, row?.alt_text);
  } catch (err) {
    console.error(`getSiteImageAlt: failed to resolve "${slotKey}", using label.`, err);
    return resolveAltText(slotKey, null);
  }
}

/**
 * Raw admin-uploaded (or seeded) photo URL for a slot, or `null` when none
 * exists — unlike `getSiteImage`, this does NOT substitute the fallback.
 */
export async function getSiteImagePhoto(slotKey: string): Promise<string | null> {
  const slot = getImageSlot(slotKey);
  if (!slot) {
    throw new Error(`getSiteImagePhoto: unknown image slot "${slotKey}". Add it to lib/images/slots.ts first.`);
  }
  const rasterFallback = isRasterPath(slot.fallback) ? slot.fallback : null;
  try {
    const row = await fetchImageRow(slotKey);
    return row?.image_url || rasterFallback;
  } catch (err) {
    console.error(`getSiteImagePhoto: failed to resolve "${slotKey}".`, err);
    return rasterFallback;
  }
}

/** Batched helper for pages/components that need several slots at once. */
export async function getSiteImages<K extends string>(
  slotKeys: readonly K[],
): Promise<Record<K, string>> {
  const entries = await Promise.all(
    slotKeys.map(async (key) => [key, await getSiteImage(key)] as const),
  );
  return Object.fromEntries(entries) as Record<K, string>;
}

/** Batched variant of `getSiteImagePhoto` for several slots at once. */
export async function getSiteImagePhotos<K extends string>(
  slotKeys: readonly K[],
): Promise<Record<K, string | null>> {
  const entries = await Promise.all(
    slotKeys.map(async (key) => [key, await getSiteImagePhoto(key)] as const),
  );
  return Object.fromEntries(entries) as Record<K, string | null>;
}

export async function getSiteImageAlts<K extends string>(
  slotKeys: readonly K[],
): Promise<Record<K, string>> {
  const entries = await Promise.all(
    slotKeys.map(async (key) => [key, await getSiteImageAlt(key)] as const),
  );
  return Object.fromEntries(entries) as Record<K, string>;
}

/** Every registered slot key, for callers that want to resolve "all of them". */
export const ALL_IMAGE_SLOT_KEYS = IMAGE_SLOTS.map((slot) => slot.key);