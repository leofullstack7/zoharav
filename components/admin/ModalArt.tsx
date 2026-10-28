import { useId } from "react";

/**
 * Decorative corner motif for the CRM booking modal
 * (components/admin/BookingDetailModal.tsx). Same hand-drawn, thin-stroke
 * line-art language as components/brand/Monogram.tsx — a silver gradient
 * stroke over sparse geometric paths — just arranged as an abstract corner
 * flourish rather than a mark. Purely decorative: aria-hidden, no meaning
 * conveyed through it alone.
 */
export function ModalArt({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 220 220" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6D7886" />
          <stop offset="40%" stopColor="#D5E0EA" />
          <stop offset="55%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#8D9BAB" />
        </linearGradient>
      </defs>
      <circle cx="170" cy="40" r="60" fill="none" stroke={`url(#${id}-a)`} strokeWidth="0.5" opacity="0.6" />
      <circle cx="170" cy="40" r="92" fill="none" stroke={`url(#${id}-a)`} strokeWidth="0.4" opacity="0.35" />
      <path d="M40 210 L130 40 L220 70" fill="none" stroke={`url(#${id}-a)`} strokeWidth="0.6" opacity="0.5" />
      <path d="M90 210 L160 95" fill="none" stroke={`url(#${id}-a)`} strokeWidth="0.5" opacity="0.4" />
      <circle cx="130" cy="40" r="2.4" fill="none" stroke={`url(#${id}-a)`} strokeWidth="1" />
    </svg>
  );
}
