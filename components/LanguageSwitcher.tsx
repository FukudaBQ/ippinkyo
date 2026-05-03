'use client';

import { useEffect, useRef, useState } from 'react';
import { LOCALES, LOCALE_LABELS, type Locale } from '@/lib/i18n/dictionaries';
import { useLocale } from '@/lib/i18n/LocaleProvider';

interface LanguageSwitcherProps {
  className?: string;
  /** Visual style: bright (over dark hero) or muted (over white). */
  variant?: 'light' | 'dark';
}

export function LanguageSwitcher({ className = '', variant = 'dark' }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [open]);

  const buttonStyle =
    variant === 'light'
      ? 'bg-white/15 border border-white/30 text-white hover:bg-white/25'
      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50';

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.langSwitcher.label}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors ${buttonStyle}`}
      >
        <span aria-hidden>🌐</span>
        <span>{LOCALE_LABELS[locale]}</span>
        <span aria-hidden className="text-[9px] opacity-70">▾</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-1.5 min-w-[120px] overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg"
        >
          {LOCALES.map((loc: Locale) => (
            <li key={loc}>
              <button
                type="button"
                role="option"
                aria-selected={loc === locale}
                onClick={() => {
                  setLocale(loc);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-[12px] transition-colors ${
                  loc === locale
                    ? 'bg-brand/10 font-bold text-brand'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {LOCALE_LABELS[loc]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
