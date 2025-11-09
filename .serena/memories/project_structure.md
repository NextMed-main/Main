# NextMed プロジェクト構造

## ディレクトリ構成

```
Main/
├── .kiro/                      # Kiro IDE設定
│   ├── steering/              # ステアリングルール
│   │   ├── product.md        # プロダクト概要
│   │   ├── tech.md           # 技術スタック
│   │   └── structure.md      # プロジェクト構造
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
│       │   └── institution-dashboard.tsx
│       ├── lib/                   # ユーティリティ
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

## パッケージ詳細

### Contract パッケージ (`pkgs/contract`)

#### 目的
Midnight Blockchainで実行されるスマートコントラクトの開発

#### 主要ファイル
- **counter.compact**: Compact言語で記述されたスマートコントラクト
  - 公開状態（ledger）の定義
  - 状態遷移関数（circuit）の実装
- **witnesses.ts**: Witness関数のTypeScript実装
- **index.ts**: コントラクトのエクスポート
- **managed/**: Compactコンパイラが生成したファイル

#### ビルドフロー
1. `pnpm compact`: counter.compactをコンパイル → managed/counterに出力
2. `pnpm build`: TypeScriptをコンパイル → dist/に出力

### CLI パッケージ (`pkgs/cli`)

#### 目的
コマンドラインからコントラクトとインタラクションするツール

#### 主要ファイル
- **standalone.ts**: スタンドアロン環境での実行
- **testnet-local.ts**: ローカルTestnet環境での実行
- **utils/**: ユーティリティ関数
  - testnet-remote.ts: リモートTestnet接続
  - testnet-remote-start-proof-server.ts: Proof Server起動
- **scripts/**: デプロイ・実行スクリプト
  - deploy.ts: コントラクトデプロイ
  - increment.ts: incrementトランザクション実行

#### 実行環境
- **Standalone**: Docker Composeでローカル環境を構築
- **Testnet Local**: ローカルでTestnetに接続
- **Testnet Remote**: リモートTestnetに接続

### Frontend パッケージ (`pkgs/frontend`)

#### 目的
患者、研究者、医療機関向けのWebインターフェース

#### アーキテクチャ
- **App Router**: Next.js 16のApp Router使用
- **コンポーネント構成**:
  - `landing-page.tsx`: ランディングページ
  - `login-screen.tsx`: ログイン画面
  - `patient-dashboard.tsx`: 患者ダッシュボード
  - `researcher-dashboard.tsx`: 研究者ダッシュボード
  - `institution-dashboard.tsx`: 医療機関ダッシュボード
- **UI**: shadcn/ui + Radix UI
- **スタイリング**: Tailwind CSS

#### ルーティング
- `/`: ランディングページ → ログイン → ロール別ダッシュボード
- ロール: `patient` | `researcher` | `institution`

## 設定ファイル

### ルートレベル
- **package.json**: モノレポのルート設定
  - スクリプト: `cli`, `contract`, `frontend`, `format`
- **pnpm-workspace.yaml**: ワークスペース定義
- **biome.json**: コードフォーマッター設定
  - インデント: タブ
  - クォート: ダブル
  - Import整理: 自動

### パッケージレベル
- **tsconfig.json**: TypeScript設定
- **package.json**: パッケージ固有の依存関係とスクリプト

## 開発フロー

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

## 依存関係の流れ

```
frontend → contract (型定義)
cli → contract (コントラクトインタラクション)
```

- Frontend と CLI は Contract パッケージに依存
- Contract は独立して開発・テスト可能

## ビルド成果物

### Contract
- `dist/`: TypeScriptコンパイル済みファイル
- `dist/managed/`: Compactコンパイル済みファイル

### CLI
- `dist/`: TypeScriptコンパイル済みファイル

### Frontend
- `.next/`: Next.jsビルド成果物
- `out/`: 静的エクスポート（設定による）
