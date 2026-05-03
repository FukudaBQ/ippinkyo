import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CouponView } from '@/components/coupon/CouponClient';

export const metadata = {
  title: '会員割引クーポン',
  description: 'お会計累計30,000円ごとに300円割引。逸品居 高幡不動店の会員割引クーポンの詳細。',
};

export default function CouponPage() {
  return (
    <>
      <Header />
      <main id="main" className="pt-[72px] sm:pt-[80px]">
        <div className="mx-auto max-w-section px-5 py-10 sm:py-14">
          <CouponView />
        </div>
      </main>
      <Footer />
    </>
  );
}
