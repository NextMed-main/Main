# Midnight Network Indexer - 使用例

## 概要

Midnight Network Indexerは、ブロックチェーンデータを効率的に収集・インデックス化し、トランザクション、ブロック、アカウント情報への高速アクセスを提供するGraphQL APIを提供するRustベースのサービスです。

## 主な機能

- **高性能**: 信頼性と速度のためにRustで構築
- **GraphQL API**: クエリ、ミューテーション、リアルタイムサブスクリプションをサポート
- **柔軟なデプロイメント**: ローカルバイナリまたは分散型マイクロサービスとしてデプロイ可能
- **データベースサポート**: PostgreSQLおよびSQLiteストレージバックエンド
- **ウォレット統合**: Midnight Wallet SDK v4以降およびLace Wallet v2.0.0以降と互換性

## セットアップ

### Docker Composeの例

```yaml
services:
  indexer:
    container_name: 'midnight-indexer'
    image: 'midnightntwrk/indexer-standalone:2.1.1'
    ports:
      - '8088:8088'  # GraphQL APIポート
    environment:
      RUST_LOG: "indexer=info,chain_indexer=info,indexer_api=info,wallet_indexer=info,indexer_common=info"
      APP__INFRA__SECRET: "303132333435363738393031323334353637383930313233343536373839303132"
      APP__INFRA__NODE__URL: "wss://rpc.testnet-02.midnight.network"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8088/ready"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
```

### Indexerの起動

```bash
docker-compose -f docker-compose.indexer.yml up -d
```

### レディネスの確認

```bash
# Indexerが準備完了か確認（推奨）
curl http://localhost:8088/ready

# ヘルスチェック（非推奨、後方互換性のため残されています）
curl http://localhost:8088/health
```

**注意**: Indexerは起動後、ノードに追いつくまで時間がかかる場合があります。GraphQL APIを使用する前に、`/ready`が`200 OK`を返すまで待ってください。

## GraphQL API使用例

### エンドポイント

**URL**: `http://localhost:8088/graphql`

### 例1: ブロックのクエリ

```bash
curl -X POST http://localhost:8088/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { blocks(limit: 10) { number hash } }"
  }'
```

**JavaScript/TypeScriptの例**:

```typescript
async function queryBlocks(limit: number = 10) {
  const response = await fetch('http://localhost:8088/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          blocks(limit: ${limit}) {
            number
            hash
            timestamp
          }
        }
      `,
    }),
  });

  const result = await response.json();
  return result.data.blocks;
}
```

### 例2: トランザクションのクエリ

```bash
curl -X POST http://localhost:8088/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { transactions(limit: 10) { id blockNumber hash } }"
  }'
```

**JavaScript/TypeScriptの例**:

```typescript
async function queryTransactions(limit: number = 10) {
  const response = await fetch('http://localhost:8088/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          transactions(limit: ${limit}) {
            id
            blockNumber
            hash
            extrinsicIndex
          }
        }
      `,
    }),
  });

  const result = await response.json();
  return result.data.transactions;
}
```

### 例3: ハッシュによるトランザクション検索

```typescript
async function searchTransactionByHash(txHash: string) {
  const response = await fetch('http://localhost:8088/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          transaction(hash: "${txHash}") {
            id
            blockNumber
            hash
            extrinsicIndex
            block {
              number
              hash
            }
          }
        }
      `,
    }),
  });

  const result = await response.json();
  return result.data.transaction;
}
```

### 例4: アカウントアドレスによるトランザクションクエリ

```typescript
async function queryTransactionsByAccount(
  address: string,
  limit: number = 100
) {
  const response = await fetch('http://localhost:8088/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          transactions(
            filter: { account: "${address}" }
            limit: ${limit}
          ) {
            id
            blockNumber
            hash
            extrinsicIndex
            block {
              number
              hash
            }
          }
        }
      `,
    }),
  });

  const result = await response.json();
  return result.data.transactions;
}
```

### 例5: ブロック範囲のクエリ

```typescript
async function queryBlocksInRange(
  fromBlock: number,
  toBlock: number,
  limit: number = 100
) {
  const response = await fetch('http://localhost:8088/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          blocks(
            filter: {
              number: { gte: ${fromBlock}, lte: ${toBlock} }
            }
            limit: ${limit}
          ) {
            number
            hash
            timestamp
            transactionCount
          }
        }
      `,
    }),
  });

  const result = await response.json();
  return result.data.blocks;
}
```

### 例6: リアルタイムサブスクリプション（WebSocket）

```typescript
// WebSocket経由でGraphQLサブスクリプションを使用
// 注意: WebSocketクライアントライブラリが必要です

async function subscribeToNewBlocks() {
  const ws = new WebSocket('ws://localhost:8088/graphql');

  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: 'start',
      payload: {
        query: `
          subscription {
            newBlock {
              number
              hash
              timestamp
            }
          }
        `,
      },
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'data') {
      console.log('New block:', data.payload.data.newBlock);
    }
  };

  return ws;
}
```

## ユースケース

### 1. 効率的なトランザクション検索

RPC経由でブロックを順次検索する代わりに、indexerを使用します：

```typescript
// ❌ 遅い: RPC経由での順次ブロック検索
async function searchTxViaRPC(txHash: string) {
  // 多くのブロックを検索する必要がある
  // 大きなブロック範囲では数分から数時間かかる可能性がある
}

// ✅ 高速: Indexer GraphQL API経由での直接クエリ
async function searchTxViaIndexer(txHash: string) {
  return await searchTransactionByHash(txHash);
  // トランザクションがインデックス化されていれば即座に返される
}
```

### 2. アカウントのトランザクション履歴

```typescript
async function getAccountHistory(address: string) {
  const transactions = await queryTransactionsByAccount(address, 1000);
  
  return transactions.map(tx => ({
    blockNumber: tx.blockNumber,
    hash: tx.hash,
    index: tx.extrinsicIndex,
    blockHash: tx.block?.hash,
  }));
}
```

### 3. ブロックエクスプローラーの機能

```typescript
async function getBlockDetails(blockNumber: number) {
  const response = await fetch('http://localhost:8088/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query {
          block(number: ${blockNumber}) {
            number
            hash
            timestamp
            parentHash
            transactions {
              id
              hash
              extrinsicIndex
            }
          }
        }
      `,
    }),
  });

  const result = await response.json();
  return result.data.block;
}
```

## WalletBuilderとの統合

`@midnight-ntwrk/wallet`パッケージの`WalletBuilder`クラスは、効率的なウォレット操作のためにindexerを使用します。Indexerは、トランザクション履歴とアカウント状態への高速アクセスを提供します。

### 基本的なWalletBuilderセットアップ

```typescript
import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { NetworkId } from '@midnight-ntwrk/zswap';

// Indexer URLでウォレットを構築
const wallet = await WalletBuilder.build(
  'https://indexer.testnet-02.midnight.network/api/v1/graphql', // Indexer GraphQL URL
  'wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws', // Indexer WebSocket URL
  'http://localhost:6300', // Proving Server URL
  'https://rpc.testnet-02.midnight.network', // Node RPC URL
  '0000000000000000000000000000000000000000000000000000000000000000', // Seed (32 bytes hex)
  NetworkId.TestNet,
  'error' // LogLevel
);

// ウォレットを起動してindexerとの同期を開始
wallet.start();
```

### シードからウォレットを構築

```typescript
import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { NetworkId } from '@midnight-ntwrk/zswap';

// シードからウォレットを構築
const wallet = await WalletBuilder.buildFromSeed(
  'http://localhost:8088/api/v1/graphql', // Indexer GraphQL URL
  'ws://localhost:8088/api/v1/graphql/ws', // Indexer WebSocket URL
  'http://localhost:6300', // Proving Server URL
  'http://localhost:9944', // Node RPC URL
  seed, // 32バイトの16進数シード
  NetworkId.TestNet,
  'info' // LogLevel
);

wallet.start();
```

### シリアライズされた状態からウォレットを復元

```typescript
import { WalletBuilder } from '@midnight-ntwrk/wallet';

// 以前にシリアライズされた状態からウォレットを復元
const wallet = await WalletBuilder.restore(
  'http://localhost:8088/api/v1/graphql',
  'ws://localhost:8088/api/v1/graphql/ws',
  'http://localhost:6300',
  'http://localhost:9944',
  seed,
  serializedState, // ウォレット状態のJSON文字列
  'info'
);

wallet.start();
```

### Indexer URLパターン

Indexerは特定のパスでGraphQLエンドポイントを公開しています：

- **GraphQL HTTP**: `http://localhost:8088/api/v1/graphql`
- **GraphQL WebSocket**: `ws://localhost:8088/api/v1/graphql/ws`

テストネットの場合：
- **GraphQL HTTP**: `https://indexer.testnet-02.midnight.network/api/v1/graphql`
- **GraphQL WebSocket**: `wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws`

### WalletBuilderにIndexerが必要な理由

`WalletBuilder`は以下の目的でindexerを使用します：

1. **高速なトランザクション履歴**: RPC経由でブロックを順次スキャンする代わりに、インデックス化されたトランザクションデータをクエリ
2. **アカウント状態の同期**: インデックス化されたアカウントトランザクションをクエリして、ウォレット状態を効率的に同期
3. **リアルタイム更新**: WebSocketサブスクリプションを使用して、新しいトランザクションを即座に受信
4. **パフォーマンス**: ウォレット操作において、RPCベースのアプローチよりも大幅に高速

### 例: Indexerを使用した完全なウォレットセットアップ

```typescript
import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { NetworkId } from '@midnight-ntwrk/zswap';
import { randomBytes } from 'crypto';

async function setupWallet() {
  // ランダムなシードを生成（32バイト）
  const seed = randomBytes(32).toString('hex');

  // Indexerでウォレットを構築
  const wallet = await WalletBuilder.buildFromSeed(
    'https://indexer.testnet-02.midnight.network/api/v1/graphql',
    'wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws',
    'http://localhost:6300',
    'https://rpc.testnet-02.midnight.network',
    seed,
    NetworkId.TestNet,
    'info'
  );

  // ウォレットを起動（indexerとの同期を開始）
  wallet.start();

  // 初期同期を待機
  const state = await Rx.firstValueFrom(wallet.state());
  console.log('Wallet address:', state.address);
  console.log('Wallet balance:', state.balances);

  return wallet;
}
```

### 設定例

#### ローカル開発

```typescript
const config = {
  indexer: 'http://127.0.0.1:8088/api/v1/graphql',
  indexerWS: 'ws://127.0.0.1:8088/api/v1/graphql/ws',
  node: 'http://127.0.0.1:9944',
  proofServer: 'http://127.0.0.1:6300',
};
```

#### テストネット

```typescript
const config = {
  indexer: 'https://indexer.testnet-02.midnight.network/api/v1/graphql',
  indexerWS: 'wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws',
  node: 'https://rpc.testnet-02.midnight.network',
  proofServer: 'http://localhost:6300', // ローカルのproof serverが必要
};
```

## フロントエンドとの統合

### React Hookの例

```typescript
import { useState, useEffect } from 'react';

const INDEXER_URL = 'http://localhost:8088/graphql';

export function useIndexerQuery<T>(query: string, variables?: Record<string, unknown>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(INDEXER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables }),
        });

        const result = await response.json();
        
        if (result.errors) {
          setError(result.errors[0].message);
        } else {
          setData(result.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query, JSON.stringify(variables)]);

  return { data, loading, error };
}

// 使用例
function TransactionList() {
  const { data, loading, error } = useIndexerQuery(`
    query {
      transactions(limit: 10) {
        id
        hash
        blockNumber
      }
    }
  `);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.transactions.map(tx => (
        <div key={tx.id}>{tx.hash}</div>
      ))}
    </div>
  );
}
```

## パフォーマンスに関する考慮事項

### 同期時間

- **テストネット**: チェーンの長さに応じて、初回同期に数時間から数日かかる場合がある
- **ローカル開発**: 通常、数秒から数分（チェーンが短いため）
- **再起動**: データベースが存在する場合、数分から数十分

### 同期状況の監視

```bash
# ログで同期の進行状況を確認
docker logs -f midnight-indexer | grep -E "current_height|highest.*height"

# レディネスエンドポイントを監視
watch -n 5 'curl -s http://localhost:8088/ready'
```

## 比較: RPC vs Indexer

| 機能 | RPC | Indexer |
|---------|-----|---------|
| トランザクション検索 | 順次ブロック検索（遅い） | インデックス化されたデータへの直接ルックアップ（高速） |
| アカウント履歴 | カスタム実装が必要 | 組み込みフィルタリング |
| リアルタイム更新 | ポーリングが必要 | GraphQLサブスクリプション |
| ブロック範囲クエリ | 複数のRPC呼び出し | 単一のGraphQLクエリ |
| パフォーマンス | 検索でO(n) | インデックス化されたデータでO(1) |

## コントラクトステートの構造

`midnight_jsonContractState` RPCメソッドで取得できるコントラクトステートのJSON構造について説明します。

### 基本構造

コントラクトステートは以下のような構造を持ちます：

```json
{
  "data": [...],
  "operations": {
    "operationName": {
      "v2": "0x0400bb040000028d0000...03b0d9709c55193eaf76"
    }
  }
}
```

### `operations`フィールド

`operations`フィールドには、コントラクトの各エントリーポイント（操作）ごとの情報が格納されています。

#### `v2`データの正体

各操作の`v2`フィールドには、**ゼロ知識証明システムのバージョン2のverifier key（検証鍵）**が格納されています。

**詳細：**

- **Verifier Keyとは**: ゼロ知識証明を検証するための公開鍵です。各コントラクト操作（例：`viewVendorScores`、`getVendorPublicProfile`など）ごとに存在します。
- **用途**: トランザクションのゼロ知識証明を検証するために使用されます。Midnight Networkのプライバシー保護機能の基盤となる重要なデータです。
- **データ形式**: シリアライズされたverifier key（Uint8Array）がhex文字列として格納されています。
- **バージョン管理**: コントラクトは複数のバージョンのverifier keyを保持できますが、現在のAPIでは最新バージョンのみが公開されています。

**例：**

```json
{
  "operations": {
    "viewVendorScores": {
      "v2": "0x0400bb040000028d0000...03b0d9709c55193eaf76"
    },
    "getVendorPublicProfile": {
      "v2": "0x0400bb04000002360000...03b0d9709c55193eaf76"
    }
  }
}
```

各操作名（エントリーポイント名）がキーとなり、その値としてverifier keyが格納されています。

### 参考資料

- [Midnight Network Contract State Documentation](https://docs.midnight.network/develop/reference/midnight-api/ledger/classes/ContractOperation)
- [Zero-Knowledge Proof Transaction Structure](https://docs.midnight.network/develop/how-midnight-works/smart-contracts)

## 参考リンク

- [Midnight Network Documentation](https://docs.midnight.network)
- [Indexer GitHub Repository](https://github.com/midnightntwrk/midnight-indexer)
- [GraphQL Documentation](https://graphql.org/learn/)
