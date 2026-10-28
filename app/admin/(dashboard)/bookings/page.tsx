"use client";

import { useCallback, useEffect, useState } from "react";
import { BookingDetailModal } from "@/components/admin/BookingDetailModal";
import type { Booking } from "@/components/admin/types";

/**
 * CRM card board for every booking. Upgraded from a plain table: each
 * booking renders as a card (name, topic, date, outcome badge); clicking a
 * card opens BookingDetailModal, where an admin reviews the full record and
 * records how the consultation went. The cancel action from the original
 * table still lives inside that modal — cancelling and setting an outcome
 * are different concepts (see BookingDetailModal's header comment).
 */

const formatter = new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" });

function OutcomeBadge({ booking }: { booking: Booking }) {
  if (booking.status === "cancelled") {
    return <span className="zh-admin-badge zh-admin-badge-cancelled">Cancelada</span>;
  }
  if (booking.outcome === "effective") {
    return <span className="zh-admin-badge zh-admin-badge-effective">Efectiva</span>;
  }
  if (booking.outcome === "not_realized") {
    return <span className="zh-admin-badge zh-admin-badge-not-realized">No se realizó</span>;
  }
  return <span className="zh-admin-badge zh-admin-badge-pending">Pendiente</span>;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Booking | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch("/api/admin/bookings");
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || "No se pudieron cargar las reservas.");
        return;
      }
      setBookings(data.bookings ?? []);
    } catch {
      setError("No se pudo conectar con el servidor.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleSaved(updated: Partial<Booking>) {
    setBookings((prev) =>
      prev?.map((b) => (b.id === selected?.id ? { ...b, ...updated } : b)) ?? prev,
    );
    setSelected((prev) => (prev ? { ...prev, ...updated } : prev));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-zh-cream">Reservas · CRM</h1>
        <p className="text-sm text-zh-muted">
          Todas las reservas, más recientes primero. Haz clic en una tarjeta para ver el detalle y registrar el
          resultado de la consultoría.
        </p>
      </div>

      {error ? <p role="alert" className="text-sm text-[#e07a7a]">{error}</p> : null}

      {bookings === null ? (
        <p className="text-sm text-zh-muted">Cargando…</p>
      ) : bookings.length === 0 ? (
        <p className="zh-admin-card p-6 text-center text-sm text-zh-muted">No hay reservas todavía.</p>
      ) : (
        <div className="zh-crm-grid">
          {bookings.map((booking, index) => (
            <button
              type="button"
              key={booking.id}
              className="zh-crm-card zh-admin-rise"
              style={{ animationDelay: `${Math.min(index, 8) * 0.04}s` }}
              onClick={() => setSelected(booking)}
            >
              <div className="zh-crm-card-head">
                <span className="zh-crm-card-name">{booking.name}</span>
                <OutcomeBadge booking={booking} />
              </div>
              <span className="zh-crm-card-topic">{booking.topic || "Consultoría"}</span>
              <span className="zh-crm-card-date">
                {booking.slot ? formatter.format(new Date(booking.slot.startsAt)) : "Sin turno asignado"}
              </span>
            </button>
          ))}
        </div>
      )}

      {selected ? (
        <BookingDetailModal booking={selected} onClose={() => setSelected(null)} onSaved={handleSaved} />
      ) : null}
    </div>
  );
}
