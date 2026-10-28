import { query } from "@/lib/db/client";

/**
 * Admin landing page. Replaces the old `redirect("/admin/availability")`
 * with a real dashboard: accumulating revenue from effective consultations
 * (each worth a flat USD $500 session fee), a status breakdown, and a
 * compact strip of the most recent clients booked.
 *
 * Deliberately a Server Component that queries the DB directly — no extra
 * API route. Charts are hand-built inline SVG (bar chart + a proportional
 * status bar), computed here from the query results. No charting library
 * dependency is introduced. The only client-side JS on this page is none:
 * hover tooltips use native SVG <title> elements, which need no JS at all.
 *
 * Entrance animation is CSS-only (`.zh-admin-rise` in styles/admin.css):
 * the keyframe itself carries opacity 0 -> 1 and plays automatically on
 * paint, gated only by `prefers-reduced-motion` — never by a JS-toggled
 * class — so content is never left invisible if a script fails to run.
 */

export const metadata = { title: "Panel · Administración" };
export const dynamic = "force-dynamic";

const SESSION_FEE_USD = 500;
const MONTHS_BACK = 6;

const MONTH_LABELS_ES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" });

type MonthlyRow = { month: Date; effective_count: string };
type StatusRow = { bucket: "effective" | "not_realized" | "pending"; count: string };
type RecentRow = {
  id: string;
  name: string;
  topic: string | null;
  outcome: "effective" | "not_realized" | null;
  status: string;
  created_at: Date;
  starts_at: Date | null;
};
type KpiRow = {
  effective_count: string;
  deal_value_total: string | null;
  open_future_slots: string;
};

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const windowStart = new Date(now.getFullYear(), now.getMonth() - (MONTHS_BACK - 1), 1);

  const [monthlyResult, statusResult, recentResult, kpiResult] = await Promise.all([
    query<MonthlyRow>(
      `select date_trunc('month', s.starts_at) as month, count(*) as effective_count
       from bookings b
       join availability_slots s on s.id = b.slot_id
       where b.outcome = 'effective' and s.starts_at >= $1
       group by 1
       order by 1`,
      [windowStart.toISOString()],
    ),
    query<StatusRow>(
      `select
         case
           when outcome = 'effective' then 'effective'
           when outcome = 'not_realized' then 'not_realized'
           else 'pending'
         end as bucket,
         count(*) as count
       from bookings
       where status <> 'cancelled'
       group by 1`,
    ),
    query<RecentRow>(
      `select b.id, b.name, b.topic, b.outcome, b.status, b.created_at, s.starts_at
       from bookings b
       left join availability_slots s on s.id = b.slot_id
       order by b.created_at desc
       limit 8`,
    ),
    query<KpiRow>(
      `select
         (select count(*) from bookings where outcome = 'effective') as effective_count,
         (select sum(deal_value) from bookings where outcome = 'effective') as deal_value_total,
         (select count(*) from availability_slots where is_booked = false and starts_at > now()) as open_future_slots`,
    ),
  ]);

  // Build a continuous 6-month axis, filling any month with no effective
  // consultations as zero rather than skipping it.
  const monthlyByKey = new Map(monthlyResult.rows.map((row) => [monthKey(new Date(row.month)), Number(row.effective_count)]));
  const months: { label: string; count: number; revenue: number; isCurrent: boolean }[] = [];
  for (let i = MONTHS_BACK - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const count = monthlyByKey.get(monthKey(d)) ?? 0;
    months.push({
      label: MONTH_LABELS_ES[d.getMonth()],
      count,
      revenue: count * SESSION_FEE_USD,
      isCurrent: i === 0,
    });
  }

  const statusCounts = { effective: 0, not_realized: 0, pending: 0 };
  for (const row of statusResult.rows) {
    statusCounts[row.bucket] = Number(row.count);
  }
  const statusTotal = statusCounts.effective + statusCounts.not_realized + statusCounts.pending || 1;

  const kpi = kpiResult.rows[0];
  const effectiveCount = Number(kpi?.effective_count ?? 0);
  const totalRevenue = effectiveCount * SESSION_FEE_USD;
  const dealValueTotal = kpi?.deal_value_total ? Number(kpi.deal_value_total) : 0;
  const openFutureSlots = Number(kpi?.open_future_slots ?? 0);

  const maxRevenue = Math.max(...months.map((m) => m.revenue), SESSION_FEE_USD);

  // --- Bar chart geometry -------------------------------------------
  const chartWidth = 560;
  const chartHeight = 190;
  const baseline = chartHeight - 24;
  const plotTop = 18;
  const plotHeight = baseline - plotTop;
  const barGap = 14;
  const barWidth = (chartWidth - barGap * (months.length - 1)) / months.length;

  return (
    <div className="flex flex-col gap-7">
      <div className="zh-admin-rise">
        <h1 className="text-lg font-semibold text-zh-cream">Panel</h1>
        <p className="text-sm text-zh-muted">
          Ingresos por consultorías efectivas, estado de las reservas y los clientes más recientes.
        </p>
      </div>

      <div className="zh-kpi-grid">
        <div className="zh-admin-glow-card zh-kpi-tile zh-admin-rise" style={{ animationDelay: "0.03s" }}>
          <span className="zh-kpi-label">Consultorías efectivas</span>
          <span className="zh-kpi-value">{effectiveCount}</span>
          <span className="zh-kpi-sub">Histórico completo</span>
        </div>
        <div className="zh-admin-glow-card zh-kpi-tile zh-admin-rise" style={{ animationDelay: "0.06s" }}>
          <span className="zh-kpi-label">Ingresos por sesión</span>
          <span className="zh-kpi-value">{currency.format(totalRevenue)}</span>
          <span className="zh-kpi-sub">{currency.format(SESSION_FEE_USD)} por consultoría efectiva</span>
        </div>
        <div className="zh-admin-glow-card zh-kpi-tile zh-admin-rise" style={{ animationDelay: "0.09s" }}>
          <span className="zh-kpi-label">Negocios consolidados</span>
          <span className="zh-kpi-value">{compactCurrency.format(dealValueTotal)}</span>
          <span className="zh-kpi-sub">Valor adicional registrado en el CRM</span>
        </div>
        <div className="zh-admin-glow-card zh-kpi-tile zh-admin-rise" style={{ animationDelay: "0.12s" }}>
          <span className="zh-kpi-label">Turnos libres</span>
          <span className="zh-kpi-value">{openFutureSlots}</span>
          <span className="zh-kpi-sub">Disponibles a futuro</span>
        </div>
      </div>

      <div className="zh-chart-grid">
        <div className="zh-admin-glow-card zh-chart-card zh-admin-rise" style={{ animationDelay: "0.15s" }}>
          <div className="zh-chart-card-head">
            <h2>Ingresos por consultorías efectivas</h2>
            <p>Últimos {MONTHS_BACK} meses · ${SESSION_FEE_USD} por sesión</p>
          </div>
          <svg
            className="zh-bar-chart"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            role="img"
            aria-label={`Ingresos mensuales por consultorías efectivas en los últimos ${MONTHS_BACK} meses`}
          >
            <defs>
              <linearGradient id="zh-bar-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4fd3a8" />
                <stop offset="100%" stopColor="#0f6b4f" />
              </linearGradient>
            </defs>
            <line x1={0} y1={baseline} x2={chartWidth} y2={baseline} stroke="var(--zh-smoke)" strokeWidth="1" />
            {months.map((m, i) => {
              const barHeight = maxRevenue > 0 ? (m.revenue / maxRevenue) * plotHeight : 0;
              const x = i * (barWidth + barGap);
              const y = baseline - barHeight;
              const showLabel = m.isCurrent || m.revenue === maxRevenue;
              return (
                <g key={m.label + i}>
                  <rect
                    className="zh-bar"
                    x={x}
                    y={barHeight > 0 ? y : baseline - 2}
                    width={barWidth}
                    height={Math.max(barHeight, 2)}
                    rx={4}
                    fill="url(#zh-bar-fill)"
                  >
                    <title>
                      {m.label}: {m.count} consultoría{m.count === 1 ? "" : "s"} efectiva{m.count === 1 ? "" : "s"} ·{" "}
                      {currency.format(m.revenue)}
                    </title>
                  </rect>
                  {showLabel ? (
                    <text className="zh-bar-value" x={x + barWidth / 2} y={y - 8} textAnchor="middle">
                      {compactCurrency.format(m.revenue)}
                    </text>
                  ) : null}
                  <text x={x + barWidth / 2} y={baseline + 16} textAnchor="middle">
                    {m.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="zh-admin-glow-card zh-chart-card zh-admin-rise" style={{ animationDelay: "0.18s" }}>
          <div className="zh-chart-card-head">
            <h2>Estado de las reservas</h2>
            <p>Reservas activas, sin cancelar</p>
          </div>
          <div className="zh-proportion-bar">
            {statusCounts.effective > 0 ? (
              <div
                className="zh-proportion-seg"
                style={{ width: `${(statusCounts.effective / statusTotal) * 100}%`, background: "#1fa37a" }}
              />
            ) : null}
            {statusCounts.not_realized > 0 ? (
              <div
                className="zh-proportion-seg"
                style={{ width: `${(statusCounts.not_realized / statusTotal) * 100}%`, background: "#e0a35c" }}
              />
            ) : null}
            {statusCounts.pending > 0 ? (
              <div
                className="zh-proportion-seg"
                style={{ width: `${(statusCounts.pending / statusTotal) * 100}%`, background: "var(--zh-gold-400)" }}
              />
            ) : null}
          </div>
          <div className="zh-status-legend">
            <div className="zh-status-legend-row">
              <span className="zh-status-legend-key">
                <span className="zh-status-dot" style={{ background: "#1fa37a" }} />
                Efectiva
              </span>
              <span className="zh-status-legend-count">{statusCounts.effective}</span>
            </div>
            <div className="zh-status-legend-row">
              <span className="zh-status-legend-key">
                <span className="zh-status-dot" style={{ background: "#e0a35c" }} />
                No se realizó
              </span>
              <span className="zh-status-legend-count">{statusCounts.not_realized}</span>
            </div>
            <div className="zh-status-legend-row">
              <span className="zh-status-legend-key">
                <span className="zh-status-dot" style={{ background: "var(--zh-gold-400)" }} />
                Pendiente / próxima
              </span>
              <span className="zh-status-legend-count">{statusCounts.pending}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="zh-admin-rise" style={{ animationDelay: "0.22s" }}>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-zh-cream">Clientes recientes</h2>
          <p className="text-xs text-zh-muted">Las últimas {recentResult.rows.length} reservas registradas.</p>
        </div>
        <div className="zh-recent-strip">
          {recentResult.rows.map((row) => (
            <div className="zh-admin-glow-card zh-recent-chip" key={row.id}>
              <span className="zh-recent-chip-name">{row.name}</span>
              <span className="zh-recent-chip-topic">{row.topic || "Consultoría"}</span>
              <span className="zh-recent-chip-date">
                {row.starts_at ? dateFormatter.format(new Date(row.starts_at)) : "Sin turno"}
              </span>
              {row.status === "cancelled" ? (
                <span className="zh-admin-badge zh-admin-badge-cancelled">Cancelada</span>
              ) : row.outcome === "effective" ? (
                <span className="zh-admin-badge zh-admin-badge-effective">Efectiva</span>
              ) : row.outcome === "not_realized" ? (
                <span className="zh-admin-badge zh-admin-badge-not-realized">No se realizó</span>
              ) : (
                <span className="zh-admin-badge zh-admin-badge-pending">Pendiente</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
