import type { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/categories';
import { loadAllNews } from '@/lib/news';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, '');

  const staticEntries: MetadataRoute.Sitemap = [
    '/',
    '/menu/',
    '/menu/all-you-can-eat/',
    '/menu/course/',
    '/menu/drink-set/',
    '/menu/set-meal/',
    '/menu/small-plate/',
    '/news/',
    '/access/',
    '/coupon/',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1.0 : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES
    .filter((c) => c.group === 'menu')
    .map((c) => ({
      url: `${base}/menu/${c.id}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  const newsEntries: MetadataRoute.Sitemap = loadAllNews().map((n) => ({
    url: `${base}/news/${n.slug}/`,
    lastModified: new Date(n.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...categoryEntries, ...newsEntries];
}
