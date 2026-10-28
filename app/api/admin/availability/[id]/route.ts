import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/requireAdmin";
import { query } from "@/lib/db/client";

/**
 * Admin-only: delete an availability slot.
 *
 * Design choice: a slot that is already booked cannot be deleted through
 * this endpoint — deleting it would silently orphan its booking row (the
 * booking's `slot_id` foreign key would dangle, and the client would lose
 * any record of when their session was). If the admin wants to free up a
 * booked slot, the correct path is cancelling the booking first (see
 * `PATCH /api/admin/bookings/[id]`), which flips `is_booked` back to false
 * and makes the slot deletable again.
 *
 * Responses:
 * - 200 { ok: true }
 * - 401 { error: string } — no valid admin session
 * - 404 { error: string } — slot does not exist
 * - 409 { error: string } — slot exists but is booked
 * - 500 { error: string } — unexpected server error
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Identificador de turno inválido." }, { status: 400 });
  }

  try {
    const deleted = await query<{ id: string }>(
      `delete from availability_slots where id = $1 and is_booked = false returning id`,
      [id],
    );

    if (deleted.rows.length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Nothing deleted — figure out whether that's because it doesn't exist
    // or because it's booked, so we can return the right status code.
    const existing = await query<{ is_booked: boolean }>(
      `select is_booked from availability_slots where id = $1`,
      [id],
    );

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: "Ese turno no existe." }, { status: 404 });
    }

    return NextResponse.json(
      { error: "No se puede eliminar un turno ya reservado. Cancela la reserva primero." },
      { status: 409 },
    );
  } catch (err) {
    console.error("Failed to delete availability slot:", err);
    return NextResponse.json({ error: "No se pudo eliminar el turno." }, { status: 500 });
  }
}
