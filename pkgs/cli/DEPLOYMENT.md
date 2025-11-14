# Patient Registry Contract Deployment Guide

このドキュメントでは、Patient Registryコントラクトを各種環境にデプロイする手順を説明します。

## 目次

1. [前提条件](#前提条件)
2. [環境変数の設定](#環境変数の設定)
3. [Standalone環境へのデプロイ](#standalone環境へのデプロイ)
4. [Testnet環境へのデプロイ](#testnet環境へのデプロイ)
5. [デプロイの検証](#デプロイの検証)
6. [トラブルシューティング](#トラブルシューティング)

## 前提条件

### 必要なツール

- Node.js 18 LTS以上
- pnpm 10.20.0
- Docker Desktop（Standalone環境の場合）

### 事前準備

1. プロジェクトのルートディレクトリに移動
   ```bash
   cd pkgs/cli
   ```

2. 依存関係のインストール
   ```bash
   pnpm install
   ```

3. コントラクトのコンパイル
   ```bash
   cd ../contract
   pnpm compact
   pnpm build
   cd ../cli
   ```

## 環境変数の設定

### .envファイルの作成

`.env.example`をコピーして`.env`ファイルを作成します：

```bash
cp .env.example .env
```

### 環境変数の説明

```bash
# デプロイ先ネットワーク
# Options: standalone, testnet-local, testnet
NETWORK_ENV_VAR=testnet

# ウォレットシード（必須）
# 本番環境では必ず新しいシードを生成してください
SEED_ENV_VAR=your-wallet-seed-here

# ウォレット状態のキャッシュファイル名（オプション）
# 指定しない場合は自動生成されます
CACHE_FILE_ENV_VAR=

# カスタムRPCエンドポイント（オプション）
# RPC_URL=https://rpc.testnet-02.midnight.network/

# カスタムIndexerエンドポイント（オプション）
# INDEXER_URL=https://indexer.testnet-02.midnight.network/
```

### セキュリティ上の注意

⚠️ **重要**: `.env`ファイルには機密情報が含まれます。

- `.env`ファイルは絶対にGitにコミットしないでください
- 本番環境では必ず新しいシードを生成してください
- シードは安全な場所に保管してください

## Standalone環境へのデプロイ

Standalone環境は、ローカルDocker環境でMidnightネットワークを実行します。

### 1. Docker環境の起動

```bash
docker compose -f standalone.yml pull
docker compose -f standalone.yml up -d
```

### 2. 環境変数の設定

```bash
export NETWORK_ENV_VAR=standalone
export SEED_ENV_VAR=test-seed-for-standalone
```

または`.env`ファイルを編集：

```bash
NETWORK_ENV_VAR=standalone
SEED_ENV_VAR=test-seed-for-standalone
```

### 3. デプロイの実行

```bash
pnpm deploy:patient-registry
```

### 4. デプロイ結果の確認

成功すると、以下のような出力が表示されます：

```
✅ Patient Registry contract deployed successfully!
Contract Address: 0x1234567890abcdef...
Transaction Hash: 0xabcdef1234567890...

Deployment info saved to: deployment-patient-registry.json
```

### 5. Docker環境の停止（オプション）

```bash
docker compose -f standalone.yml down
```

## Testnet環境へのデプロイ

Testnet環境は、Midnight Testnet-02（公開テストネットワーク）にデプロイします。

### 1. ウォレットの準備

#### 新しいシードの生成

```bash
# Node.jsで新しいシードを生成
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### tDUSTの取得

1. [Midnight Testnet Faucet](https://faucet.testnet-02.midnight.network/)にアクセス
2. ウォレットアドレスを入力してtDUSTをリクエスト
3. トランザクションが完了するまで待機（通常1-2分）

### 2. 環境変数の設定

```bash
export NETWORK_ENV_VAR=testnet
export SEED_ENV_VAR=your-testnet-wallet-seed
```

または`.env`ファイルを編集：

```bash
NETWORK_ENV_VAR=testnet
SEED_ENV_VAR=your-testnet-wallet-seed
```

### 3. デプロイの実行

```bash
pnpm deploy:patient-registry
```

### 4. デプロイ結果の確認

成功すると、`deployment-patient-registry.json`ファイルが作成されます：

```json
{
  "contractAddress": "0x1234567890abcdef...",
  "transactionHash": "0xabcdef1234567890...",
  "deployedAt": "2025-01-15T04:30:00.000Z",
  "network": "testnet",
  "deployer": "addr1...",
  "initialState": {
    "registrationCount": 0,
    "maleCount": 0,
    "femaleCount": 0,
    "otherCount": 0
  }
}
```

## デプロイの検証

デプロイが成功したら、検証スクリプトを実行してコントラクトの動作を確認します。

### 検証スクリプトの実行

```bash
pnpm verify:patient-registry
```

### 検証内容

検証スクリプトは以下を確認します：

1. デプロイ情報の読み込み
2. コントラクトへの接続
3. 初期状態の確認（カウンター = 0）
4. テスト操作の実行（increment）
5. 更新後の状態の確認

### 成功時の出力

```
✅ Contract verification successful!
Contract is working as expected.
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. "Wallet seed is required"

**原因**: `SEED_ENV_VAR`環境変数が設定されていない

**解決方法**:
```bash
export SEED_ENV_VAR=your-wallet-seed
```

#### 2. "Network connection failed"

**原因**: ネットワークに接続できない

**解決方法**:
- Standalone環境の場合: Dockerコンテナが起動しているか確認
  ```bash
  docker compose -f standalone.yml ps
  ```
- Testnet環境の場合: インターネット接続を確認

#### 3. "Insufficient funds"

**原因**: ウォレットの残高不足

**解決方法**:
- Standalone環境: Faucetから自動的に資金が供給されるまで待機
- Testnet環境: [Faucet](https://faucet.testnet-02.midnight.network/)からtDUSTを取得

#### 4. "Deployment info file not found"

**原因**: デプロイが完了していない、または`deployment-patient-registry.json`が削除された

**解決方法**:
```bash
# デプロイを再実行
pnpm deploy:patient-registry
```

#### 5. "Failed to compile contract"

**原因**: コントラクトがコンパイルされていない

**解決方法**:
```bash
cd ../contract
pnpm compact
pnpm build
cd ../cli
```

### ログの確認

詳細なログは以下のディレクトリに保存されます：

- Standalone: `logs/standalone/`
- Testnet: `logs/testnet/`

```bash
# 最新のログを確認
tail -f logs/testnet/combined.log
```

### デバッグモード

より詳細なログを出力する場合：

```bash
DEBUG='*' pnpm deploy:patient-registry
```

## 次のステップ

デプロイが成功したら、以下を実施してください：

1. **デプロイ情報の保存**
   - `deployment-patient-registry.json`を安全な場所にバックアップ
   - コントラクトアドレスを記録

2. **フロントエンドの設定**
   - コントラクトアドレスをフロントエンドの設定に追加
   - 環境変数を更新

3. **監視の設定**
   - コントラクトの状態を定期的に確認
   - トランザクション履歴を監視

4. **ドキュメントの更新**
   - デプロイ情報をチームと共有
   - 運用手順書を作成

## 参考資料

- [Midnight Documentation](https://docs.midnight.network/)
- [Midnight Testnet Faucet](https://faucet.testnet-02.midnight.network/)
- [Midnight Explorer](https://explorer.testnet-02.midnight.network/)
- [Counter Example](https://github.com/midnight-ntwrk/example-counter)

## サポート

問題が解決しない場合は、以下を確認してください：

1. [Midnight Discord](https://discord.gg/midnight)でコミュニティに質問
2. [GitHub Issues](https://github.com/midnight-ntwrk/midnight/issues)で既知の問題を確認
3. プロジェクトのREADME.mdを参照

---

**最終更新**: 2025-01-15
**バージョン**: 1.0.0
