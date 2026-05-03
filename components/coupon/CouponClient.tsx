'use client';

import { useLocale } from '@/lib/i18n/LocaleProvider';
import { SITE } from '@/lib/site';

function formatYen(value: number, locale: string) {
  return new Intl.NumberFormat(
    locale === 'ja' ? 'ja-JP' : locale === 'zh' ? 'zh-CN' : 'en-US',
    { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 },
  ).format(value);
}

export function CouponView() {
  const { t, locale } = useLocale();
  const threshold = formatYen(SITE.coupon.thresholdJpy, locale);
  const discount = formatYen(SITE.coupon.discountJpy, locale);

  return (
    <article>
      <header>
        <h1 className="font-serif text-[26px] font-bold text-neutral-900 sm:text-[32px]">
          {t.coupon.title}
        </h1>
      </header>

      <section className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-accent p-7 text-white shadow-xl">
        <div className="text-[12px] font-bold uppercase tracking-[0.2em] opacity-80">COUPON</div>
        <div className="mt-2 text-[22px] font-bold leading-snug sm:text-[26px]">
          {t.coupon.rule(threshold, discount)}
        </div>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[12px] backdrop-blur">
          🎟️ Member Coupon
        </div>
      </section>

      <p className="mt-5 text-[12px] leading-[1.8] text-neutral-500">{t.coupon.note}</p>

      <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
        <h2 className="text-[16px] font-bold text-neutral-900">ご利用方法</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-[13px] leading-[1.8] text-neutral-700">
          <li>ご来店時、スタッフにお名前をお伝えください。</li>
          <li>お会計時にスタンプを押し、累計金額を記録します。</li>
          <li>累計 {threshold} に達した次回のお会計から {discount} 割引が適用されます。</li>
          <li>他クーポン・サービスとの併用はできません。</li>
        </ol>
      </section>
    </article>
  );
}
