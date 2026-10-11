"use client";

import { site } from "@/content/site";
import { FormEvent, useState } from "react";

export function ContactForm({ locale }: { locale: string }) {
  const [sent, setSent] = useState(false);
  const es = locale === "es";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(es ? "Consulta Zoharav" : "Zoharav enquiry");
    const body = encodeURIComponent(`${name}\n${email}\n\n${message}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return <p className="script">{es ? "Escríbanos y le responderemos." : "Message us and we'll get back to you."}</p>;
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <label className="field">
        <span>{es ? "Nombre" : "Name"}</span>
        <input name="name" autoComplete="name" />
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
        <span>{es ? "Mensaje" : "Message"}</span>
        <textarea name="message" rows={4} />
      </label>
      <button className="btn-solid" type="submit">
        {es ? "Enviar" : "Send"} →
      </button>
    </form>
  );
}
