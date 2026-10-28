import { site } from "@/content/site";
import { NextResponse } from "next/server";
import { Resend } from "resend";

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

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: Partial<BookingRequestPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";

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

  const subject = category ? `Booking request — ${category}` : "Booking request";
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
