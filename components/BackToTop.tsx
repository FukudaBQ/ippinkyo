'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/lib/i18n/LocaleProvider';

export function BackToTop() {
  const { t } = useLocale();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t.menu.backToTop}
      className="fixed bottom-5 right-5 z-40 h-11 w-11 rounded-full bg-brand text-white shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
    >
      <span aria-hidden className="text-[16px]">↑</span>
    </button>
  );
}
