/**
 * One-off migration + seed runner for the admin image-management feature.
 *
 *   1. Creates `site_images` (idempotent, `CREATE TABLE IF NOT EXISTS`,
 *      same pattern as scripts/migrate.cjs).
 *   2. Creates the public "site-images" Supabase Storage bucket
 *      (idempotent — tolerates "already exists").
 *   3. Seeds every slot in lib/images/slots.ts: for slots with a
 *      `seedSource` (a recovered original photo, or the one photo that was
 *      never deleted, /images/firm/office.jpg), resizes + converts it to
 *      WebP and uploads it to Storage; for slots without one (team
 *      portraits — no real photo ever existed), inserts a row with
 *      `image_url = null` so the public site's existing placeholder shows
 *      until an admin uploads a real one.
 *   4. Re-running is safe: a slot whose row already has an `image_url` is
 *      left alone rather than re-uploaded.
 *
 * Deliberately does NOT import lib/db/client.ts, lib/supabase/admin.ts, or
 * lib/images/optimize.ts — all three (correctly) start with `import
 * "server-only"`, which throws outside a Next.js Server Component. Exactly
 * like scripts/migrate.cjs already does for the Postgres connection, this
 * script duplicates the small amount of setup it needs instead.
 *
 * Usage: node scripts/migrate-site-images.ts
 *   (Node 22+ runs .ts directly via built-in type stripping — no ts-node /
 *   tsx install required. Run from the repository root.)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { IMAGE_SLOTS } from "../lib/images/slots.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const SEED_IMAGES_DIR = path.join(__dirname, ".seed-images");
const SITE_IMAGES_BUCKET = "site-images";

// --- env -------------------------------------------------------------
function loadEnvLocal() {
  const envPath = path.join(REPO_ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const contents = fs.readFileSync(envPath, "utf8");
  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvLocal();

const postgresUrl = process.env.POSTGRES_URL_NON_POOLING;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!postgresUrl) {
  console.error("POSTGRES_URL_NON_POOLING is not set. Aborting.");
  process.exit(1);
}
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set. Aborting.");
  process.exit(1);
}

// --- Postgres (duplicated from scripts/migrate.cjs; see its own comment
// for why: Node's bundled CA store doesn't trust Supabase's root CA) ----
const SUPABASE_CA = `-----BEGIN CERTIFICATE-----
MIIDxDCCAqygAwIBAgIUbLxMod62P2ktCiAkxnKJwtE9VPYwDQYJKoZIhvcNAQEL
BQAwazELMAkGA1UEBhMCVVMxEDAOBgNVBAgMB0RlbHdhcmUxEzARBgNVBAcMCk5l
dyBDYXN0bGUxFTATBgNVBAoMDFN1cGFiYXNlIEluYzEeMBwGA1UEAwwVU3VwYWJh
c2UgUm9vdCAyMDIxIENBMB4XDTIxMDQyODEwNTY1M1oXDTMxMDQyNjEwNTY1M1ow
azELMAkGA1UEBhMCVVMxEDAOBgNVBAgMB0RlbHdhcmUxEzARBgNVBAcMCk5ldyBD
YXN0bGUxFTATBgNVBAoMDFN1cGFiYXNlIEluYzEeMBwGA1UEAwwVU3VwYWJhc2Ug
Um9vdCAyMDIxIENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqQXW
QyHOB+qR2GJobCq/CBmQ40G0oDmCC3mzVnn8sv4XNeWtE5XcEL0uVih7Jo4Dkx1Q
DmGHBH1zDfgs2qXiLb6xpw/CKQPypZW1JssOTMIfQppNQ87K75Ya0p25Y3ePS2t2
GtvHxNjUV6kjOZjEn2yWEcBdpOVCUYBVFBNMB4YBHkNRDa/+S4uywAoaTWnCJLUi
cvTlHmMw6xSQQn1UfRQHk50DMCEJ7Cy1RxrZJrkXXRP3LqQL2ijJ6F4yMfh+Gyb4
O4XajoVj/+R4GwywKYrrS8PrSNtwxr5StlQO8zIQUSMiq26wM8mgELFlS/32Uclt
NaQ1xBRizkzpZct9DwIDAQABo2AwXjALBgNVHQ8EBAMCAQYwHQYDVR0OBBYEFKjX
uXY32CztkhImng4yJNUtaUYsMB8GA1UdIwQYMBaAFKjXuXY32CztkhImng4yJNUt
aUYsMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAB8spzNn+4VU
tVxbdMaX+39Z50sc7uATmus16jmmHjhIHz+l/9GlJ5KqAMOx26mPZgfzG7oneL2b
VW+WgYUkTT3XEPFWnTp2RJwQao8/tYPXWEJDc0WVQHrpmnWOFKU/d3MqBgBm5y+6
jB81TU/RG2rVerPDWP+1MMcNNy0491CTL5XQZ7JfDJJ9CCmXSdtTl4uUQnSuv/Qx
Cea13BX2ZgJc7Au30vihLhub52De4P/4gonKsNHYdbWjg7OWKwNv/zitGDVDB9Y2
CMTyZKG3XEu5Ghl1LEnI3QmEKsqaCLv12BnVjbkSeZsMnevJPs1Ye6TjjJwdik5P
o/bKiIz+Fq8=
-----END CERTIFICATE-----`;

function buildClientConfig(rawConnectionString: string) {
  const url = new URL(rawConnectionString);
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 5432,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, "") || "postgres",
    ssl: { ca: SUPABASE_CA },
  };
}

async function optimizeToWebp(input: Buffer, maxWidth: number, maxHeight: number): Promise<Buffer> {
  return sharp(input)
    .resize({ width: maxWidth, height: maxHeight, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}

function resolveSeedFile(seedSource: string): string {
  // firm/office.jpg was never deleted — read it straight from /public
  // rather than the recovered-originals directory.
  if (seedSource === "firm/office.jpg") {
    return path.join(REPO_ROOT, "public", "images", "firm", "office.jpg");
  }
  return path.join(SEED_IMAGES_DIR, seedSource);
}

async function main() {
  const pg = new Client(buildClientConfig(postgresUrl!));
  await pg.connect();

  const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    // 1. Schema -----------------------------------------------------
    await pg.query("begin");
    await pg.query(`
      create table if not exists site_images (
        slot_key text primary key,
        label text not null,
        page text not null,
        recommended_width int not null,
        recommended_height int not null,
        image_url text,
        storage_path text,
        updated_at timestamptz not null default now()
      );
    `);
    await pg.query("commit");
    console.log("site_images table ready.");

    // 2. Storage bucket ----------------------------------------------
    const { error: bucketError } = await supabase.storage.createBucket(SITE_IMAGES_BUCKET, { public: true });
    if (bucketError) {
      const alreadyExists =
        /already exists/i.test(bucketError.message) || (bucketError as { statusCode?: string }).statusCode === "409";
      if (!alreadyExists) throw bucketError;
      console.log(`Bucket "${SITE_IMAGES_BUCKET}" already exists — continuing.`);
    } else {
      console.log(`Bucket "${SITE_IMAGES_BUCKET}" created.`);
    }

    // 3. Seed every slot ----------------------------------------------
    for (const slot of IMAGE_SLOTS) {
      const existing = await pg.query<{ image_url: string | null }>(
        "select image_url from site_images where slot_key = $1",
        [slot.key],
      );
      const alreadySeeded = existing.rows.length > 0 && Boolean(existing.rows[0].image_url);

      if (alreadySeeded) {
        console.log(`[skip] ${slot.key} — already has an image_url.`);
        continue;
      }

      if (!slot.seedSource) {
        // Team portraits: no real photo exists yet — insert/leave the row
        // null so the public placeholder keeps showing.
        await pg.query(
          `insert into site_images (slot_key, label, page, recommended_width, recommended_height, image_url, storage_path, updated_at)
           values ($1, $2, $3, $4, $5, null, null, now())
           on conflict (slot_key) do nothing`,
          [slot.key, slot.label, slot.page, slot.recommendedWidth, slot.recommendedHeight],
        );
        console.log(`[seed] ${slot.key} — no photo available, left null.`);
        continue;
      }

      const sourcePath = resolveSeedFile(slot.seedSource);
      if (!fs.existsSync(sourcePath)) {
        console.warn(`[warn] ${slot.key} — seed source not found at ${sourcePath}, skipping.`);
        continue;
      }

      const originalBuffer = fs.readFileSync(sourcePath);
      const originalBytes = originalBuffer.byteLength;
      const optimized = await optimizeToWebp(originalBuffer, slot.recommendedWidth, slot.recommendedHeight);
      const storagePath = `${slot.key}-seed.webp`;

      const { error: uploadError } = await supabase.storage
        .from(SITE_IMAGES_BUCKET)
        .upload(storagePath, optimized, { contentType: "image/webp", upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(storagePath);
      const imageUrl = publicUrlData.publicUrl;

      await pg.query(
        `insert into site_images (slot_key, label, page, recommended_width, recommended_height, image_url, storage_path, updated_at)
         values ($1, $2, $3, $4, $5, $6, $7, now())
         on conflict (slot_key) do update set
           label = excluded.label,
           page = excluded.page,
           recommended_width = excluded.recommended_width,
           recommended_height = excluded.recommended_height,
           image_url = excluded.image_url,
           storage_path = excluded.storage_path,
           updated_at = excluded.updated_at`,
        [slot.key, slot.label, slot.page, slot.recommendedWidth, slot.recommendedHeight, imageUrl, storagePath],
      );

      console.log(
        `[seed] ${slot.key} — ${originalBytes.toLocaleString()} bytes -> ${optimized.byteLength.toLocaleString()} bytes (webp), ${imageUrl}`,
      );
    }

    // 4. Verification ---------------------------------------------------
    const rows = await pg.query<{ slot_key: string; image_url: string | null }>(
      "select slot_key, image_url from site_images order by slot_key",
    );
    console.log("\n--- site_images (final state) ---");
    for (const row of rows.rows) {
      console.log(`${row.slot_key}\t${row.image_url ?? "(null — using fallback)"}`);
    }
    console.log(`\n${rows.rows.length} rows total (${IMAGE_SLOTS.length} slots registered).`);
  } finally {
    await pg.end();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
