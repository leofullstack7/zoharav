"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.error || "Credenciales inválidas.");
        setSubmitting(false);
        return;
      }

      const next = searchParams.get("next");
      router.push(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="zh-admin-card w-full max-w-sm p-8">
        <h1 className="mb-1 text-lg font-semibold text-zh-cream">ZOHARAV &amp; CO.</h1>
        <p className="mb-6 text-sm text-zh-muted">Panel de administración</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-xs text-zh-muted">
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="zh-admin-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-xs text-zh-muted">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="zh-admin-input"
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm text-[#e07a7a]">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={submitting} className="zh-admin-btn mt-2">
            {submitting ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
