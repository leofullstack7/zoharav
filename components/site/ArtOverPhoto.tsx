import Image from "next/image";

/**
 * Layers an admin-uploaded (or seeded-from-recovered-original) photo
 * *behind* the site's hand-built SVG/editorial art, instead of swapping
 * one for the other. The photo is pushed dark (see `.art-over-photo-*` in
 * styles/experience.css) and the art sits on top in `mix-blend-mode:
 * screen`, so the art's own near-black background all but disappears
 * into the photo while its lighter glow/linework remains the clearly
 * legible, primary visual — the photo reads as a moody, subdued backdrop,
 * never a straight replacement.
 *
 * Drop this in wherever a single `<Image src={artSrc} fill ... />` used
 * to be the whole picture: both layers use `fill`, so the result occupies
 * exactly the same box the lone image used to. When `photoUrl` is null
 * (no admin upload/seed for this slot), renders the art alone — the
 * pre-existing look, unchanged.
 */
export function ArtOverPhoto({
  photoUrl,
  artSrc,
  alt = "",
  priority,
  sizes,
}: {
  photoUrl?: string | null;
  artSrc: string;
  alt?: string;
  priority?: boolean;
  sizes: string;
}) {
  if (!photoUrl) {
    return <Image src={artSrc} alt={alt} fill priority={priority} sizes={sizes} className="art-over-photo-img" />;
  }

  return (
    <>
      <Image
        src={photoUrl}
        alt=""
        aria-hidden
        fill
        priority={priority}
        sizes={sizes}
        className="art-over-photo-img art-over-photo-backdrop"
      />
      <Image
        src={artSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="art-over-photo-img art-over-photo-art"
      />
    </>
  );
}
