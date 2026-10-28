import { NextResponse } from "next/server";
import { query } from "@/lib/db/client";

/**
 * Public, read-only list of upcoming, not-yet-booked session slots. Used by
 * both the admin panel (to preview what visitors can see) and the chat
 * widget's booking flow (to offer slots to a prospect). No auth required.
 *
 * Response shape: { slots: [{ id, startsAt, durationMinutes }] }
 * - id: string (uuid)
 * - startsAt: string (ISO 8601 timestamp, UTC)
 * - durationMinutes: number
 */

type SlotRow = {
  id: string;
  starts_at: Date;
  duration_minutes: number;
};

export async function GET() {
  try {
    const result = await query<SlotRow>(
      `select id, starts_at, duration_minutes
       from availability_slots
       where is_booked = false
         and starts_at > now()
       order by starts_at asc`,
    );

    const slots = result.rows.map((row) => ({
      id: row.id,
      startsAt: new Date(row.starts_at).toISOString(),
      durationMinutes: row.duration_minutes,
    }));

    return NextResponse.json({ slots }, { status: 200 });
  } catch (err) {
    console.error("Failed to load availability slots:", err);
    return NextResponse.json({ error: "Failed to load availability." }, { status: 500 });
  }
}
