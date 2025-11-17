# Midnight Network RPC CLI Tool

Midnight NetworkのRPCエンドポイントと対話するためのコマンドラインインターフェースツールです。

## インストール

```bash
cd rpc
pnpm install
```

## ビルド

```bash
pnpm run build
```

## 開発

### リントとフォーマット

このプロジェクトは[Biome](https://biomejs.dev/) v2を使用しています。

```bash
# リントチェック
pnpm run lint

# リントとフォーマットの自動修正
pnpm run lint:fix

# フォーマットのみ
pnpm run format

# 型チェック
pnpm run typecheck
```

## 使用方法

### 基本的な使い方

```bash
# ヘルプを表示
pnpm run dev --help

# 開発モードで実行
pnpm run dev -- <method> [options]

# ビルド後に実行
pnpm run build
pnpm run start -- <method> [options]
```

### グローバルオプション

* `-e, --endpoint <url>`: RPCエンドポイントURL（デフォルト: `https://rpc.testnet-02.midnight.network/`）
* `-t, --timeout <ms>`: リクエストタイムアウト（ミリ秒、デフォルト: 30000）
* `-h, --help`: ヘルプを表示
* `-V, --version`: バージョンを表示

### RPCメソッド

すべてのRPCメソッドは直接コマンドとして呼び出すことができます。

#### システム情報

```bash
# チェーン名を取得
pnpm run dev -- system_chain

# ノード名を取得
pnpm run dev -- system_name

# ノードバージョンを取得
pnpm run dev -- system_version

# ノードのヘルス状態を取得
pnpm run dev -- system_health

# 接続されているピアのリストを取得
pnpm run dev -- system_peers

# チェーンのプロパティを取得
pnpm run dev -- system_properties
```

#### ブロックチェーン情報

```bash
# ブロックのヘッダーとボディを取得
pnpm run dev -- chain_getBlock [hash]

# 特定のブロックのハッシュを取得
pnpm run dev -- chain_getBlockHash [blockNumber]

# 最終確定されたブロックのハッシュを取得
pnpm run dev -- chain_getFinalizedHead

# 特定のブロックのヘッダーを取得
pnpm run dev -- chain_getHeader [hash]
```

#### ストレージとランタイム状態

```bash
# ストレージエントリを取得
pnpm run dev -- state_getStorage --key <key> [--at <hash>]

# ランタイムメタデータを取得
pnpm run dev -- state_getMetadata [--at <hash>]

# ランタイムバージョンを取得
pnpm run dev -- state_getRuntimeVersion [--at <hash>]
```

#### RPCメソッド

```bash
# 利用可能なRPCメソッドのリストを取得
pnpm run dev -- rpc_methods
```

#### Midnight固有メソッド

```bash
# JSONエンコードされたコントラクト状態を取得
pnpm run dev -- midnight_jsonContractState --address <address> [--block <hash>]

# 生の（バイナリエンコードされた）コントラクト状態を取得
pnpm run dev -- midnight_contractState --address <address> [--block <hash>]

# 未請求トークンまたは報酬の額を取得
pnpm run dev -- midnight_unclaimedAmount --beneficiary <beneficiary> [--at <hash>]

# ZSwapチェーン状態を取得
pnpm run dev -- midnight_zswapChainState --address <address> [--block <hash>]

# サポートされているRPC APIバージョンのリストを取得
pnpm run dev -- midnight_apiVersions

# レジャーバージョンを取得
pnpm run dev -- midnight_ledgerVersion [--at <hash>]
```

### カスタムRPCコール

任意のRPCメソッドを呼び出すことができます:

```bash
pnpm run dev -- call --method <method> [--params <params>]
```

例:

```bash
# system_chainメソッドを呼び出す（パラメータなし）
pnpm run dev -- call --method system_chain --params "[]"

# パラメータ付きで呼び出す
pnpm run dev -- call --method midnight_jsonContractState --params '["contract_address"]'
```

## 使用例

### チェーン情報を取得

```bash
pnpm run dev -- system_chain
# 出力: "testnet-02-1"
```

### APIバージョンを取得

```bash
pnpm run dev -- midnight_apiVersions
# 出力: [2]
```

### コントラクト状態を取得

```bash
pnpm run dev -- midnight_jsonContractState --address "your_contract_address"
```

### トランザクション検索

```bash
# トランザクションハッシュで検索
pnpm run dev -- search-tx <transaction_hash>

# ブロック範囲を指定して検索
pnpm run dev -- search-tx <transaction_hash> --startBlock 1000 --endBlock 2000

# 最大検索ブロック数を指定
pnpm run dev -- search-tx <transaction_hash> --maxBlocks 500
```

### アカウントアドレスでトランザクション検索

```bash
# アカウントアドレスに関連するトランザクションを検索
pnpm run dev -- search-account <account_address>

# ブロック範囲を指定して検索
pnpm run dev -- search-account <account_address> --startBlock 1000 --endBlock 2000

# 最大検索ブロック数を指定（デフォルト: 100）
pnpm run dev -- search-account <account_address> --maxBlocks 200
```

### カスタムエンドポイントを使用

```bash
pnpm run dev -- --endpoint https://custom-endpoint.com system_chain
```

### ヘルプの表示

```bash
# メインコマンドのヘルプ
pnpm run dev --help

# 特定のメソッドのヘルプ
pnpm run dev -- system_chain --help
pnpm run dev -- midnight_jsonContractState --help
pnpm run dev -- search-tx --help
pnpm run dev -- search-account --help
```

## ドキュメント

* [RPC_API.md](./RPC_API.md) - 詳細なRPC APIリファレンス
* [INDEXER.md](./INDEXER.md) - Midnight Network Indexerについて

## ライセンス

Apache-2.0

