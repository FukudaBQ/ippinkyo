'use client';

import { useLocale } from '@/lib/i18n/LocaleProvider';
import { SITE } from '@/lib/site';

export function AccessHeader() {
  const { t } = useLocale();
  return (
    <header>
      <h1 className="font-serif text-[26px] font-bold text-neutral-900 sm:text-[32px]">
        {t.access.title}
      </h1>
      <p className="mt-2 text-[13px] text-neutral-500">{t.access.description}</p>
    </header>
  );
}

export function AccessShopInfo() {
  const { t } = useLocale();
  return (
    <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
      <table className="w-full">
        <tbody>
          <Row th={t.shopInfo.name} td={SITE.name} />
          <Row
            th={t.shopInfo.address}
            td={
              <>
                〒{SITE.address.postalCode}
                <br />
                {SITE.address.region}{SITE.address.locality}{SITE.address.street}
              </>
            }
          />
          <Row
            th={t.shopInfo.tel}
            td={
              <a href={SITE.tel.href} className="text-brand hover:underline">
                {SITE.tel.display}
              </a>
            }
          />
          <Row
            th={t.shopInfo.hours}
            td={
              <>
                11:00–15:00（L.O. 14:30）
                <br />
                17:00–23:00（L.O. 22:30）
              </>
            }
          />
          <Row th={t.shopInfo.closedDay} td={SITE.hours.closedDayLabel} />
          <Row
            th={t.shopInfo.nearestStation}
            td={t.access.walkFromStation(SITE.access.walkMinutes)}
          />
          <Row
            th={t.shopInfo.facilities}
            td={
              <span className="flex flex-wrap gap-1.5">
                <Tag>{t.shopInfo.nonSmoking}</Tag>
                <Tag>{t.shopInfo.smokingArea}</Tag>
                <Tag>{t.shopInfo.childFriendly}</Tag>
              </span>
            }
          />
        </tbody>
      </table>

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={SITE.tel.href}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-[13px] font-bold text-white hover:bg-brand-light transition-colors"
        >
          ☎ {SITE.tel.display}
        </a>
        <a
          href={SITE.social.googleMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-3 text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          🗺️ {t.access.openInGoogleMaps}
        </a>
        <a
          href={`https://maps.apple.com/?ll=${SITE.address.geo.lat},${SITE.address.geo.lng}&q=${encodeURIComponent(SITE.shortName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-3 text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          📍 {t.access.openInAppleMaps}
        </a>
      </div>
    </section>
  );
}

export function AccessParkingDetail() {
  const { t } = useLocale();

  return (
    <section className="mt-8">
      <h2 className="font-serif text-[20px] font-bold text-neutral-900">
        {t.home.parkingHeading}
      </h2>
      <p className="mt-2 text-[13px] leading-[1.8] text-neutral-600">
        {t.home.parkingNoneNote}
      </p>

      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {SITE.parking.nearby.map((p) => (
          <li
            key={p.name}
            className="rounded-xl border border-neutral-200 bg-white p-4 text-[13px] shadow-sm"
          >
            <div className="text-[14px] font-bold text-neutral-800">{p.name}</div>
            <div className="mt-2 text-neutral-500">
              {t.home.parkingWalkMin(p.walkMin)} · {t.home.parkingPriceJpy(p.priceJpy)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Row({ th, td }: { th: string; td: React.ReactNode }) {
  return (
    <tr className="border-b border-neutral-200 last:border-b-0">
      <th className="w-[120px] py-3.5 text-left align-top text-[13px] font-bold text-neutral-800">{th}</th>
      <td className="py-3.5 text-[13px] leading-[1.7] text-neutral-600">{td}</td>
    </tr>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-700">
      {children}
    </span>
  );
}
