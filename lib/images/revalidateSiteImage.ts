import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { getPublishedSlugs } from "@/lib/content/insights";
import { legalDocIds } from "@/lib/content/legalDocs";
import { SITE_IMAGES_CACHE_TAG } from "./getSiteImage";

/**
 * next-intl is configured with `localePrefix: "as-needed"` and
 * `defaultLocale: "en"`: English routes are unprefixed, Spanish routes are
 * prefixed with /es. Both must be revalidated for a path to actually
 * refresh for every visitor.
 */
function localizedPaths(path: string): string[] {
  const esPath = path === "/" ? "/es" : `/es${path}`;
  return [path, esPath];
}

/**
 * Called by the admin upload/delete routes right after `site_images` is
 * written. Busts the shared Data Cache tag every `getSiteImage()` call is
 * tagged with, then forces an immediate re-render (clearing the Full Route
 * Cache) of every public page that could be showing this slot — so an
 * admin's upload shows up on the live site on the very next request, with
 * no redeploy and no waiting out a cache TTL.
 *
 * The mega-menu in components/layout/Header.tsx is deliberately NOT in
 * this list: it resolves its per-service thumbnail through a tiny public
 * API route (GET /api/site-images/services) fetched client-side on mount,
 * precisely so a service-cover upload doesn't require revalidating every
 * single page on the site (Header renders inside the shared (site)
 * layout, which wraps literally every route).
 */
export function revalidateSiteImage(slotKey: string): void {
  revalidateTag(SITE_IMAGES_CACHE_TAG);

  const paths = new Set<string>();
  const addPage = (path: string) => {
    for (const p of localizedPaths(path)) paths.add(p);
  };

  if (slotKey.startsWith("home.") || slotKey.startsWith("team.")) {
    addPage("/");
  } else if (slotKey === "about.hero") {
    addPage("/about");
  } else if (slotKey === "booking.hero") {
    addPage("/booking");
  } else if (slotKey === "contact.hero") {
    addPage("/contact");
  } else if (slotKey === "faq.hero") {
    addPage("/faq");
  } else if (slotKey === "legal.hero") {
    for (const doc of legalDocIds) addPage(`/legal/${doc}`);
  } else if (slotKey === "sectors.hero") {
    addPage("/sectors");
  } else if (slotKey === "services-index.hero") {
    addPage("/services");
  } else if (slotKey === "insights.hero") {
    addPage("/insights");
    try {
      for (const slug of getPublishedSlugs()) addPage(`/insights/${slug}`);
    } catch (err) {
      console.error("revalidateSiteImage: could not list insight slugs to revalidate.", err);
    }
  } else if (slotKey === "global-presence.hero") {
    addPage("/global-presence");
  } else if (slotKey.startsWith("services.") && slotKey.endsWith(".cover")) {
    const slug = slotKey.slice("services.".length, -".cover".length);
    addPage(`/services/${slug}`);
    addPage("/"); // home "Servicios" line-grid card for this service
  } else if (slotKey.startsWith("offices.") && slotKey.endsWith(".cover")) {
    addPage("/global-presence");
    addPage("/"); // home "Presencia" city card
  }
  // slotKey === "not-found.hero": the locale not-found page is rendered
  // on demand for any unmatched route, not a static path `revalidatePath`
  // can target — the 5-minute Data Cache TTL on getSiteImage is enough for
  // this low-traffic page to pick up a fresh value.

  for (const path of paths) revalidatePath(path);
}
