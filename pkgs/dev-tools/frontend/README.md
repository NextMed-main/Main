# Midnight Network RPC Explorer

Midnight NetworkのRPCエンドポイントと対話するためのWebインターフェースです。

## 機能

* すべてのRPCメソッドをブラウザから呼び出し可能
* パラメータの入力フォーム
* レスポンスのJSON表示
* エラーハンドリング
* カスタムエンドポイントの設定

## 開発

### インストール

```bash
cd frontend
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで `http://localhost:5173` を開きます。

### ビルド

```bash
pnpm build
```

### リントとフォーマット

```bash
# リントチェック
pnpm lint

# リントとフォーマットの自動修正
pnpm lint:fix

# フォーマットのみ
pnpm format
```

## 使用方法

1. 上部のエンドポイント入力欄でRPCエンドポイントを設定（デフォルト: `https://rpc.testnet-02.midnight.network/`）
2. 左側のサイドバーから呼び出したいRPCメソッドを選択
3. 必要に応じてパラメータを入力
4. 「Call RPC Method」ボタンをクリック
5. 結果が下部に表示されます

## 技術スタック

* **Vite** - ビルドツール
* **React** - UIフレームワーク
* **TypeScript** - 型安全性
* **Biome** - リントとフォーマット

## ライセンス

Apache-2.0
