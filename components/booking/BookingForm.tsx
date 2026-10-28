"use client";

import type { BookingCategory } from "@/content/booking";
import { site } from "@/content/site";
import { loc } from "@/lib/i18n/loc";
import { FormEvent, useState } from "react";

/**
 * Per-category booking request form. There is no payment processing in this
 * site: submitting posts the category and the visitor's contact details to
 * our server-side /api/booking route, which relays the lead by email via
 * Resend so a human can follow up to confirm scheduling and payment.
 */
export function BookingForm({ category, locale }: { category: BookingCategory; locale: string }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const es = locale === "es";
  const categoryName = loc(category.name, locale);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const company = String(data.get("company") ?? "");
    const message = String(data.get("message") ?? "");

    setSubmitting(true);
    setFailed(false);
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          message,
          category: categoryName,
        }),
      });

      if (!response.ok) {
        throw new Error("Booking request failed");
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
      <p className="script">
        {es
          ? "Solicitud enviada. Confirmaremos el horario y los detalles de pago por correo o llamada en el siguiente día hábil."
          : "Request sent. We will confirm scheduling and payment details by email or call within the next business day."}
      </p>
    );
  }

  if (failed) {
    return (
      <p className="script">
        {es
          ? `No pudimos enviar la solicitud en este momento. Por favor escríbanos directamente a ${site.email} o llámenos para confirmar su sesión.`
          : `We could not send your request right now. Please email us directly at ${site.email} or call us to confirm your session.`}
        {" "}
        <button type="button" className="text-link as-button" onClick={() => setFailed(false)}>
          {es ? "Intentar de nuevo" : "Try again"}
        </button>
      </p>
    );
  }

  if (!open) {
    return (
      <button type="button" className="text-link as-button" onClick={() => setOpen(true)}>
        {es ? "Solicitar esta sesión" : "Request this session"}
      </button>
    );
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <p className="kicker" style={{ gridColumn: "1 / -1" }}>
        {es ? "Sesión: " : "Session: "}
        {categoryName}
      </p>
      <label className="field">
        <span>{es ? "Nombre" : "Name"} *</span>
        <input name="name" required autoComplete="name" />
      </label>
      <label className="field">
        <span>Email *</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="field">
        <span>{es ? "Teléfono" : "Phone"}</span>
        <input name="phone" autoComplete="tel" />
      </label>
      <label className="field">
        <span>{es ? "Empresa" : "Company"}</span>
        <input name="company" />
      </label>
      <label className="field" style={{ gridColumn: "1 / -1" }}>
        <span>{es ? "Mensaje (opcional)" : "Message (optional)"}</span>
        <textarea name="message" rows={3} />
      </label>
      <button className="btn-solid" type="submit" disabled={submitting}>
        {submitting ? (es ? "Enviando…" : "Sending…") : `${es ? "Enviar solicitud" : "Send request"} →`}
      </button>
    </form>
  );
}
