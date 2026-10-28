import { AddSlotForm } from "@/components/admin/AddSlotForm";
import { DeleteSlotButton } from "@/components/admin/DeleteSlotButton";
import { query } from "@/lib/db/client";

export const metadata = { title: "Disponibilidad · Panel de administración" };

// Rendered fresh on every request — slot state changes from both the admin
// (create/delete) and the public booking flow, so this page must never be
// statically cached.
export const dynamic = "force-dynamic";

type SlotRow = {
  id: string;
  starts_at: Date;
  duration_minutes: number;
  is_booked: boolean;
};

const formatter = new Intl.DateTimeFormat("es", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AvailabilityPage() {
  // No lower bound on starts_at: unlike the first pass of this page, past
  // booked slots (including the historical demo consultations seeded via
  // scripts/seed-demo-bookings.cjs) are shown too, struck through, so an
  // admin can see at a glance which historical slots were actually
  // consumed. Upcoming slots (open or booked) render normally, as before.
  const result = await query<SlotRow>(
    `select id, starts_at, duration_minutes, is_booked
     from availability_slots
     order by starts_at asc`,
  );
  const slots = result.rows;
  const now = Date.now();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-zh-cream">Disponibilidad</h1>
        <p className="text-sm text-zh-muted">
          Todos los turnos, pasados y próximos. Los turnos pasados y reservados aparecen tachados. Agrega nuevos
          turnos o elimina los que no estén reservados.
        </p>
      </div>

      <AddSlotForm />

      <div className="zh-admin-card overflow-x-auto">
        <table className="zh-admin-table">
          <thead>
            <tr>
              <th>Fecha y hora</th>
              <th>Duración</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {slots.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-zh-muted">
                  No hay turnos todavía.
                </td>
              </tr>
            ) : (
              slots.map((slot) => {
                const isPast = new Date(slot.starts_at).getTime() < now;
                const isPastBooked = isPast && slot.is_booked;
                return (
                  <tr key={slot.id}>
                    <td className={isPastBooked ? "zh-slot-past-booked" : "text-zh-cream"}>
                      {formatter.format(new Date(slot.starts_at))}
                      {isPastBooked ? <span className="zh-slot-past-tag">Pasada</span> : null}
                    </td>
                    <td className={isPastBooked ? "zh-slot-past-booked" : "text-zh-muted"}>
                      {slot.duration_minutes} min
                    </td>
                    <td>
                      <span className={`zh-admin-badge ${slot.is_booked ? "zh-admin-badge-booked" : "zh-admin-badge-open"}`}>
                        {slot.is_booked ? "Reservado" : "Libre"}
                      </span>
                    </td>
                    <td className="text-right">
                      {slot.is_booked ? (
                        <span className="text-xs text-zh-muted">Cancela la reserva para eliminar</span>
                      ) : (
                        <DeleteSlotButton id={slot.id} />
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
