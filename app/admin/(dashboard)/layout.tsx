import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

/**
 * Shared chrome for every authenticated /admin page (everything except
 * /admin/login, which lives outside this route group on purpose so it
 * never shows this nav). The route group `(dashboard)` doesn't affect the
 * URL: this still serves /admin, /admin/availability, /admin/bookings and
 * /admin/settings.
 */
export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-zh-smoke pb-5">
        <div>
          <p className="text-sm font-semibold text-zh-cream">ZOHARAV &amp; CO.</p>
          <p className="text-xs text-zh-muted">Panel de administración</p>
        </div>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/admin" className="zh-admin-btn-ghost">
            Dashboard
          </Link>
          <Link href="/admin/availability" className="zh-admin-btn-ghost">
            Disponibilidad
          </Link>
          <Link href="/admin/bookings" className="zh-admin-btn-ghost">
            Reservas · CRM
          </Link>
          <Link href="/admin/images" className="zh-admin-btn-ghost">
            Imágenes
          </Link>
          <Link href="/admin/settings" className="zh-admin-btn-ghost">
            Configuración
          </Link>
          <LogoutButton />
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
