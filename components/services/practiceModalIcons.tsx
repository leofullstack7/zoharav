const icons = [
  <svg key="chart" viewBox="0 0 24 24" aria-hidden>
    <path
      d="M4 19V5M4 19h16M8 17V11M12 17V7M16 17v-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>,
  <svg key="shield" viewBox="0 0 24 24" aria-hidden>
    <path
      d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M9.5 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  <svg key="compass" viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14.5 9.5L13 15l-5.5-1.5L13 9l1.5.5z" fill="currentColor" opacity="0.9" />
  </svg>,
  <svg key="spark" viewBox="0 0 24 24" aria-hidden>
    <path
      d="M12 3l1.2 4.5L17.5 9l-4.8 1.5L12 15l-1.2-4.5L6.5 9l4.8-1.5L12 3z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M5 20h3M19 20h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
];

export function practiceBulletIcon(index: number) {
  return icons[index % icons.length];
}

export function PracticeModalAccent() {
  return (
    <svg className="svc-studio-accent" viewBox="0 0 120 24" aria-hidden>
      <path d="M0 12h88" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <circle cx="100" cy="12" r="3" fill="currentColor" />
      <circle cx="112" cy="12" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}