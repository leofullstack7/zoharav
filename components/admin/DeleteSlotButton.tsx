"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Deletes an unbooked slot. Booked slots never render this as an active
 * button (see app/admin/(dashboard)/availability/page.tsx) — the server
 * also refuses the delete (409) as defense in depth, in case the UI state
 * is stale.
 */
export function DeleteSlotButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm("¿Eliminar este turno?")) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/availability/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data?.error || "No se pudo eliminar.");
        setPending(false);
        return;
      }
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" onClick={handleDelete} disabled={pending} className="zh-admin-btn-danger">
        {pending ? "Eliminando…" : "Eliminar"}
      </button>
      {error ? <span className="text-xs text-[#e07a7a]">{error}</span> : null}
    </div>
  );
}
