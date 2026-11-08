"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Slot = {
  key: string;
  label: string;
  recommendedWidth: number;
  recommendedHeight: number;
  imageUrl: string | null;
  fallback: string | null;
  updatedAt: string | null;
  href: string;
  anchor: string | null;
};

type Group = { page: string; href: string; slots: Slot[] };

type SlotStatus = { kind: "idle" } | { kind: "working" } | { kind: "error"; message: string } | { kind: "ok" };

const DESKTOP_W = 1440;
const DESKTOP_H = 2400;
const PREVIEW_SCALE = 0.32;

export default function ImagesAdminPage() {
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState("/es");
  const [statuses, setStatuses] = useState<Record<string, SlotStatus>>({});
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const frameRef = useRef<HTMLIFrameElement>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/images");
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setLoadError(data?.error || "No se pudieron cargar las imágenes.");
        return;
      }
      const nextGroups: Group[] = data.groups ?? [];
      setGroups(nextGroups);
      setActivePage((current) => current ?? nextGroups[0]?.page ?? null);
    } catch {
      setLoadError("No se pudo conectar con el servidor.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const currentGroup = useMemo(
    () => groups?.find((group) => group.page === activePage) ?? groups?.[0] ?? null,
    [groups, activePage],
  );

  useEffect(() => {
    if (!currentGroup) return;
    setPreviewSrc(currentGroup.href);
    setActiveSlot(null);
  }, [currentGroup?.page, currentGroup?.href]);

  function setStatus(slotKey: string, status: SlotStatus) {
    setStatuses((prev) => ({ ...prev, [slotKey]: status }));
  }

  function jumpToSlot(slot: Slot) {
    setActiveSlot(slot.key);
    const next = slot.anchor ? `${slot.href}#${slot.anchor}` : slot.href;
    setPreviewSrc(next);
    const frame = frameRef.current;
    if (!frame?.contentWindow || !slot.anchor) return;
    try {
      frame.contentWindow.document.getElementById(slot.anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      /* cross-origin during first paint is ignored */
    }
  }

  function onFrameLoad() {
    const slot = currentGroup?.slots.find((item) => item.key === activeSlot);
    if (!slot?.anchor) return;
    const frame = frameRef.current;
    if (!frame?.contentWindow) return;
    try {
      frame.contentWindow.document.getElementById(slot.anchor)?.scrollIntoView({ block: "start" });
    } catch {
      /* ignore */
    }
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
      const frame = frameRef.current;
      if (frame) frame.src = frame.src;
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
      const frame = frameRef.current;
      if (frame) frame.src = frame.src;
    } catch {
      setStatus(slotKey, { kind: "error", message: "No se pudo conectar con el servidor." });
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-zh-cream">Imágenes por sección</h1>
        <p className="text-sm text-zh-muted">
          Cada interruptor abre una página de la firma. La vista de la derecha es el sitio real a
          tamaño de escritorio, reducido — no se adapta a móvil. Elige una sección para saltar a esa
          imagen y sustituirla.
        </p>
      </div>

      {loadError ? (
        <p role="alert" className="text-sm text-[#e07a7a]">
          {loadError}
        </p>
      ) : null}

      {groups === null && !loadError ? <p className="text-sm text-zh-muted">Cargando…</p> : null}

      {groups ? (
        <div className="zh-admin-page-switch" role="tablist" aria-label="Páginas del sitio">
          {groups.map((group) => (
            <button
              key={group.page}
              type="button"
              role="tab"
              aria-selected={group.page === currentGroup?.page}
              className={`zh-admin-page-chip${group.page === currentGroup?.page ? " is-on" : ""}`}
              onClick={() => setActivePage(group.page)}
            >
              {group.page}
            </button>
          ))}
        </div>
      ) : null}

      {currentGroup ? (
        <div className="zh-admin-image-board">
          <div className="zh-admin-preview-col">
            <p className="zh-admin-preview-label">
              Vista de escritorio · {DESKTOP_W}px · {Math.round(PREVIEW_SCALE * 100)}%
            </p>
            <div
              className="zh-admin-preview-stage"
              style={{
                width: DESKTOP_W * PREVIEW_SCALE,
                height: 900 * PREVIEW_SCALE,
              }}
            >
              <iframe
                ref={frameRef}
                title={`Vista de ${currentGroup.page}`}
                src={previewSrc}
                onLoad={onFrameLoad}
                className="zh-admin-preview-frame"
                style={{
                  width: DESKTOP_W,
                  height: DESKTOP_H,
                  transform: `scale(${PREVIEW_SCALE})`,
                }}
              />
            </div>
          </div>

          <div className="zh-admin-slot-col">
            {currentGroup.slots.map((slot) => {
              const status = statuses[slot.key] ?? { kind: "idle" };
              const preview = slot.imageUrl || slot.fallback;
              const missingUpload = !slot.imageUrl;
              return (
                <div
                  key={slot.key}
                  className={`zh-admin-slot-row${activeSlot === slot.key ? " is-on" : ""}`}
                >
                  <button type="button" className="zh-admin-slot-jump" onClick={() => jumpToSlot(slot)}>
                    <span className="zh-admin-slot-thumb">
                      {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                        <img src={preview} alt="" />
                      ) : (
                        <span>Sin imagen</span>
                      )}
                    </span>
                    <span className="zh-admin-slot-copy">
                      <strong>{slot.label}</strong>
                      <em>
                        {slot.recommendedWidth}×{slot.recommendedHeight}px
                        {missingUpload ? " · usando predeterminada" : " · imagen del admin"}
                      </em>
                    </span>
                  </button>

                  <div className="zh-admin-slot-actions">
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
                    {status.kind === "error" ? (
                      <p role="alert" className="text-xs text-[#e07a7a]">
                        {status.message}
                      </p>
                    ) : null}
                    {status.kind === "ok" ? <p className="text-xs text-[#4fd3a8]">Guardado.</p> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
