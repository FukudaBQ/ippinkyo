import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  AccessHeader,
  AccessShopInfo,
  AccessParkingDetail,
} from '@/components/access/AccessClient';
import { PaymentMethods } from '@/components/PaymentMethods';

export const metadata = {
  title: 'アクセス・店舗情報',
  description: '逸品居 高幡不動店へのアクセス、駐車場、営業時間、設備情報。',
};

export default function AccessPage() {
  return (
    <>
      <Header />
      <main id="main" className="pt-[72px] sm:pt-[80px]">
        <div className="mx-auto max-w-section px-5 py-10 sm:py-14">
          <AccessHeader />

          <div className="mt-6 overflow-hidden rounded-xl bg-neutral-100 h-[300px] sm:h-[400px]">
            <iframe
              title="店舗地図"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.5!2d139.4089608!3d35.6624532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018e31ad727c3ef%3A0x58ca50a24b15f738!2sIppinkyo+-+Takahatafudo+Store!5e0!3m2!1sja!2sjp!4v1"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>

          <AccessShopInfo />
          <AccessParkingDetail />

          <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
            <h2 className="font-serif text-[18px] font-bold text-neutral-900">お支払い方法</h2>
            <PaymentMethods className="mt-4" />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
