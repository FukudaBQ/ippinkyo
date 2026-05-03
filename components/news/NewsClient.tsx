'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import type { NewsItem } from '@/lib/news/types';
import { localizedNews } from '@/lib/news/types';

export function NewsPageHeader() {
  const { t } = useLocale();
  return (
    <header>
      <h1 className="font-serif text-[26px] font-bold text-neutral-900 sm:text-[32px]">
        {t.news.title}
      </h1>
      <p className="mt-2 text-[13px] text-neutral-500">{t.news.description}</p>
    </header>
  );
}

interface NewsArticleProps {
  item: NewsItem;
}

function formatDate(iso: string, locale: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat(
      locale === 'ja' ? 'ja-JP' : locale === 'zh' ? 'zh-CN' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' },
    ).format(d);
  } catch {
    return iso;
  }
}

/**
 * Render a single news article. We intentionally keep markdown rendering
 * minimal (paragraph + simple emphasis) to avoid pulling in a large dep
 * for what is essentially short announcements.
 */
export function NewsArticle({ item }: NewsArticleProps) {
  const { locale, t } = useLocale();
  const tx = localizedNews(item, locale);
  const date = formatDate(item.date, locale);

  return (
    <article>
      <Link
        href="/news/"
        className="inline-flex items-center gap-1 text-[12px] text-neutral-500 hover:text-brand-accent"
      >
        ← {t.news.backToList}
      </Link>

      <header className="mt-4">
        <div className="flex items-center gap-2 text-[12px] text-neutral-500">
          <time dateTime={item.date}>{date}</time>
          {item.tag && (
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
              {item.tag}
            </span>
          )}
        </div>
        <h1 className="mt-3 font-serif text-[24px] font-bold text-neutral-900 leading-snug sm:text-[30px]">
          {tx.title}
        </h1>
      </header>

      <div className="prose prose-sm prose-neutral mt-6 max-w-none text-[14px] leading-[1.9] text-neutral-700">
        {renderSimpleMarkdown(tx.body)}
      </div>
    </article>
  );
}

/**
 * Tiny markdown renderer: paragraphs (blank-line separated), bullet lists
 * starting with "- ", and **bold** spans. Good enough for short news posts;
 * gives us a zero-dependency build.
 */
function renderSimpleMarkdown(src: string): React.ReactNode {
  const blocks = src.split(/\n{2,}/);
  return blocks.map((block, i) => {
    const lines = block.split('\n').filter(Boolean);
    if (lines.every((l) => l.trim().startsWith('- '))) {
      return (
        <ul key={i} className="my-3 list-disc pl-6">
          {lines.map((line, j) => (
            <li key={j} className="my-1">{renderInline(line.replace(/^-\s+/, ''))}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="my-3">
        {lines.map((line, j) => (
          <span key={j}>
            {renderInline(line)}
            {j < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={i} className="font-bold text-neutral-900">{p.slice(2, -2)}</strong>;
    }
    return <span key={i}>{p}</span>;
  });
}
