import type { Metadata, Viewport } from 'next';
import { Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google';
import { LocaleProvider } from '@/lib/i18n/LocaleProvider';
import { RestaurantJsonLd } from '@/components/JsonLd';
import { SITE } from '@/lib/site';
import { asset } from '@/lib/paths';
import './globals.css';

const notoSans = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

const notoSerif = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-serif-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | 中華料理`,
    template: `%s | ${SITE.shortName}`,
  },
  description:
    '高幡不動駅から徒歩1分。本格中華・四川料理。麻婆豆腐・食べ放題・お得コース・宴会対応。ネット予約・PayPay対応。',
  metadataBase: new URL(SITE.url),
  applicationName: SITE.shortName,
  authors: [{ name: SITE.name }],
  keywords: [
    '逸品居', '高幡不動', '中華料理', '四川料理', '麻婆豆腐', '食べ放題',
    '飲み放題', '宴会', '日野市', 'Chinese restaurant', 'Sichuan',
  ],
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.shortName,
    title: `${SITE.name} | 中華料理`,
    description: SITE.tagline,
    images: [
      {
        url: asset('/images/hero.jpg'),
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.tagline,
    images: [asset('/images/hero.jpg')],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#8B0000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <head>
        <RestaurantJsonLd />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-neutral-900 focus:shadow"
        >
          メインコンテンツへ
        </a>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
