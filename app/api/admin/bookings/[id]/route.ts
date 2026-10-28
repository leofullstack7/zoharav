import { NextResponse } from "next/server";
import type { PoolClient } from "pg";
import { getAdminSession } from "@/lib/auth/requireAdmin";
import { withTransaction } from "@/lib/db/client";

/**
 * Admin-only: update a booking's status. Only `status: "cancelled"` is
 * supported for this pass. Cancelling a booking also frees up its slot
 * (`availability_slots.is_booked = false`) in the same transaction, so the
 * slot immediately becomes bookable/deletable again — mirrors the booking
 * creation flow in `app/api/bookings/route.ts`, just in reverse.
 *
 * Request body (JSON): { status: "cancelled" }
 *
 * Responses:
 * - 200 { ok: true }
 * - 400 { error: string } — missing/invalid input
 * - 401 { error: string } — no valid admin session
 * - 404 { error: string } — booking does not exist
 * - 409 { error: string } — booking is already cancelled
 * - 500 { error: string } — unexpected server error
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

  const status =
    typeof body === "object" && body !== null && "status" in body && typeof body.status === "string"
      ? body.status
      : "";

  if (status !== "cancelled") {
    return NextResponse.json({ error: "Solo se admite status: 'cancelled'." }, { status: 400 });
  }

  try {
    const outcome = await withTransaction(async (client: PoolClient) => {
      const bookingResult = await client.query<BookingRow>(
        `select id, status, slot_id from bookings where id = $1 for update`,
        [id],
      );

      const booking = bookingResult.rows[0];
      if (!booking) {
        return { kind: "not_found" as const };
      }
      if (booking.status === "cancelled") {
        return { kind: "already_cancelled" as const };
      }

      await client.query(`update bookings set status = 'cancelled' where id = $1`, [id]);

      if (booking.slot_id) {
        await client.query(`update availability_slots set is_booked = false where id = $1`, [booking.slot_id]);
      }

      return { kind: "ok" as const };
    });

    if (outcome.kind === "not_found") {
      return NextResponse.json({ error: "Esa reserva no existe." }, { status: 404 });
    }
    if (outcome.kind === "already_cancelled") {
      return NextResponse.json({ error: "Esa reserva ya estaba cancelada." }, { status: 409 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Failed to cancel booking:", err);
    return NextResponse.json({ error: "No se pudo cancelar la reserva." }, { status: 500 });
  }
}
