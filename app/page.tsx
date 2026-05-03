import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { asset } from '@/lib/paths';

export default function HomePage() {
  return (
    <>
      <Header />

      <section
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-ink"
        style={{ padding: '120px 20px 60px' }}
      >
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${asset('/images/hero.jpg')})` }}
          aria-hidden
        />
        <div className="relative text-center text-white max-w-[720px] w-full">
          <h1 className="font-serif text-[36px] md:text-[52px] font-bold tracking-[0.15em] mb-3 [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]">
            逸品居
          </h1>
          <p className="text-[12px] md:text-[14px] font-light tracking-wide4 text-neutral-300 mb-2">高幡不動店</p>
          <p className="text-[12px] md:text-[13px] text-neutral-400 mb-6 md:mb-8 leading-[1.8]">
            旨辛本格中華 ｜ 麻婆豆腐 ｜ 四川料理
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-[420px] mx-auto md:gap-3">
            <QuickButton href="/menu/" icon="🍜" label="メニュー" sub="MENU" />
            <QuickButton href="tel:0428424097" icon="☎" label="ご予約" sub="RESERVE" />
          </div>
        </div>
      </section>

      <section id="access" className="py-[60px] px-5 md:py-[60px] md:px-5">
        <div className="max-w-section mx-auto">
          <h2 className="font-serif text-[22px] md:text-[26px] font-bold text-center mb-2 text-neutral-800 tracking-wide2">
            店舗情報
          </h2>
          <p className="text-center text-[12px] text-neutral-400 tracking-wide4 mb-10">SHOP INFO &amp; ACCESS</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
            <div>
              <table className="w-full">
                <tbody>
                  <InfoRow th="店名" td="逸品居 高幡不動店" />
                  <InfoRow th="住所" td={<>〒191-0031<br />東京都日野市高幡2-16 1F</>} />
                  <InfoRow
                    th="電話"
                    td={
                      <a href="tel:0428424097" className="text-brand no-underline">
                        042-842-4097
                      </a>
                    }
                  />
                  <InfoRow
                    th="営業時間"
                    td={
                      <>
                        11:00～15:00（L.O. 14:30）<br />
                        17:00～23:00（L.O. 22:30）
                      </>
                    }
                  />
                  <InfoRow th="定休日" td="火曜日" />
                </tbody>
              </table>
              <a
                href="tel:0428424097"
                className="inline-block bg-brand text-white px-8 py-3.5 rounded-md font-bold tracking-[0.05em] mt-5 hover:bg-brand-light transition-colors"
              >
                ☎ 042-842-4097
              </a>
            </div>
            <div className="rounded-lg overflow-hidden h-[260px] md:h-[320px] bg-neutral-100">
              <iframe
                title="店舗地図"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.5!2d139.4089608!3d35.6624532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018e31ad727c3ef%3A0x58ca50a24b15f738!2sIppinkyo+-+Takahatafudo+Store!5e0!3m2!1sja!2sjp!4v1"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function QuickButton({ href, icon, label, sub }: { href: string; icon: string; label: string; sub: string }) {
  const content = (
    <>
      <div className="text-[20px] md:text-[24px] mb-1.5">{icon}</div>
      <div className="text-[12px] md:text-[14px] font-bold tracking-[0.08em]">{label}</div>
      <div className="hidden md:block text-[10px] text-neutral-300 tracking-wide3 mt-0.5">{sub}</div>
    </>
  );
  const className =
    'flex flex-col items-center justify-center bg-white/10 border border-white/30 text-white px-3 py-3.5 md:px-3 md:py-[18px] rounded-lg backdrop-blur-sm hover:bg-brand hover:border-brand hover:-translate-y-0.5 transition-all duration-200';

  if (href.startsWith('tel:') || href.startsWith('mailto:')) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

function InfoRow({ th, td }: { th: string; td: React.ReactNode }) {
  return (
    <tr className="border-b border-neutral-200">
      <th className="text-left py-3.5 font-bold text-[14px] text-neutral-800 w-[100px] align-top">{th}</th>
      <td className="py-3.5 text-[14px] text-neutral-600 leading-[1.7]">{td}</td>
    </tr>
  );
}
