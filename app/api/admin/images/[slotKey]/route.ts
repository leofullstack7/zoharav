import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/requireAdmin";
import { query } from "@/lib/db/client";
import { isLikelyImage, optimizeToWebp } from "@/lib/images/optimize";
import { revalidateSiteImage } from "@/lib/images/revalidateSiteImage";
import { getImageSlot } from "@/lib/images/slots";
import { getSupabaseAdminClient, SITE_IMAGES_BUCKET } from "@/lib/supabase/admin";

/**
 * Admin-only: upload (POST) or remove (DELETE) the image for one slot.
 *
 * POST body: multipart/form-data with a single "file" field. The upload is
 * resized to fit inside the slot's recommended dimensions (never upscaled,
 * never cropped — `fit: "inside", withoutEnlargement: true`), converted to
 * WebP at quality 82, and stored at a timestamped path so replacing an
 * image always gets a fresh URL (busts any CDN/browser cache automatically)
 * while the previous object is deleted so Storage doesn't accumulate
 * orphans. `site_images` is updated and the affected public page(s) are
 * revalidated immediately — see lib/images/revalidateSiteImage.ts.
 *
 * Responses: 200 { ok: true, imageUrl: string } · 400 · 401 · 404 · 500
 */

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB — generous for a phone photo, not for abuse.

async function requireAdminOr401() {
  const session = await getAdminSession();
  return session ? null : NextResponse.json({ error: "No autorizado." }, { status: 401 });
}

export async function POST(request: Request, { params }: { params: Promise<{ slotKey: string }> }) {
  const unauthorized = await requireAdminOr401();
  if (unauthorized) return unauthorized;

  const { slotKey } = await params;
  const slot = getImageSlot(slotKey);
  if (!slot) {
    return NextResponse.json({ error: "Slot de imagen desconocido." }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "Se requiere un archivo de imagen." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "El archivo supera el tamaño máximo (15 MB)." }, { status: 400 });
  }
  if (file.type && !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "El archivo debe ser una imagen." }, { status: 400 });
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());
  if (!(await isLikelyImage(inputBuffer))) {
    return NextResponse.json({ error: "El archivo no parece ser una imagen válida." }, { status: 400 });
  }

  let optimized: Buffer;
  try {
    optimized = await optimizeToWebp(inputBuffer, slot.recommendedWidth, slot.recommendedHeight);
  } catch (err) {
    console.error(`Failed to optimize upload for slot "${slotKey}":`, err);
    return NextResponse.json({ error: "No se pudo procesar la imagen." }, { status: 500 });
  }

  const storagePath = `${slotKey}-${Date.now()}.webp`;

  try {
    const supabase = getSupabaseAdminClient();

    // Look up the previous object so it can be deleted once the new one is
    // safely stored — avoids leaking an orphaned file on every replace.
    const previous = await query<{ storage_path: string | null }>(
      "select storage_path from site_images where slot_key = $1",
      [slotKey],
    );
    const previousStoragePath = previous.rows[0]?.storage_path ?? null;

    const { error: uploadError } = await supabase.storage
      .from(SITE_IMAGES_BUCKET)
      .upload(storagePath, optimized, { contentType: "image/webp", upsert: false });
    if (uploadError) {
      console.error(`Failed to upload image for slot "${slotKey}":`, uploadError);
      return NextResponse.json({ error: "No se pudo subir la imagen." }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(storagePath);
    const imageUrl = publicUrlData.publicUrl;

    await query(
      `insert into site_images (slot_key, label, page, recommended_width, recommended_height, image_url, storage_path, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, now())
       on conflict (slot_key) do update set
         image_url = excluded.image_url,
         storage_path = excluded.storage_path,
         updated_at = excluded.updated_at`,
      [slotKey, slot.label, slot.page, slot.recommendedWidth, slot.recommendedHeight, imageUrl, storagePath],
    );

    if (previousStoragePath) {
      const { error: removeError } = await supabase.storage.from(SITE_IMAGES_BUCKET).remove([previousStoragePath]);
      if (removeError) {
        // Non-fatal: the new image is already live and the DB row already
        // points at it — log and move on rather than fail the request over
        // a leftover file.
        console.error(`Failed to delete previous image for slot "${slotKey}":`, removeError);
      }
    }

    revalidateSiteImage(slotKey);

    return NextResponse.json({ ok: true, imageUrl }, { status: 200 });
  } catch (err) {
    console.error(`Failed to save uploaded image for slot "${slotKey}":`, err);
    return NextResponse.json({ error: "No se pudo guardar la imagen." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slotKey: string }> }) {
  const unauthorized = await requireAdminOr401();
  if (unauthorized) return unauthorized;

  const { slotKey } = await params;
  const slot = getImageSlot(slotKey);
  if (!slot) {
    return NextResponse.json({ error: "Slot de imagen desconocido." }, { status: 404 });
  }

  try {
    const existing = await query<{ storage_path: string | null }>(
      "select storage_path from site_images where slot_key = $1",
      [slotKey],
    );
    const storagePath = existing.rows[0]?.storage_path ?? null;

    await query(
      `update site_images set image_url = null, storage_path = null, updated_at = now() where slot_key = $1`,
      [slotKey],
    );

    if (storagePath) {
      const supabase = getSupabaseAdminClient();
      const { error: removeError } = await supabase.storage.from(SITE_IMAGES_BUCKET).remove([storagePath]);
      if (removeError) {
        console.error(`Failed to delete storage object for slot "${slotKey}":`, removeError);
      }
    }

    revalidateSiteImage(slotKey);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error(`Failed to clear image for slot "${slotKey}":`, err);
    return NextResponse.json({ error: "No se pudo quitar la imagen." }, { status: 500 });
  }
}
