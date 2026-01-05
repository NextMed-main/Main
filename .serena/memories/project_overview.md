# NextMed プロジェクト概要

## プロジェクトの目的

NextMedは、Midnight Blockchainを活用した次世代医療データプラットフォームです。
「患者レジストリ（Patient Registry）」を中心に、患者のプライバシーを保護しながら、医療データの安全な管理と活用を実現することを目的としています。

### 主要な特徴
- **Midnight Blockchain**: ゼロ知識証明（ZK）技術によるプライバシー保護
- **Patient Registry**: 患者情報のオンチェーン登録と管理
- **AI駆動開発**: `AGENTS.md` に基づく高品質なコード実装
- **HelixChain Reference**: 過去の優秀実装（`references/helixchain`）を参考にした堅牢な設計

## 技術スタック

### モノレポ構成
- **パッケージマネージャー**: pnpm (v10.20.0)
- **パッケージ**:
  - `pkgs/contract`: Midnight Smart Contract (Compact)
  - `pkgs/cli`: Interaction & Deployment Scripts (Node.js)
  - `pkgs/frontend`: Web Application (Next.js 16.0.0, React 19.2.0)

### 主要技術
- **Contract**: Compact v0.16-0.25, @midnight-ntwrk/compact-runtime v0.8.1
- **Frontend**: Tailwind CSS 4.1.9, Radix UI, shadcn/ui
- **Formatter**: Biome v2.3.2
