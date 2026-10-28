"use client";

import { useEffect, useState } from "react";

/**
 * "El admin debe poder escribir de qué forma quiere que se llame [el bot]."
 *
 * Prefills from the existing public `GET /api/bot-settings` (Nova's,
 * read-only here, untouched) and saves through the admin-only
 * `PUT /api/admin/bot-settings`, which upserts the same `bot_settings` row
 * the public GET reads — so a save here takes effect for the chat widget
 * immediately, no other change needed.
 */
export default function SettingsPage() {
  const [botName, setBotName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/bot-settings");
        const data = await response.json().catch(() => ({}));
        if (!cancelled) setBotName(data?.botName || "");
      } catch {
        if (!cancelled) setError("No se pudo cargar el nombre actual del bot.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSavedAt(null);

    const trimmed = botName.trim();
    if (!trimmed) {
      setError("El nombre no puede estar vacío.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/bot-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botName: trimmed }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || "No se pudo guardar.");
        setSaving(false);
        return;
      }
      setBotName(data.botName);
      setSavedAt(Date.now());
      setSaving(false);
    } catch {
      setError("No se pudo conectar con el servidor.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-zh-cream">Configuración</h1>
        <p className="text-sm text-zh-muted">
          Elige cómo quieres que se llame el asistente del chat en el sitio público.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="zh-admin-card flex max-w-md flex-col gap-3 p-5">
        <label htmlFor="bot-name" className="text-xs text-zh-muted">
          Nombre del bot
        </label>
        <input
          id="bot-name"
          type="text"
          maxLength={80}
          value={botName}
          onChange={(e) => setBotName(e.target.value)}
          disabled={loading}
          className="zh-admin-input"
        />

        {error ? (
          <p role="alert" className="text-sm text-[#e07a7a]">
            {error}
          </p>
        ) : null}
        {savedAt ? <p className="text-sm text-[#4fd3a8]">Guardado.</p> : null}

        <button type="submit" disabled={loading || saving} className="zh-admin-btn self-start">
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </form>
    </div>
  );
}
