import { NextResponse } from "next/server";
import { clientIpFromHeaders, consumeRateLimit } from "./rateLimit";

export async function rejectIfRateLimited(
  request: Request,
  name: string,
  limit: number,
  windowMs: number,
): Promise<NextResponse | null> {
  const ip = clientIpFromHeaders(request.headers);
  const result = await consumeRateLimit(`${name}:${ip}`, limit, windowMs);
  if (result.ok) return null;
  return NextResponse.json(
    { error: "Too many requests. Please try again shortly." },
    {
      status: 429,
      headers: { "Retry-After": String(result.retryAfterSeconds) },
    },
  );
}

export async function readJsonBody<T>(
  request: Request,
  maxBytes: number,
): Promise<{ ok: true; value: T } | { ok: false; response: NextResponse }> {
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return { ok: false, response: NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }) };
  }
  if (raw.length > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Request body is too large." }, { status: 413 }),
    };
  }
  try {
    return { ok: true, value: JSON.parse(raw) as T };
  } catch {
    return { ok: false, response: NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }) };
  }
}
