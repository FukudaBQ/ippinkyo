/**
 * UI string dictionary for the three supported locales.
 *
 * Server renders Japanese by default; on the client we read the user's
 * preference from localStorage and re-render with the matching dictionary.
 *
 * Keep keys short and namespaced by feature ("home.hero.cta").
 */

export const LOCALES = ['ja', 'zh', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ja';

export const LOCALE_LABELS: Record<Locale, string> = {
  ja: '日本語',
  zh: '中文',
  en: 'English',
};

export interface Dictionary {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    menu: string;
    news: string;
    access: string;
    coupon: string;
    home: string;
  };
  status: {
    open: string;
    closed: string;
    closesAt: (t: string) => string;
    reopensAtToday: (t: string) => string;
    reopensNext: (t: string) => string;
    closedToday: string;
  };
  home: {
    heroSubtitle: string;
    heroBody: string;
    quickMenu: string;
    quickReserve: string;
    signatureHeading: string;
    signatureSub: string;
    newsHeading: string;
    newsSub: string;
    newsViewAll: string;
    newsEmpty: string;
    reserveHeading: string;
    reserveSub: string;
    deliveryHeading: string;
    deliverySub: string;
    couponHeading: string;
    couponSub: string;
    paymentHeading: string;
    accessHeading: string;
    accessSub: string;
    parkingHeading: string;
    parkingSub: string;
    parkingNoneNote: string;
    parkingWalkMin: (n: number) => string;
    parkingPriceJpy: (yen: number) => string;
    parkingViewMore: string;
  };
  shopInfo: {
    name: string;
    address: string;
    tel: string;
    hours: string;
    closedDay: string;
    nearestStation: string;
    facilities: string;
    nonSmoking: string;
    smokingArea: string;
    childFriendly: string;
  };
  reservation: {
    callNow: string;
    tabelog: string;
    hotpepper: string;
    line: string;
    lineHint: string;
  };
  delivery: {
    uberEats: string;
    wolt: string;
    demaekan: string;
  };
  coupon: {
    title: string;
    rule: (threshold: string, discount: string) => string;
    note: string;
  };
  payments: {
    cash: string;
    card: string;
    paypay: string;
  };
  menu: {
    title: string;
    categories: string;
    sectionMenu: string;
    sectionCourse: string;
    searchPlaceholder: string;
    searchEmpty: string;
    swipeHint: string;
    backToTop: string;
    photoComingSoon: string;
    countItems: (n: number) => string;
    notReady: string;
    home: string;
  };
  news: {
    title: string;
    description: string;
    backToList: string;
    publishedOn: (date: string) => string;
    empty: string;
  };
  access: {
    title: string;
    description: string;
    openInGoogleMaps: string;
    openInAppleMaps: string;
    walkFromStation: (n: number) => string;
  };
  footer: {
    rights: string;
    sitemap: string;
  };
  langSwitcher: {
    label: string;
  };
}

const ja: Dictionary = {
  meta: {
    title: '逸品居 高幡不動店 | 本格中華・四川料理',
    description:
      '高幡不動駅から徒歩1分。本格中華・四川料理。麻婆豆腐・食べ放題・お得コース・宴会対応。ネット予約・PayPay対応。',
  },
  nav: {
    menu: 'メニュー',
    news: 'お知らせ',
    access: 'アクセス',
    coupon: 'クーポン',
    home: 'トップ',
  },
  status: {
    open: '営業中',
    closed: '本日営業時間外',
    closesAt: (t) => `${t} まで`,
    reopensAtToday: (t) => `本日 ${t} に再開`,
    reopensNext: (t) => `次回営業 ${t}〜`,
    closedToday: '本日定休日',
  },
  home: {
    heroSubtitle: '高幡不動店',
    heroBody: '旨辛本格中華 ｜ 麻婆豆腐 ｜ 四川料理',
    quickMenu: 'メニューを見る',
    quickReserve: 'ご予約',
    signatureHeading: '逸品居の自慢料理',
    signatureSub: 'SIGNATURE DISHES',
    newsHeading: 'お知らせ・新着',
    newsSub: 'WHAT\'S NEW',
    newsViewAll: 'すべて見る',
    newsEmpty: '現在お知らせはありません。',
    reserveHeading: 'ご予約',
    reserveSub: 'RESERVATION',
    deliveryHeading: 'テイクアウト・デリバリー',
    deliverySub: 'TAKEOUT & DELIVERY',
    couponHeading: '会員割引クーポン',
    couponSub: 'COUPON',
    paymentHeading: 'お支払い方法',
    accessHeading: '店舗情報・アクセス',
    accessSub: 'SHOP INFO & ACCESS',
    parkingHeading: '駐車場のご案内',
    parkingSub: 'PARKING',
    parkingNoneNote:
      '当店専用の駐車場はございません。お車でお越しの際は近隣のコインパーキングをご利用ください。',
    parkingWalkMin: (n) => `徒歩${n}分`,
    parkingPriceJpy: (yen) => `¥${yen.toLocaleString()} / 24時間`,
    parkingViewMore: '駐車場の詳細を見る',
  },
  shopInfo: {
    name: '店名',
    address: '住所',
    tel: '電話',
    hours: '営業時間',
    closedDay: '定休日',
    nearestStation: '最寄駅',
    facilities: '設備',
    nonSmoking: '全席禁煙',
    smokingArea: '喫煙スペースあり',
    childFriendly: 'お子様連れ歓迎',
  },
  reservation: {
    callNow: '電話で予約',
    tabelog: '食べログで予約',
    hotpepper: 'ホットペッパーで予約',
    line: 'LINEで予約',
    lineHint: '友だち追加でクーポン配信',
  },
  delivery: {
    uberEats: 'Uber Eats',
    wolt: 'Wolt',
    demaekan: '出前館',
  },
  coupon: {
    title: '会員割引クーポン',
    rule: (threshold, discount) =>
      `お会計累計 ${threshold} ごとに ${discount} 割引`,
    note: '※ お支払い前に必ずスタッフにご提示ください。他クーポン・サービスとの併用不可。',
  },
  payments: {
    cash: '現金',
    card: 'クレジットカード',
    paypay: 'PayPay',
  },
  menu: {
    title: 'メニュー',
    categories: 'カテゴリー',
    sectionMenu: 'メニュー',
    sectionCourse: 'コース・セット',
    searchPlaceholder: '料理名で検索…',
    searchEmpty: '該当する料理が見つかりませんでした。',
    swipeHint: 'カテゴリーを開く',
    backToTop: 'トップへ戻る',
    photoComingSoon: '写真準備中',
    countItems: (n) => `全 ${n} 品`,
    notReady: '準備中です。',
    home: 'トップ',
  },
  news: {
    title: 'お知らせ・新着',
    description: '逸品居 高幡不動店からのお知らせ・新メニュー情報。',
    backToList: 'お知らせ一覧へ戻る',
    publishedOn: (date) => `${date} 投稿`,
    empty: '現在お知らせはありません。',
  },
  access: {
    title: 'アクセス・店舗情報',
    description: '逸品居 高幡不動店へのアクセス、駐車場、営業時間、設備情報。',
    openInGoogleMaps: 'Google マップで開く',
    openInAppleMaps: 'Apple マップで開く',
    walkFromStation: (n) => `高幡不動駅から徒歩 ${n} 分`,
  },
  footer: {
    rights: '© 逸品居 All Rights Reserved.',
    sitemap: 'サイトマップ',
  },
  langSwitcher: {
    label: '言語',
  },
};

const zh: Dictionary = {
  meta: {
    title: '逸品居 高幡不动店 | 正宗中华・四川料理',
    description:
      '高幡不动站徒步1分钟。正宗中华・四川料理。麻婆豆腐・自助餐・优惠套餐・宴会承办。在线预约・支持PayPay。',
  },
  nav: {
    menu: '菜单',
    news: '公告',
    access: '到店指南',
    coupon: '优惠券',
    home: '首页',
  },
  status: {
    open: '营业中',
    closed: '今日营业时间外',
    closesAt: (t) => `营业至 ${t}`,
    reopensAtToday: (t) => `今日 ${t} 再开`,
    reopensNext: (t) => `下次营业 ${t}〜`,
    closedToday: '今日休息',
  },
  home: {
    heroSubtitle: '高幡不动店',
    heroBody: '麻辣正宗中华 ｜ 麻婆豆腐 ｜ 四川料理',
    quickMenu: '查看菜单',
    quickReserve: '预约',
    signatureHeading: '逸品居招牌菜',
    signatureSub: 'SIGNATURE DISHES',
    newsHeading: '公告・新动态',
    newsSub: 'WHAT\'S NEW',
    newsViewAll: '查看全部',
    newsEmpty: '暂无公告。',
    reserveHeading: '预约',
    reserveSub: 'RESERVATION',
    deliveryHeading: '外带・外卖',
    deliverySub: 'TAKEOUT & DELIVERY',
    couponHeading: '会员优惠券',
    couponSub: 'COUPON',
    paymentHeading: '支付方式',
    accessHeading: '店铺信息・到店指南',
    accessSub: 'SHOP INFO & ACCESS',
    parkingHeading: '停车场指南',
    parkingSub: 'PARKING',
    parkingNoneNote:
      '本店没有专用停车场。开车前来的客人请使用附近的投币停车场。',
    parkingWalkMin: (n) => `徒步${n}分钟`,
    parkingPriceJpy: (yen) => `¥${yen.toLocaleString()} / 24小时`,
    parkingViewMore: '查看停车场详情',
  },
  shopInfo: {
    name: '店名',
    address: '地址',
    tel: '电话',
    hours: '营业时间',
    closedDay: '定休日',
    nearestStation: '最近车站',
    facilities: '设施',
    nonSmoking: '全席禁烟',
    smokingArea: '设有吸烟区',
    childFriendly: '欢迎携带儿童',
  },
  reservation: {
    callNow: '电话预约',
    tabelog: '通过食べログ预约',
    hotpepper: '通过 HotPepper 预约',
    line: 'LINE 预约',
    lineHint: '加好友领取优惠券',
  },
  delivery: {
    uberEats: 'Uber Eats',
    wolt: 'Wolt',
    demaekan: '出前館',
  },
  coupon: {
    title: '会员优惠券',
    rule: (threshold, discount) => `消费累计满 ${threshold} 立减 ${discount}`,
    note: '※ 结账前请向店员出示。不可与其他优惠券・服务同时使用。',
  },
  payments: {
    cash: '现金',
    card: '信用卡',
    paypay: 'PayPay',
  },
  menu: {
    title: '菜单',
    categories: '分类',
    sectionMenu: '菜单',
    sectionCourse: '套餐・组合',
    searchPlaceholder: '搜索菜名…',
    searchEmpty: '没有找到相关菜品。',
    swipeHint: '打开分类',
    backToTop: '回到顶部',
    photoComingSoon: '照片准备中',
    countItems: (n) => `共 ${n} 道`,
    notReady: '准备中。',
    home: '首页',
  },
  news: {
    title: '公告・新动态',
    description: '逸品居 高幡不动店的公告与新菜资讯。',
    backToList: '返回公告列表',
    publishedOn: (date) => `${date} 发布`,
    empty: '暂无公告。',
  },
  access: {
    title: '到店指南・店铺信息',
    description: '逸品居 高幡不动店的交通、停车、营业时间、设施信息。',
    openInGoogleMaps: '在 Google 地图打开',
    openInAppleMaps: '在 Apple 地图打开',
    walkFromStation: (n) => `高幡不动站徒步 ${n} 分钟`,
  },
  footer: {
    rights: '© 逸品居 All Rights Reserved.',
    sitemap: '网站地图',
  },
  langSwitcher: {
    label: '语言',
  },
};

const en: Dictionary = {
  meta: {
    title: 'Ippinkyo Takahatafudo | Authentic Chinese & Sichuan Cuisine',
    description:
      '1 min walk from Takahatafudo Station. Authentic Chinese & Sichuan cuisine. Mapo tofu, all-you-can-eat, set courses, banquet service. Online reservation & PayPay accepted.',
  },
  nav: {
    menu: 'Menu',
    news: 'News',
    access: 'Access',
    coupon: 'Coupon',
    home: 'Home',
  },
  status: {
    open: 'Open',
    closed: 'Closed',
    closesAt: (t) => `Open until ${t}`,
    reopensAtToday: (t) => `Reopens at ${t} today`,
    reopensNext: (t) => `Next open ${t}`,
    closedToday: 'Closed today',
  },
  home: {
    heroSubtitle: 'Takahatafudo Branch',
    heroBody: 'Authentic Sichuan & Chinese · Mapo Tofu · Hot & Spicy',
    quickMenu: 'View Menu',
    quickReserve: 'Reserve',
    signatureHeading: 'Signature Dishes',
    signatureSub: 'SIGNATURE',
    newsHeading: 'What\'s New',
    newsSub: 'NEWS',
    newsViewAll: 'View all',
    newsEmpty: 'No news at the moment.',
    reserveHeading: 'Reservations',
    reserveSub: 'RESERVATION',
    deliveryHeading: 'Take-out & Delivery',
    deliverySub: 'DELIVERY',
    couponHeading: 'Loyalty Coupon',
    couponSub: 'COUPON',
    paymentHeading: 'Payment Methods',
    accessHeading: 'Shop Info & Access',
    accessSub: 'INFO & ACCESS',
    parkingHeading: 'Parking',
    parkingSub: 'PARKING',
    parkingNoneNote:
      'We do not have an on-site parking lot. Please use one of the nearby coin parking lots.',
    parkingWalkMin: (n) => `${n} min walk`,
    parkingPriceJpy: (yen) => `¥${yen.toLocaleString()} / 24h`,
    parkingViewMore: 'View parking details',
  },
  shopInfo: {
    name: 'Name',
    address: 'Address',
    tel: 'Phone',
    hours: 'Hours',
    closedDay: 'Closed',
    nearestStation: 'Nearest station',
    facilities: 'Facilities',
    nonSmoking: 'Non-smoking',
    smokingArea: 'Smoking area available',
    childFriendly: 'Family friendly',
  },
  reservation: {
    callNow: 'Call to reserve',
    tabelog: 'Reserve on Tabelog',
    hotpepper: 'Reserve on HotPepper',
    line: 'Reserve on LINE',
    lineHint: 'Add as friend for coupons',
  },
  delivery: {
    uberEats: 'Uber Eats',
    wolt: 'Wolt',
    demaekan: 'Demae-kan',
  },
  coupon: {
    title: 'Loyalty Coupon',
    rule: (threshold, discount) =>
      `Spend a total of ${threshold} → get ${discount} off`,
    note: '* Please show this to staff before payment. Cannot be combined with other coupons.',
  },
  payments: {
    cash: 'Cash',
    card: 'Credit Card',
    paypay: 'PayPay',
  },
  menu: {
    title: 'Menu',
    categories: 'Categories',
    sectionMenu: 'À la carte',
    sectionCourse: 'Courses & Sets',
    searchPlaceholder: 'Search dishes…',
    searchEmpty: 'No dishes match your search.',
    swipeHint: 'Open categories',
    backToTop: 'Back to top',
    photoComingSoon: 'Photo coming soon',
    countItems: (n) => `${n} items`,
    notReady: 'Coming soon.',
    home: 'Home',
  },
  news: {
    title: 'News & Updates',
    description: 'News and updates from Ippinkyo Takahatafudo.',
    backToList: 'Back to news list',
    publishedOn: (date) => `Posted on ${date}`,
    empty: 'No news at the moment.',
  },
  access: {
    title: 'Access & Shop Info',
    description: 'Directions, parking, opening hours and facilities at Ippinkyo Takahatafudo.',
    openInGoogleMaps: 'Open in Google Maps',
    openInAppleMaps: 'Open in Apple Maps',
    walkFromStation: (n) => `${n} min walk from Takahatafudo Station`,
  },
  footer: {
    rights: '© Ippinkyo. All Rights Reserved.',
    sitemap: 'Sitemap',
  },
  langSwitcher: {
    label: 'Language',
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { ja, zh, en };

/** Map our internal locale to the BCP-47 lang attribute. */
export const HTML_LANG: Record<Locale, string> = {
  ja: 'ja',
  zh: 'zh-CN',
  en: 'en',
};
