# 逸品居 高幡不動店

中華料理レストランのウェブサイト。Next.js 15 + TypeScript + Tailwind CSS で構築、静的サイトとして書き出し、Cloudflare Workers と GitHub Pages の両方にデプロイ。

## 開発

```bash
npm install         # 初回のみ
npm run dev         # http://localhost:3000
npm run build       # → out/ に静的サイトを書き出し
npm run typecheck   # 型チェックのみ
```

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
app/                    # Next.js App Router ページ
components/             # 再利用可能な UI コンポーネント
lib/
  ├ types.ts            # 共通型
  ├ categories.ts       # カテゴリーのメタデータ
  ├ dishes.ts           # ビルド時に Markdown を読み込むパーサー
  └ paths.ts            # basePath 補助
public/                 # 静的ファイル（画像など）
document/               # メニューデータ（Markdown 表）
scripts/                # 画像ダウンロード用 Python スクリプト
```

## ページ構成

| ルート | ファイル | 説明 |
| --- | --- | --- |
| `/` | `app/page.tsx` | トップ |
| `/menu/` | `app/menu/page.tsx` | カテゴリー一覧 |
| `/menu/<id>/` | `app/menu/[category]/page.tsx` | 一品メニュー 14 カテゴリー（動的ルート） |
| `/menu/all-you-can-eat/` | `app/menu/all-you-can-eat/page.tsx` | 食べ放題・飲み放題 |
| `/menu/course/` | `app/menu/course/page.tsx` | お得コース（番号付き） |
| `/menu/drink-set/` | `app/menu/drink-set/page.tsx` | 飲みセット（複数選択） |
| `/menu/set-meal/` | `app/menu/set-meal/page.tsx` | 定食 |
| `/menu/small-plate/` | `app/menu/small-plate/page.tsx` | 小皿料理 |
