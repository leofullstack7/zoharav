/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

/**
 * One-off migration runner for the admin CRM upgrade: widens `bookings`
 * with the fields the CRM card/modal view (app/admin/(dashboard)/bookings)
 * needs to record how a consultation actually went. Applies schema with
 * `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, so it is safe to re-run.
 *
 * Mirrors scripts/migrate.cjs exactly: same env loading, same
 * POSTGRES_URL_NON_POOLING connection (direct, non-pgbouncer — DDL is safer
 * outside a transaction-mode pooler), same embedded Supabase root CA.
 *
 * Usage: node scripts/migrate-crm.cjs
 */

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

// Same public Supabase root CA constant as scripts/migrate.cjs /
// lib/db/client.ts — duplicated here because *.pem is gitignored repo-wide
// and this script must keep working on a fresh checkout.
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
    await client.query(`
      alter table bookings add column if not exists outcome text;
      alter table bookings add column if not exists summary text;
      alter table bookings add column if not exists key_points text;
      alter table bookings add column if not exists deals_consolidated text;
      alter table bookings add column if not exists deal_value numeric;
      alter table bookings add column if not exists reviewed_at timestamptz;
    `);
    // Belt-and-suspenders: constrain outcome to the three allowed values at
    // the database level too, not just in the API route. Named so re-running
    // this script doesn't try to add a duplicate constraint.
    await client.query(`
      do $$
      begin
        if not exists (
          select 1 from pg_constraint where conname = 'bookings_outcome_check'
        ) then
          alter table bookings
            add constraint bookings_outcome_check
            check (outcome is null or outcome in ('effective', 'not_realized'));
        end if;
      end $$;
    `);
    await client.query("commit");
    console.log("CRM migration applied successfully.");
  } catch (err) {
    await client.query("rollback");
    console.error("CRM migration failed, rolled back:", err);
    process.exitCode = 1;
    return;
  }

  const columnCheck = await client.query(`
    select column_name, data_type
    from information_schema.columns
    where table_schema = 'public' and table_name = 'bookings'
    order by ordinal_position;
  `);
  console.log("bookings columns:", columnCheck.rows);

  await client.end();
}

main().catch((err) => {
  console.error("Unexpected migration error:", err);
  process.exit(1);
});
