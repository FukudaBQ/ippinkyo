'use client';

import { SITE } from '@/lib/site';
import { useLocale } from '@/lib/i18n/LocaleProvider';

export function PaymentMethods({ className = '' }: { className?: string }) {
  const { t } = useLocale();

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {SITE.payments.map((p) => (
        <li
          key={p.id}
          className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[12px] font-medium text-neutral-700 shadow-sm"
        >
          <span aria-hidden className="text-[14px]">{p.icon}</span>
          <span>{t.payments[p.id]}</span>
        </li>
      ))}
    </ul>
  );
}
