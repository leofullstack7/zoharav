"use client";

import { site } from "@/content/site";
import { FormEvent, useState } from "react";

/**
 * Reusable newsletter signup form. Posts to our server-side /api/newsletter
 * route, which relays the subscriber's email by Resend — the same pipeline
 * BookingForm uses, so there is one email integration to maintain.
 */
export function NewsletterForm({ locale }: { locale: string }) {
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const es = locale === "es";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");

    setSubmitting(true);
    setFailed(false);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Newsletter signup failed");
      }

      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <p className="script newsletter-note">
        {es ? "Gracias por suscribirse." : "Thank you for subscribing."}
      </p>
    );
  }

  if (failed) {
    return (
      <p className="script newsletter-note">
        {es
          ? `No pudimos completar la suscripción. Escríbanos a ${site.supportEmail}.`
          : `We could not complete the signup. Please email us at ${site.supportEmail}.`}
        {" "}
        <button type="button" className="text-link as-button" onClick={() => setFailed(false)}>
          {es ? "Intentar de nuevo" : "Try again"}
        </button>
      </p>
    );
  }

  return (
    <form className="newsletter-form" onSubmit={onSubmit}>
      <label className="newsletter-field">
        <span className="sr-only">{es ? "Correo" : "Email"}</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={es ? "Su correo" : "Your email"}
        />
      </label>
      <button className="btn-gold" type="submit" disabled={submitting}>
        {submitting ? (es ? "Enviando…" : "Sending…") : es ? "Suscribirse" : "Subscribe"}
      </button>
    </form>
  );
}
