import type { Metadata } from "next";
import "@/styles/admin.css";

/**
 * Root layout for the standalone /admin tool. Lives outside app/[locale]/
 * on purpose: this is an internal, Spanish-only dashboard, not part of the
 * bilingual public marketing site, so it gets its own <html>/<body> (there
 * is no app/layout.tsx shared root — app/[locale]/layout.tsx plays that role
 * for the public site, this plays it for /admin) and its own minimal
 * stylesheet (styles/admin.css) instead of the full marketing styles/globals.css.
 */

export const metadata: Metadata = {
  title: "Panel de administración · ZOHARAV & CO.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
