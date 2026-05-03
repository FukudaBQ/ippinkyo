import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NewsArticle } from '@/components/news/NewsClient';
import { loadAllNews, loadNewsBySlug } from '@/lib/news';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return loadAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = loadNewsBySlug(slug);
  if (!item) return { title: 'お知らせ' };
  return {
    title: item.translations.ja.title,
    description: item.translations.ja.body.slice(0, 140),
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = loadNewsBySlug(slug);
  if (!item) notFound();

  return (
    <>
      <Header />
      <main id="main" className="pt-[72px] sm:pt-[80px]">
        <div className="mx-auto max-w-section px-5 py-10 sm:py-14">
          <NewsArticle item={item} />
        </div>
      </main>
      <Footer />
    </>
  );
}

export const dynamicParams = false;
