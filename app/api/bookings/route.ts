import { NextResponse } from "next/server";
import type { PoolClient } from "pg";
import { withTransaction } from "@/lib/db/client";

/**
 * Books an availability slot. This is the single, stable contract both the
 * admin panel's test flow and the chat widget's booking modal call — do not
 * change its shape without updating both.
 *
 * Request body (JSON): { slotId: string; name: string; email: string; phone?: string; topic?: string }
 *
 * Responses:
 * - 200 { ok: true, bookingId: string }                 — booked successfully
 * - 400 { error: string }                                — missing/invalid input
 * - 404 { error: string }                                — slotId does not exist
 * - 409 { error: string }                                — slot exists but is already booked
 * - 500 { error: string }                                — unexpected server error
 *
 * Concurrency: the slot's availability is re-checked with
 * `SELECT ... FOR UPDATE` inside the same transaction that marks it booked
 * and inserts the booking row, so two simultaneous requests for the same
 * slot cannot both succeed — the second always observes `is_booked = true`
 * and receives 409. A partial unique index on bookings(slot_id) (excluding
 * cancelled bookings) backs this up at the database level.
 */

export type CreateBookingPayload = {
  slotId: string;
  name: string;
  email: string;
  phone?: string;
  topic?: string;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type SlotRow = {
  id: string;
  is_booked: boolean;
};

export async function POST(request: Request) {
  let body: Partial<CreateBookingPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const slotId = typeof body.slotId === "string" ? body.slotId.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const topic = typeof body.topic === "string" ? body.topic.trim() : "";

  if (!isNonEmptyString(slotId) || !UUID_RE.test(slotId)) {
    return NextResponse.json({ error: "A valid slotId is required." }, { status: 400 });
  }
  if (!isNonEmptyString(name)) {
    return NextResponse.json({ error: "A name is required." }, { status: 400 });
  }
  if (!isNonEmptyString(email) || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  try {
    const outcome = await withTransaction(async (client: PoolClient) => {
      const slotResult = await client.query<SlotRow>(
        `select id, is_booked
         from availability_slots
         where id = $1
         for update`,
        [slotId],
      );

      const slot = slotResult.rows[0];
      if (!slot) {
        return { kind: "not_found" as const };
      }
      if (slot.is_booked) {
        return { kind: "conflict" as const };
      }

      const bookingResult = await client.query<{ id: string }>(
        `insert into bookings (slot_id, name, email, phone, topic, source)
         values ($1, $2, $3, $4, $5, 'chat')
         returning id`,
        [slotId, name, email, phone || null, topic || null],
      );

      await client.query(`update availability_slots set is_booked = true where id = $1`, [slotId]);

      return { kind: "ok" as const, bookingId: bookingResult.rows[0].id };
    });

    if (outcome.kind === "not_found") {
      return NextResponse.json({ error: "That slot does not exist." }, { status: 404 });
    }
    if (outcome.kind === "conflict") {
      return NextResponse.json({ error: "That slot has already been booked." }, { status: 409 });
    }

    return NextResponse.json({ ok: true, bookingId: outcome.bookingId }, { status: 200 });
  } catch (err) {
    // Belt-and-suspenders: the partial unique index on bookings(slot_id)
    // would raise a unique_violation (23505) if this transaction's row
    // lock were ever somehow bypassed. Surface that as 409, not 500.
    if (typeof err === "object" && err !== null && "code" in err && err.code === "23505") {
      return NextResponse.json({ error: "That slot has already been booked." }, { status: 409 });
    }
    console.error("Unexpected error creating booking:", err);
    return NextResponse.json({ error: "Failed to create booking." }, { status: 500 });
  }
}
