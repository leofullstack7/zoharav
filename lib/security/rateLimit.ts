import "server-only";
import { query } from "@/lib/db/client";

/**
 * Sliding fixed-window limiter backed by Postgres so concurrent serverless
 * instances share the same counters. If the table has not been migrated yet,
 * falls back to a process-local Map (still useful in a single instance / dev).
 */

type LimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

const memoryWindows = new Map<string, { start: number; count: number }>();
let tableReady: boolean | null = null;
let warnedFallback = false;

async function ensureTable(): Promise<boolean> {
  if (tableReady === true) return true;
  try {
    await query(`
      create table if not exists rate_limits (
        bucket text primary key,
        window_start timestamptz not null,
        hit_count integer not null
      )
    `);
    tableReady = true;
    return true;
  } catch (err) {
    tableReady = false;
    if (!warnedFallback) {
      warnedFallback = true;
      console.error("rate_limits table unavailable; using in-process fallback.", err);
    }
    return false;
  }
}

function memoryLimit(bucket: string, limit: number, windowMs: number, now: number): LimitResult {
  const existing = memoryWindows.get(bucket);
  if (!existing || now - existing.start >= windowMs) {
    memoryWindows.set(bucket, { start: now, count: 1 });
    return { ok: true };
  }
  existing.count += 1;
  if (existing.count > limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.start + windowMs - now) / 1000));
    return { ok: false, retryAfterSeconds };
  }
  return { ok: true };
}

export async function consumeRateLimit(
  bucket: string,
  limit: number,
  windowMs: number,
): Promise<LimitResult> {
  const now = Date.now();
  const dbReady = await ensureTable();
  if (!dbReady) {
    return memoryLimit(bucket, limit, windowMs, now);
  }

  try {
    const result = await query<{ hit_count: number; window_start: Date }>(
      `insert into rate_limits (bucket, window_start, hit_count)
       values ($1, now(), 1)
       on conflict (bucket) do update set
         hit_count = case
           when rate_limits.window_start > now() - ($2::bigint * interval '1 millisecond')
           then rate_limits.hit_count + 1
           else 1
         end,
         window_start = case
           when rate_limits.window_start > now() - ($2::bigint * interval '1 millisecond')
           then rate_limits.window_start
           else now()
         end
       returning hit_count, window_start`,
      [bucket, windowMs],
    );
    const row = result.rows[0];
    if (row.hit_count > limit) {
      const elapsedMs = Date.now() - new Date(row.window_start).getTime();
      const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - elapsedMs) / 1000));
      return { ok: false, retryAfterSeconds };
    }
    return { ok: true };
  } catch (err) {
    if (!warnedFallback) {
      warnedFallback = true;
      console.error("rate_limits query failed; using in-process fallback.", err);
    }
    return memoryLimit(bucket, limit, windowMs, now);
  }
}

export function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 128);
  return "unknown";
}
