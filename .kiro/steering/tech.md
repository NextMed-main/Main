# NextMed 技術スタック

## プロジェクト構成

### モノレポ管理
- **パッケージマネージャー**: pnpm 10.20.0
- **ワークスペース**: pnpm workspace（`pkgs/*`）
- **パッケージ構成**:
  - `pkgs/contract`: Midnightスマートコントラクト
  - `pkgs/cli`: CLIツール
  - `pkgs/frontend`: Next.js Webアプリケーション

## Contract パッケージ

### コア技術
- **Compact言語**: Midnight専用スマートコントラクト言語
  - バージョン: `>= 0.16 && <= 0.25`
  - コンパイラ: compactc
- **ランタイム**: @midnight-ntwrk/compact-runtime ^0.9.0
- **TypeScript**: 5.9.3

### 開発ツール
- **テストフレームワーク**: Vitest 4.0.8
- **リンター**: ESLint 9.38.0
  - @typescript-eslint/eslint-plugin
  - @typescript-eslint/parser
  - eslint-config-prettier
  - eslint-plugin-prettier
- **ビルドツール**: TypeScript Compiler (tsc)
- **テストコンテナ**: testcontainers 11.7.2

### 主要コマンド
```bash
cd pkgs/contract

# Compactコントラクトのコンパイル
pnpm compact

# TypeScriptビルド
pnpm build

# テスト実行
pnpm test

# リント
pnpm lint
```

## CLI パッケージ

### Midnight SDK
- **@midnight-ntwrk/compact-runtime**: ^0.9.0
- **@midnight-ntwrk/ledger**: ^4.0.0
- **@midnight-ntwrk/midnight-js-contracts**: 2.0.2
- **@midnight-ntwrk/midnight-js-http-client-proof-provider**: 2.0.2
- **@midnight-ntwrk/midnight-js-indexer-public-data-provider**: 2.0.2
- **@midnight-ntwrk/midnight-js-level-private-state-provider**: 2.0.2
- **@midnight-ntwrk/midnight-js-node-zk-config-provider**: 2.0.2
- **@midnight-ntwrk/midnight-js-types**: 2.0.2
- **@midnight-ntwrk/wallet**: 5.0.0
- **@midnight-ntwrk/wallet-api**: 5.0.0
- **@midnight-ntwrk/zswap**: ^4.0.0

### ユーティリティ
- **ロギング**: pino 10.1.0 + pino-pretty 13.1.2
- **WebSocket**: ws 8.18.3
- **環境変数**: dotenv 17.2.3

### 開発ツール
- **TypeScript**: 5.9.3
- **テストフレームワーク**: Vitest 4.0.8
- **テストコンテナ**: testcontainers 11.7.2
- **ESLint**: 9.38.0（Contractと同じ構成）

### 主要コマンド
```bash
cd pkgs/cli

# スタンドアロン環境でテスト
pnpm test-api

# Testnet環境でテスト
pnpm test-against-testnet

# 実行環境
pnpm standalone          # スタンドアロン環境
pnpm testnet-local       # ローカルTestnet
pnpm testnet-remote      # リモートTestnet
pnpm testnet-remote-ps   # Proof Server付きリモートTestnet

# デプロイとインタラクション
pnpm deploy              # コントラクトデプロイ
pnpm increment           # incrementトランザクション実行

# ビルド
pnpm build               # TypeScriptビルド
pnpm typecheck           # 型チェックのみ
pnpm lint                # リント
```

## Frontend パッケージ

### フレームワーク & ランタイム
- **Next.js**: 16.0.0（App Router）
- **React**: 19.2.0
- **React DOM**: 19.2.0
- **TypeScript**: 5.x

### ビルドシステム
- **バンドラー**: Next.js内蔵（Turbopack/Webpack）
- **CSS**: Tailwind CSS 4.1.9 + PostCSS 8.5
- **PostCSS**: @tailwindcss/postcss 4.1.9

### UIコンポーネントライブラリ

#### shadcn/ui（New Yorkスタイル）
- **Radix UI**: Headlessアクセシビリティプリミティブ
  - @radix-ui/react-accordion: 1.2.2
  - @radix-ui/react-alert-dialog: 1.1.4
  - @radix-ui/react-aspect-ratio: 1.1.1
  - @radix-ui/react-avatar: 1.1.2
  - @radix-ui/react-checkbox: 1.1.3
  - @radix-ui/react-collapsible: 1.1.2
  - @radix-ui/react-context-menu: 2.2.4
  - @radix-ui/react-dialog: 1.1.4
  - @radix-ui/react-dropdown-menu: 2.1.4
  - @radix-ui/react-hover-card: 1.1.4
  - @radix-ui/react-label: 2.1.1
  - @radix-ui/react-menubar: 1.1.4
  - @radix-ui/react-navigation-menu: 1.2.3
  - @radix-ui/react-popover: 1.1.4
  - @radix-ui/react-progress: 1.1.1
  - @radix-ui/react-radio-group: 1.2.2
  - @radix-ui/react-scroll-area: 1.2.2
  - @radix-ui/react-select: 2.1.4
  - @radix-ui/react-separator: 1.1.1
  - @radix-ui/react-slider: 1.2.2
  - @radix-ui/react-slot: 1.1.1
  - @radix-ui/react-switch: 1.1.2
  - @radix-ui/react-tabs: 1.1.2
  - @radix-ui/react-toast: 1.2.4
  - @radix-ui/react-toggle: 1.1.1
  - @radix-ui/react-toggle-group: 1.1.1
  - @radix-ui/react-tooltip: 1.1.6

#### スタイリングユーティリティ
- **Lucide React**: 0.454.0（アイコンライブラリ）
- **class-variance-authority**: 0.7.1（コンポーネントバリアント管理）
- **tailwind-merge**: 2.5.5（条件付きclassName）
- **clsx**: 2.1.1（条件付きclassName）
- **tailwindcss-animate**: 1.0.7（アニメーション）
- **tw-animate-css**: 1.3.3（アニメーション）

### 主要ライブラリ

#### フォーム管理
- **react-hook-form**: 7.60.0
- **@hookform/resolvers**: 3.10.0
- **zod**: 3.25.76（バリデーション）

#### UI機能
- **next-themes**: 0.4.6（ダーク/ライトモード）
- **recharts**: latest（データ可視化）
- **sonner**: 1.7.4（トースト通知）
- **cmdk**: 1.0.4（コマンドパレット）
- **vaul**: 0.9.9（ドロワー）

#### 日付処理
- **date-fns**: 4.1.0
- **react-day-picker**: 9.8.0

#### その他
- **embla-carousel-react**: 8.5.1（カルーセル）
- **input-otp**: 1.4.1（OTP入力）
- **react-resizable-panels**: 2.1.7（リサイズ可能パネル）
- **@vercel/analytics**: latest（アナリティクス）
- **autoprefixer**: 10.4.20（CSSベンダープレフィックス）

### パスエイリアス
すべてのインポートで`@/`プレフィックスを使用:
- `@/components` - Reactコンポーネント
- `@/lib` - ユーティリティ関数
- `@/hooks` - カスタムReactフック
- `@/app` - Next.js appディレクトリ

### 主要コマンド
```bash
cd pkgs/frontend

# 開発サーバー起動（ポート3000）
pnpm dev

# プロダクションビルド
pnpm build

# プロダクションサーバー起動
pnpm start

# リント
pnpm lint
```

### 設定ノート
- TypeScript strictモード有効
- next.config.mjsでビルドエラーを無視（typescript.ignoreBuildErrors: true）
- 画像最適化無効（unoptimized: true）
- テーマ用CSS変数有効
- RSC（React Server Components）有効

## ルートレベルツール

### コードフォーマッター
- **Biome**: 2.3.2
  - インデントスタイル: タブ
  - クォートスタイル: ダブル
  - Import整理: 自動（organizeImports: "on"）
  - VCS統合: Git

### 共通コマンド
```bash
# ルートディレクトリで実行

# 全体のフォーマット
pnpm format

# 特定パッケージでコマンド実行
pnpm cli <command>      # CLIパッケージ
pnpm contract <command> # Contractパッケージ
pnpm frontend <command> # Frontendパッケージ
```

## Docker環境

### スタンドアロン環境
- **Docker Compose**: standalone.yml
- **サービス**:
  - Midnight Node
  - Midnight Indexer
  - Proof Server
  - PostgreSQL（Indexer用）

### 使用方法
```bash
cd pkgs/cli
docker compose -f standalone.yml pull    # イメージプル
docker compose -f standalone.yml up      # コンテナ起動
docker compose -f standalone.yml down    # コンテナ停止
```

## 開発環境

### システム要件
- **OS**: macOS (Darwin)
- **Node.js**: 18 LTS以上
- **pnpm**: 10.20.0
- **Docker**: 最新版（スタンドアロン環境用）

### エディタ設定
- **推奨エディタ**: VSCode
- **推奨拡張機能**:
  - Biome（コードフォーマット）
  - TypeScript（型チェック）
  - Tailwind CSS IntelliSense
  - ESLint

## TypeScript設定

### 共通設定
- **target**: ES6以上
- **module**: ESNext
- **moduleResolution**: bundler
- **strict**: true
- **esModuleInterop**: true
- **skipLibCheck**: true
- **resolveJsonModule**: true
- **isolatedModules**: true

### パッケージ固有設定
各パッケージに`tsconfig.json`と`tsconfig.build.json`が存在

## テスト環境

### テストフレームワーク
- **Vitest**: 4.0.8（全パッケージ共通）
- **Testcontainers**: 11.7.2（Docker環境テスト）

### テスト実行
```bash
# Contract
cd pkgs/contract && pnpm test

# CLI（スタンドアロン環境）
cd pkgs/cli && pnpm test-api

# CLI（Testnet環境）
cd pkgs/cli && pnpm test-against-testnet
```

## セキュリティ

### 環境変数管理
- `.env`ファイルで管理
- `.gitignore`に追加済み
- 機密情報のハードコード禁止

### 依存関係管理
- `pnpm-lock.yaml`でバージョン固定
- 定期的なセキュリティアップデート
- 不要な依存関係の削除

## パフォーマンス最適化

### Frontend
- Next.js App Routerによる自動最適化
- React Server Componentsの活用
- 画像最適化（設定により無効化可能）
- コード分割とレイジーローディング

### Contract
- Compactコンパイラによる最適化
- ゼロ知識証明の効率的な生成
- 状態遷移の最小化

## CI/CD（将来的な実装）

### 推奨ツール
- GitHub Actions
- Vercel（Frontend）
- Docker Hub（CLI/Contract）

### パイプライン
1. リント・フォーマットチェック
2. 型チェック
3. テスト実行
4. ビルド
5. デプロイ

## 参考リソース

### 公式ドキュメント
- **Midnight Docs**: https://docs.midnight.network/
- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev/
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **shadcn/ui Docs**: https://ui.shadcn.com/

### コミュニティ
- Midnight Discord
- GitHub Discussions
