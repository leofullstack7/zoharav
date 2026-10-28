import "server-only";
import sharp from "sharp";

/**
 * Resizes an uploaded image to fit inside a slot's recommended dimensions
 * (never upscaling, never cropping) and converts it to WebP. Shared by the
 * admin upload route so every slot gets the same optimization pass.
 */
export async function optimizeToWebp(
  input: Buffer,
  maxWidth: number,
  maxHeight: number,
): Promise<Buffer> {
  return sharp(input)
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer();
}

/** Loose but real validation: sniffs the actual bytes, not just the filename/MIME header. */
export async function isLikelyImage(input: Buffer): Promise<boolean> {
  try {
    const meta = await sharp(input).metadata();
    return Boolean(meta.format);
  } catch {
    return false;
  }
}
