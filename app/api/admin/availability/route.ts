import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/requireAdmin";
import { query } from "@/lib/db/client";

/**
 * Admin-only: create a new availability slot.
 *
 * Request body (JSON): { startsAt: string (ISO 8601); durationMinutes?: number }
 * - durationMinutes defaults to 60, must be an integer between 5 and 480.
 *
 * Responses:
 * - 201 { slot: { id, startsAt, durationMinutes, isBooked } }
 * - 400 { error: string }  — missing/invalid input
 * - 401 { error: string }  — no valid admin session
 * - 500 { error: string }  — unexpected server error
 */

const DEFAULT_DURATION_MINUTES = 60;
const MIN_DURATION_MINUTES = 5;
const MAX_DURATION_MINUTES = 480;

type SlotRow = {
  id: string;
  starts_at: Date;
  duration_minutes: number;
  is_booked: boolean;
};

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  const startsAtRaw =
    typeof body === "object" && body !== null && "startsAt" in body && typeof body.startsAt === "string"
      ? body.startsAt
      : "";
  const durationRaw =
    typeof body === "object" && body !== null && "durationMinutes" in body ? body.durationMinutes : undefined;

  if (!startsAtRaw) {
    return NextResponse.json({ error: "startsAt es obligatorio." }, { status: 400 });
  }

  const startsAtDate = new Date(startsAtRaw);
  if (Number.isNaN(startsAtDate.getTime())) {
    return NextResponse.json({ error: "startsAt debe ser una fecha/hora válida." }, { status: 400 });
  }

  let durationMinutes = DEFAULT_DURATION_MINUTES;
  if (durationRaw !== undefined) {
    const parsed = Number(durationRaw);
    if (!Number.isInteger(parsed) || parsed < MIN_DURATION_MINUTES || parsed > MAX_DURATION_MINUTES) {
      return NextResponse.json(
        { error: `durationMinutes debe ser un entero entre ${MIN_DURATION_MINUTES} y ${MAX_DURATION_MINUTES}.` },
        { status: 400 },
      );
    }
    durationMinutes = parsed;
  }

  try {
    const result = await query<SlotRow>(
      `insert into availability_slots (starts_at, duration_minutes)
       values ($1, $2)
       returning id, starts_at, duration_minutes, is_booked`,
      [startsAtDate.toISOString(), durationMinutes],
    );

    const row = result.rows[0];
    return NextResponse.json(
      {
        slot: {
          id: row.id,
          startsAt: new Date(row.starts_at).toISOString(),
          durationMinutes: row.duration_minutes,
          isBooked: row.is_booked,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Failed to create availability slot:", err);
    return NextResponse.json({ error: "No se pudo crear el turno." }, { status: 500 });
  }
}
