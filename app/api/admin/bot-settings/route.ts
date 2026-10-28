import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/requireAdmin";
import { query } from "@/lib/db/client";

/**
 * Admin-only: set the chat widget's bot name
 * ("el admin debe poder escribir de qué forma quiere que se llame el bot").
 *
 * Upserts the `bot_settings` row with key='bot_name'. The existing public
 * `GET /api/bot-settings` (untouched, owned by Nova) reads this exact same
 * row, so a change here takes effect immediately for the public chat
 * widget with no other code change.
 *
 * Request body (JSON): { botName: string }
 *
 * Responses:
 * - 200 { ok: true, botName: string }
 * - 400 { error: string } — missing/invalid input
 * - 401 { error: string } — no valid admin session
 * - 500 { error: string } — unexpected server error
 */

const MAX_BOT_NAME_LENGTH = 80;

export async function PUT(request: Request) {
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

  const botNameRaw =
    typeof body === "object" && body !== null && "botName" in body && typeof body.botName === "string"
      ? body.botName.trim()
      : "";

  if (!botNameRaw) {
    return NextResponse.json({ error: "botName es obligatorio." }, { status: 400 });
  }
  if (botNameRaw.length > MAX_BOT_NAME_LENGTH) {
    return NextResponse.json(
      { error: `botName no puede superar ${MAX_BOT_NAME_LENGTH} caracteres.` },
      { status: 400 },
    );
  }

  try {
    await query(
      `insert into bot_settings (key, value, updated_at)
       values ('bot_name', $1, now())
       on conflict (key) do update set value = excluded.value, updated_at = excluded.updated_at`,
      [botNameRaw],
    );

    return NextResponse.json({ ok: true, botName: botNameRaw }, { status: 200 });
  } catch (err) {
    console.error("Failed to update bot settings:", err);
    return NextResponse.json({ error: "No se pudo guardar el nombre del bot." }, { status: 500 });
  }
}
