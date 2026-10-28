"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Slot = {
  key: string;
  label: string;
  recommendedWidth: number;
  recommendedHeight: number;
  imageUrl: string | null;
  updatedAt: string | null;
};

type Group = { page: string; slots: Slot[] };

type SlotStatus = { kind: "idle" } | { kind: "working" } | { kind: "error"; message: string } | { kind: "ok" };

/**
 * "El admin debe poder elegir y subir qué imágenes van en cada parte del
 * sitio (inicio y cada página)."
 *
 * Lists every image slot from lib/images/slots.ts (fetched via
 * GET /api/admin/images, grouped by page), with the recommended size
 * shown as a visible hint, a live preview (or "sin imagen" placeholder),
 * and an upload/remove action per slot. Upload optimization (resize to
 * fit, convert to WebP) happens server-side in
 * app/api/admin/images/[slotKey]/route.ts — this page only posts the raw
 * file. <details>/<summary> accordion per page group, same resilient,
 * JS-light pattern as components/site/FaqAccordion.tsx.
 */
export default function ImagesAdminPage() {
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, SlotStatus>>({});
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/images");
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setLoadError(data?.error || "No se pudieron cargar las imágenes.");
        return;
      }
      setGroups(data.groups ?? []);
    } catch {
      setLoadError("No se pudo conectar con el servidor.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function setStatus(slotKey: string, status: SlotStatus) {
    setStatuses((prev) => ({ ...prev, [slotKey]: status }));
  }

  async function handleUpload(slotKey: string) {
    const input = fileInputs.current[slotKey];
    const file = input?.files?.[0];
    if (!file) {
      setStatus(slotKey, { kind: "error", message: "Elige un archivo primero." });
      return;
    }

    setStatus(slotKey, { kind: "working" });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`/api/admin/images/${encodeURIComponent(slotKey)}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(slotKey, { kind: "error", message: data?.error || "No se pudo subir la imagen." });
        return;
      }
      if (input) input.value = "";
      setStatus(slotKey, { kind: "ok" });
      await load();
    } catch {
      setStatus(slotKey, { kind: "error", message: "No se pudo conectar con el servidor." });
    }
  }

  async function handleRemove(slotKey: string) {
    if (!window.confirm("¿Quitar esta imagen? La página volverá a mostrar la imagen predeterminada.")) return;
    setStatus(slotKey, { kind: "working" });
    try {
      const response = await fetch(`/api/admin/images/${encodeURIComponent(slotKey)}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(slotKey, { kind: "error", message: data?.error || "No se pudo quitar la imagen." });
        return;
      }
      setStatus(slotKey, { kind: "idle" });
      await load();
    } catch {
      setStatus(slotKey, { kind: "error", message: "No se pudo conectar con el servidor." });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-zh-cream">Imágenes</h1>
        <p className="text-sm text-zh-muted">
          Elige y sube la imagen de cada sección del sitio. Toda imagen se optimiza automáticamente
          (se ajusta al tamaño recomendado y se convierte a WebP) antes de publicarse.
        </p>
      </div>

      {loadError ? <p role="alert" className="text-sm text-[#e07a7a]">{loadError}</p> : null}

      {groups === null && !loadError ? <p className="text-sm text-zh-muted">Cargando…</p> : null}

      {groups?.map((group) => (
        <details key={group.page} className="zh-admin-card" open>
          <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-zh-cream">
            {group.page}
          </summary>
          <div className="flex flex-col gap-4 border-t border-zh-smoke p-5">
            {group.slots.map((slot) => {
              const status = statuses[slot.key] ?? { kind: "idle" };
              return (
                <div
                  key={slot.key}
                  className="flex flex-col gap-3 border-b border-zh-smoke pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-start"
                >
                  <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded bg-zh-graphite">
                    {slot.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- admin-only preview thumbnail, not worth next/image config for arbitrary Storage URLs here.
                      <img src={slot.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-2 text-center text-[0.65rem] text-zh-muted">
                        Sin imagen — usando la predeterminada
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-zh-cream">{slot.label}</p>
                    <p className="text-xs text-zh-muted">
                      Tamaño recomendado: {slot.recommendedWidth}×{slot.recommendedHeight}px
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => {
                          fileInputs.current[slot.key] = el;
                        }}
                        className="text-xs text-zh-muted"
                      />
                      <button
                        type="button"
                        className="zh-admin-btn"
                        disabled={status.kind === "working"}
                        onClick={() => handleUpload(slot.key)}
                      >
                        {status.kind === "working" ? "Subiendo…" : "Subir"}
                      </button>
                      {slot.imageUrl ? (
                        <button
                          type="button"
                          className="zh-admin-btn-danger"
                          disabled={status.kind === "working"}
                          onClick={() => handleRemove(slot.key)}
                        >
                          Quitar
                        </button>
                      ) : null}
                    </div>

                    {status.kind === "error" ? (
                      <p role="alert" className="mt-1 text-xs text-[#e07a7a]">
                        {status.message}
                      </p>
                    ) : null}
                    {status.kind === "ok" ? <p className="mt-1 text-xs text-[#4fd3a8]">Guardado.</p> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      ))}
    </div>
  );
}
