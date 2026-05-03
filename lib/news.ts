/**
 * Server-only news loader. Reads markdown files from `document/news/`,
 * parses YAML-lite frontmatter and a `## :ja` / `## :zh` / `## :en` section
 * layout into structured {@link NewsItem} objects.
 *
 * Client components must import types from `lib/news/types.ts` to avoid
 * pulling `node:fs` into the browser bundle.
 */
import 'server-only';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { NewsItem, NewsTranslations } from './news/types';

export type { NewsItem, NewsTranslations } from './news/types';
export { localizedNews } from './news/types';

const NEWS_ROOT = path.join(process.cwd(), 'document', 'news');

interface RawFrontmatter {
  date?: string;
  tag?: string;
  pinned?: boolean;
  title_ja?: string;
  title_zh?: string;
  title_en?: string;
}

function parseFrontmatter(src: string): { meta: RawFrontmatter; body: string } {
  const m = src.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  const fmBlock = m?.[1];
  const body = m?.[2];
  if (!m || fmBlock === undefined || body === undefined) {
    return { meta: {}, body: src };
  }

  const meta: RawFrontmatter = {};
  for (const line of fmBlock.split('\n')) {
    const kv = line.match(/^\s*([a-z_]+)\s*:\s*(.+?)\s*$/i);
    const rawKey = kv?.[1];
    const rawVal = kv?.[2];
    if (!kv || rawKey === undefined || rawVal === undefined) continue;
    const key = rawKey as keyof RawFrontmatter;
    const value = rawVal.replace(/^["']|["']$/g, '');
    if (key === 'pinned') {
      (meta as Record<string, unknown>)[key] = value === 'true';
    } else {
      (meta as Record<string, unknown>)[key] = value;
    }
  }
  return { meta, body };
}

interface BodySections {
  ja: string;
  zh?: string;
  en?: string;
}

/**
 * Split a markdown body into per-locale sections delimited by `## :ja` /
 * `## :zh` / `## :en` headings. The Japanese section is mandatory; others
 * default to it.
 */
function splitBodyByLocale(body: string): BodySections {
  const sections: BodySections = { ja: '' };
  const re = /^##\s*:(ja|zh|en)\s*$/gm;
  const indexes: { loc: keyof BodySections; start: number; end: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) {
    const loc = match[1];
    if (loc !== 'ja' && loc !== 'zh' && loc !== 'en') continue;
    indexes.push({
      loc,
      start: match.index + match[0].length,
      end: -1,
    });
  }
  if (indexes.length === 0) {
    sections.ja = body.trim();
    return sections;
  }
  for (let i = 0; i < indexes.length; i += 1) {
    const cur = indexes[i]!;
    const next = indexes[i + 1];
    cur.end = next ? next.start - `## :${next.loc}`.length : body.length;
  }
  for (const sec of indexes) {
    sections[sec.loc] = body.slice(sec.start, sec.end).trim();
  }
  return sections;
}

function buildItem(slug: string, raw: string): NewsItem {
  const { meta, body } = parseFrontmatter(raw);
  const sections = splitBodyByLocale(body);

  const titleJa = meta.title_ja ?? slug;

  const translations: NewsTranslations = {
    ja: { title: titleJa, body: sections.ja },
  };
  if (meta.title_zh || sections.zh) {
    translations.zh = { title: meta.title_zh ?? titleJa, body: sections.zh ?? sections.ja };
  }
  if (meta.title_en || sections.en) {
    translations.en = { title: meta.title_en ?? titleJa, body: sections.en ?? sections.ja };
  }

  return {
    slug,
    date: meta.date ?? '1970-01-01',
    tag: meta.tag,
    pinned: meta.pinned ?? false,
    translations,
  };
}

function safeReaddir(): string[] {
  try {
    return readdirSync(NEWS_ROOT);
  } catch {
    return [];
  }
}

/** Load all news items, sorted newest-first. */
export function loadAllNews(): NewsItem[] {
  return safeReaddir()
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = readFileSync(path.join(NEWS_ROOT, file), 'utf-8');
      return buildItem(slug, raw);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function loadNewsBySlug(slug: string): NewsItem | null {
  const all = loadAllNews();
  return all.find((n) => n.slug === slug) ?? null;
}
