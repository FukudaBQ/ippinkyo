'use client';

import { useEffect, useState } from 'react';
import { getOpenStatus, type OpenStatus } from '@/lib/businessHours';
import { useLocale } from '@/lib/i18n/LocaleProvider';

interface StatusBadgeProps {
  /** Tailwind className for size/positioning customization. */
  className?: string;
}

/**
 * Live "営業中 / 営業時間外" pill. We compute status with the user's local
 * clock client-side; SSR shows the value at build time which is acceptable
 * because the pill mounts very fast.
 */
export function StatusBadge({ className = '' }: StatusBadgeProps) {
  const { t } = useLocale();
  const [status, setStatus] = useState<OpenStatus>(() => getOpenStatus());

  useEffect(() => {
    const tick = () => setStatus(getOpenStatus());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const isOpen = status.state === 'open';
  const dotColor = isOpen ? 'bg-emerald-400' : 'bg-neutral-400';
  const textColor = isOpen ? 'text-emerald-50' : 'text-neutral-200';
  const bgColor = isOpen ? 'bg-emerald-700/85' : 'bg-neutral-700/85';

  let detail = '';
  if (status.state === 'open') {
    detail = t.status.closesAt(status.closesAt);
  } else if (status.reopensOn === 'today' && status.reopensAt) {
    detail = t.status.reopensAtToday(status.reopensAt);
  } else if (status.reopensOn === 'next' && status.reopensAt) {
    detail = t.status.reopensNext(status.reopensAt);
  } else {
    detail = t.status.closedToday;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur ${bgColor} ${textColor} ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className={`relative flex h-2 w-2`}>
        {isOpen && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dotColor} opacity-60`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dotColor}`} />
      </span>
      <span className="font-bold">{isOpen ? t.status.open : t.status.closed}</span>
      <span className="opacity-90">· {detail}</span>
    </span>
  );
}
