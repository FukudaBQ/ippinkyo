'use client';

import { SITE } from '@/lib/site';
import { useLocale } from '@/lib/i18n/LocaleProvider';

interface DeliveryItem {
  href: string;
  label: string;
  bg: string;
  fg: string;
}

export function DeliveryCTA({ className = '' }: { className?: string }) {
  const { t } = useLocale();

  const items: DeliveryItem[] = [
    { href: SITE.delivery.uberEats, label: t.delivery.uberEats, bg: 'bg-black', fg: 'text-[#06C167]' },
    { href: SITE.delivery.wolt, label: t.delivery.wolt, bg: 'bg-[#00C2E8]', fg: 'text-white' },
    { href: SITE.delivery.demaekan, label: t.delivery.demaekan, bg: 'bg-[#E94A2C]', fg: 'text-white' },
  ];

  return (
    <ul className={`grid grid-cols-3 gap-2 sm:gap-3 ${className}`}>
      {items.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center rounded-lg px-3 py-3.5 text-[13px] font-bold transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md ${item.bg} ${item.fg}`}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
