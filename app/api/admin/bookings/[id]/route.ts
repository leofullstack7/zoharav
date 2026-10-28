import { NextResponse } from "next/server";
import type { PoolClient } from "pg";
import { getAdminSession } from "@/lib/auth/requireAdmin";
import { withTransaction } from "@/lib/db/client";

/**
 * Admin-only: update a booking. Two independent concerns share this one
 * PATCH route, and either (or both) may appear in the same request body:
 *
 *   1. `status: "cancelled"` — the original cancel action. Cancelling a
 *      booking also frees up its slot (`availability_slots.is_booked =
 *      false`) in the same transaction, so the slot immediately becomes
 *      bookable/deletable again — mirrors the booking creation flow in
 *      `app/api/bookings/route.ts`, just in reverse. Unchanged from the
 *      original implementation.
 *   2. CRM review fields — `outcome`, `summary`, `keyPoints`,
 *      `dealsConsolidated`, `dealValue` — written from the CRM card modal
 *      in app/admin/(dashboard)/bookings. `outcome` is conceptually
 *      distinct from `status`: a booking can be cancelled (never happened /
 *      called off ahead of time) independently of whether, for a booking
 *      that *did* proceed, the session was effective or the client no-showed
 *      ("no se realizó"). Setting `outcome` also stamps `reviewed_at`.
 *
 * Request body (JSON), any combination of:
 *   { status?: "cancelled",
 *     outcome?: "effective" | "not_realized" | null,
 *     summary?: string | null,
 *     keyPoints?: string | null,
 *     dealsConsolidated?: string | null,
 *     dealValue?: number | null }
 *
 * Responses:
 * - 200 { ok: true }
 * - 400 { error: string } — missing/invalid input
 * - 401 { error: string } — no valid admin session
 * - 404 { error: string } — booking does not exist
 * - 409 { error: string } — booking is already cancelled (status path only)
 * - 500 { error: string } — unexpected server error
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLOWED_OUTCOMES = new Set(["effective", "not_realized"]);

type BookingRow = {
  id: string;
  status: string;
  slot_id: string | null;
};

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Identificador de reserva inválido." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  const record = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};

  const wantsCancel = "status" in record;
  if (wantsCancel && record.status !== "cancelled") {
    return NextResponse.json({ error: "Solo se admite status: 'cancelled'." }, { status: 400 });
  }

  const wantsOutcome = "outcome" in record;
  let outcomeValue: string | null = null;
  if (wantsOutcome) {
    const raw = record.outcome;
    if (raw !== null && typeof raw !== "string") {
      return NextResponse.json({ error: "outcome debe ser un texto o null." }, { status: 400 });
    }
    if (typeof raw === "string" && !ALLOWED_OUTCOMES.has(raw)) {
      return NextResponse.json(
        { error: "outcome debe ser 'effective', 'not_realized' o null." },
        { status: 400 },
      );
    }
    outcomeValue = raw;
  }

  const textFields: { column: string; key: string }[] = [
    { column: "summary", key: "summary" },
    { column: "key_points", key: "keyPoints" },
    { column: "deals_consolidated", key: "dealsConsolidated" },
  ];
  const textUpdates: { column: string; value: string | null }[] = [];
  for (const { column, key } of textFields) {
    if (!(key in record)) continue;
    const raw = record[key];
    if (raw !== null && typeof raw !== "string") {
      return NextResponse.json({ error: `${key} debe ser un texto o null.` }, { status: 400 });
    }
    textUpdates.push({ column, value: raw });
  }

  const wantsDealValue = "dealValue" in record;
  let dealValue: number | null = null;
  if (wantsDealValue) {
    const raw = record.dealValue;
    if (raw !== null && typeof raw !== "number") {
      return NextResponse.json({ error: "dealValue debe ser un número o null." }, { status: 400 });
    }
    if (typeof raw === "number" && (!Number.isFinite(raw) || raw < 0)) {
      return NextResponse.json({ error: "dealValue debe ser un número válido y no negativo." }, { status: 400 });
    }
    dealValue = raw;
  }

  if (!wantsCancel && !wantsOutcome && textUpdates.length === 0 && !wantsDealValue) {
    return NextResponse.json({ error: "No se recibió ningún campo para actualizar." }, { status: 400 });
  }

  try {
    const outcomeResult = await withTransaction(async (client: PoolClient) => {
      const bookingResult = await client.query<BookingRow>(
        `select id, status, slot_id from bookings where id = $1 for update`,
        [id],
      );

      const booking = bookingResult.rows[0];
      if (!booking) {
        return { kind: "not_found" as const };
      }

      if (wantsCancel) {
        if (booking.status === "cancelled") {
          return { kind: "already_cancelled" as const };
        }

        await client.query(`update bookings set status = 'cancelled' where id = $1`, [id]);

        if (booking.slot_id) {
          await client.query(`update availability_slots set is_booked = false where id = $1`, [booking.slot_id]);
        }
      }

      if (wantsOutcome || textUpdates.length > 0 || wantsDealValue) {
        const setClauses: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        if (wantsOutcome) {
          setClauses.push(`outcome = $${paramIndex++}`, `reviewed_at = now()`);
          values.push(outcomeValue);
        }
        for (const { column, value } of textUpdates) {
          setClauses.push(`${column} = $${paramIndex++}`);
          values.push(value);
        }
        if (wantsDealValue) {
          setClauses.push(`deal_value = $${paramIndex++}`);
          values.push(dealValue);
        }

        values.push(id);
        await client.query(`update bookings set ${setClauses.join(", ")} where id = $${paramIndex}`, values);
      }

      return { kind: "ok" as const };
    });

    if (outcomeResult.kind === "not_found") {
      return NextResponse.json({ error: "Esa reserva no existe." }, { status: 404 });
    }
    if (outcomeResult.kind === "already_cancelled") {
      return NextResponse.json({ error: "Esa reserva ya estaba cancelada." }, { status: 409 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Failed to update booking:", err);
    return NextResponse.json({ error: "No se pudo actualizar la reserva." }, { status: 500 });
  }
}
