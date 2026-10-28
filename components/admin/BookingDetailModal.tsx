"use client";

import { useEffect, useRef, useState } from "react";
import { ModalArt } from "./ModalArt";
import type { Booking as BookingType, BookingOutcome } from "./types";

/**
 * CRM detail modal for a single booking (opened by clicking a card in
 * app/admin/(dashboard)/bookings/page.tsx). Shows the full client record and
 * lets an admin record how the consultation actually went: outcome
 * ("Consultoría efectiva" / "No se realizó"), a free-text summary, key
 * points addressed, and any consolidated business. Saving calls the
 * extended `PATCH /api/admin/bookings/[id]` route with whichever fields
 * changed. The existing "Cancelar" action lives alongside this — it is a
 * different concept (the booking never happened at all) — and still posts
 * `{ status: "cancelled" }` exactly as before.
 *
 * Accessibility follows the same pattern already established by
 * components/chat/BookingModal.tsx: role="dialog" + aria-modal, a focus
 * trap over the dialog's focusable elements, Escape-to-close, scroll lock
 * while open, and focus restored to the trigger on close.
 */

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const dateFormatter = new Intl.DateTimeFormat("es", { dateStyle: "full", timeStyle: "short" });

export function BookingDetailModal({
  booking,
  onClose,
  onSaved,
}: {
  booking: BookingType;
  onClose: () => void;
  onSaved: (updated: Partial<BookingType>) => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const [outcome, setOutcome] = useState<BookingOutcome | null>(booking.outcome);
  const [summary, setSummary] = useState(booking.summary ?? "");
  const [keyPoints, setKeyPoints] = useState(booking.keyPoints ?? "");
  const [dealsConsolidated, setDealsConsolidated] = useState(booking.dealsConsolidated ?? "");
  const [dealValue, setDealValue] = useState(booking.dealValue !== null ? String(booking.dealValue) : "");

  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function patch(body: Record<string, unknown>) {
    const response = await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || "No se pudo actualizar la reserva.");
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const parsedDealValue = dealValue.trim() === "" ? null : Number(dealValue);
    if (parsedDealValue !== null && (!Number.isFinite(parsedDealValue) || parsedDealValue < 0)) {
      setError("El valor del negocio debe ser un número válido.");
      setSaving(false);
      return;
    }
    try {
      await patch({
        outcome,
        summary,
        keyPoints,
        dealsConsolidated,
        dealValue: parsedDealValue,
      });
      onSaved({
        outcome,
        summary,
        keyPoints,
        dealsConsolidated,
        dealValue: parsedDealValue,
        reviewedAt: new Date().toISOString(),
      });
      setSaving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar la reserva.");
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!window.confirm("¿Cancelar esta reserva? El turno quedará libre de nuevo.")) return;
    setCancelling(true);
    setError(null);
    try {
      await patch({ status: "cancelled" });
      onSaved({ status: "cancelled" });
      setCancelling(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cancelar la reserva.");
      setCancelling(false);
    }
  }

  const isCancelled = booking.status === "cancelled";

  return (
    <div className="zh-crm-modal-overlay" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className="zh-crm-modal zh-admin-rise"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de la reserva de ${booking.name}`}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ModalArt className="zh-crm-modal-art" />

        <header className="zh-crm-modal-head">
          <div>
            <p className="text-xs text-zh-muted">{booking.topic || "Consultoría"}</p>
            <h2 className="text-lg font-semibold text-zh-cream">{booking.name}</h2>
          </div>
          <button type="button" className="zh-crm-modal-close" aria-label="Cerrar" onClick={onClose}>
            ×
          </button>
        </header>

        <dl className="zh-crm-field-grid">
          <div>
            <dt>Email</dt>
            <dd>{booking.email}</dd>
          </div>
          <div>
            <dt>Teléfono</dt>
            <dd>{booking.phone || "—"}</dd>
          </div>
          <div>
            <dt>Servicio</dt>
            <dd>{booking.topic || "—"}</dd>
          </div>
          <div>
            <dt>Sesión</dt>
            <dd>{booking.slot ? dateFormatter.format(new Date(booking.slot.startsAt)) : "—"}</dd>
          </div>
        </dl>

        {isCancelled ? (
          <p className="zh-admin-badge zh-admin-badge-cancelled" style={{ marginBottom: "1rem" }}>
            Cancelada
          </p>
        ) : null}

        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-zh-muted">Resultado de la consultoría</p>
          <div className="zh-crm-outcome-row">
            <button
              type="button"
              className="zh-crm-outcome-btn"
              data-kind="effective"
              data-active={outcome === "effective"}
              onClick={() => setOutcome(outcome === "effective" ? null : "effective")}
            >
              Consultoría efectiva
            </button>
            <button
              type="button"
              className="zh-crm-outcome-btn"
              data-kind="not_realized"
              data-active={outcome === "not_realized"}
              onClick={() => setOutcome(outcome === "not_realized" ? null : "not_realized")}
            >
              No se realizó
            </button>
          </div>
        </div>

        <div className="zh-crm-field">
          <label htmlFor="crm-summary">Cómo estuvo la consultoría</label>
          <textarea
            id="crm-summary"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Resumen de la sesión…"
          />
        </div>

        <div className="zh-crm-field">
          <label htmlFor="crm-key-points">Puntos clave abordados</label>
          <textarea
            id="crm-key-points"
            rows={3}
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            placeholder="Puntos tratados en la sesión…"
          />
        </div>

        <div className="zh-crm-field">
          <label htmlFor="crm-deals">Negocios consolidados</label>
          <textarea
            id="crm-deals"
            rows={2}
            value={dealsConsolidated}
            onChange={(e) => setDealsConsolidated(e.target.value)}
            placeholder="Alcance o mandato acordado, si lo hay…"
          />
        </div>

        <div className="zh-crm-field" style={{ maxWidth: "220px" }}>
          <label htmlFor="crm-deal-value">Valor del negocio (USD, adicional a la sesión)</label>
          <input
            id="crm-deal-value"
            type="number"
            min={0}
            step="100"
            value={dealValue}
            onChange={(e) => setDealValue(e.target.value)}
            placeholder="0"
          />
        </div>

        {error ? (
          <p role="alert" className="text-sm text-[#e07a7a]">
            {error}
          </p>
        ) : null}

        <div className="zh-crm-modal-actions">
          <button
            type="button"
            className="zh-admin-btn-danger"
            onClick={handleCancel}
            disabled={cancelling || isCancelled}
          >
            {isCancelled ? "Cancelada" : cancelling ? "Cancelando…" : "Cancelar reserva"}
          </button>
          <button type="button" className="zh-admin-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
