'use client';

import { SITE } from '@/lib/site';
import { useLocale } from '@/lib/i18n/LocaleProvider';

interface CTAItem {
  href: string;
  icon: string;
  label: string;
  hint?: string;
  /** Visual accent color (Tailwind classes). */
  tone: 'brand' | 'orange' | 'green' | 'neutral';
  external?: boolean;
}

const TONE_STYLES: Record<CTAItem['tone'], string> = {
  brand: 'bg-brand text-white hover:bg-brand-light',
  orange: 'bg-[#FF6F00] text-white hover:bg-[#E65100]',
  green: 'bg-[#06C755] text-white hover:bg-[#05a847]', // LINE green
  neutral: 'bg-neutral-800 text-white hover:bg-neutral-700',
};

/**
 * The combined reservation call-to-action block. Phone, Tabelog, HotPepper,
 * LINE — all routed via well-known external URLs configured in `lib/site.ts`.
 */
export function ReservationCTA({ className = '' }: { className?: string }) {
  const { t } = useLocale();

  const items: CTAItem[] = [
    {
      href: SITE.tel.href,
      icon: '☎',
      label: t.reservation.callNow,
      hint: SITE.tel.display,
      tone: 'brand',
    },
    {
      href: SITE.reservation.tabelog,
      icon: '🍽️',
      label: t.reservation.tabelog,
      hint: 'tabelog.com',
      tone: 'neutral',
      external: true,
    },
    {
      href: SITE.reservation.hotpepper,
      icon: '🌶️',
      label: t.reservation.hotpepper,
      hint: 'hotpepper.jp',
      tone: 'orange',
      external: true,
    },
    {
      href: SITE.social.line,
      icon: '💬',
      label: t.reservation.line,
      hint: t.reservation.lineHint,
      tone: 'green',
      external: true,
    },
  ];

  return (
    <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
      {items.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            className={`flex items-center gap-3 rounded-lg px-4 py-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${TONE_STYLES[item.tone]}`}
          >
            <span aria-hidden className="text-[22px]">{item.icon}</span>
            <span className="flex-1">
              <span className="block text-[14px] font-bold leading-tight">{item.label}</span>
              {item.hint && (
                <span className="block text-[11px] opacity-80 mt-0.5">{item.hint}</span>
              )}
            </span>
            <span aria-hidden className="text-[14px] opacity-70">→</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
