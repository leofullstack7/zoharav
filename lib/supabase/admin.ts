import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Public-read bucket holding every admin-uploaded site image. Created
 * (idempotently) by scripts/migrate-site-images.ts. Public so the site's
 * <Image> tags can load straight from Storage without a signed URL.
 */
export const SITE_IMAGES_BUCKET = "site-images";

let cachedClient: SupabaseClient | undefined;

/**
 * Server-only Supabase client authorized with the service-role key — full
 * read/write access to Storage (and, in principle, to every table, though
 * this app only ever uses it for the `site-images` bucket; table access
 * still goes through `lib/db/client.ts`'s `pg` pool). Never import this
 * from a Client Component — the `server-only` guard above makes that fail
 * the build rather than ship the key to the browser.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set; cannot manage Storage.");
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}
