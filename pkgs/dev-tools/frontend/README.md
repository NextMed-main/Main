# Midnight Network DevTools Frontend

Midnight Network開発者向けのWebツール集です。

## 利用可能なツール

### RPC Explorer
* すべてのRPCメソッドをブラウザから呼び出し可能
* パラメータの入力フォーム
* レスポンスのJSON表示
* エラーハンドリング
* カスタムエンドポイントの設定

### Wallet Connection
* Midnight Network対応ウォレットへの接続確認
* アドレスと残高の表示
* ウォレットの検出と管理

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

## 新しいツールの追加方法

新しいツールを追加するには、以下の手順に従ってください：

1. **ツールコンポーネントを作成**
   - `src/` ディレクトリに新しいコンポーネントファイルを作成
   - 例: `src/NewTool.tsx`

2. **ツール設定に追加**
   - `src/tools-config.tsx` を開く
   - `TOOLS` 配列に新しいツールの設定を追加：
   ```typescript
   {
     id: "new-tool",
     name: "New Tool",
     description: "新しいツールの説明",
     component: NewTool,
   }
   ```

3. **コンポーネントをインポート**
   - `tools-config.tsx` の上部で新しいコンポーネントをインポート

これだけで、ナビゲーションバーに新しいツールが自動的に追加され、`#new-tool` のURLハッシュでアクセス可能になります。

## 技術スタック

* **Vite** - ビルドツール
* **React** - UIフレームワーク
* **TypeScript** - 型安全性
* **Biome** - リントとフォーマット

## ライセンス

Apache-2.0
