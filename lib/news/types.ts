import type { Locale } from '@/lib/i18n/dictionaries';

export interface NewsTranslations {
  ja: { title: string; body: string };
  zh?: { title: string; body: string };
  en?: { title: string; body: string };
}

export interface NewsItem {
  /** URL slug — the markdown filename without extension. */
  slug: string;
  /** ISO date "YYYY-MM-DD" (parsed from frontmatter). */
  date: string;
  /** Optional category badge ("キャンペーン" / "新メニュー" / etc.). */
  tag?: string;
  /** Whether the item should be highlighted on the home page. */
  pinned: boolean;
  /** Per-locale title + body. Falls back to ja when locale is missing. */
  translations: NewsTranslations;
}

/**
 * Pure helper used by client and server alike — picks the right translation
 * (with `ja` as a guaranteed fallback). Kept in this types-only module so it
 * can be safely imported from client components without dragging in `fs`.
 */
export function localizedNews(item: NewsItem, locale: Locale): { title: string; body: string } {
  return item.translations[locale] ?? item.translations.ja;
}
