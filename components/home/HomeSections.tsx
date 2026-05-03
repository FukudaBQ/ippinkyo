'use client';

import Link from 'next/link';
import { useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { asset } from '@/lib/paths';
import { SITE } from '@/lib/site';

export function HomeHero() {
  const { t } = useLocale();

  return (
    <section
      className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-ink pt-[120px] pb-[60px] px-5"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45"
        style={{ backgroundImage: `url(${asset('/images/hero.jpg')})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/70" aria-hidden />

      <div className="relative w-full max-w-[760px] text-center text-white">
        <div className="flex justify-center mb-5">
          <StatusBadge />
        </div>
        <h1 className="font-serif text-[40px] font-bold tracking-[0.15em] [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] sm:text-[56px]">
          逸品居
        </h1>
        <p className="mt-2 text-[12px] font-light tracking-[0.3em] text-neutral-200 sm:text-[14px]">
          {t.home.heroSubtitle}
        </p>
        <p className="mt-3 text-[12px] leading-[1.8] text-neutral-300 sm:text-[14px]">
          {t.home.heroBody}
        </p>

        <div className="mx-auto mt-8 grid max-w-[460px] grid-cols-2 gap-3">
          <QuickButton href="/menu/" icon="🍜" label={t.home.quickMenu} sub="MENU" />
          <QuickButton href="#reservation" icon="☎" label={t.home.quickReserve} sub="RESERVE" />
        </div>

        <div className="mt-6 text-[11px] text-neutral-300/90 tracking-wide2">
          📍 {t.access.walkFromStation(SITE.access.walkMinutes)}
        </div>
      </div>
    </section>
  );
}

function QuickButton({ href, icon, label, sub }: { href: string; icon: string; label: string; sub: string }) {
  const className =
    'flex flex-col items-center justify-center gap-1 rounded-lg border border-white/30 bg-white/10 px-3 py-4 text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:bg-brand sm:py-[18px]';
  const inner = (
    <>
      <div className="text-[22px] sm:text-[24px]">{icon}</div>
      <div className="text-[12px] font-bold tracking-[0.08em] sm:text-[14px]">{label}</div>
      <div className="hidden text-[10px] tracking-wide3 text-neutral-300 sm:block">{sub}</div>
    </>
  );
  if (href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:')) {
    return (
      <a href={href} className={className}>{inner}</a>
    );
  }
  return (
    <Link href={href} className={className}>{inner}</Link>
  );
}

interface SectionHeaderProps {
  heading: keyof Dictionary['home'];
  sub?: keyof Dictionary['home'];
}

export function SectionHeader({ heading, sub }: SectionHeaderProps) {
  const { t } = useLocale();
  return (
    <header className="text-center">
      <h2 className="font-serif text-[22px] font-bold text-neutral-800 tracking-wide sm:text-[26px]">
        {t.home[heading] as string}
      </h2>
      {sub && (
        <p className="mt-1 text-[11px] tracking-[0.3em] text-neutral-400">{t.home[sub] as string}</p>
      )}
    </header>
  );
}

export function NewsSectionHeader() {
  const { t } = useLocale();
  return (
    <header className="flex items-end justify-between">
      <div>
        <h2 className="font-serif text-[22px] font-bold text-neutral-800 sm:text-[26px]">
          {t.home.newsHeading}
        </h2>
        <p className="mt-1 text-[11px] tracking-[0.3em] text-neutral-400">{t.home.newsSub}</p>
      </div>
      <Link
        href="/news/"
        className="text-[12px] font-bold text-brand-accent hover:underline"
      >
        {t.home.newsViewAll} →
      </Link>
    </header>
  );
}

export function HomeAccessSection() {
  const { t } = useLocale();
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <section id="access" className="mx-auto max-w-page px-5 py-14 sm:py-16">
      <SectionHeader heading="accessHeading" sub="accessSub" />

      <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
        <div>
          <table className="w-full">
            <tbody>
              <InfoRow th={t.shopInfo.name} td={SITE.name} />
              <InfoRow
                th={t.shopInfo.address}
                td={
                  <>
                    〒{SITE.address.postalCode}
                    <br />
                    {SITE.address.region}{SITE.address.locality}{SITE.address.street}
                  </>
                }
              />
              <InfoRow
                th={t.shopInfo.tel}
                td={
                  <a href={SITE.tel.href} className="text-brand no-underline hover:underline">
                    {SITE.tel.display}
                  </a>
                }
              />
              <InfoRow
                th={t.shopInfo.hours}
                td={
                  <>
                    11:00–15:00（L.O. 14:30）
                    <br />
                    17:00–23:00（L.O. 22:30）
                  </>
                }
              />
              <InfoRow th={t.shopInfo.closedDay} td={SITE.hours.closedDayLabel} />
              <InfoRow
                th={t.shopInfo.nearestStation}
                td={t.access.walkFromStation(SITE.access.walkMinutes)}
              />
              <InfoRow
                th={t.shopInfo.facilities}
                td={
                  <span className="flex flex-wrap gap-1.5">
                    <FacilityTag>{t.shopInfo.nonSmoking}</FacilityTag>
                    <FacilityTag>{t.shopInfo.smokingArea}</FacilityTag>
                    <FacilityTag>{t.shopInfo.childFriendly}</FacilityTag>
                  </span>
                }
              />
            </tbody>
          </table>

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={SITE.tel.href}
              className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-[13px] font-bold tracking-[0.05em] text-white hover:bg-brand-light transition-colors"
            >
              ☎ {SITE.tel.display}
            </a>
            <a
              href={SITE.social.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-3 text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <span aria-hidden>🗺️</span> {t.access.openInGoogleMaps}
            </a>
          </div>
        </div>

        <div className="h-[260px] overflow-hidden rounded-lg bg-neutral-100 md:h-[360px]">
          {mapLoaded ? (
            <iframe
              title={t.home.accessHeading}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.5!2d139.4089608!3d35.6624532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018e31ad727c3ef%3A0x58ca50a24b15f738!2sIppinkyo+-+Takahatafudo+Store!5e0!3m2!1sja!2sjp!4v1"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          ) : (
            <button
              type="button"
              onClick={() => setMapLoaded(true)}
              className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[linear-gradient(135deg,#e0e7ef,#f3f4f6)] text-neutral-600 hover:bg-neutral-100"
              aria-label={t.access.openInGoogleMaps}
            >
              <span aria-hidden className="text-[40px]">🗺️</span>
              <span className="text-[13px] font-bold">Tap to load map</span>
              <span className="text-[11px] text-neutral-500">{SITE.address.full}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function InfoRow({ th, td }: { th: string; td: React.ReactNode }) {
  return (
    <tr className="border-b border-neutral-200">
      <th className="w-[110px] py-3.5 text-left align-top text-[13px] font-bold text-neutral-800">{th}</th>
      <td className="py-3.5 text-[13px] leading-[1.7] text-neutral-600">{td}</td>
    </tr>
  );
}

function FacilityTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-700">
      {children}
    </span>
  );
}
