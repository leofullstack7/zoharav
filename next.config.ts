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
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default withNextIntl(nextConfig);
