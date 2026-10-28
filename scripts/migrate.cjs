/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

/**
 * One-off migration runner for the shared data foundation (availability
 * slots, bookings, bot settings) that the admin panel and the chat widget
 * both depend on. Applies schema with `CREATE TABLE IF NOT EXISTS` and seeds
 * `bot_settings` with `ON CONFLICT DO NOTHING`, so it is safe to re-run.
 *
 * Uses POSTGRES_URL_NON_POOLING (a direct, non-pgbouncer connection) rather
 * than the pooled POSTGRES_URL, because DDL and transactions are safer
 * outside of a transaction-mode pooler.
 *
 * Usage: node scripts/migrate.cjs
 */

// This script runs standalone via `node`, outside of Next.js, so .env.local
// is not auto-loaded. Parse it by hand (no extra dependency needed) without
// clobbering any variables already present in the real environment.
function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  const contents = fs.readFileSync(envPath, "utf8");
  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

const connectionString = process.env.POSTGRES_URL_NON_POOLING;
if (!connectionString) {
  console.error("POSTGRES_URL_NON_POOLING is not set. Aborting migration.");
  process.exit(1);
}

const botDefaultName = process.env.BOT_DEFAULT_NAME || "Octano";

// Concurrency approach: a slot is never double-booked because booking it
// happens inside a single transaction in POST /api/bookings — the slot row
// is re-checked with "SELECT ... FOR UPDATE" immediately before it is
// marked is_booked = true and the booking row is inserted. The FOR UPDATE
// row lock makes a second, concurrent request for the same slot block until
// the first transaction commits (or rolls back); afterwards its own
// is_booked check fails and it returns 409 instead of double-booking. The
// partial unique index on bookings.slot_id below is a second,
// belt-and-suspenders guarantee at the database level: at most one
// non-cancelled booking may reference a given slot no matter what bug or
// bypass might otherwise slip past the application-level check.

// Node's bundled CA store does not include Supabase's own root CA, so a
// plain TLS connection fails chain verification. Rather than disabling
// certificate verification, trust Supabase's root CA explicitly (fetched
// once via `openssl s_client` against the pooler). This is the same public
// root CA constant embedded in lib/db/client.ts — duplicated here, not read
// from a file, because *.pem is gitignored repo-wide and this script must
// keep working on a fresh checkout.
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

// Build an explicit client config instead of passing `connectionString`
// directly: pg-connection-string parses the "sslmode=require" query
// parameter in POSTGRES_URL_NON_POOLING into its own ssl settings, which
// otherwise takes precedence over (and conflicts with) the explicit `ca`
// below. Parsing the URL ourselves and supplying discrete fields lets our
// `ssl.ca` win cleanly, still with full certificate-chain verification.
function buildClientConfig(rawConnectionString) {
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

async function main() {
  const client = new Client(buildClientConfig(connectionString));
  await client.connect();

  try {
    await client.query("begin");
    // bookings references availability_slots, and the partial unique index
    // on bookings.slot_id is declared before the table itself above purely
    // for narrative order in this file; reorder statements so Postgres sees
    // dependencies in the right order.
    await client.query(`
      create extension if not exists pgcrypto;

      create table if not exists availability_slots (
        id uuid primary key default gen_random_uuid(),
        starts_at timestamptz not null,
        duration_minutes integer not null default 60,
        is_booked boolean not null default false,
        created_at timestamptz not null default now()
      );

      create index if not exists availability_slots_starts_at_idx
        on availability_slots (starts_at);

      create table if not exists bookings (
        id uuid primary key default gen_random_uuid(),
        slot_id uuid not null references availability_slots (id),
        name text not null,
        email text not null,
        phone text,
        topic text,
        source text not null default 'chat',
        created_at timestamptz not null default now(),
        status text not null default 'confirmed'
      );

      create unique index if not exists bookings_slot_id_unique_active_idx
        on bookings (slot_id)
        where status <> 'cancelled';

      create table if not exists bot_settings (
        key text primary key,
        value text,
        updated_at timestamptz not null default now()
      );
    `);

    await client.query(
      `insert into bot_settings (key, value) values ('bot_name', $1) on conflict (key) do nothing;`,
      [botDefaultName],
    );

    await client.query("commit");
    console.log("Migration applied successfully.");
  } catch (err) {
    await client.query("rollback");
    console.error("Migration failed, rolled back:", err);
    process.exitCode = 1;
    return;
  }

  // Verification: read back what we just wrote.
  const botSettings = await client.query("select key, value, updated_at from bot_settings order by key;");
  console.log("bot_settings rows:", botSettings.rows);

  const tableCheck = await client.query(`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in ('availability_slots', 'bookings', 'bot_settings')
    order by table_name;
  `);
  console.log("Tables present:", tableCheck.rows.map((r) => r.table_name));

  await client.end();
}

main().catch((err) => {
  console.error("Unexpected migration error:", err);
  process.exit(1);
});
