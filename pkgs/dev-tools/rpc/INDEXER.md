# Midnight Network Indexer

Midnight Networkのindexerは、ブロックチェーンデータを効率的に収集・インデックス化し、DAppやサービスが迅速にアクセスできるようにするためのコンポーネントです。

## 概要

### 新しいRustベースのIndexer（推奨）

Midnight Networkは、従来のScalaベースの`midnight-pubsub-indexer`に代わる、**新しいRustベースのindexer**を導入しました。

#### 主な特徴

* **高性能と信頼性**: Rustで完全に書き直され、パフォーマンスと信頼性が向上
* **モジュラー設計**: サービス指向の設計に移行し、メンテナンス性が向上
* **GraphQL API**: クエリ、ミューテーション、リアルタイムサブスクリプションをサポート
* **柔軟なデプロイメント**: ローカルバイナリまたは分散型マイクロサービスとしてデプロイ可能
* **データベースサポート**: PostgreSQLおよびSQLiteのストレージバックエンドをサポート
* **ウォレット統合**: Midnight Wallet SDK v4以降およびLace Wallet v2.0.0以降と完全に互換性

#### 機能

* ブロック履歴の取得
* データの処理とインデックス化
* GraphQL APIを通じたクエリ
* ミューテーション
* リアルタイムサブスクリプション

### 従来のScalaベースのIndexer（非推奨）

`midnight-pubsub-indexer`は、パブリッシュ・サブスクライブ（Pub-Sub）モデルを採用したindexerでしたが、**現在は非推奨**となっており、将来的に廃止される予定です。

#### 特徴（参考）

* パブリッシュ・サブスクライブ（Pub-Sub）モデル
* ネットワーク上のイベントやトランザクションをリアルタイムでキャッチ
* データベースに格納
* Apache License V2.0の下で提供

## 使用方法

### 新しいRustベースのIndexer

#### Docker Composeを使用した起動（推奨）

新しいRustベースのindexerは、`midnightntwrk/indexer-standalone`というDockerイメージで提供されています。

##### 基本的なDocker Compose設定例

```yaml
services:
  indexer:
    container_name: 'midnight-indexer'
    image: 'midnightntwrk/indexer-standalone:2.1.1'
    ports:
      - '8088:8088'  # GraphQL APIポート
    environment:
      RUST_LOG: "indexer=info,chain_indexer=info,indexer_api=info,wallet_indexer=info,indexer_common=info"
      # 32バイトのランダムな16進数エンコードされたシークレット（開発用）
      APP__INFRA__SECRET: "303132333435363738393031323334353637383930313233343536373839303132"
      # Midnight NodeのWebSocket URL
      APP__INFRA__NODE__URL: "wss://rpc.testnet-02.midnight.network"
    depends_on:
      - node  # ローカルノードを使用する場合
```

##### 起動手順

1. **Docker Composeファイルの使用**

プロジェクトルートに`docker-compose.indexer.yml`ファイルが用意されています。

2. **Indexerの起動**

```bash
# プロジェクトルートから実行
docker-compose -f docker-compose.indexer.yml up -d
```

3. **動作確認**

Indexerが起動したら、GraphQL APIが利用可能になります：

```bash
# レディネスチェック（推奨）
# indexerがノードに追いついているか確認
curl http://localhost:8088/ready

# ヘルスチェック（非推奨、後方互換性のため残されています）
curl http://localhost:8088/health

# GraphQLエンドポイント
curl -X POST http://localhost:8088/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name } } }"}'
```

**注意**: Indexerが起動直後は、ノードに追いつくまで時間がかかる場合があります。`/ready`エンドポイントが`200 OK`を返すまで待ってからGraphQL APIを使用してください。

#### 同期時間について

Indexerの同期時間は、以下の要因によって異なります：

* **ブロックチェーンの長さ**: チェーンの長さが長いほど、同期に時間がかかります
* **ネットワーク速度**: ノードとの接続速度やネットワークの状態
* **リソース**: CPU、メモリ、ディスクI/Oの性能
* **初回起動か再起動か**: 初回起動の場合は全ブロックを同期する必要があります

**目安**:

* **テストネット**:
  * 初回同期: チェーンの長さによって異なりますが、**数時間から数日**かかる場合があります
  * 現在のテストネット（ブロック高さ約258万）: 初回同期には**数時間から半日程度**かかる可能性があります
  * 再起動後: データベースに既存データがある場合は、**数分から数十分程度**
* **ローカル開発環境**: 通常、**数秒から数分程度**（チェーンが短いため）

**現在の同期状況の確認**:

ログから現在の同期状況を確認できます：

```bash
# 最新のブロック高さと現在の同期位置を確認
docker logs midnight-indexer 2>&1 | grep -E "current_height|highest.*height" | tail -5

# 同期速度の確認（ブロック/秒）
docker logs midnight-indexer 2>&1 | grep "traversing back" | tail -3
```

ログから見ると、indexerは親ハッシュを遡ってブロックを取得しています（`traversing back via parent hashes`）。これは初回同期時の動作で、時間がかかります。

**同期状況の確認方法**:

```bash
# ログを確認して同期状況を監視
docker logs -f midnight-indexer

# または、特定のキーワードでフィルタ
docker logs midnight-indexer 2>&1 | grep -i "sync\|catch\|index\|block"

# レディネスを定期的に確認
watch -n 5 'curl -s http://localhost:8088/ready'
```

#### ローカルノードと一緒に起動する場合

ローカルのMidnight Nodeと一緒に起動する場合の完全な例：

```yaml
services:
  node:
    image: 'midnightnetwork/midnight-node:0.12.0'
    container_name: 'midnight-node'
    ports:
      - "9944:9944"  # WebSocket RPC
    healthcheck:
      test: [ "CMD", "curl", "-f", "http://localhost:9944/health" ]
      interval: 2s
      timeout: 5s
      retries: 5
      start_period: 40s
    environment:
      CFG_PRESET: "dev"

  indexer:
    container_name: 'midnight-indexer'
    image: 'midnightntwrk/indexer-standalone:2.1.1'
    ports:
      - '8088:8088'
    environment:
      RUST_LOG: "indexer=info,chain_indexer=info,indexer_api=info,wallet_indexer=info,indexer_common=info"
      APP__INFRA__SECRET: "303132333435363738393031323334353637383930313233343536373839303132"
      APP__INFRA__NODE__URL: "ws://node:9944"  # ローカルノードを参照
    depends_on:
      node:
        condition: service_started
```

起動：

```bash
# プロジェクトルートから実行
docker-compose -f docker-compose.indexer-local.yml up -d
```

#### 環境変数の説明

* `RUST_LOG`: ログレベルの設定
* `APP__INFRA__SECRET`: 32バイトのランダムな16進数エンコードされたシークレット（開発用）
* `APP__INFRA__NODE__URL`: Midnight NodeのWebSocket URL
  * テストネット: `wss://rpc.testnet-02.midnight.network`
  * ローカルノード: `ws://node:9944`

#### GraphQL APIの使用

Indexerが起動すると、ポート8088でGraphQL APIが利用可能になります。

**エンドポイント**: `http://localhost:8088/graphql`

**例: ブロック情報を取得**

```bash
curl -X POST http://localhost:8088/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { blocks(limit: 10) { number hash } }"
  }'
```

**例: トランザクションを検索**

```bash
curl -X POST http://localhost:8088/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { transactions(limit: 10) { id blockNumber } }"
  }'
```

### 従来のScalaベースのIndexer（非推奨）

#### Dockerイメージ

```bash
# 従来のindexer（非推奨）
docker pull midnightnetwork/midnight-pubsub-indexer:latest
```

**注意**: このindexerは非推奨です。新しいRustベースのindexerへの移行を推奨します。

## トランザクション検索への活用

Indexerを使用することで、以下のような効率的なトランザクション検索が可能になります：

1. **トランザクションハッシュでの検索**: インデックス化されたデータから直接検索
2. **アカウントアドレスでの検索**: 特定のアカウントに関連するすべてのトランザクションを高速に取得
3. **ブロック範囲での検索**: 指定したブロック範囲内のトランザクションを効率的に検索
4. **リアルタイム監視**: GraphQLサブスクリプションを使用して、新しいトランザクションをリアルタイムで監視

## 移行について

現在`midnight-pubsub-indexer`を使用している開発者は、新しいRustベースのindexerへの移行を検討することが推奨されます。移行手順については、公式ドキュメントを参照してください。

## 参考リンク

* [Midnight Network公式サイト](https://midnight.network)
* [Midnight Network公式ドキュメント](https://docs.midnight.network)
* [GitHubリポジトリ](https://github.com/midnightntwrk/midnight-indexer)（新しいRustベースのindexer）
