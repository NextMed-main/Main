# Midnight Network RPC API リファレンス

Midnight NetworkはPolkadot RPCに準拠したJSON-RPCインターフェースを提供しています。このドキュメントでは、Polkadot標準のRPCメソッドと、Midnight固有のRPCメソッドについて説明します。

## 目次

* [基本情報](#基本情報)
* [Polkadot標準RPCメソッド](#polkadot標準rpcメソッド)
* [Midnight固有RPCメソッド](#midnight固有rpcメソッド)
* [使用例](#使用例)

## 基本情報

### エンドポイント

* **Testnet**: `https://rpc.testnet-02.midnight.network/`

### JSON-RPC形式

Midnight NetworkはJSON-RPC 2.0標準に準拠しています。すべてのリクエストは以下の形式で送信します:

```json
{
  "jsonrpc": "2.0",
  "method": "method_name",
  "params": [],
  "id": 1
}
```

### リクエスト例

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "system_chain",
    "params": [],
    "id": 1
  }' \
  https://rpc.testnet-02.midnight.network/
```

## Polkadot標準RPCメソッド

Midnight NetworkはPolkadot RPC標準に準拠しており、以下のカテゴリのメソッドをサポートしています。

### author

トランザクションの送信と管理に関するメソッド。

* `author_pendingExtrinsics()`: 保留中のextrinsicを取得
* `author_submitExtrinsic(extrinsic: Extrinsic)`: extrinsicを送信
* `author_submitAndWatchExtrinsic(extrinsic: Extrinsic)`: extrinsicを送信して監視

### chain

ブロックチェーンの状態とブロック情報を取得するメソッド。

* `chain_getBlock(hash?: BlockHash)`: ブロックのヘッダーとボディを取得（ブロック内のextrinsicを含む）
* `chain_getBlockHash(blockNumber?: BlockNumber)`: 特定のブロックのハッシュを取得
* `chain_getFinalizedHead()`: 最終確定されたブロックのハッシュを取得
* `chain_getHeader(hash?: BlockHash)`: 特定のブロックのヘッダーを取得
* `chain_subscribeNewHeads()`: 新しいブロックヘッダーを購読
* `chain_subscribeFinalizedHeads()`: 最終確定されたブロックヘッダーを購読

**注意**: Polkadot/Substrateでは、Ethereumのような直接のトランザクションハッシュ検索メソッドは標準RPCに含まれていません。トランザクション（extrinsic）はブロック内に含まれるため、`chain_getBlock`でブロックを取得し、その中のextrinsicを検索する必要があります。

### state

ストレージとランタイム状態をクエリするメソッド。

* `state_getStorage(key: StorageKey, at?: BlockHash)`: ストレージエントリを取得
* `state_getStorageHash(key: StorageKey, at?: BlockHash)`: ストレージエントリのハッシュを取得
* `state_getStorageSize(key: StorageKey, at?: BlockHash)`: ストレージエントリのサイズを取得
* `state_getKeys(key: StorageKey, at?: BlockHash)`: プレフィックスに一致するキーを取得
* `state_getKeysPaged(key: StorageKey, count: u32, startKey?: StorageKey, at?: BlockHash)`: ページネーション付きでキーを取得
* `state_getMetadata(at?: BlockHash)`: ランタイムメタデータを取得
* `state_getRuntimeVersion(at?: BlockHash)`: ランタイムバージョンを取得
* `state_queryStorage(keys: Vec<StorageKey>, fromBlock: Hash, toBlock?: BlockHash)`: 複数のブロックにわたるストレージ変更をクエリ
* `state_subscribeStorage(keys?: Vec<StorageKey>)`: ストレージ変更を購読

### system

ノードのシステム情報を取得するメソッド。

* `system_chain()`: チェーン名を取得
* `system_name()`: ノード名を取得
* `system_version()`: ノードバージョンを取得
* `system_health()`: ノードのヘルス状態を取得
* `system_peers()`: 接続されているピアのリストを取得
* `system_properties()`: チェーンのプロパティを取得
* `system_accountNextIndex(accountId: AccountId)`: アカウントの次のトランザクションインデックスを取得

### payment

トランザクション手数料に関するメソッド。

* `payment_queryInfo(extrinsic: Bytes, at?: BlockHash)`: extrinsicの手数料情報を取得
* `payment_queryFeeDetails(extrinsic: Bytes, at?: BlockHash)`: extrinsicの手数料詳細を取得

### rpc

RPCメソッドの情報を取得するメソッド。

* `rpc_methods()`: 利用可能なRPCメソッドのリストを取得

詳細なメソッド一覧については、[Polkadot.js RPC ドキュメント](https://polkadot.js.org/docs/substrate/rpc/)を参照してください。

## Midnight固有RPCメソッド

Midnight Networkは、スマートコントラクトの状態管理とゼロ知識証明に関連する独自のRPCメソッドを提供しています。

### midnight\_jsonContractState

JSONエンコードされたスマートコントラクトの状態を取得します。

**メソッド名**: `midnight_jsonContractState`

**パラメータ**:

* `contract_address: String` - コントラクトアドレス
* `at: Option<BlockHash>` - ブロックハッシュ（オプション、指定しない場合は最新ブロック）

**戻り値**: `String` - JSONエンコードされたコントラクト状態

**エラー**: `StateRpcError`

**例**:

```json
{
  "jsonrpc": "2.0",
  "method": "midnight_jsonContractState",
  "params": ["contract_address_here"],
  "id": 1
}
```

### midnight\_contractState

生の（バイナリエンコードされた）コントラクト状態を取得します。

**メソッド名**: `midnight_contractState`

**パラメータ**:

* `contract_address: String` - コントラクトアドレス
* `at: Option<BlockHash>` - ブロックハッシュ（オプション、指定しない場合は最新ブロック）

**戻り値**: `String` - 生の（バイナリエンコードされた）コントラクト状態

**エラー**: `StateRpcError`

**例**:

```json
{
  "jsonrpc": "2.0",
  "method": "midnight_contractState",
  "params": ["contract_address_here"],
  "id": 1
}
```

### midnight\_unclaimedAmount

受益者アドレスの未請求トークンまたは報酬の額を取得します。

**メソッド名**: `midnight_unclaimedAmount`

**パラメータ**:

* `beneficiary: String` - 受益者アドレス
* `at: Option<BlockHash>` - ブロックハッシュ（オプション、指定しない場合は最新ブロック）

**戻り値**: `u128` - 未請求の額

**エラー**: `StateRpcError`

**例**:

```json
{
  "jsonrpc": "2.0",
  "method": "midnight_unclaimedAmount",
  "params": ["beneficiary_address_here"],
  "id": 1
}
```

### midnight\_zswapChainState

ZSwapチェーンの状態を取得します。ゼロ知識状態ロールアップに使用されます。

**メソッド名**: `midnight_zswapChainState`

**パラメータ**:

* `contract_address: String` - コントラクトアドレス
* `at: Option<BlockHash>` - ブロックハッシュ（オプション、指定しない場合は最新ブロック）

**戻り値**: `String` - ZSwapチェーン状態

**エラー**: `StateRpcError`

**例**:

```json
{
  "jsonrpc": "2.0",
  "method": "midnight_zswapChainState",
  "params": ["contract_address_here"],
  "id": 1
}
```

### midnight\_apiVersions

サポートされているRPC APIバージョンのリストを取得します。ツールの互換性チェックに有用です。

**メソッド名**: `midnight_apiVersions`

**パラメータ**: なし

**戻り値**: `Vec<u32>` - サポートされているAPIバージョンのリスト

**エラー**: なし

**例**:

```json
{
  "jsonrpc": "2.0",
  "method": "midnight_apiVersions",
  "params": [],
  "id": 1
}
```

### midnight\_ledgerVersion

指定されたブロックでのレジャーの完全な状態のスナップショットを提供します。

**メソッド名**: `midnight_ledgerVersion`

**パラメータ**:

* `at: Option<BlockHash>` - ブロックハッシュ（オプション、指定しない場合は最新ブロック）

**戻り値**: `String` - レジャーバージョン

**エラー**: `BlockRpcError`

**例**:

```json
{
  "jsonrpc": "2.0",
  "method": "midnight_ledgerVersion",
  "params": [],
  "id": 1
}
```

### midnight\_jsonBlock

JSONエンコードされたブロック情報を取得します。ブロック内のextrinsic（トランザクション）を含みます。

**メソッド名**: `midnight_jsonBlock`

**パラメータ**:

* `at: Option<BlockHash>` - ブロックハッシュ（オプション、指定しない場合は最新ブロック）

**戻り値**: `String` - JSONエンコードされたブロック情報

**エラー**: `BlockRpcError`

**例**:

```json
{
  "jsonrpc": "2.0",
  "method": "midnight_jsonBlock",
  "params": [],
  "id": 1
}
```

**注意**: このメソッドを使用してブロックを取得し、その中のextrinsicを検索することで、トランザクション（extrinsic）を検索できます。

### midnight\_decodeEvents

イベントをデコードします。

**メソッド名**: `midnight_decodeEvents`

**パラメータ**:

* `events: String` - エンコードされたイベントデータ

**戻り値**: `String` - デコードされたイベント情報

**エラー**: `StateRpcError`

**例**:

```json
{
  "jsonrpc": "2.0",
  "method": "midnight_decodeEvents",
  "params": ["encoded_events_here"],
  "id": 1
}
```

### midnight\_zswapStateRoot

ZSwap状態ルートを取得します。

**メソッド名**: `midnight_zswapStateRoot`

**パラメータ**:

* `at: Option<BlockHash>` - ブロックハッシュ（オプション、指定しない場合は最新ブロック）

**戻り値**: `String` - ZSwap状態ルート

**エラー**: `StateRpcError`

**例**:

```json
{
  "jsonrpc": "2.0",
  "method": "midnight_zswapStateRoot",
  "params": [],
  "id": 1
}
```

## Midnight Networkのトランザクションについて

### トランザクションの特徴

Midnight Networkは、Polkadot SDKの標準的なトランザクション形式をサポートしていますが、実際のオンチェーン活動では\*\*証明ベースの検証モデル（proof-based verification model）\*\*を使用しています。

#### 主な特徴

1. **署名なしトランザクション（Unsigned Transactions）**
   * ほとんどのトランザクションは**署名なし（unsigned）**
   * Midnight Ledger独自の形式に準拠
   * 伝統的な署名ベースの認証ではなく、\*\*暗号学的証明（cryptographic proof）\*\*を埋め込む

2. **証明ベースの検証**
   * トランザクションには、特定のアクション（コントラクト呼び出し、デプロイ、ZSwapトランザクションなど）の有効性を証明する暗号学的証明が含まれる
   * この証明により、ネットワークは機密データや署名を直接公開せずに状態遷移を検証できる

3. **トランザクションの処理ステージ**
   * **トランザクションプールでの検証**: トランザクションの構造と論理的な要件をチェック
   * **ブロックへの含まれ**: 検証されたトランザクションがブロックに含まれる
   * **証明の完全検証**: 埋め込まれた証明が完全に検証される
   * **状態遷移の実行**: 有効な場合、ランタイムで定義されたロジックに従って状態遷移が実行される
   * **ストレージへのコミット**: 結果の状態更新がオンチェーンストレージレイヤーにコミットされる

#### 標準的なPolkadotトランザクションとの違い

| 項目 | 標準Polkadot | Midnight Network |
|------|-------------|------------------|
| 認証方式 | 署名ベース | 証明ベース |
| トランザクション形式 | Signed Extrinsic | Unsigned + Proof |
| データの公開性 | 公開 | 機密データを保護 |
| 検証方法 | 署名の検証 | 暗号学的証明の検証 |

## トランザクション（Extrinsic）の検索について

Polkadot/Substrateでは、Ethereumのような直接のトランザクションハッシュ検索メソッドは標準RPCに含まれていません。これは、SubstrateのアーキテクチャがEthereumとは異なるためです。さらに、Midnight Networkでは証明ベースのトランザクションを使用しているため、標準的なextrinsic検索とは異なるアプローチが必要になる場合があります。

### トランザクションを検索する方法

1. **ブロックを取得してextrinsicを検索**: `chain_getBlock`または`midnight_jsonBlock`でブロックを取得し、その中のextrinsicを検索します。

2. **ブロック範囲を検索**: 複数のブロックを順次取得し、各ブロック内のextrinsicを検索します。

3. **Indexerを使用**: Midnight Networkのindexerを使用してトランザクションを検索する方法もあります。

### 実装例

```bash
# 1. 最新ブロックを取得
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "midnight_jsonBlock",
    "params": [],
    "id": 1
  }' \
  https://rpc.testnet-02.midnight.network/

# 2. 特定のブロックを取得
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "chain_getBlock",
    "params": ["block_hash_here"],
    "id": 1
  }' \
  https://rpc.testnet-02.midnight.network/
```

取得したブロックの`extrinsics`フィールドに、そのブロックに含まれるすべてのextrinsic（トランザクション）が含まれています。

### トランザクションハッシュしかわからない場合

トランザクションハッシュしかわからない場合、以下の方法で検索できます：

1. **CLIツールを使用**: `search-tx`コマンドでトランザクションハッシュを検索
2. **ブロック範囲を検索**: 複数のブロックを順次取得し、各ブロック内のextrinsicを検索
3. **Indexerを使用**: Midnight Networkのindexerを使用（推奨）

**注意**: RPCノードは通常、トランザクションのインデックスを保持していないため、ブロックを順次検索する必要があります。大量のブロックを検索する場合は時間がかかる可能性があります。

### より効率的な検索方法

標準RPCではブロックを遡るしかありませんが、以下の方法で効率化できます：

1. **バイナリサーチ**: ブロック範囲を半分ずつ絞り込んで検索（実装済み）
   * 大きなブロック範囲でも効率的に検索可能
   * O(log n)の時間計算量

2. **Indexerの使用（推奨）**: Midnight Networkのindexerを使用
   * **新しいRustベースのindexer**（推奨）
     * 従来のScalaベースの`midnight-pubsub-indexer`は非推奨
     * Rustで完全に書き直され、高性能と信頼性を実現
     * GraphQL APIを提供（クエリ、ミューテーション、リアルタイムサブスクリプション）
     * PostgreSQLおよびSQLiteのストレージバックエンドをサポート
     * ローカルバイナリまたは分散型マイクロサービスとしてデプロイ可能
     * Midnight Wallet SDK v4以降およびLace Wallet v2.0.0以降と完全に互換性
   * トランザクションをインデックス化しているため、高速に検索可能
   * 最も効率的な方法

3. **Archive Nodeの使用**: `archive_unstable_*`メソッドを使用
   * 過去のブロックに高速にアクセス可能
   * ただし、WebSocket接続が必要な場合が多い

4. **ストレージクエリ**: `state_queryStorage`を使用してイベントから逆引き
   * 特定のストレージキーに関連する変更を複数のブロックにわたって検索
   * イベントからトランザクションを逆引きできる可能性がある

5. **ブロック範囲の指定**: 可能な限り検索範囲を絞り込む
   * トランザクションの送信時刻がわかっている場合、その時刻のブロック範囲を指定

### 自分の取引が入っているブロックを検索する方法

自分のアカウントアドレスに関連するトランザクションを検索するには：

1. **CLIツールを使用**: `search-account`コマンドでアカウントアドレスに関連するトランザクションを検索
2. **ブロック範囲を検索**: 複数のブロックを取得し、各ブロック内のextrinsicを確認
3. **Indexerを使用**: Midnight Networkのindexerを使用（推奨）

**注意**: 実際の実装では、extrinsicをデコードしてアカウントアドレスを正確に確認する必要があります。簡易的な検索では、extrinsicのエンコードされた文字列内にアドレスが含まれているかを確認しますが、これは完全に正確ではない可能性があります。

## 使用例

### チェーン名を取得

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "system_chain",
    "params": [],
    "id": 1
  }' \
  https://rpc.testnet-02.midnight.network/
```

### コントラクト状態を取得

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "midnight_jsonContractState",
    "params": ["your_contract_address"],
    "id": 1
  }' \
  https://rpc.testnet-02.midnight.network/
```

### サポートされているAPIバージョンを取得

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "midnight_apiVersions",
    "params": [],
    "id": 1
  }' \
  https://rpc.testnet-02.midnight.network/
```

## エラーハンドリング

RPCリクエストが失敗した場合、以下の形式でエラーが返されます:

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32600,
    "message": "Invalid Request"
  },
  "id": 1
}
```

一般的なエラーコード:

* `-32600`: Invalid Request
* `-32601`: Method not found
* `-32602`: Invalid params
* `-32603`: Internal error

Midnight固有のエラー:

* `StateRpcError`: 状態関連のRPCエラー
* `BlockRpcError`: ブロック関連のRPCエラー

## 参考資料

* [Polkadot.js RPC ドキュメント](https://polkadot.js.org/docs/substrate/rpc/)
* [JSON-RPC 2.0 仕様](https://www.jsonrpc.org/specification)
* [Midnight Network ドキュメント](https://docs.midnight.network/)
