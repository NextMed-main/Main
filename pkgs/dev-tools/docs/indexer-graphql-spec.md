# Midnight Network Indexer GraphQL API 完全仕様

このドキュメントは、Midnight Network IndexerのGraphQL APIの完全な仕様を記録したものです。
スキーマイントロスペクションにより取得した情報に基づいています。

## 目次

- [クエリ (Query)](#クエリ-query)
- [ミューテーション (Mutation)](#ミューテーション-mutation)
- [サブスクリプション (Subscription)](#サブスクリプション-subscription)
- [型定義](#型定義)
- [スカラー型](#スカラー型)
- [入力型](#入力型)

## クエリ (Query)

### `block`

ブロックを取得します。オフセットが指定されない場合、最新のブロックを返します。

**引数:**
- `offset: BlockOffset` (オプション) - ブロックのオフセット

**戻り値:** `Block`

**例:**
```graphql
query {
  block(offset: { height: 1000 }) {
    hash
    height
    timestamp
    transactions {
      hash
    }
  }
}
```

### `transactions`

トランザクションを取得します。

**引数:**
- `offset: TransactionOffset!` (必須) - トランザクションのオフセット

**戻り値:** `[Transaction!]!`

**例:**
```graphql
query {
  transactions(offset: { hash: "0x..." }) {
    hash
    identifiers
    block {
      height
    }
  }
}
```

### `contractAction`

コントラクトアクションを取得します。

**引数:**
- `address: HexEncoded!` (必須) - コントラクトアドレス
- `offset: ContractActionOffset` (オプション) - コントラクトアクションのオフセット

**戻り値:** `ContractAction`

**例:**
```graphql
query {
  contractAction(
    address: "0x..."
    offset: { blockOffset: { height: 1000 } }
  ) {
    address
    state
    transaction {
      hash
    }
  }
}
```

## ミューテーション (Mutation)

### `connect`

指定されたviewing keyでウォレットを接続し、セッションIDを返します。

**引数:**
- `viewingKey: ViewingKey!` (必須) - ウォレットのviewing key

**戻り値:** `HexEncoded!` - セッションID

**例:**
```graphql
mutation {
  connect(viewingKey: "...") {
    # Returns session ID as HexEncoded
  }
}
```

### `disconnect`

指定されたセッションIDでウォレットを切断します。

**引数:**
- `sessionId: HexEncoded!` (必須) - セッションID

**戻り値:** `Unit`

**例:**
```graphql
mutation {
  disconnect(sessionId: "0x...")
}
```

## サブスクリプション (Subscription)

### `blocks`

ブロックの変更を購読します。オフセットが指定されない場合、最新のブロックから開始します。

**引数:**
- `offset: BlockOffset` (オプション) - ブロックのオフセット

**戻り値:** `Block!`

**例:**
```graphql
subscription {
  blocks(offset: { height: 1000 }) {
    hash
    height
    timestamp
  }
}
```

### `contractActions`

指定されたアドレスのコントラクトアクションの変更を購読します。オフセットが指定されない場合、最新のブロックから開始します。

**引数:**
- `address: HexEncoded!` (必須) - コントラクトアドレス
- `offset: BlockOffset` (オプション) - ブロックのオフセット

**戻り値:** `ContractAction!`

**例:**
```graphql
subscription {
  contractActions(
    address: "0x..."
    offset: { height: 1000 }
  ) {
    address
    state
    transaction {
      hash
    }
  }
}
```

### `wallet`

指定されたセッションIDのウォレットイベントを購読します。イベントは`ViewingUpdate`または`ProgressUpdate`です。インデックスが指定されない場合、0から開始します。

**引数:**
- `sessionId: HexEncoded!` (必須) - セッションID
- `index: Int` (オプション) - 開始インデックス（デフォルト: 0）
- `sendProgressUpdates: Boolean` (オプション) - 進捗更新を送信するかどうか

**戻り値:** `WalletSyncEvent!`

**例:**
```graphql
subscription {
  wallet(
    sessionId: "0x..."
    index: 0
    sendProgressUpdates: true
  ) {
    ... on ViewingUpdate {
      index
      update {
        ... on RelevantTransaction {
          transaction {
            hash
          }
        }
        ... on MerkleTreeCollapsedUpdate {
          update
        }
      }
    }
    ... on ProgressUpdate {
      highestIndex
      highestRelevantIndex
    }
  }
}
```

## 型定義

### `Block`

ブロックとその関連データ。

**フィールド:**
- `hash: HexEncoded!` - ブロックハッシュ
- `height: Int!` - ブロック高さ
- `protocolVersion: Int!` - プロトコルバージョン
- `timestamp: Int!` - UNIXタイムスタンプ
- `author: HexEncoded` - ブロック作成者
- `parent: Block` - 親ブロック
- `transactions: [Transaction!]!` - このブロック内のトランザクション

### `Transaction`

トランザクションとその関連データ。

**フィールド:**
- `hash: HexEncoded!` - トランザクションハッシュ
- `protocolVersion: Int!` - プロトコルバージョン
- `applyStage: ApplyStage!` - トランザクションの適用ステージ
- `identifiers: [String!]!` - トランザクション識別子（72文字のhex文字列の配列）。各識別子は8文字のプレフィックスと64文字のデータで構成されます。
- `raw: HexEncoded!` - 生のトランザクションコンテンツ
- `merkleTreeRoot: HexEncoded!` - マークルツリーのルート
- `block: Block!` - このトランザクションが含まれるブロック
- `contractActions: [ContractAction!]!` - コントラクトアクション

### `ContractAction` (Interface)

コントラクトアクションのインターフェース。

**実装型:**
- `ContractCall` - コントラクト呼び出し
- `ContractDeploy` - コントラクトデプロイ
- `ContractUpdate` - コントラクト更新

**共通フィールド:**
- `address: HexEncoded!` - コントラクトアドレス
- `state: HexEncoded!` - コントラクト状態
- `chainState: HexEncoded!` - チェーン状態
- `transaction: Transaction!` - 関連するトランザクション

### `ContractCall`

コントラクト呼び出し。

**フィールド:**
- `address: HexEncoded!` - コントラクトアドレス
- `state: HexEncoded!` - コントラクト状態
- `chainState: HexEncoded!` - チェーン状態
- `entryPoint: HexEncoded` - エントリーポイント
- `transaction: Transaction` - 関連するトランザクション
- `deploy: ContractDeploy` - 関連するデプロイ（存在する場合）

### `ContractDeploy`

コントラクトデプロイ。

**フィールド:**
- `address: HexEncoded!` - コントラクトアドレス
- `state: HexEncoded!` - コントラクト状態
- `chainState: HexEncoded!` - チェーン状態
- `transaction: Transaction` - 関連するトランザクション

### `ContractUpdate`

コントラクト更新。

**フィールド:**
- `address: HexEncoded!` - コントラクトアドレス
- `state: HexEncoded!` - コントラクト状態
- `chainState: HexEncoded!` - チェーン状態
- `transaction: Transaction` - 関連するトランザクション

### `RelevantTransaction`

ウォレットに関連するトランザクション。

**フィールド:**
- `transaction: Transaction!` - ウォレットに関連するトランザクション
- `start: Int!` - 開始インデックス
- `end: Int!` - 終了インデックス

### `ViewingUpdate`

ウォレットのviewing更新。関連するトランザクションと、オプションでマークルツリーの折りたたまれた更新を含みます。

**フィールド:**
- `index: Int!` - zswap状態への次の開始インデックス。通常は含まれる関連トランザクションの終了インデックスに1を加えた値。失敗の場合は、その終了インデックス。
- `update: [ZswapChainStateUpdate!]!` - ウォレットに関連するトランザクションと、オプションで折りたたまれたマークルツリーの更新。`ZswapChainStateUpdate`は`RelevantTransaction`または`MerkleTreeCollapsedUpdate`のユニオン型です。

### `ProgressUpdate`

ウォレットインデックス化の進捗情報を集約します。

**フィールド:**
- `highestIndex: Int!` - 現在知られているすべてのトランザクションのzswap状態への最高の終了インデックス
- `highestRelevantIndex: Int!` - 現在知られているすべての関連トランザクション（既知のウォレットに属するもの）のzswap状態への最高の終了インデックス。`highestIndex`以下。
- `highestRelevantWalletIndex: Int!` - 特定のウォレットの現在知られているすべての関連トランザクションのzswap状態への最高の終了インデックス。`highestRelevantIndex`以下。

### `MerkleTreeCollapsedUpdate`

マークルツリーの折りたたまれた更新。

**フィールド:**
- `protocolVersion: Int!` - プロトコルバージョン
- `start: Int!` - zswap状態への開始インデックス
- `end: Int!` - zswap状態への終了インデックス
- `update: HexEncoded!` - hexエンコードされたマークルツリーの折りたたまれた更新

### `WalletSyncEvent` (Union)

ウォレット同期イベントのユニオン型。

**可能な型:**
- `ViewingUpdate` - viewing更新
- `ProgressUpdate` - 進捗更新

### `ZswapChainStateUpdate` (Union)

zswapチェーン状態更新のユニオン型。`ViewingUpdate.update`フィールドで使用されます。

**可能な型:**
- `RelevantTransaction` - 関連するトランザクション
- `MerkleTreeCollapsedUpdate` - 折りたたまれたマークルツリーの更新

## スカラー型

### `HexEncoded`

hexエンコードされた文字列。通常は`0x`プレフィックス付きのhex文字列として表現されます。

### `ViewingKey`

ウォレットのviewing key。ウォレットの状態を閲覧するために使用されます。

### `ApplyStage`

トランザクションの適用ステージ。enum型です。

**可能な値:**
- `FailEntirely` - トランザクションが完全に失敗した
- `SucceedEntirely` - トランザクションが完全に成功した

**注意:** 完全な値のリストはスキーマに記載されていないため、実際の使用例から確認する必要があります。

### `Unit`

ユニット型。値を持たない型です。

### `Boolean`

真偽値型。`true`または`false`。

### `Int`

整数型。符号付き32ビット整数。

### `Float`

浮動小数点数型。IEEE 754の倍精度浮動小数点数。

### `String`

文字列型。UTF-8文字列。

### `ID`

ID型。文字列または数値として表現されます。

## 入力型

### `BlockOffset`

ブロックのオフセット。ハッシュまたは高さのいずれかを指定します。

**フィールド:**
- `hash: HexEncoded` (オプション) - ブロックハッシュ
- `height: Int` (オプション) - ブロック高さ

**注意:** `hash`と`height`のいずれか一方を指定する必要があります。

**例:**
```graphql
{ hash: "0x..." }
# または
{ height: 1000 }
```

### `TransactionOffset`

トランザクションのオフセット。ハッシュまたは識別子のいずれかを指定します。

**フィールド:**
- `hash: HexEncoded` (オプション) - トランザクションハッシュ（64文字のhex）
- `identifier: HexEncoded` (オプション) - トランザクション識別子（72文字のhex）

**注意:** `hash`と`identifier`のいずれか一方を指定する必要があります。

**例:**
```graphql
{ hash: "0x..." }
# または
{ identifier: "00000000..." }
```

### `ContractActionOffset`

コントラクトアクションのオフセット。ブロックオフセットまたはトランザクションオフセットのいずれかを指定します。

**フィールド:**
- `blockOffset: BlockOffset` (オプション) - ブロックオフセット
- `transactionOffset: TransactionOffset` (オプション) - トランザクションオフセット

**注意:** `blockOffset`と`transactionOffset`のいずれか一方を指定する必要があります。

**例:**
```graphql
{ blockOffset: { height: 1000 } }
# または
{ transactionOffset: { hash: "0x..." } }
```

## 使用例

### ブロックとトランザクションの取得

```graphql
query {
  block(offset: { height: 2598885 }) {
    hash
    height
    timestamp
    protocolVersion
    author
    transactions {
      hash
      protocolVersion
      applyStage
      identifiers
      raw
      merkleTreeRoot
      contractActions {
        __typename
        address
        state
        chainState
      }
    }
  }
}
```

### トランザクションの検索（ハッシュ）

```graphql
query {
  transactions(offset: { hash: "0x..." }) {
    hash
    identifiers
    block {
      height
      timestamp
    }
  }
}
```

### トランザクションの検索（識別子）

```graphql
query {
  transactions(offset: { identifier: "00000000190d924fdf8e747ca07eab9eb54fdbff12ac71e71fb31d7840ad276c3cda11c7" }) {
    hash
    identifiers
    block {
      height
      timestamp
    }
  }
}
```

### コントラクトアクションの取得

```graphql
query {
  contractAction(
    address: "0x..."
    offset: { blockOffset: { height: 1000 } }
  ) {
    __typename
    address
    state
    chainState
    transaction {
      hash
      block {
        height
      }
    }
    ... on ContractCall {
      entryPoint
      deploy {
        address
      }
    }
  }
}
```

### ブロックの購読

```graphql
subscription {
  blocks(offset: { height: 1000 }) {
    hash
    height
    timestamp
    transactions {
      hash
    }
  }
}
```

### ウォレットイベントの購読

```graphql
subscription {
  wallet(
    sessionId: "0x..."
    index: 0
    sendProgressUpdates: true
  ) {
    ... on ViewingUpdate {
      index
      update {
        ... on RelevantTransaction {
          transaction {
            hash
            identifiers
            block {
              height
            }
          }
          start
          end
        }
        ... on MerkleTreeCollapsedUpdate {
          protocolVersion
          start
          end
          update
        }
      }
    }
    ... on ProgressUpdate {
      highestIndex
      highestRelevantIndex
      highestRelevantWalletIndex
    }
  }
}
```

## 注意事項

1. **アカウントアドレスでの検索はサポートされていません**: GraphQL APIには、アカウントアドレス（Bech32mアドレスなど）で直接トランザクションを検索する機能はありません。代わりに、`transaction.identifiers`フィールドから識別子を取得して検索してください。

2. **再帰制限**: ブロックの親チェーンを再帰的に取得する際は、サーバー側の再帰制限（約13レベル）に注意してください。

3. **オフセットの必須性**: `transactions`クエリでは、`offset`引数が必須です。`hash`または`identifier`のいずれかを指定する必要があります。

4. **識別子の形式**: トランザクション識別子は72文字のhex文字列（8文字のプレフィックス + 64文字のデータ）です。

5. **ハッシュの形式**: トランザクションハッシュは64文字のhex文字列で、通常`0x`プレフィックスが付きます。

6. **WebSocketサブスクリプション**: サブスクリプションを使用するには、WebSocket接続が必要です。エンドポイントは通常、`wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws`の形式です。

## 参考リンク

- [Midnight Network公式ドキュメント](https://docs.midnight.network/)
- [GraphQL公式ドキュメント](https://graphql.org/learn/)

