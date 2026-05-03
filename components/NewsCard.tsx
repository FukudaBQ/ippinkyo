'use client';

import Link from 'next/link';
import type { NewsItem } from '@/lib/news/types';
import { localizedNews } from '@/lib/news/types';
import { useLocale } from '@/lib/i18n/LocaleProvider';

interface NewsCardProps {
  item: NewsItem;
  /** Use a denser layout on the homepage list. */
  compact?: boolean;
}

function formatDate(iso: string, locale: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat(
      locale === 'ja' ? 'ja-JP' : locale === 'zh' ? 'zh-CN' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' },
    ).format(d);
  } catch {
    return iso;
  }
}

export function NewsCard({ item, compact = false }: NewsCardProps) {
  const { locale } = useLocale();
  const tx = localizedNews(item, locale);
  const date = formatDate(item.date, locale);

  return (
    <Link
      href={`/news/${item.slug}/`}
      className={`group block rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-brand-accent/40 ${compact ? '' : 'h-full'}`}
    >
      <div className="flex items-center gap-2 text-[11px] text-neutral-500">
        <time dateTime={item.date} className="tracking-wide">{date}</time>
        {item.tag && (
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
            {item.tag}
          </span>
        )}
        {item.pinned && (
          <span aria-label="pinned" className="text-[10px] text-amber-600">📌</span>
        )}
      </div>
      <h3 className="mt-2 text-[14px] sm:text-[15px] font-bold text-neutral-800 leading-snug group-hover:text-brand-accent transition-colors">
        {tx.title}
      </h3>
      {!compact && tx.body && (
        <p className="mt-2 text-[12px] text-neutral-500 leading-[1.7] line-clamp-2">
          {tx.body.replace(/[#*_>`-]/g, '').slice(0, 120)}
        </p>
      )}
    </Link>
  );
}
