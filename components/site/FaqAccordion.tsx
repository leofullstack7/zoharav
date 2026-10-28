"use client";

import { useId, useMemo, useState } from "react";
import type { FaqItem, Localized } from "@/content/types";
import { loc } from "@/lib/i18n/loc";

type Category = FaqItem["category"];

/**
 * Small, local label map — only the categories that actually appear in
 * content/faqs.ts get rendered as pills (derived at runtime below), so this
 * map can stay a superset without ever introducing a category that isn't
 * really in use.
 */
const CATEGORY_LABELS: Record<Category, Localized> = {
  firm: { en: "Firm", es: "Firma" },
  booking: { en: "Booking", es: "Reserva" },
  method: { en: "Methodology", es: "Metodología" },
  confidentiality: { en: "Confidentiality", es: "Confidencialidad" },
  energy: { en: "Energy", es: "Energía" },
  geography: { en: "Geography", es: "Geografía" },
  service: { en: "Services", es: "Servicios" },
};

export function FaqAccordion({ items, locale }: { items: FaqItem[]; locale: string }) {
  const es = locale === "es";
  const groupId = useId();
  const [active, setActive] = useState<Category | "all">("all");

  const categories = useMemo(() => {
    const seen = new Set<Category>();
    const list: Category[] = [];
    for (const item of items) {
      if (!seen.has(item.category)) {
        seen.add(item.category);
        list.push(item.category);
      }
    }
    return list;
  }, [items]);

  const visible = active === "all" ? items : items.filter((item) => item.category === active);

  return (
    <div className="faq-block">
      <div
        className="faq-filters"
        role="group"
        aria-label={es ? "Filtrar preguntas por categoría" : "Filter questions by category"}
      >
        <button
          type="button"
          className={active === "all" ? "faq-pill is-active" : "faq-pill"}
          aria-pressed={active === "all"}
          onClick={() => setActive("all")}
        >
          {es ? "Todas" : "All"}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={active === category ? "faq-pill is-active" : "faq-pill"}
            aria-pressed={active === category}
            onClick={() => setActive(category)}
          >
            {loc(CATEGORY_LABELS[category], locale)}
          </button>
        ))}
      </div>

      <div className="faq-list">
        {visible.map((item, index) => {
          const panelId = `faq-panel-${groupId}-${item.id}`;
          return (
            <details key={item.id} className="faq-row" name={`faq-group-${groupId}`}>
              <summary className="faq-summary" aria-controls={panelId}>
                <span className="faq-num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="faq-question">{loc(item.question, locale)}</span>
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <div className="faq-panel" id={panelId}>
                <p>{loc(item.answer, locale)}</p>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
