"use client";

import { useState } from "react";
import { Monogram } from "@/components/brand/Monogram";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";

export function Bubbles({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const es = locale === "es";

  return (
    <div className="bubbles">
      {open ? (
        <div className="bubble-panel" role="dialog" aria-label={es ? "Concierge privado" : "Private Concierge"}>
          <p className="kicker">{es ? "Concierge privado" : "Private Concierge"}</p>
          <p>
            {es
              ? "Cuéntenos el objetivo. Un asesor senior le escribe en 24 horas hábiles."
              : "Tell us the aim. A senior advisor writes within 24 business hours."}
          </p>
          <Link href="/booking">{es ? "Reservar la sesión" : "Book the session"}</Link>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <Link href="/global-presence">{es ? "Las oficinas" : "The offices"}</Link>
        </div>
      ) : null}

      <Link className="bubble bubble-mail" href="/contact" aria-label={es ? "Escribir" : "Write"}>
        <span>✉</span>
      </Link>
      <Link className="bubble bubble-book" href="/booking" aria-label={es ? "Reservar" : "Book"}>
        <span>→</span>
      </Link>
      <button
        className="bubble bubble-main"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Monogram />
        <i />
      </button>
    </div>
  );
}
