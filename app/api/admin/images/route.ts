import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/requireAdmin";
import { query } from "@/lib/db/client";
import { groupImageSlotsByPage } from "@/lib/images/slots";

/**
 * Admin-only: list every image slot grouped by page, each joined with its
 * current `site_images` row (if any). Drives the /admin/images grid —
 * labels, recommended dimensions, and page grouping all come from the
 * single IMAGE_SLOTS registry (lib/images/slots.ts), never duplicated
 * here; this route only adds what actually lives in the database
 * (image_url, updated_at).
 *
 * Response: 200 { groups: Array<{ page: string; slots: Array<{
 *   key, label, recommendedWidth, recommendedHeight, imageUrl, updatedAt
 * }> }> }
 */
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const result = await query<{ slot_key: string; image_url: string | null; updated_at: string }>(
      "select slot_key, image_url, updated_at from site_images",
    );
    const rowsByKey = new Map(result.rows.map((row) => [row.slot_key, row]));

    const groups = groupImageSlotsByPage().map(({ page, slots }) => ({
      page,
      slots: slots.map((slot) => {
        const row = rowsByKey.get(slot.key);
        return {
          key: slot.key,
          label: slot.label,
          recommendedWidth: slot.recommendedWidth,
          recommendedHeight: slot.recommendedHeight,
          imageUrl: row?.image_url ?? null,
          updatedAt: row?.updated_at ?? null,
        };
      }),
    }));

    return NextResponse.json({ groups }, { status: 200 });
  } catch (err) {
    console.error("Failed to list site images:", err);
    return NextResponse.json({ error: "No se pudo cargar la lista de imágenes." }, { status: 500 });
  }
}
