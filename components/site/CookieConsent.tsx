"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";

/**
 * First-visit cookie/privacy notice. No analytics or tracking cookies are
 * wired into the site yet — this only records the visitor's choice in
 * localStorage so that work (when it lands) has consent state to read from.
 * Nothing is gated on the stored value today.
 */
const STORAGE_KEY = "zh-cookie-consent";
type Consent = "accepted" | "declined";

export function CookieConsent({ locale }: { locale: string }) {
  const es = locale === "es";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage unavailable (private mode, etc.) — fall back to showing the banner.
    }
    if (stored !== "accepted" && stored !== "declined") {
      setVisible(true);
    }
  }, []);

  function choose(value: Consent) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignore storage failures; the banner still dismisses for this visit.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="zh-cookie-banner" role="region" aria-label={es ? "Aviso de cookies" : "Cookie notice"}>
      <p className="zh-cookie-copy">
        {es
          ? "Utilizamos cookies esenciales para operar este sitio."
          : "We use essential cookies to operate this site."}{" "}
        <Link href="/legal/privacy" className="text-link">
          {es ? "Política de Privacidad" : "Privacy Policy"}
        </Link>
      </p>
      <div className="zh-cookie-actions">
        <button type="button" className="text-link as-button" onClick={() => choose("declined")}>
          {es ? "Rechazar" : "Decline"}
        </button>
        <button type="button" className="btn-solid" onClick={() => choose("accepted")}>
          {es ? "Aceptar" : "Accept"}
        </button>
      </div>
    </div>
  );
}
