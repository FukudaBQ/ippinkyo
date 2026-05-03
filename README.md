# 逸品居 高幡不動店

中華料理レストランのウェブサイト。Next.js 15 (App Router) + TypeScript + Tailwind CSS で構築、静的サイトとして書き出し、Cloudflare Workers と GitHub Pages の両方にデプロイ。

## 機能

- 多言語対応（日本語 / 中文 / English のクライアント側切替）
- 営業中ステータスバッジ（リアルタイム計算）
- ネット予約導線（電話・食べログ・ホットペッパー・LINE プレースホルダー）
- テイクアウト・デリバリー導線（Uber Eats / Wolt / 出前館 プレースホルダー）
- お知らせ・新着 機能（Markdown ベース、`document/news/*.md`）
- 会員割引クーポン（`/coupon` 専用ページ ＋ ホームバナー）
- お支払い方法表示（現金 / クレジットカード / PayPay）
- 駐車場のご案内（近隣コインパーキング）
- メニュー検索 + サイドバー、画像拡大 (Lightbox)
- 構造化データ (schema.org `Restaurant`)、OG タグ、`sitemap.xml`、`robots.txt`

## 開発

```bash
npm install         # 初回のみ
npm run dev         # http://localhost:3000
npm run build       # → out/ に静的サイトを書き出し
npm run typecheck   # 型チェックのみ
```

## 中央設定 — `lib/site.ts`

店舗名・電話・住所・営業時間・支払い方法・駐車場・予約リンク・SNS・クーポン金額など、業務上変わり得るあらゆる値はここから読みます。
変更が必要なときは `lib/site.ts` の 1 ファイルだけを編集してください。

## メニューに料理を追加するには

データの実体は `document/menu/<カテゴリー名>` と `document/buffet_and_set/<カテゴリー名>` の Markdown 表。
Markdown を編集 → `npm run build` だけで、`/menu/<id>/` ページが自動更新される。

例: `document/menu/特色料理` に行を追加すると、`/menu/specialty/` に新しい料理カードが出る。

```
| 菜品   | 说明              | 价格   |
| ----- | ---------------- | ------ |
| 新料理 | 説明文            | 1,200円 |
```

画像は `public/images/dishes/<id>-<index>.jpg`（`<index>` は 0 始まり、Markdown の行順）。

## お知らせを追加するには

`document/news/<YYYY-MM-DD>-<slug>.md` を作る。フォーマット:

```md
---
date: 2026-04-15
tag: キャンペーン
pinned: true
title_ja: 日本語タイトル
title_zh: 中文标题
title_en: English title
---

## :ja
日本語本文…

## :zh
中文正文…

## :en
English body…
```

`title_zh` / `title_en` と `## :zh` / `## :en` セクションは省略可（その場合 `:ja` にフォールバック）。

## 国際化

クライアント側で localStorage に保存される簡易 i18n。サーバーは常に日本語をレンダリングし、ハイドレーション後に切り替わります。
辞書は `lib/i18n/dictionaries.ts` の `ja` / `zh` / `en` を編集して追加・更新できます。

## デプロイ

| 環境 | URL | トリガー |
| --- | --- | --- |
| Cloudflare Workers (本番) | `xxx.workers.dev` | `wrangler deploy` |
| GitHub Pages (テスト) | `https://fukudabq.github.io/ippinkyo/` | `master` ブランチへの push |

`next.config.ts` の `basePath` は環境変数 `DEPLOY_TARGET=gh-pages` の有無で切り替わる：
- 設定あり → `/ippinkyo` を全パスに付与（GitHub Pages 用）
- 設定なし → ルートパス（Cloudflare 用）

## ディレクトリ構成

```
app/
  ├ layout.tsx          # ルートレイアウト（メタ・schema.org・LocaleProvider）
  ├ page.tsx            # トップページ
  ├ menu/               # メニューページ群
  ├ news/               # お知らせ一覧 + 詳細
  ├ access/             # アクセス・店舗情報・駐車場
  ├ coupon/             # 会員割引クーポン
  ├ sitemap.ts
  └ robots.ts
components/
  ├ Header / Footer
  ├ StatusBadge / LanguageSwitcher
  ├ ReservationCTA / DeliveryCTA / PaymentMethods
  ├ ParkingInfo / CouponBanner / NewsCard
  ├ Lightbox / BackToTop / JsonLd
  ├ MenuShell / DishCard / BuffetHero
  ├ home/, news/, access/, coupon/, menu/  # 各画面の client サブコンポーネント
lib/
  ├ site.ts             # 店舗マスター設定（電話・営業時間・支払い・駐車場・予約・クーポン）
  ├ businessHours.ts    # 「営業中」判定ロジック
  ├ i18n/               # 多言語辞書 + Provider
  ├ news.ts             # 'server-only' お知らせローダー
  ├ news/types.ts       # クライアントから安全に import 可能な型
  ├ types.ts            # 共通型
  ├ categories.ts       # カテゴリーのメタデータ
  ├ dishes.ts           # ビルド時に Markdown を読み込むパーサー
  └ paths.ts            # basePath 補助
public/                 # 静的ファイル（画像など）
document/
  ├ menu/               # 一品料理
  ├ buffet_and_set/     # コース・食べ放題
  └ news/               # お知らせ Markdown
scripts/                # 画像ダウンロード用 Python スクリプト
```

## ページ構成

| ルート | ファイル | 説明 |
| --- | --- | --- |
| `/` | `app/page.tsx` | トップ（ヒーロー・お知らせ・予約・デリバリー・クーポン・支払い・駐車場・アクセス） |
| `/menu/` | `app/menu/page.tsx` | カテゴリー一覧 |
| `/menu/<id>/` | `app/menu/[category]/page.tsx` | 一品メニュー（動的ルート） |
| `/menu/all-you-can-eat/` | `…/all-you-can-eat/page.tsx` | 食べ放題・飲み放題 |
| `/menu/course/` | `…/course/page.tsx` | お得コース |
| `/menu/drink-set/` | `…/drink-set/page.tsx` | 飲みセット |
| `/menu/set-meal/` | `…/set-meal/page.tsx` | 定食 |
| `/menu/small-plate/` | `…/small-plate/page.tsx` | 小皿料理 |
| `/news/` | `app/news/page.tsx` | お知らせ一覧 |
| `/news/<slug>/` | `app/news/[slug]/page.tsx` | お知らせ詳細 |
| `/access/` | `app/access/page.tsx` | アクセス・駐車場・支払い |
| `/coupon/` | `app/coupon/page.tsx` | 会員割引クーポン詳細 |
