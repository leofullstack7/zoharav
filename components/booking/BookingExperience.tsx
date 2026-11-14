"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { BookingCategory, BookingOption } from "@/content/booking";
import { loc } from "@/lib/i18n/loc";
import { intlBcp47 } from "@/lib/i18n/locale";
import type { AvailabilitySlot } from "@/components/chat/types";
import { BookingSelectOverlay } from "@/components/booking/BookingSelectOverlay";

type Stage = "grid" | "offers" | "selecting" | "calendar" | "details" | "done";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function localDayKey(iso: string) {
  const date = new Date(iso);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function monthLabel(year: number, month: number, locale: string) {
  return new Intl.DateTimeFormat(intlBcp47(locale), {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
}

function dayHeading(iso: string, locale: string) {
  return new Intl.DateTimeFormat(intlBcp47(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(iso));
}

function timeLabel(iso: string, locale: string) {
  return new Intl.DateTimeFormat(intlBcp47(locale), {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function BookingExperience({
  locale,
  categories,
  photos,
  initialLine,
  initialOffer,
}: {
  locale: string;
  categories: BookingCategory[];
  photos: Record<string, string | null>;
  initialLine?: string | null;
  initialOffer?: string | null;
}) {
  const es = locale === "es";
  const presetCategory = categories.find((item) => item.id === initialLine) ?? null;
  const presetOption = presetCategory?.options.find((item) => item.id === initialOffer) ?? null;
  const [stage, setStage] = useState<Stage>(() => {
    if (presetCategory && presetOption) return prefersReducedMotion() ? "calendar" : "selecting";
    if (presetCategory) return "offers";
    return "grid";
  });
  const [selectedId, setSelectedId] = useState<string | null>(presetCategory?.id ?? null);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(presetOption?.id ?? null);
  const [slots, setSlots] = useState<AvailabilitySlot[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const [pickedSlot, setPickedSlot] = useState<AvailabilitySlot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [conflict, setConflict] = useState(false);

  const selected = categories.find((item) => item.id === selectedId) ?? null;
  const selectedOffer = selected?.options.find((item) => item.id === selectedOfferId) ?? null;
  const selectedName = selected ? loc(selected.name, locale) : "";
  const selectedOfferName = selectedOffer ? loc(selectedOffer.label, locale) : "";
  const overlayTitle = selectedOfferName || selectedName;
  const topicLabel = [selectedName, selectedOfferName].filter(Boolean).join(" · ");

  async function loadSlots() {
    setLoadFailed(false);
    try {
      const response = await fetch("/api/availability");
      if (!response.ok) throw new Error("availability");
      const data: { slots?: AvailabilitySlot[] } = await response.json();
      setSlots(Array.isArray(data.slots) ? data.slots : []);
    } catch {
      setLoadFailed(true);
      setSlots([]);
    }
  }

  useEffect(() => {
    void loadSlots();
  }, []);

  const byDay = useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>();
    for (const slot of slots ?? []) {
      const key = localDayKey(slot.startsAt);
      const bucket = map.get(key);
      if (bucket) bucket.push(slot);
      else map.set(key, [slot]);
    }
    return map;
  }, [slots]);

  const cells = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1);
    const pad = (first.getDay() + 6) % 7;
    const days = new Date(cursor.year, cursor.month + 1, 0).getDate();
    const list: Array<number | null> = Array.from({ length: pad }, () => null);
    for (let day = 1; day <= days; day += 1) list.push(day);
    return list;
  }, [cursor]);

  const finishSelect = useCallback(() => setStage("calendar"), []);

  function choose(category: BookingCategory) {
    setSelectedId(category.id);
    setSelectedOfferId(null);
    setPickedDay(null);
    setPickedSlot(null);
    setConflict(false);
    if (!category.options.length) {
      if (prefersReducedMotion()) setStage("calendar");
      else setStage("selecting");
      return;
    }
    setStage("offers");
  }

  function chooseOffer(option: BookingOption) {
    setSelectedOfferId(option.id);
    setPickedDay(null);
    setPickedSlot(null);
    setConflict(false);
    if (prefersReducedMotion()) {
      setStage("calendar");
      return;
    }
    setStage("selecting");
  }

  function backToGrid() {
    setStage("grid");
    setSelectedId(null);
    setSelectedOfferId(null);
    setPickedDay(null);
    setPickedSlot(null);
  }

  function backToOffers() {
    setStage("offers");
    setSelectedOfferId(null);
    setPickedDay(null);
    setPickedSlot(null);
  }

  function selectDay(day: number) {
    const key = `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (!byDay.has(key)) return;
    setPickedDay(key);
    setPickedSlot(null);
  }

  function selectTime(slot: AvailabilitySlot) {
    setPickedSlot(slot);
    setStage("details");
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!pickedSlot || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: pickedSlot.id,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          topic: topicLabel,
        }),
      });
      const data: { ok?: boolean; error?: string } = await response.json();
      if (response.status === 200 && data.ok) {
        setStage("done");
        return;
      }
      if (response.status === 409) {
        setConflict(true);
        setPickedSlot(null);
        setStage("calendar");
        await loadSlots();
        return;
      }
      setSubmitError(
        data.error ||
          (es ? "No pudimos completar la reserva. Intenta de nuevo." : "We could not complete the booking. Please try again."),
      );
    } catch {
      setSubmitError(es ? "No pudimos completar la reserva. Intenta de nuevo." : "We could not complete the booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const weekdays = es
    ? ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className={`booking-stage is-${stage}`}>
      {stage === "selecting" && overlayTitle ? (
        <BookingSelectOverlay title={overlayTitle} onDone={finishSelect} />
      ) : null}

      <div className="booking-grid" hidden={stage !== "grid"}>
        {categories.map((category) => {
          const name = loc(category.name, locale);
          const picked = category.id === selectedId;
          return (
            <button
              type="button"
              key={category.id}
              className={`booking-card${picked ? " is-picked" : ""}`}
              onClick={() => choose(category)}
              disabled={stage !== "grid"}
              aria-pressed={picked}
            >
              <span
                className="booking-card-media"
                aria-hidden
                style={{
                  backgroundImage: `url(${photos[`booking.category.${category.id}`] ?? category.image})`,
                }}
              />
              <span className="booking-card-name">{name}</span>
              <span className="booking-card-toggle" aria-hidden>
                <span className="booking-card-icon" />
              </span>
            </button>
          );
        })}
      </div>

      {stage === "offers" && selected ? (
        <section className="booking-offers" aria-live="polite">
          <header className="booking-calendar-head">
            <p className="booking-cal-index">{es ? "01 · Práctica" : "01 · Practice"}</p>
            <h2>{selectedName}</h2>
            <p className="booking-cal-sub">
              {es
                ? "Elija el subservicio de esta consulta. Luego verá la disponibilidad."
                : "Choose the sub-service for this consultation. Availability follows."}
            </p>
            <button type="button" className="text-link as-button" onClick={backToGrid}>
              {es ? "Cambiar línea" : "Change line"}
            </button>
          </header>
          <ul className="booking-offer-list">
            {selected.options.map((option) => (
              <li key={option.id}>
                <button type="button" className="booking-offer" onClick={() => chooseOffer(option)}>
                  <span>{loc(option.label, locale)}</span>
                  <span aria-hidden>→</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {stage === "calendar" ? (
        <section className="booking-calendar" aria-live="polite">
          <header className="booking-calendar-head">
            <p className="booking-cal-index">{es ? "02 · Disponibilidad" : "02 · Availability"}</p>
            <h2>{selectedOfferName || selectedName}</h2>
            {selectedOfferName ? <p className="booking-cal-line">{selectedName}</p> : null}
            <p className="booking-cal-sub">
              {es ? "Sesión de 60 minutos. Elige el día que brilla, luego la hora." : "A 60-minute session. Choose the day that lights, then the hour."}
            </p>
            {selected ? (
              <button type="button" className="text-link as-button" onClick={backToOffers}>
                {es ? "Cambiar práctica" : "Change practice"}
              </button>
            ) : null}
            <button type="button" className="text-link as-button" onClick={backToGrid}>
              {es ? "Cambiar línea" : "Change line"}
            </button>
          </header>

          {conflict ? (
            <p className="booking-calendar-note" role="alert">
              {es
                ? "Ese horario acaba de tomarse. Elige otro día disponible."
                : "That time was just taken. Please pick another available day."}
            </p>
          ) : null}

          {slots === null ? (
            <p className="booking-calendar-note">{es ? "Cargando disponibilidad…" : "Loading availability…"}</p>
          ) : loadFailed ? (
            <p className="booking-calendar-note">
              {es ? "No pudimos cargar la agenda. " : "We couldn't load the schedule. "}
              <button type="button" className="text-link as-button" onClick={() => void loadSlots()}>
                {es ? "Intentar de nuevo" : "Try again"}
              </button>
            </p>
          ) : (
            <div className="booking-cal-stage">
              <div className="booking-month">
                <div className="booking-month-nav">
                  <button
                    type="button"
                    aria-label={es ? "Mes anterior" : "Previous month"}
                    onClick={() =>
                      setCursor((prev) =>
                        prev.month === 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: prev.month - 1 },
                      )
                    }
                  >
                    ←
                  </button>
                  <p>{monthLabel(cursor.year, cursor.month, locale)}</p>
                  <button
                    type="button"
                    aria-label={es ? "Mes siguiente" : "Next month"}
                    onClick={() =>
                      setCursor((prev) =>
                        prev.month === 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: prev.month + 1 },
                      )
                    }
                  >
                    →
                  </button>
                </div>
                <div className="booking-month-week">
                  {weekdays.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="booking-month-grid">
                  {cells.map((day, index) => {
                    if (!day) return <span key={`e-${index}`} className="booking-day is-empty" />;
                    const key = `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const openSlots = byDay.get(key);
                    const open = Boolean(openSlots);
                    const active = pickedDay === key;
                    return (
                      <button
                        type="button"
                        key={key}
                        className={`booking-day${open ? " is-open" : ""}${active ? " is-active" : ""}`}
                        disabled={!open}
                        onClick={() => selectDay(day)}
                      >
                        <span className="booking-day-num">{day}</span>
                        {open ? <i className="booking-day-mark" aria-hidden /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <aside className="booking-hours">
                {pickedDay && byDay.get(pickedDay) ? (
                  <>
                    <p className="booking-hours-kicker">{es ? "Hora local" : "Local time"}</p>
                    <p className="booking-hours-day">{dayHeading(byDay.get(pickedDay)![0].startsAt, locale)}</p>
                    <ol className="booking-hour-list">
                      {byDay.get(pickedDay)!.map((slot) => (
                        <li key={slot.id}>
                          <button type="button" className="booking-hour" onClick={() => selectTime(slot)}>
                            <span className="booking-hour-face">{timeLabel(slot.startsAt, locale)}</span>
                            <span className="booking-hour-meta">{es ? "60 min" : "60 min"}</span>
                            <span className="booking-hour-go" aria-hidden>
                              →
                            </span>
                          </button>
                        </li>
                      ))}
                    </ol>
                  </>
                ) : byDay.size === 0 ? (
                  <p className="booking-calendar-note">
                    {es
                      ? "No hay días disponibles en este momento. Escríbenos y un asesor te contacta."
                      : "No days are available right now. Write to us and an advisor will reach out."}
                  </p>
                ) : (
                  <div className="booking-hours-empty">
                    <span className="booking-hours-orbit" aria-hidden />
                    <p>{es ? "Toca un día con marca. Ahí está el hueco." : "Touch a marked day. The opening lives there."}</p>
                  </div>
                )}
              </aside>
            </div>
          )}
        </section>
      ) : null}

      {stage === "details" && pickedSlot ? (
        <form className="form-grid booking-details" onSubmit={onSubmit}>
          <p className="kicker" style={{ gridColumn: "1 / -1" }}>
            {topicLabel}
            {" · "}
            {dayHeading(pickedSlot.startsAt, locale)} · {timeLabel(pickedSlot.startsAt, locale)}
            {" "}
            <button type="button" className="text-link as-button" onClick={() => setStage("calendar")}>
              {es ? "Cambiar horario" : "Change time"}
            </button>
          </p>
          {submitError ? (
            <p className="booking-calendar-note" role="alert" style={{ gridColumn: "1 / -1" }}>
              {submitError}
            </p>
          ) : null}
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
          <label className="field" style={{ gridColumn: "1 / -1" }}>
            <span>{es ? "Teléfono" : "Phone"}</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" />
          </label>
          <button className="btn-solid" type="submit" disabled={submitting}>
            {submitting ? (es ? "Reservando…" : "Booking…") : `${es ? "Confirmar reserva" : "Confirm booking"} →`}
          </button>
        </form>
      ) : null}

      {stage === "done" ? (
        <p className="script booking-done">
          {es
            ? "Sesión reservada. Un asesor senior la confirmará por correo."
            : "Session reserved. A senior advisor will confirm it by email."}
        </p>
      ) : null}
    </div>
  );
}
