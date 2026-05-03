import { SITE } from '@/lib/site';

const DOW_KEYS: Record<number, string> = {
  0: 'Su',
  1: 'Mo',
  2: 'Tu',
  3: 'We',
  4: 'Th',
  5: 'Fr',
  6: 'Sa',
};

function buildOpeningHoursSpecification() {
  const out: { '@type': 'OpeningHoursSpecification'; dayOfWeek: string; opens: string; closes: string }[] = [];
  for (const [dowStr, blocks] of Object.entries(SITE.hours.weekly)) {
    const day = DOW_KEYS[Number(dowStr)];
    if (!day) continue;
    for (const b of blocks) {
      out.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: day,
        opens: b.open,
        closes: b.close,
      });
    }
  }
  return out;
}

/**
 * Restaurant schema.org structured data, injected into the document head.
 * Greatly improves local SEO (Google Knowledge Panel, "near me" results).
 */
export function RestaurantJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: SITE.name,
    alternateName: 'Ippinkyo Takahatafudo',
    servesCuisine: ['Chinese', 'Sichuan'],
    priceRange: '¥¥',
    address: {
      '@type': 'PostalAddress',
      postalCode: SITE.address.postalCode,
      addressRegion: SITE.address.region,
      addressLocality: SITE.address.locality,
      streetAddress: SITE.address.street,
      addressCountry: 'JP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.address.geo.lat,
      longitude: SITE.address.geo.lng,
    },
    telephone: SITE.tel.intl,
    url: SITE.url,
    openingHoursSpecification: buildOpeningHoursSpecification(),
    acceptsReservations: true,
    paymentAccepted: 'Cash, Credit Card, PayPay',
    hasMenu: `${SITE.url}/menu/`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
