'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { SITE } from '@/lib/site';

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-ink text-neutral-300">
      <div className="mx-auto max-w-page px-5 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <div className="font-serif text-[20px] font-bold text-white">{SITE.shortName}</div>
            <div className="mt-1 text-[12px] text-neutral-400">高幡不動店 ｜ 中華料理</div>
            <p className="mt-3 text-[12px] leading-[1.7] text-neutral-400">{SITE.tagline}</p>
          </div>

          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              {t.home.accessHeading}
            </h4>
            <address className="mt-3 not-italic text-[12px] leading-[1.8] text-neutral-300">
              {SITE.address.full}
              <br />
              <a href={SITE.tel.href} className="text-white hover:underline">
                ☎ {SITE.tel.display}
              </a>
            </address>
            <div className="mt-3 text-[12px] text-neutral-400 leading-[1.8]">
              <div>11:00–15:00 / 17:00–23:00</div>
              <div>
                {t.shopInfo.closedDay}: {SITE.hours.closedDayLabel}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              {t.nav.menu} / {t.nav.news}
            </h4>
            <ul className="mt-3 space-y-2 text-[13px]">
              <FooterLink href="/menu/" label={t.nav.menu} />
              <FooterLink href="/news/" label={t.nav.news} />
              <FooterLink href="/access/" label={t.nav.access} />
              <FooterLink href="/coupon/" label={t.nav.coupon} />
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-neutral-800 pt-6 text-[11px] text-neutral-500 sm:flex-row">
          <div>{t.footer.rights}</div>
          <div className="flex items-center gap-4">
            <a
              href={SITE.social.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              Google Maps
            </a>
            <a
              href={SITE.reservation.tabelog}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              食べログ
            </a>
            <a
              href={SITE.reservation.hotpepper}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              HotPepper
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="text-neutral-300 hover:text-white transition-colors">
        {label}
      </Link>
    </li>
  );
}
