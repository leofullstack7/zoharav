import "server-only";
import sharp from "sharp";

/**
 * Resizes an uploaded image to fit inside a slot's recommended dimensions
 * (never upscaling, never cropping) and converts it to WebP. Shared by the
 * admin upload route so every slot gets the same optimization pass.
 */
export type OptimizeResult = {
  buffer: Buffer;
  beforeBytes: number;
  afterBytes: number;
  width: number | undefined;
  height: number | undefined;
};

/** Resize (fit inside, never upscale), strip metadata, emit WebP. */
export async function optimizeToWebp(
  input: Buffer,
  maxWidth: number,
  maxHeight: number,
): Promise<OptimizeResult> {
  const beforeBytes = input.byteLength;
  const pipeline = sharp(input, { failOn: "none" }).rotate().withMetadata({ exif: undefined, icc: undefined });

  const buffer = await pipeline
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80, effort: 5, smartSubsample: true })
    .toBuffer();

  const meta = await sharp(buffer).metadata();
  return {
    buffer,
    beforeBytes,
    afterBytes: buffer.byteLength,
    width: meta.width,
    height: meta.height,
  };
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
