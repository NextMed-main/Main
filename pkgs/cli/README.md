# NextMed CLI

NextMedプロジェクトのコマンドラインインターフェース（CLI）ツールです。

## 概要

このパッケージには、Midnight Blockchainにデプロイされたスマートコントラクトとインタラクションするためのスクリプトが含まれています。

## 機能

### Counter Contract（サンプル）

- デプロイ: `pnpm deploy`
- インクリメント: `pnpm increment`

### Patient Registry Contract

- デプロイ: `pnpm deploy:patient-registry`
- 検証: `pnpm verify:patient-registry`

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. コントラクトのコンパイル

```bash
cd ../contract
pnpm compact
pnpm build
cd ../cli
```

### 3. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成：

```bash
cp .env.example .env
```

`.env`ファイルを編集して、必要な環境変数を設定：

```bash
NETWORK_ENV_VAR=testnet
SEED_ENV_VAR=your-wallet-seed-here
```

## 使い方

### Patient Registryのデプロイ

詳細な手順は[DEPLOYMENT.md](./DEPLOYMENT.md)を参照してください。

#### Standalone環境（ローカル）

```bash
# Docker環境を起動
docker compose -f standalone.yml up -d

# 環境変数を設定
export NETWORK_ENV_VAR=standalone
export SEED_ENV_VAR=test-seed-for-standalone

# デプロイ
pnpm deploy:patient-registry

# 検証
pnpm verify:patient-registry
```

#### Testnet環境

```bash
# 環境変数を設定
export NETWORK_ENV_VAR=testnet
export SEED_ENV_VAR=your-testnet-wallet-seed

# デプロイ
pnpm deploy:patient-registry

# 検証
pnpm verify:patient-registry
```

## スクリプト一覧

### 開発・テスト

- `pnpm test-api`: Standalone環境でAPIテストを実行
- `pnpm test-against-testnet`: Testnet環境でテストを実行
- `pnpm build`: TypeScriptをビルド
- `pnpm typecheck`: 型チェックのみ実行
- `pnpm lint`: ESLintでコードをチェック

### 実行環境

- `pnpm standalone`: Standalone環境で実行
- `pnpm testnet-local`: ローカルTestnet環境で実行
- `pnpm testnet-remote`: リモートTestnet環境で実行
- `pnpm testnet-remote-ps`: Proof Server付きリモートTestnet環境で実行

### Counter Contract

- `pnpm deploy`: Counterコントラクトをデプロイ
- `pnpm increment`: Counterをインクリメント

### Patient Registry Contract

- `pnpm deploy:patient-registry`: Patient Registryコントラクトをデプロイ
- `pnpm verify:patient-registry`: デプロイされたコントラクトを検証

## ディレクトリ構成

```
pkgs/cli/
├── scripts/              # デプロイ・検証スクリプト
│   ├── deploy.ts
│   ├── deploy-patient-registry.ts
│   ├── increment.ts
│   └── verify-patient-registry.ts
├── src/                  # ソースコード
│   ├── api.ts           # API関数
│   ├── config.ts        # 環境設定
│   ├── utils/           # ユーティリティ
│   └── test/            # テストコード
├── logs/                # ログファイル（自動生成）
├── .env                 # 環境変数（要作成）
├── .env.example         # 環境変数のサンプル
├── DEPLOYMENT.md        # デプロイ手順書
├── package.json
└── README.md           # このファイル
```

## トラブルシューティング

### よくある問題

1. **"Wallet seed is required"**
   - 解決: `SEED_ENV_VAR`環境変数を設定してください

2. **"Network connection failed"**
   - Standalone: Dockerコンテナが起動しているか確認
   - Testnet: インターネット接続を確認

3. **"Insufficient funds"**
   - Testnet: [Faucet](https://faucet.testnet-02.midnight.network/)からtDUSTを取得

詳細は[DEPLOYMENT.md](./DEPLOYMENT.md)のトラブルシューティングセクションを参照してください。

## 参考資料

- [Midnight Documentation](https://docs.midnight.network/)
- [Midnight Testnet Faucet](https://faucet.testnet-02.midnight.network/)
- [Counter Example](https://github.com/midnight-ntwrk/example-counter)
- [デプロイ手順書](./DEPLOYMENT.md)

## ライセンス

MIT License

---

**最終更新**: 2025-01-15
