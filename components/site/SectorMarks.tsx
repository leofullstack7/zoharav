import type { SectorId } from "@/content/types";

/**
 * One small hand-drawn line glyph per sector — the "abstract mark" the
 * redesign brief calls for on each Sectors spotlight card in place of a
 * photo per sector (no dedicated sector photography exists; see the note
 * in app/[locale]/(site)/sectors/page.tsx). Plain stroked SVG, no fill,
 * inherits `currentColor` so a single CSS rule on `.sector-slide` controls
 * the resting tone and the hover brightening — no per-icon color logic.
 */
export function SectorMark({ id, className }: { id: SectorId; className?: string }) {
  const common = {
    className: className ? `sector-slide-mark ${className}` : "sector-slide-mark",
    width: 40,
    height: 40,
    viewBox: "0 0 40 40",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "energy-utilities":
      return (
        <svg {...common}>
          <path d="M22 4 10 22h8l-2 14 14-20h-9l1-12Z" />
        </svg>
      );
    case "oil-gas":
      return (
        <svg {...common}>
          <path d="M20 5c6 7 9 12 9 17a9 9 0 1 1-18 0c0-5 3-10 9-17Z" />
          <path d="M20 17c2.5 2.8 3.6 4.9 3.6 7a3.6 3.6 0 1 1-7.2 0" />
        </svg>
      );
    case "mining":
      return (
        <svg {...common}>
          <path d="M20 5 33 14 28 34H12L7 14Z" />
          <path d="M7 14h26M20 5v29M14 14l6 20 6-20" />
        </svg>
      );
    case "manufacturing":
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="6.5" />
          <path d="M20 8v3M20 29v3M8 20h3M29 20h3M11.5 11.5l2 2M26.5 26.5l2 2M28.5 11.5l-2 2M13.5 26.5l-2 2" />
        </svg>
      );
    case "logistics":
      return (
        <svg {...common}>
          <path d="M5 13h17v14H5z" />
          <path d="M22 18h7l5 5v4h-5" />
          <circle cx="12" cy="29" r="2.6" />
          <circle cx="27" cy="29" r="2.6" />
        </svg>
      );
    case "agriculture":
      return (
        <svg {...common}>
          <path d="M20 34V13" />
          <path d="M20 13c0-6-5-9-10-9 0 6 4 10 10 9Z" />
          <path d="M20 19c0-5 5-8 10-8 0 5-4 9-10 8Z" />
        </svg>
      );
    case "financial":
      return (
        <svg {...common}>
          <path d="M6 30 15 19l6 5 13-15" />
          <path d="M28 9h6v6" />
        </svg>
      );
    case "public-sector":
    default:
      return (
        <svg {...common}>
          <path d="M20 5 35 13H5Z" />
          <path d="M8 16v13M16 16v13M24 16v13M32 16v13M5 33h30" />
        </svg>
      );
  }
}
