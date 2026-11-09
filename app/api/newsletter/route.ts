import { site } from "@/content/site";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { readJsonBody, rejectIfRateLimited } from "@/lib/security/http";
import { FIELD_LIMITS, isNonEmptyString, isValidEmail, readBoundedString } from "@/lib/security/input";

/**
 * Receives newsletter signups from NewsletterForm and relays them by email
 * via Resend, server-side — the same pipeline as /api/booking, so there is
 * only one email integration to maintain. There is no mailing-list provider
 * wired up yet; this simply notifies the team of a new subscriber so they
 * can be added by hand until that's in place.
 */

export type NewsletterSignupPayload = {
  email: string;
};

// Resend's shared sandbox sender. It works without any domain verification,
// which keeps this route functional the moment RESEND_API_KEY is set.
// TODO(owner): once the zoharav.com domain is verified in the Resend
// dashboard, switch this to a real address such as "newsletter@zoharav.com".
const FROM_ADDRESS = "Zoharav Newsletter <onboarding@resend.dev>";

// Internal routing inbox (not the public-facing contact address) is the
// right destination for operational notifications like this one.
const TO_ADDRESS = site.supportEmail;

export async function POST(request: Request) {
  const limited = await rejectIfRateLimited(request, "newsletter", 6, 15 * 60 * 1000);
  if (limited) return limited;

  const parsed = await readJsonBody<Partial<NewsletterSignupPayload>>(request, 2_048);
  if (!parsed.ok) return parsed.response;
  const body = parsed.value;

  const email = readBoundedString(body.email, FIELD_LIMITS.email);

  if (!isNonEmptyString(email) || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!isNonEmptyString(apiKey)) {
    console.error("RESEND_API_KEY is not set; cannot send newsletter signup email.");
    return NextResponse.json(
      { error: "Email delivery is not configured on the server." },
      { status: 500 },
    );
  }

  const subject = "Newsletter signup";
  const text = `New newsletter signup\n\nEmail: ${email}`;

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
      return NextResponse.json({ error: "Failed to send newsletter signup." }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error sending newsletter signup email:", err);
    return NextResponse.json({ error: "Failed to send newsletter signup." }, { status: 500 });
  }
}
