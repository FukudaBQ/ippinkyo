'use client';

import { useLocale } from '@/lib/i18n/LocaleProvider';

export function MenuIndexHeading() {
  const { t } = useLocale();
  return (
    <header className="mb-5">
      <h1 className="font-serif text-[22px] font-bold text-neutral-800">{t.menu.title}</h1>
    </header>
  );
}
