import { NextResponse } from "next/server";
import { query } from "@/lib/db/client";

/**
 * Public, read-only bot settings for the chat widget (e.g. so the public
 * site can display the configured bot name). Intentionally has no auth and
 * no write support — a PUT/admin-only write path belongs in the admin
 * panel, not here.
 *
 * Response shape: { botName: string }
 */

export async function GET() {
  const fallbackName = process.env.BOT_DEFAULT_NAME || "Octano";

  try {
    const result = await query<{ value: string | null }>(
      `select value from bot_settings where key = 'bot_name'`,
    );

    const botName = result.rows[0]?.value?.trim() || fallbackName;

    return NextResponse.json({ botName }, { status: 200 });
  } catch (err) {
    console.error("Failed to load bot settings, falling back to default:", err);
    return NextResponse.json({ botName: fallbackName }, { status: 200 });
  }
}
