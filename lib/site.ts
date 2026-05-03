/**
 * Single source of truth for all store-level metadata.
 * Anything that might change with time / business policy lives here so that
 * pages and components can stay declarative.
 */

export interface OpeningHourBlock {
  /** "11:00" */
  open: string;
  /** "15:00" */
  close: string;
  /** Optional "L.O. 14:30" hint */
  lastOrder?: string;
}

export interface OpeningSchedule {
  /** 0 = Sun, 1 = Mon, ..., 6 = Sat. Empty = closed. */
  weekly: Record<number, OpeningHourBlock[]>;
  /** Human-readable closed-day label (multilingual handled in i18n). */
  closedDayLabel: string;
}

export const SITE = {
  name: '逸品居 高幡不動店',
  shortName: '逸品居',
  tagline: '旨辛本格中華 ｜ 麻婆豆腐 ｜ 四川料理',
  url: 'https://ippinkyo.example.com',
  locale: 'ja_JP',

  address: {
    postalCode: '191-0031',
    region: '東京都',
    locality: '日野市',
    street: '高幡2-16 1F',
    full: '〒191-0031 東京都日野市高幡2-16 1F',
    /** From Google Maps. */
    geo: { lat: 35.6624489, lng: 139.4115411 },
  },

  /** Telephone (国際表記). */
  tel: {
    display: '042-842-4097',
    intl: '+81-42-842-4097',
    href: 'tel:+81428424097',
  },

  hours: {
    weekly: {
      0: [
        { open: '11:00', close: '15:00', lastOrder: 'L.O. 14:30' },
        { open: '17:00', close: '23:00', lastOrder: 'L.O. 22:30' },
      ],
      1: [
        { open: '11:00', close: '15:00', lastOrder: 'L.O. 14:30' },
        { open: '17:00', close: '23:00', lastOrder: 'L.O. 22:30' },
      ],
      // 2 = Tuesday closed
      3: [
        { open: '11:00', close: '15:00', lastOrder: 'L.O. 14:30' },
        { open: '17:00', close: '23:00', lastOrder: 'L.O. 22:30' },
      ],
      4: [
        { open: '11:00', close: '15:00', lastOrder: 'L.O. 14:30' },
        { open: '17:00', close: '23:00', lastOrder: 'L.O. 22:30' },
      ],
      5: [
        { open: '11:00', close: '15:00', lastOrder: 'L.O. 14:30' },
        { open: '17:00', close: '23:00', lastOrder: 'L.O. 22:30' },
      ],
      6: [
        { open: '11:00', close: '15:00', lastOrder: 'L.O. 14:30' },
        { open: '17:00', close: '23:00', lastOrder: 'L.O. 22:30' },
      ],
    } as Record<number, OpeningHourBlock[]>,
    closedDayLabel: '火曜日',
  } satisfies OpeningSchedule,

  /** Reservation channels. */
  reservation: {
    tabelog: 'https://s.tabelog.com/tokyo/A1329/A132903/13283465/',
    hotpepper: 'https://www.hotpepper.jp/strJ003753006/',
  },

  /** Delivery / take-out channels. */
  delivery: {
    uberEats: '#',
    wolt: '#',
    demaekan: '#',
  },

  /** Social / messaging. */
  social: {
    line: '#',
    instagram: '#',
    googleMaps:
      'https://www.google.co.jp/maps/place/Ippinkyo+-+Takahatafudo+Store/@35.6624489,139.4089662,17z',
  },

  /** Payment methods accepted at the restaurant. */
  payments: [
    { id: 'cash', icon: '💴' },
    { id: 'card', icon: '💳' },
    { id: 'paypay', icon: '📱' },
  ] as const,

  /** Parking nearby (the restaurant has none of its own). */
  parking: {
    onSite: false,
    nearby: [
      { name: 'Compark 高幡不動 第4', priceJpy: 700, walkMin: 3 },
      { name: 'アイペック 高幡不動 第3', priceJpy: 700, walkMin: 4 },
      { name: 'パークジャパン 高幡不動 第1', priceJpy: 700, walkMin: 5 },
    ],
  },

  /** Coupon currently running. */
  coupon: {
    /** Threshold in JPY for accumulated spend on a single bill. */
    thresholdJpy: 30000,
    /** Discount (in yen) granted at threshold. */
    discountJpy: 300,
  },

  /** Useful station info. */
  access: {
    nearestStation: '高幡不動駅',
    walkMinutes: 1,
  },

  features: {
    nonSmoking: true,
    smokingArea: true,
    childFriendly: true,
    privateRoom: false,
  },
} as const;

export type SiteConfig = typeof SITE;
