'use client';

import Link from 'next/link';
import { SITE } from '@/lib/site';
import { useLocale } from '@/lib/i18n/LocaleProvider';

export function CouponBanner({ className = '' }: { className?: string }) {
  const { t, locale } = useLocale();
  const fmt = new Intl.NumberFormat(locale === 'ja' ? 'ja-JP' : locale === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  });
  const threshold = fmt.format(SITE.coupon.thresholdJpy);
  const discount = fmt.format(SITE.coupon.discountJpy);

  return (
    <Link
      href="/coupon/"
      className={`group block overflow-hidden rounded-xl bg-gradient-to-br from-brand to-brand-accent text-white shadow-lg hover:shadow-xl transition-shadow ${className}`}
    >
      <div className="flex items-center gap-4 px-5 py-5 sm:px-6 sm:py-6">
        <div aria-hidden className="text-[36px] leading-none">🎟️</div>
        <div className="flex-1">
          <div className="text-[12px] font-bold uppercase tracking-[0.15em] opacity-80">
            {t.home.couponSub}
          </div>
          <div className="mt-1 text-[16px] sm:text-[18px] font-bold leading-snug">
            {t.coupon.rule(threshold, discount)}
          </div>
        </div>
        <div aria-hidden className="text-[20px] opacity-80 transition-transform group-hover:translate-x-1">→</div>
      </div>
    </Link>
  );
}
