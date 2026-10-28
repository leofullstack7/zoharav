"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { AvailabilitySlot, BookingTopic } from "./types";

/**
 * Centered, accessible booking modal. Reached only after the chat's
 * post-navigation "Sí" choice — fetches real availability from
 * GET /api/availability (owned by another agent, read-only here), lets the
 * visitor pick a slot, collects name/email/phone, and books via
 * POST /api/bookings. 409 (slot just taken) is handled specifically: the
 * visitor is told so and the slot list is refreshed rather than shown a
 * generic error.
 */

type Phase = "slots" | "details" | "success" | "submit-error";

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function dayLabel(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(iso));
}

function timeLabel(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function BookingModal({
  locale,
  topic,
  onClose,
}: {
  locale: string;
  topic: BookingTopic;
  onClose: () => void;
}) {
  const es = locale === "es";
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const [slots, setSlots] = useState<AvailabilitySlot[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [conflictNotice, setConflictNotice] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [phase, setPhase] = useState<Phase>("slots");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  async function loadSlots() {
    setLoadFailed(false);
    setSlots(null);
    try {
      const response = await fetch("/api/availability");
      if (!response.ok) throw new Error("availability request failed");
      const data: { slots?: AvailabilitySlot[] } = await response.json();
      setSlots(Array.isArray(data.slots) ? data.slots : []);
    } catch {
      setLoadFailed(true);
      setSlots([]);
    }
  }

  useEffect(() => {
    loadSlots();
  }, []);

  // Focus trap + Escape-to-close + scroll lock, standard modal behavior.
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

  const groupedSlots = useMemo(() => {
    const groups = new Map<string, AvailabilitySlot[]>();
    for (const slot of slots ?? []) {
      const key = dayKey(slot.startsAt);
      const bucket = groups.get(key);
      if (bucket) bucket.push(slot);
      else groups.set(key, [slot]);
    }
    return Array.from(groups.entries());
  }, [slots]);

  function handleSelectSlot(slot: AvailabilitySlot) {
    setConflictNotice(false);
    setSelectedSlot(slot);
    setPhase("details");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selectedSlot || submitting) return;
    if (!name.trim() || !isValidEmail(email.trim())) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          topic: topic.name,
        }),
      });
      const data: { ok?: boolean; bookingId?: string; error?: string } = await response.json();

      if (response.status === 200 && data.ok) {
        setBookingId(data.bookingId ?? null);
        setPhase("success");
        return;
      }

      if (response.status === 409) {
        setConflictNotice(true);
        setSelectedSlot(null);
        setPhase("slots");
        await loadSlots();
        return;
      }

      setSubmitError(
        data.error ||
          (es
            ? "No pudimos completar la reserva. Intenta de nuevo."
            : "We could not complete the booking. Please try again."),
      );
      setPhase("submit-error");
    } catch {
      setSubmitError(
        es
          ? "No pudimos completar la reserva. Intenta de nuevo."
          : "We could not complete the booking. Please try again.",
      );
      setPhase("submit-error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="octano-modal-overlay" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className="octano-modal"
        role="dialog"
        aria-modal="true"
        aria-label={es ? "Reservar una sesión" : "Book a session"}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="octano-modal-head">
          <div>
            <p className="kicker">{es ? "Concierge privado" : "Private Concierge"}</p>
            <h2>{es ? "Reservar una sesión" : "Book a session"}</h2>
            <p className="octano-modal-topic">{topic.name}</p>
          </div>
          <button type="button" className="octano-modal-close" aria-label={es ? "Cerrar" : "Close"} onClick={onClose}>
            ×
          </button>
        </header>

        {conflictNotice ? (
          <p className="octano-modal-notice" role="alert">
            {es
              ? "Ese horario acaba de ser tomado por otra persona. Elige otro disponible."
              : "That slot was just taken by someone else. Please pick another."}
          </p>
        ) : null}

        {phase === "slots" ? (
          <div className="octano-modal-body">
            {slots === null ? (
              <p className="octano-modal-status">{es ? "Cargando disponibilidad…" : "Loading availability…"}</p>
            ) : loadFailed ? (
              <p className="octano-modal-status octano-modal-status--error">
                {es
                  ? "No pudimos cargar la agenda. "
                  : "We couldn't load the schedule. "}
                <button type="button" className="text-link as-button" onClick={loadSlots}>
                  {es ? "Intentar de nuevo" : "Try again"}
                </button>
              </p>
            ) : groupedSlots.length === 0 ? (
              <p className="octano-modal-status">
                {es
                  ? "No hay horarios disponibles por ahora. Escríbenos y un asesor te contacta directamente."
                  : "No slots are available right now. Write to us and an advisor will reach out directly."}
              </p>
            ) : (
              <div className="octano-slot-groups">
                {groupedSlots.map(([key, daySlots]) => (
                  <div className="octano-slot-group" key={key}>
                    <p className="octano-slot-day">{dayLabel(daySlots[0].startsAt, locale)}</p>
                    <div className="octano-slot-chips">
                      {daySlots.map((slot) => (
                        <button
                          type="button"
                          key={slot.id}
                          className="octano-slot-chip"
                          onClick={() => handleSelectSlot(slot)}
                        >
                          {timeLabel(slot.startsAt, locale)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {phase === "details" && selectedSlot ? (
          <form className="octano-modal-body form-grid" onSubmit={handleSubmit}>
            <p className="octano-modal-selected">
              {es ? "Horario elegido: " : "Selected time: "}
              <strong>
                {dayLabel(selectedSlot.startsAt, locale)} · {timeLabel(selectedSlot.startsAt, locale)}
              </strong>
              {" "}
              <button
                type="button"
                className="text-link as-button"
                onClick={() => {
                  setSelectedSlot(null);
                  setPhase("slots");
                }}
              >
                {es ? "Cambiar" : "Change"}
              </button>
            </p>
            <label className="field">
              <span>{es ? "Nombre" : "Name"} *</span>
              <input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" />
            </label>
            <label className="field">
              <span>Email *</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label className="field">
              <span>{es ? "Teléfono" : "Phone"}</span>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" />
            </label>
            <button className="btn-solid" type="submit" disabled={submitting}>
              {submitting ? (es ? "Reservando…" : "Booking…") : `${es ? "Confirmar reserva" : "Confirm booking"} →`}
            </button>
          </form>
        ) : null}

        {phase === "submit-error" ? (
          <div className="octano-modal-body">
            <p className="octano-modal-status octano-modal-status--error">{submitError}</p>
            <button type="button" className="btn-solid" onClick={() => setPhase("details")}>
              {es ? "Intentar de nuevo" : "Try again"}
            </button>
          </div>
        ) : null}

        {phase === "success" ? (
          <div className="octano-modal-body">
            <p className="octano-modal-success">
              {es
                ? "Listo. Tu sesión quedó reservada. Un asesor senior la confirmará por correo."
                : "Done. Your session is booked. A senior advisor will confirm it by email."}
            </p>
            {bookingId ? <p className="octano-modal-booking-id">{es ? "Referencia" : "Reference"}: {bookingId}</p> : null}
            <button type="button" className="btn-solid" onClick={onClose}>
              {es ? "Cerrar" : "Close"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
