import "server-only";
import { team } from "@/content/team";
import { getSiteImagePhotos } from "./getSiteImage";

/**
 * Resolves every `team.<id>.photo` slot and remaps the result from the
 * full slot key to the bare member id, matching the shape TeamSlider's
 * `photos` prop expects (see components/home/TeamSlider.tsx's TeamCard,
 * `photoUrl={photos?.[member.id]}`). Mirrors the remap already done
 * inline in lib/images/homeImages.ts for the home page's own TeamSlider
 * usage — pulled out here so About can reuse the exact same lookup
 * without re-deriving it.
 */
export async function getTeamPhotosById(): Promise<Record<string, string | null>> {
  const photos = await getSiteImagePhotos(team.map((member) => `team.${member.id}.photo`));
  const byId: Record<string, string | null> = {};
  for (const member of team) {
    byId[member.id] = photos[`team.${member.id}.photo`] ?? null;
  }
  return byId;
}
