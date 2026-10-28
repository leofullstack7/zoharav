import "server-only";
import { unstable_cache } from "next/cache";
import { query } from "@/lib/db/client";
import { getImageSlot, IMAGE_SLOTS } from "./slots";

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

const fetchImageUrl = unstable_cache(
  async (slotKey: string): Promise<string | null> => {
    const result = await query<{ image_url: string | null }>(
      "select image_url from site_images where slot_key = $1",
      [slotKey],
    );
    return result.rows[0]?.image_url ?? null;
  },
  ["site-image-url"],
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
    const url = await fetchImageUrl(slotKey);
    return url || slot.fallback;
  } catch (err) {
    console.error(`getSiteImage: failed to resolve "${slotKey}", using fallback.`, err);
    return slot.fallback;
  }
}

/**
 * Raw admin-uploaded (or seeded) photo URL for a slot, or `null` when none
 * exists — unlike `getSiteImage`, this does NOT substitute the fallback.
 * Used wherever the caller needs to render the photo as a separate,
 * darkened backdrop layer *behind* the slot's hand-built SVG art (see
 * components/site/ArtOverPhoto.tsx) rather than as a straight replacement
 * for it: the two are composited together, so the caller needs to know
 * whether a photo exists at all before deciding whether to render that
 * second layer.
 */
export async function getSiteImagePhoto(slotKey: string): Promise<string | null> {
  if (!getImageSlot(slotKey)) {
    throw new Error(`getSiteImagePhoto: unknown image slot "${slotKey}". Add it to lib/images/slots.ts first.`);
  }
  try {
    return await fetchImageUrl(slotKey);
  } catch (err) {
    console.error(`getSiteImagePhoto: failed to resolve "${slotKey}".`, err);
    return null;
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

/** Every registered slot key, for callers that want to resolve "all of them". */
export const ALL_IMAGE_SLOT_KEYS = IMAGE_SLOTS.map((slot) => slot.key);
