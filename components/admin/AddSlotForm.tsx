"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Creates a new availability slot. Date + time are collected as separate
 * native inputs (friendlier than a single datetime-local on most locales)
 * and combined into a single Date before being sent as ISO 8601 — the
 * server (POST /api/admin/availability) re-validates regardless.
 */
export function AddSlotForm() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!date || !time) {
      setError("Fecha y hora son obligatorias.");
      return;
    }

    const startsAt = new Date(`${date}T${time}`);
    if (Number.isNaN(startsAt.getTime())) {
      setError("Fecha u hora inválida.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startsAt: startsAt.toISOString(), durationMinutes: duration }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.error || "No se pudo crear el turno.");
        setSubmitting(false);
        return;
      }

      setDate("");
      setTime("");
      setDuration(60);
      setSubmitting(false);
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="zh-admin-card flex flex-wrap items-end gap-3 p-4">
      <div>
        <label htmlFor="slot-date" className="mb-1 block text-xs text-zh-muted">
          Fecha
        </label>
        <input
          id="slot-date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="zh-admin-input"
        />
      </div>
      <div>
        <label htmlFor="slot-time" className="mb-1 block text-xs text-zh-muted">
          Hora
        </label>
        <input
          id="slot-time"
          type="time"
          required
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="zh-admin-input"
        />
      </div>
      <div>
        <label htmlFor="slot-duration" className="mb-1 block text-xs text-zh-muted">
          Duración (min)
        </label>
        <input
          id="slot-duration"
          type="number"
          min={5}
          max={480}
          step={5}
          required
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="zh-admin-input w-28"
        />
      </div>
      <button type="submit" disabled={submitting} className="zh-admin-btn">
        {submitting ? "Creando…" : "Agregar turno"}
      </button>
      {error ? (
        <p role="alert" className="w-full text-sm text-[#e07a7a]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
