import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ReservationCTA } from '@/components/ReservationCTA';
import { DeliveryCTA } from '@/components/DeliveryCTA';
import { PaymentMethods } from '@/components/PaymentMethods';
import { ParkingInfo } from '@/components/ParkingInfo';
import { CouponBanner } from '@/components/CouponBanner';
import { NewsCard } from '@/components/NewsCard';
import { BackToTop } from '@/components/BackToTop';
import { HomeHero, HomeAccessSection, NewsSectionHeader, SectionHeader } from '@/components/home/HomeSections';
import { loadAllNews, type NewsItem } from '@/lib/news';
import { SITE } from '@/lib/site';

export default function HomePage() {
  const news = loadAllNews().slice(0, 3);

  return (
    <>
      <Header transparent />

      <main id="main">
        <HomeHero />

        {/* お知らせ・新着 */}
        <section id="news" className="mx-auto max-w-page px-5 py-14 sm:py-16">
          <NewsSectionHeader />
          <NewsList news={news} />
        </section>

        {/* 予約 */}
        <section id="reservation" className="bg-paper">
          <div className="mx-auto max-w-page px-5 py-14 sm:py-16">
            <SectionHeader heading="reserveHeading" sub="reserveSub" />
            <ReservationCTA className="mt-7" />
          </div>
        </section>

        {/* テイクアウト・デリバリー */}
        <section id="delivery" className="mx-auto max-w-page px-5 py-14 sm:py-16">
          <SectionHeader heading="deliveryHeading" sub="deliverySub" />
          <DeliveryCTA className="mt-7" />
        </section>

        {/* クーポン */}
        <section id="coupon" className="bg-paper">
          <div className="mx-auto max-w-section px-5 py-14 sm:py-16">
            <CouponBanner />
          </div>
        </section>

        {/* 支払い方法 */}
        <section id="payments" className="mx-auto max-w-page px-5 py-12">
          <SectionHeader heading="paymentHeading" />
          <PaymentMethods className="mt-5" />
        </section>

        {/* 駐車場 */}
        <section id="parking" className="bg-paper">
          <div className="mx-auto max-w-page px-5 py-14 sm:py-16">
            <SectionHeader heading="parkingHeading" sub="parkingSub" />
            <ParkingInfo className="mt-7" limit={3} showMoreLink />
          </div>
        </section>

        {/* アクセス */}
        <HomeAccessSection />
      </main>

      <Footer />
      <BackToTop />

      {/* Floating phone CTA on mobile so the call action is always one tap away. */}
      <a
        href={SITE.tel.href}
        aria-label="電話で予約"
        className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 hover:bg-brand-light md:hidden"
      >
        <span aria-hidden className="text-[20px]">☎</span>
      </a>
    </>
  );
}

function NewsList({ news }: { news: NewsItem[] }) {
  if (news.length === 0) {
    return (
      <p className="mt-7 rounded-lg border border-dashed border-neutral-300 bg-white px-5 py-10 text-center text-[13px] text-neutral-500">
        現在お知らせはありません。
      </p>
    );
  }
  return (
    <ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {news.map((n) => (
        <li key={n.slug}>
          <NewsCard item={n} compact />
        </li>
      ))}
    </ul>
  );
}
