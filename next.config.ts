import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** 301s from the previous Shopify URLs. */
const legacyRedirects: [string, string][] = [
  ["/pages/energy-transition", "/services/energy-transition"],
  ["/pages/financial-advisory", "/services/investment-financial-advisory"],
  ["/pages/strategic-consulting", "/services/strategic-operational-consulting"],
  ["/pages/operational-efficiency", "/services/strategic-operational-consulting"],
  ["/pages/cybersecurity", "/services"],
  ["/pages/data-ai", "/services"],
  ["/pages/our-company", "/about"],
  ["/pages/contact", "/contact"],
  ["/pages/consulting-advisory", "/booking"],
  ["/products/consulting-session-zoharav-advisory", "/booking"],
  ["/pages/privacy-policy", "/legal/privacy"],
  ["/pages/terms-of-services", "/legal/terms"],
  ["/pages/refund-policy", "/legal/refund"],
  ["/pages/damage-policy", "/legal/damage"],
  ["/pages/help", "/faq"],
];

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    // The editorial image system is hand-built local SVG (no user-supplied
    // or remote SVG is ever served here), so it's safe to let next/image
    // pass them through with the standard SVG-safety headers applied.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Admin-uploaded images (lib/images/getSiteImage.ts) are served from the
    // public "site-images" Supabase Storage bucket, created in
    // scripts/migrate-site-images.ts — next/image needs the host allow-listed
    // to optimize/serve them. Any Supabase project's public Storage URL
    // matches this pattern, not just the current project ref.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
