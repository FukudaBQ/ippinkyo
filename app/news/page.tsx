import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NewsCard } from '@/components/NewsCard';
import { NewsPageHeader } from '@/components/news/NewsClient';
import { loadAllNews } from '@/lib/news';

export const metadata = {
  title: 'お知らせ・新着',
  description: '逸品居 高幡不動店からのお知らせ、新メニュー、キャンペーン情報。',
};

export default function NewsListPage() {
  const news = loadAllNews();

  return (
    <>
      <Header />
      <main id="main" className="pt-[72px] sm:pt-[80px]">
        <div className="mx-auto max-w-section px-5 py-10 sm:py-14">
          <NewsPageHeader />

          {news.length === 0 ? (
            <p className="mt-8 rounded-lg border border-dashed border-neutral-300 bg-white px-5 py-10 text-center text-[13px] text-neutral-500">
              現在お知らせはありません。
            </p>
          ) : (
            <ul className="mt-8 space-y-3">
              {news.map((n) => (
                <li key={n.slug}>
                  <NewsCard item={n} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
