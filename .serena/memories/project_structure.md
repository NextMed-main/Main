# NextMed プロジェクト構造

## ディレクトリ構成

```
Main/
├── .kiro/                      # Kiro IDE設定（要件定義・タスクリスト等）
│   └── specs/                 # プロダクト仕様書
├── .serena/                   # Serenaエージェント設定
├── compact/                   # Compact言語関連（現在は空）
├── references/                # 参考プロジェクト
│   └── helixchain/           # Midnightハッカソン受賞作品（実装例）
├── pkgs/                      # モノレポパッケージ
│   ├── contract/             # Midnightスマートコントラクト
│   │   ├── src/
│   │   │   ├── patient-registry.compact      # 患者レジストリコントラクト
│   │   │   ├── index.ts                     # エクスポート
│   │   │   ├── witnesses.ts                 # Witness実装
│   │   │   ├── managed/                     # コンパイル済みコントラクト
│   │   │   └── test/                        # テストファイル
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── cli/                  # CLIツール
│   │   ├── src/
│   │   │   ├── utils/              # ユーティリティ
│   │   │   ├── standalone.ts       # スタンドアロン実行
│   │   │   └── testnet-local.ts    # ローカルTestnet実行
│   │   ├── scripts/                # デプロイ・実行スクリプト
│   │   │   ├── deploy-patient-registry.ts
│   │   │   ├── register-patient.ts
│   │   │   └── get-stats.ts
│   │   ├── standalone.yml          # Docker Compose設定
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/             # Next.js Webアプリケーション
│       ├── app/                    # App Router
│       ├── components/             # UIコンポーネント
│       ├── package.json
│       └── tailwind.config.ts
├── AGENTS.md                  # AI駆動開発 共通ガイドライン（最重要）
├── package.json               # ルート設定（pnpm v10.20.0）
└── pnpm-workspace.yaml        # ワークスペース定義
```

## 主要設定ファイル
- **package.json**: モノレポのルート設定
- **biome.json**: コードフォーマッター設定
- **AGENTS.md**: AIエージェント向けの行動指針と品質基準

## 開発フロー

### 1. Contract開発
- パス: `pkgs/contract`
- コマンド: `pnpm compact`, `pnpm build`, `pnpm test`

### 2. CLI開発
- パス: `pkgs/cli`
- コマンド: `pnpm deploy:patient-registry`, `pnpm register:patient`

### 3. Frontend開発
- パス: `pkgs/frontend`
- コマンド: `pnpm dev`
