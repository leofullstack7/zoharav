import Link from "next/link";

/**
 * Fallback for an invalid `locale` segment (e.g. /fr/anything). The normal 404 lives at
 * app/[locale]/(site)/not-found.tsx; this one only fires before that layout tree can
 * render, so it supplies its own <html>/<body> and stays locale-agnostic (bilingual).
 * Uses plain next/link (not @/i18n/navigation) since there is no valid locale here.
 */
export default function InvalidLocaleNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07070a",
          color: "#e7edf3",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <p style={{ letterSpacing: "0.18em", fontSize: "0.8rem", color: "#9aa3ae" }}>404</p>
          <h1 style={{ fontSize: "1.6rem", margin: "0.6rem 0" }}>
            Page not found / Página no encontrada
          </h1>
          <p style={{ color: "#9aa3ae", marginBottom: "1.4rem" }}>
            ZOHARAV &amp; CO.
          </p>
          <p>
            <Link href="/" style={{ color: "#d5dee8", marginRight: "1.2rem" }}>
              English →
            </Link>
            <Link href="/es" style={{ color: "#d5dee8" }}>
              Español →
            </Link>
          </p>
        </div>
      </body>
    </html>
  );
}
