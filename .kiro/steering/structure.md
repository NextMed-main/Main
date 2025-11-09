# NextMed プロジェクト構造

## ディレクトリ構成

```
Main/
├── .kiro/                      # Kiro IDE設定
│   ├── steering/              # ステアリングルール
│   │   ├── product.md        # プロダクト概要
│   │   ├── tech.md           # 技術スタック
│   │   └── structure.md      # プロジェクト構造（このファイル）
│   └── settings/             # IDE設定
├── .serena/                   # Serenaエージェント設定
├── pkgs/                      # モノレポパッケージ
│   ├── contract/             # Midnightスマートコントラクト
│   │   ├── src/
│   │   │   ├── counter.compact      # Compactコントラクト
│   │   │   ├── index.ts             # エクスポート
│   │   │   ├── witnesses.ts         # Witness実装
│   │   │   ├── managed/             # コンパイル済みコントラクト
│   │   │   └── test/                # テストファイル
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── cli/                  # CLIツール
│   │   ├── src/
│   │   │   ├── utils/              # ユーティリティ
│   │   │   ├── standalone.ts       # スタンドアロン実行
│   │   │   ├── testnet-local.ts    # ローカルTestnet実行
│   │   │   └── ...
│   │   ├── scripts/                # デプロイ・実行スクリプト
│   │   │   ├── deploy.ts
│   │   │   └── increment.ts
│   │   ├── standalone.yml          # Docker Compose設定
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/             # Next.js Webアプリケーション
│       ├── app/                    # App Router
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── components/             # Reactコンポーネント
│       │   ├── ui/                # shadcn/uiコンポーネント
│       │   ├── landing-page.tsx
│       │   ├── login-screen.tsx
│       │   ├── patient-dashboard.tsx
│       │   ├── researcher-dashboard.tsx
│       │   ├── institution-dashboard.tsx
│       │   └── theme-provider.tsx
│       ├── lib/                   # ユーティリティ
│       │   └── utils.ts
│       ├── hooks/                 # カスタムフック
│       ├── public/                # 静的アセット
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.mjs
│       ├── tailwind.config.ts
│       └── components.json
├── AGENTS.md                  # AI開発ガイドライン
├── README.md                  # プロジェクトREADME
├── package.json               # ルートpackage.json
├── pnpm-workspace.yaml        # pnpmワークスペース設定
├── pnpm-lock.yaml             # 依存関係ロックファイル
├── biome.json                 # Biome設定
└── .gitignore                 # Git無視ファイル
```

## パッケージ構成

### Contract パッケージ (`pkgs/contract`)

Midnight Blockchainで実行されるスマートコントラクト

**主要ファイル:**
- `counter.compact`: Compact言語で記述されたスマートコントラクト
- `witnesses.ts`: Witness関数のTypeScript実装
- `index.ts`: コントラクトのエクスポート
- `managed/`: Compactコンパイラが生成したファイル

**技術スタック:**
- Compact言語（Midnight専用）
- @midnight-ntwrk/compact-runtime (v0.9.0)
- TypeScript 5.x
- Vitest（テスト）

### CLI パッケージ (`pkgs/cli`)

コマンドラインからコントラクトとインタラクションするツール

**主要ファイル:**
- `standalone.ts`: スタンドアロン環境での実行
- `testnet-local.ts`: ローカルTestnet環境での実行
- `utils/`: ユーティリティ関数
- `scripts/`: デプロイ・実行スクリプト

**技術スタック:**
- Node.js (ES Modules)
- Midnight SDK (@midnight-ntwrk/*)
- Testcontainers（テスト）
- Pino（ロギング）

### Frontend パッケージ (`pkgs/frontend`)

患者、研究者、医療機関向けのWebインターフェース

**主要ファイル:**
- `app/`: Next.js App Router
- `components/`: Reactコンポーネント
  - `landing-page.tsx`: ランディングページ
  - `login-screen.tsx`: ログイン画面
  - `patient-dashboard.tsx`: 患者ダッシュボード
  - `researcher-dashboard.tsx`: 研究者ダッシュボード
  - `institution-dashboard.tsx`: 医療機関ダッシュボード

**技術スタック:**
- Next.js 16.0.0 (App Router)
- React 19.2.0
- Tailwind CSS 4.1.9
- shadcn/ui + Radix UI
- React Hook Form + Zod

## アーキテクチャパターン

### モノレポ構成

pnpmワークスペースを使用したモノレポ構成：
- 各パッケージは独立して開発・テスト可能
- 共通の依存関係はルートで管理
- パッケージ間の依存関係は明確に定義

### 依存関係の流れ

```
frontend → contract (型定義)
cli → contract (コントラクトインタラクション)
```

### Contract パッケージのアーキテクチャ

**Compact言語の3層構造:**
1. **Ledger（公開状態）**: ブロックチェーン上の公開データ
2. **Circuit（状態遷移関数）**: ゼロ知識証明として実行
3. **Witness（プライベート入力）**: オフチェーンで実行

### Frontend パッケージのアーキテクチャ

**コンポーネント構成:**
- **Page Components**: ロール別ダッシュボード（patient, researcher, institution）
- **UI Components**: 再利用可能なshadcn/uiコンポーネント（`components/ui/`）
- **Feature Components**: ロール固有のコンポーネント

**状態管理:**
- クライアントサイド状態: React hooks（useState, useRef）
- グローバル状態管理ライブラリなし（Redux, Zustand等）
- Props drillingでコンポーネント間通信

**ルーティングパターン:**
1. ランディングページ → ログイン画面 → ロール別ダッシュボード
2. ロール状態は`app/page.tsx`で管理
3. 型: `UserRole = "patient" | "researcher" | "institution" | null`

**コンポーネント規約:**
- すべてのページレベルコンポーネントは`"use client"`ディレクティブを使用
- Props interfaceはインラインまたは別の型として定義
- ナビゲーション用のコールバックProps（例: `onLogout`, `onGetStarted`）
- shadcn/uiコンポーネントは`@/components/ui/`からインポート

**スタイリングアプローチ:**
- すべてのスタイリングにTailwindユーティリティクラスを使用
- テーマカラーにCSS変数を使用（primary, secondary, accent, success等）
- モバイルファーストのレスポンシブデザイン
- グラデーション背景: `bg-gradient-to-br from-primary/5 via-background to-secondary/5`

## ファイル命名規則

### Contract パッケージ
- Compactファイル: kebab-case（例: `counter.compact`）
- TypeScriptファイル: kebab-case（例: `witnesses.ts`）

### CLI パッケージ
- TypeScriptファイル: kebab-case（例: `testnet-local.ts`）
- スクリプトファイル: kebab-case（例: `deploy.ts`）

### Frontend パッケージ
- Reactコンポーネント: kebab-case（例: `patient-dashboard.tsx`）
- ユーティリティ: kebab-case（例: `use-toast.ts`）
- 設定ファイル: kebab-caseまたは標準名（例: `next.config.mjs`）

## インポート規約

### Frontend パッケージ

常にパスエイリアスを使用:
```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
```

クロスディレクトリインポートに`../`や`./`のような相対インポートは使用しない。

### Contract/CLI パッケージ

相対インポートまたは絶対インポートを使用:
```typescript
import { Contract } from './contract'
import { witnesses } from './witnesses'
```

## ビルドフロー

### Contract パッケージ
1. `pnpm compact`: counter.compactをコンパイル → managed/counterに出力
2. `pnpm build`: TypeScriptをコンパイル → dist/に出力

### CLI パッケージ
1. `pnpm build`: TypeScriptをコンパイル → dist/に出力

### Frontend パッケージ
1. `pnpm build`: Next.jsプロダクションビルド → .next/に出力

## 開発ワークフロー

### 1. Contract開発
```bash
cd pkgs/contract
# Compactコントラクト編集
vim src/counter.compact
# コンパイル
pnpm compact
# TypeScriptビルド
pnpm build
# テスト
pnpm test
```

### 2. CLI開発
```bash
cd pkgs/cli
# スタンドアロン環境で実行
pnpm standalone
# または
# Testnet環境で実行
pnpm testnet-local
```

### 3. Frontend開発
```bash
cd pkgs/frontend
# 開発サーバー起動
pnpm dev
# ブラウザで http://localhost:3000 を開く
```

## 設定ファイル

### ルートレベル
- **package.json**: モノレポのルート設定
- **pnpm-workspace.yaml**: ワークスペース定義
- **biome.json**: コードフォーマッター設定
  - インデント: タブ
  - クォート: ダブル
  - Import整理: 自動

### パッケージレベル
- **tsconfig.json**: TypeScript設定
- **package.json**: パッケージ固有の依存関係とスクリプト

## ビルド成果物

### Contract
- `dist/`: TypeScriptコンパイル済みファイル
- `dist/managed/`: Compactコンパイル済みファイル

### CLI
- `dist/`: TypeScriptコンパイル済みファイル

### Frontend
- `.next/`: Next.jsビルド成果物
- `out/`: 静的エクスポート（設定による）

## 重要な注意事項

### Compact コントラクト
- Compact言語バージョン: `>= 0.16 && <= 0.25`
- 必ず`CompactStandardLibrary`をインポート
- 公開状態は`export ledger`で定義
- 状態遷移関数は`export circuit`で定義

### TypeScript
- すべてのパッケージでTypeScript 5.x使用
- 厳格な型チェック有効
- `any`型の使用を避ける

### テスト
- すべてのパッケージでVitestを使用
- 単体テストと統合テストを組み合わせる
- Docker環境でのテストをサポート（CLI）

### セキュリティ
- 機密情報は環境変数で管理
- `.env`ファイルは`.gitignore`に追加
- Witness関数でのみプライベートデータを扱う
