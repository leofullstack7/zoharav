import "server-only";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

/**
 * Shared server-side Postgres client for the Supabase database provisioned
 * via the Vercel marketplace integration. This module wraps a single `pg`
 * Pool and must only ever be imported from server-side code (Route Handlers,
 * Server Components, server actions) — the `server-only` import above makes
 * any accidental client-bundle import fail at build time rather than
 * silently shipping DB credentials to the browser.
 *
 * Uses the pooled POSTGRES_URL (pgbouncer, transaction mode) rather than
 * POSTGRES_URL_NON_POOLING: application queries are short request/response
 * or single transactions (see `withTransaction`), which transaction-mode
 * pooling supports fine, and pooling is what keeps a serverless deployment
 * from exhausting Postgres connections under concurrent invocations. DDL /
 * migrations use POSTGRES_URL_NON_POOLING instead — see scripts/migrate.cjs.
 */

// Node's bundled CA store does not include Supabase's own root CA, so a
// plain TLS connection fails chain-of-trust verification. Rather than
// disabling certificate verification (`rejectUnauthorized: false`), we trust
// Supabase's root CA explicitly, keeping the connection fully verified.
// Fetched once via `openssl s_client` against the pooler; also checked into
// scripts/certs/supabase-root-ca.pem for the migration script to reuse.
const SUPABASE_ROOT_CA = `-----BEGIN CERTIFICATE-----
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

function buildPool(): Pool {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("POSTGRES_URL is not set; the database connection cannot be created.");
  }

  // Parse the URL ourselves and pass discrete fields: pg-connection-string
  // would otherwise parse the "sslmode=require" query parameter into its
  // own ssl settings, which takes precedence over (and conflicts with) the
  // explicit `ca` below.
  const url = new URL(connectionString);
  return new Pool({
    host: url.hostname,
    port: url.port ? Number(url.port) : 5432,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, "") || "postgres",
    ssl: { ca: SUPABASE_ROOT_CA },
    max: 5,
    // Bounded timeouts so a network hiccup or an exhausted pool fails fast
    // with a catchable error instead of hanging a request indefinitely.
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
  });
}

// Reuse a single Pool across hot reloads (dev) and warm serverless
// invocations instead of opening a new one per request/import.
declare global {
  var __zoharavPgPool: Pool | undefined;
}

export function getPool(): Pool {
  if (!global.__zoharavPgPool) {
    global.__zoharavPgPool = buildPool();
  }
  return global.__zoharavPgPool;
}

/** Runs a single query against the shared pool. */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return getPool().query<T>(text, params);
}

/**
 * Runs `fn` inside a BEGIN/COMMIT transaction on a single checked-out
 * client, rolling back on any thrown error. Use this whenever a sequence of
 * statements must be atomic — e.g. re-checking and claiming a booking slot.
 */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("begin");
    const result = await fn(client);
    await client.query("commit");
    return result;
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}
