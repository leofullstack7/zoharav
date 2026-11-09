import { bookingCategories } from "@/content/booking";
import { site } from "@/content/site";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { readJsonBody, rejectIfRateLimited } from "@/lib/security/http";
import { FIELD_LIMITS, isNonEmptyString, isValidEmail, oneLine, readBoundedMultiline, readBoundedString } from "@/lib/security/input";

/**
 * Receives booking-request submissions from BookingForm and relays them by
 * email via Resend (https://resend.com), server-side. This replaces the old
 * `mailto:` redirect, which silently "succeeded" even when the visitor's
 * device had no configured mail client and the lead never arrived anywhere.
 */

export type BookingRequestPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  category: string;
};

// Resend's shared sandbox sender. It works without any domain verification,
// which keeps this route functional the moment RESEND_API_KEY is set.
// TODO(owner): once the zoharav.com domain is verified in the Resend
// dashboard, switch this to a real address such as "bookings@zoharav.com".
const FROM_ADDRESS = "Zoharav Bookings <onboarding@resend.dev>";

// Internal routing inbox (not the public-facing contact address) is the
// right destination for operational lead notifications like this one.
const TO_ADDRESS = site.supportEmail;

const ALLOWED_CATEGORIES = new Set(
  bookingCategories.flatMap((category) => [category.id, category.name.en, category.name.es]),
);

export async function POST(request: Request) {
  const limited = await rejectIfRateLimited(request, "booking-email", 8, 15 * 60 * 1000);
  if (limited) return limited;

  const parsed = await readJsonBody<Partial<BookingRequestPayload>>(request, 16_384);
  if (!parsed.ok) return parsed.response;
  const body = parsed.value;

  const name = readBoundedString(body.name, FIELD_LIMITS.name);
  const email = readBoundedString(body.email, FIELD_LIMITS.email);
  const phone = readBoundedString(body.phone, FIELD_LIMITS.phone);
  const company = readBoundedString(body.company, FIELD_LIMITS.company);
  const message = readBoundedMultiline(body.message, FIELD_LIMITS.message);
  const categoryRaw = readBoundedString(body.category, FIELD_LIMITS.category);
  const category = ALLOWED_CATEGORIES.has(categoryRaw) ? categoryRaw : "";

  if (!isNonEmptyString(email) || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }
  if (!isNonEmptyString(name)) {
    return NextResponse.json({ error: "A name is required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!isNonEmptyString(apiKey)) {
    console.error("RESEND_API_KEY is not set; cannot send booking email.");
    return NextResponse.json(
      { error: "Email delivery is not configured on the server." },
      { status: 500 },
    );
  }

  const subject = category ? `Booking request — ${oneLine(category)}` : "Booking request";
  const lines = [
    `Session requested: ${category || "(not specified)"}`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "",
    company ? `Company: ${company}` : "",
    "",
    message ? `Message:\n${message}` : "",
  ].filter((line) => line.length > 0);
  const text = lines.join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject,
      text,
    });

    if (error) {
      console.error("Resend API returned an error:", error);
      return NextResponse.json({ error: "Failed to send booking request." }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error sending booking email:", err);
    return NextResponse.json({ error: "Failed to send booking request." }, { status: 500 });
  }
}
