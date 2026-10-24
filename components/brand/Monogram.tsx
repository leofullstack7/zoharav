import { useId } from "react";

export function Monogram({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 72 72" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6D7886" />
          <stop offset="38%" stopColor="#D5E0EA" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#B7C4D4" />
          <stop offset="100%" stopColor="#8D9BAB" />
        </linearGradient>
      </defs>
      <circle cx="36" cy="36" r="34" fill="none" stroke={`url(#${id})`} strokeWidth="0.6" />
      <path
        d="M18 22h36L22 50h32"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="1.6"
        strokeLinejoin="miter"
      />
      <path
        d="M46 18c10 4 14 12 14 18s-4 14-14 18"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}
