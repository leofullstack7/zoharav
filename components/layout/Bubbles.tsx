"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Monogram } from "@/components/brand/Monogram";
import { Link } from "@/i18n/navigation";

/**
 * The full Octano chat (message list, input, booking modal, OpenAI calls)
 * is real weight — it must never ship in the initial/shared bundle. It is
 * only imported, client-side, the first time someone actually opens the
 * bubble. `ssr: false` because it talks to the browser-only pieces of
 * lib/motion (matchMedia) and has no useful server-rendered state anyway.
 */
const OctanoChatPanel = dynamic(() => import("@/components/chat/OctanoChatPanel").then((m) => m.OctanoChatPanel), {
  ssr: false,
  loading: () => (
    <div className="octano-panel octano-panel--loading" aria-hidden="true">
      <div className="octano-skeleton-line" />
      <div className="octano-skeleton-line" />
      <div className="octano-skeleton-line octano-skeleton-line--short" />
    </div>
  ),
});

export function Bubbles({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const es = locale === "es";

  function handleToggle() {
    setOpen((value) => !value);
    setLoaded(true);
  }

  return (
    <div className="bubbles">
      {loaded ? (
        // Stays mounted once loaded (hidden via CSS, not unmounted) so the
        // conversation survives closing/reopening the bubble and, crucially,
        // client-side navigation to a /services/[slug] page triggered from
        // inside the chat itself — this component tree lives in the
        // persistent (site) layout, sibling to {children}, so route changes
        // within that layout never remount it.
        <div className={`octano-panel-wrap${open ? " is-open" : ""}`}>
          <OctanoChatPanel locale={locale} onClose={() => setOpen(false)} />
        </div>
      ) : null}

      <Link className="bubble bubble-mail" href="/contact" aria-label={es ? "Escribir" : "Write"}>
        <span>✉</span>
      </Link>
      <Link className="bubble bubble-book" href="/booking" aria-label={es ? "Reservar" : "Book"}>
        <span>→</span>
      </Link>
      <button className="bubble bubble-main" type="button" aria-expanded={open} onClick={handleToggle}>
        <Monogram />
        <i />
      </button>
    </div>
  );
}
