import { NextResponse } from "next/server";
import { services } from "@/content/services";
import { query } from "@/lib/db/client";

/**
 * Public, read-only: for each of the six service lines, the raw admin
 * photo URL (or null) plus the art fallback. Exists so
 * components/layout/Header.tsx (the mega-menu thumbnail, a client
 * component rendered inside the shared (site) layout — i.e. on every
 * single page) can composite the same ArtOverPhoto layering the rest of
 * the site uses, without the admin upload route having to revalidate
 * every page on the site. The mega-menu panel is hidden until hover, so
 * this fetch never competes with the page's own LCP image.
 *
 * No admin/session check: this only ever returns image URLs that are
 * already public (the Storage bucket is public-read) or the service's
 * already-public fallback SVG — nothing sensitive.
 */
export async function GET() {
  const fallbackPayload = () => {
    const payload: Record<string, { photoUrl: string | null; art: string }> = {};
    for (const service of services) payload[service.slug] = { photoUrl: null, art: service.image };
    return payload;
  };

  try {
    const result = await query<{ slot_key: string; image_url: string | null }>(
      "select slot_key, image_url from site_images where slot_key like 'services.%.cover'",
    );
    const bySlot = new Map(result.rows.map((row) => [row.slot_key, row.image_url]));

    const payload: Record<string, { photoUrl: string | null; art: string }> = {};
    for (const service of services) {
      payload[service.slug] = {
        photoUrl: bySlot.get(`services.${service.slug}.cover`) ?? null,
        art: service.image,
      };
    }

    return NextResponse.json(payload, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Failed to resolve service cover images:", err);
    return NextResponse.json(fallbackPayload(), { status: 200, headers: { "Cache-Control": "no-store" } });
  }
}
