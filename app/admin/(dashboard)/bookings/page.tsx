"use client";

import { useCallback, useEffect, useState } from "react";

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  topic: string | null;
  source: string;
  status: string;
  createdAt: string;
  slot: { id: string; startsAt: string; durationMinutes: number | null } | null;
};

const formatter = new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" });

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

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

  async function handleCancel(id: string) {
    if (!window.confirm("¿Cancelar esta reserva? El turno quedará libre de nuevo.")) return;
    setCancellingId(id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || "No se pudo cancelar la reserva.");
        setCancellingId(null);
        return;
      }
      await load();
      setCancellingId(null);
    } catch {
      setError("No se pudo conectar con el servidor.");
      setCancellingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-zh-cream">Reservas</h1>
        <p className="text-sm text-zh-muted">Todas las reservas, más recientes primero.</p>
      </div>

      {error ? <p role="alert" className="text-sm text-[#e07a7a]">{error}</p> : null}

      <div className="zh-admin-card overflow-x-auto">
        <table className="zh-admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Tema</th>
              <th>Turno</th>
              <th>Estado</th>
              <th>Creada</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {bookings === null ? (
              <tr>
                <td colSpan={7} className="text-center text-zh-muted">
                  Cargando…
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-zh-muted">
                  No hay reservas todavía.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="text-zh-cream">{booking.name}</td>
                  <td className="text-zh-muted">
                    <div>{booking.email}</div>
                    {booking.phone ? <div>{booking.phone}</div> : null}
                  </td>
                  <td className="text-zh-muted">{booking.topic || "—"}</td>
                  <td className="text-zh-muted">
                    {booking.slot ? formatter.format(new Date(booking.slot.startsAt)) : "—"}
                  </td>
                  <td>
                    <span
                      className={`zh-admin-badge ${
                        booking.status === "cancelled" ? "zh-admin-badge-cancelled" : "zh-admin-badge-open"
                      }`}
                    >
                      {booking.status === "cancelled" ? "Cancelada" : booking.status}
                    </span>
                  </td>
                  <td className="text-zh-muted">{formatter.format(new Date(booking.createdAt))}</td>
                  <td className="text-right">
                    {booking.status !== "cancelled" ? (
                      <button
                        type="button"
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="zh-admin-btn-danger"
                      >
                        {cancellingId === booking.id ? "Cancelando…" : "Cancelar"}
                      </button>
                    ) : (
                      <span className="text-xs text-zh-muted">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
