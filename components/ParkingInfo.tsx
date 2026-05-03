'use client';

import { SITE } from '@/lib/site';
import { useLocale } from '@/lib/i18n/LocaleProvider';

interface ParkingInfoProps {
  className?: string;
  /** Show only the top N parkings (e.g. on the home preview). */
  limit?: number;
  /** When true, append a "View more" link to the dedicated /access page. */
  showMoreLink?: boolean;
}

export function ParkingInfo({ className = '', limit, showMoreLink = false }: ParkingInfoProps) {
  const { t } = useLocale();
  const list = limit ? SITE.parking.nearby.slice(0, limit) : SITE.parking.nearby;

  return (
    <div className={`rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 ${className}`}>
      <div className="flex items-start gap-3">
        <div aria-hidden className="text-[22px] leading-none">🅿️</div>
        <div className="flex-1">
          <p className="text-[13px] leading-[1.7] text-amber-900">
            {t.home.parkingNoneNote}
          </p>
        </div>
      </div>
      <ul className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {list.map((p) => (
          <li
            key={p.name}
            className="rounded-lg bg-white border border-neutral-200 px-3 py-2.5 text-[12px] text-neutral-700"
          >
            <div className="font-bold text-neutral-800 leading-tight truncate" title={p.name}>
              {p.name}
            </div>
            <div className="mt-1 flex items-center gap-2 text-neutral-500">
              <span>{t.home.parkingWalkMin(p.walkMin)}</span>
              <span aria-hidden>·</span>
              <span>{t.home.parkingPriceJpy(p.priceJpy)}</span>
            </div>
          </li>
        ))}
      </ul>
      {showMoreLink && (
        <div className="mt-3 text-right">
          <a
            href="/access/"
            className="inline-flex items-center gap-1 text-[12px] font-bold text-brand-accent hover:underline"
          >
            {t.home.parkingViewMore} <span aria-hidden>→</span>
          </a>
        </div>
      )}
    </div>
  );
}
