import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/requireAdmin";
import { query } from "@/lib/db/client";

/**
 * Admin-only: list every booking, newest first, joined with its slot's
 * date/time so the dashboard doesn't need a second round trip.
 *
 * Response shape: { bookings: Booking[] }
 * Booking: {
 *   id, name, email, phone, topic, source, status, createdAt,
 *   slot: { id, startsAt, durationMinutes } | null
 * }
 * `slot` is null if the slot row was ever deleted independently of its
 * booking (shouldn't normally happen — DELETE /api/admin/availability/[id]
 * refuses to delete booked slots — but a left join keeps this endpoint
 * robust either way).
 */

type BookingRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  topic: string | null;
  source: string;
  status: string;
  created_at: Date;
  slot_id: string | null;
  starts_at: Date | null;
  duration_minutes: number | null;
};

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const result = await query<BookingRow>(
      `select b.id, b.name, b.email, b.phone, b.topic, b.source, b.status, b.created_at,
              s.id as slot_id, s.starts_at, s.duration_minutes
       from bookings b
       left join availability_slots s on s.id = b.slot_id
       order by b.created_at desc`,
    );

    const bookings = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      topic: row.topic,
      source: row.source,
      status: row.status,
      createdAt: new Date(row.created_at).toISOString(),
      slot:
        row.slot_id && row.starts_at
          ? {
              id: row.slot_id,
              startsAt: new Date(row.starts_at).toISOString(),
              durationMinutes: row.duration_minutes,
            }
          : null,
    }));

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (err) {
    console.error("Failed to load bookings:", err);
    return NextResponse.json({ error: "No se pudieron cargar las reservas." }, { status: 500 });
  }
}
