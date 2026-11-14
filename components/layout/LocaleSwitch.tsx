"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { localeShort } from "@/lib/i18n/locale";

type Props = {
  locale: string;
  className?: string;
  onNavigate?: () => void;
};

export function LocaleSwitch({ locale, className, onNavigate }: Props) {
  const pathname = usePathname();
  const current = locale as AppLocale;

  return (
    <div className={className ?? "lang-switch"} role="group" aria-label="Language">
      {routing.locales.map((code) => {
        const active = code === current;
        return (
          <Link
            key={code}
            href={pathname}
            locale={code}
            className={active ? "is-active" : undefined}
            aria-current={active ? "true" : undefined}
            onClick={onNavigate}
          >
            {localeShort[code]}
          </Link>
        );
      })}
    </div>
  );
}