import "server-only";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources/chat/completions";
import { getService, services } from "@/content/services";
import type { Locale } from "@/content/types";
import { loc } from "@/lib/i18n/loc";
import { buildSystemPrompt } from "@/lib/chat/systemPrompt";

/**
 * Octano chat endpoint.
 *
 * Request body (JSON): { messages: { role: "user" | "assistant"; content: string }[], locale: "en" | "es", botName?: string }
 * - `messages` is the full running conversation held client-side (no
 *   server-side session storage) — simplest viable "memory" is the client
 *   re-sending history each turn.
 * - `botName` is optional: the frontend already fetches it once from
 *   GET /api/bot-settings for display, so it is passed straight through
 *   here rather than having this route query the database a second time.
 *   Falls back to BOT_DEFAULT_NAME / "Octano" if omitted.
 *
 * Response body (JSON, always 200 so the widget can render it directly):
 *   { message: string, recommendation?: { slug: string; name: string; reason: string } }
 *
 * Grounding: the system prompt is built by `buildSystemPrompt`, which
 * serializes the live `content/services.ts` / `content/lines/*.ts` data at
 * request time. There is no hand-written list of "what Zoharav offers"
 * anywhere in this file — see lib/chat/systemPrompt.ts.
 */

const DEFAULT_MODEL = "gpt-4o-mini";
const MAX_HISTORY_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 4000;

type IncomingRole = "user" | "assistant";
type IncomingMessage = { role: IncomingRole; content: string };

type ChatRequestBody = {
  messages?: unknown;
  locale?: unknown;
  botName?: unknown;
};

export type ChatRecommendation = {
  slug: string;
  name: string;
  reason: string;
};

export type ChatResponseBody = {
  message: string;
  recommendation?: ChatRecommendation;
};

const SERVICE_SLUGS = services.map((service) => service.slug);

const recommendServiceTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "recommend_service",
    description:
      "Call this when, and only when, you have confidently identified one specific Zoharav advisory line that matches what the visitor needs. Never call it for technology, AI, data, cybersecurity, or software topics — Zoharav does not offer those.",
    parameters: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          enum: SERVICE_SLUGS,
          description: "The exact slug of the one real Zoharav service line being recommended.",
        },
        reason: {
          type: "string",
          description: "One short, warm sentence explaining why this line fits what the visitor described.",
        },
      },
      required: ["slug", "reason"],
      additionalProperties: false,
    },
  },
};

function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "es";
}

function sanitizeMessages(input: unknown): IncomingMessage[] {
  if (!Array.isArray(input)) return [];
  const cleaned: IncomingMessage[] = [];
  for (const item of input) {
    if (
      item &&
      typeof item === "object" &&
      ((item as { role?: unknown }).role === "user" || (item as { role?: unknown }).role === "assistant") &&
      typeof (item as { content?: unknown }).content === "string"
    ) {
      const role = (item as { role: IncomingRole }).role;
      const content = (item as { content: string }).content.slice(0, MAX_MESSAGE_LENGTH).trim();
      if (content.length > 0) {
        cleaned.push({ role, content });
      }
    }
  }
  return cleaned.slice(-MAX_HISTORY_MESSAGES);
}

let cachedClient: OpenAI | null = null;
function getClient(): OpenAI {
  if (!cachedClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set.");
    }
    cachedClient = new OpenAI({ apiKey });
  }
  return cachedClient;
}

function fallbackText(locale: Locale): string {
  return locale === "es"
    ? "Cuéntame un poco más para poder orientarte bien."
    : "Tell me a bit more so I can point you in the right direction.";
}

function technicalErrorText(locale: Locale): string {
  return locale === "es"
    ? "Tuvimos un problema técnico justo ahora. ¿Puedes intentarlo de nuevo en un momento, o prefieres escribirnos directamente?"
    : "We hit a technical snag just now. Could you try again in a moment, or would you rather write to us directly?";
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const locale: Locale = isLocale(body.locale) ? body.locale : "en";
  const messages = sanitizeMessages(body.messages);
  const botName =
    typeof body.botName === "string" && body.botName.trim().length > 0
      ? body.botName.trim()
      : process.env.BOT_DEFAULT_NAME || "Octano";

  if (messages.length === 0) {
    return NextResponse.json({ error: "At least one message is required." }, { status: 400 });
  }

  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
  const systemPrompt = buildSystemPrompt(locale, botName);

  const conversation: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((item): ChatCompletionMessageParam => ({ role: item.role, content: item.content })),
  ];

  try {
    const client = getClient();

    const first = await client.chat.completions.create({
      model,
      messages: conversation,
      tools: [recommendServiceTool],
      tool_choice: "auto",
      temperature: 0.6,
    });

    const firstMessage = first.choices[0]?.message;
    const toolCall = firstMessage?.tool_calls?.find(
      (call) => call.type === "function" && call.function.name === "recommend_service",
    );

    if (!toolCall || toolCall.type !== "function") {
      const text = firstMessage?.content?.trim();
      return NextResponse.json<ChatResponseBody>({ message: text || fallbackText(locale) });
    }

    let recommendation: ChatRecommendation | undefined;
    try {
      const args = JSON.parse(toolCall.function.arguments) as { slug?: unknown; reason?: unknown };
      const service = typeof args.slug === "string" ? getService(args.slug) : undefined;
      if (service) {
        recommendation = {
          slug: service.slug,
          name: loc(service.name, locale),
          reason: typeof args.reason === "string" ? args.reason : "",
        };
      }
    } catch {
      // Malformed tool-call arguments: fall through without a recommendation.
    }

    const assistantToolMessage: ChatCompletionMessageParam = {
      role: "assistant",
      content: firstMessage.content,
      tool_calls: firstMessage.tool_calls,
    };

    const toolResultMessage: ChatCompletionMessageParam = {
      role: "tool",
      tool_call_id: toolCall.id,
      content: recommendation
        ? JSON.stringify({ ok: true, slug: recommendation.slug, name: recommendation.name })
        : JSON.stringify({ ok: false, error: "Unknown or unsupported service slug." }),
    };

    const second = await client.chat.completions.create({
      model,
      messages: [...conversation, assistantToolMessage, toolResultMessage],
      temperature: 0.6,
    });

    const finalText = second.choices[0]?.message?.content?.trim();

    return NextResponse.json<ChatResponseBody>({
      message: finalText || fallbackText(locale),
      recommendation,
    });
  } catch (err) {
    console.error("Octano chat completion failed:", err);
    return NextResponse.json<ChatResponseBody>({ message: technicalErrorText(locale) }, { status: 200 });
  }
}
