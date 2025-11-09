# NextMed プロジェクト概要

## プロジェクトの目的

NextMedは、Midnight Blockchainを活用した次世代医療データプラットフォームです。患者のデータ主権を完全に保護しながら、医療AIの発展を加速させることを目的としています。

### 主要な特徴
- **ゼロ知識証明（ZK）技術**: 患者のEHRデータを暗号化したまま扱い、生データへのアクセスを完全に遮断
- **ZK-ML（ゼロ知識機械学習）**: AIモデルの分析結果と証明のみを提供し、生データは一切漏洩させない
- **国内医療基盤連携**: さくらねっと、セルビアネット、富士通EHRシステムとの連携

## ターゲットユーザー
1. **患者**: 自身の医療データの所有者
2. **医療機関**: データ提供者（SS-MIX2対応ネットワーク、富士通EHRシステム導入機関）
3. **研究者・AI開発者**: 機密データを分析したい組織・個人

## 技術スタック

### モノレポ構成
- **パッケージマネージャー**: pnpm (v10.20.0)
- **ワークスペース構成**: 
  - `pkgs/contract`: Midnightスマートコントラクト
  - `pkgs/cli`: CLIツール
  - `pkgs/frontend`: Next.js Webアプリケーション

### Contract パッケージ
- **言語**: Compact (Midnight専用スマートコントラクト言語)
- **ランタイム**: @midnight-ntwrk/compact-runtime (v0.9.0)
- **テスト**: Vitest
- **ビルド**: TypeScript

### CLI パッケージ
- **ランタイム**: Node.js (ES Modules)
- **Midnight SDK**: 
  - @midnight-ntwrk/midnight-js-contracts
  - @midnight-ntwrk/wallet
  - @midnight-ntwrk/ledger
- **テスト**: Vitest + Testcontainers
- **ロギング**: Pino

### Frontend パッケージ
- **フレームワーク**: Next.js 16.0.0 (App Router)
- **UI**: React 19.2.0
- **スタイリング**: Tailwind CSS 4.1.9
- **コンポーネント**: Radix UI + shadcn/ui
- **フォーム**: React Hook Form + Zod
- **アイコン**: Lucide React

## 開発環境
- **OS**: macOS (Darwin)
- **コードフォーマッター**: Biome (v2.3.2)
- **バージョン管理**: Git
- **言語**: TypeScript 5.x
