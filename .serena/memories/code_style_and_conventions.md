# NextMed コードスタイルと規約

## 全体的な方針

### 言語
- **日本語優先**: 特段の指定がない限り、わかりやすくて自然な日本語で回答・コメントを記述
- **コミットメッセージ**: 英語でコンベンショナルコミット形式を使用

### 開発哲学
- **TDD原則**: テスト駆動開発を基本とする
- **ボーイスカウトルール**: コードを見つけた時よりも良い状態で残す
- **DRY原則**: 重複を避け、単一の信頼できる情報源を維持

## コードフォーマット（Biome）

### 基本設定
- **インデント**: タブ（`indentStyle: "tab"`）
- **クォート**: ダブルクォート（`quoteStyle: "double"`）
- **自動整形**: `pnpm format` で実行
- **Import整理**: 自動で整理される（`organizeImports: "on"`）

### ファイル管理
- `.gitignore` を尊重
- VCS（Git）統合が有効

## TypeScript 規約

### 型定義
- **型アノテーション**: 明示的に型を指定
- **型推論**: 可能な限り活用するが、パブリックAPIは明示的に
- **any禁止**: 型安全性を維持するため、`any`の使用を避ける

### 命名規則
- **変数・関数**: camelCase（例: `getUserData`, `isActive`）
- **型・インターフェース**: PascalCase（例: `UserData`, `ApiResponse`）
- **定数**: UPPER_SNAKE_CASE（例: `MAX_RETRY_COUNT`）
- **プライベートメンバー**: アンダースコアプレフィックス不要（TypeScriptの`private`を使用）

### 意味のある命名
- 変数名・関数名で意図を明確に伝える
- 略語は避け、完全な単語を使用（例外: 一般的な略語 `id`, `url`など）

## Compact スマートコントラクト規約

### 基本構造
```compact
pragma language_version >= 0.16 && <= 0.25;
import CompactStandardLibrary;

// 公開状態の定義
export ledger <name>: <Type>;

// 状態遷移関数
export circuit <functionName>(): [] {
    // 実装
}
```

### コメント
- 日本語でコメントを記述
- 公開状態と状態遷移関数には必ずコメントを付ける

## エラーハンドリング

### 原則
- エラーの抑制（`@ts-ignore`, `try-catch`で握りつぶす）は禁止
- 根本原因を修正する
- 早期にエラーを検出し、明確なエラーメッセージを提供

### 実装パターン
```typescript
// 良い例
if (!data) {
  throw new Error("Data is required");
}

// 悪い例
try {
  // @ts-ignore
  data.someMethod();
} catch {
  // エラーを無視
}
```

## テスト規約

### テストフレームワーク
- **Vitest**: すべてのパッケージで使用

### テストの原則
- 実装詳細ではなく振る舞いをテスト
- テスト間の依存を避ける
- 任意の順序で実行可能に
- 高速で、常に同じ結果を返す

### テストファイル配置
- `src/test/` ディレクトリに配置
- テストファイル名: `*.test.ts` または `*.spec.ts`

## コメント規約

### コメントの目的
- **「なぜ」を説明**: 実装の理由や背景を記述
- **「何を」はコードで表現**: コード自体が自己説明的であるべき

### 例
```typescript
// 良い例: なぜこの実装が必要かを説明
// ZK証明の生成には時間がかかるため、タイムアウトを長めに設定
const PROOF_GENERATION_TIMEOUT = 30000;

// 悪い例: コードを繰り返すだけ
// タイムアウトを30000に設定
const PROOF_GENERATION_TIMEOUT = 30000;
```

## Git コミット規約

### コンベンショナルコミット形式
```
<type>: <subject>

<body>

<footer>
```

### Type
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント変更
- `test`: テスト追加・修正
- `refactor`: リファクタリング
- `chore`: ビルドプロセスやツールの変更

### 例
```
feat: add patient data encryption feature

Implement ZK-based encryption for patient EHR data
using Midnight's compact runtime.

Closes #123
```

## セキュリティ規約

### 機密情報管理
- APIキー、パスワードは環境変数で管理
- ハードコード禁止
- `.env` ファイルは `.gitignore` に追加

### 入力検証
- すべての外部入力を検証
- Zodなどのバリデーションライブラリを活用

## パフォーマンス規約

### 最適化の原則
- 推測ではなく計測に基づいて最適化
- 初期段階から拡張性を考慮
- N+1問題やオーバーフェッチを避ける

## ドキュメント規約

### README
- プロジェクトの概要
- セットアップ手順
- 使用方法
- 実例を含める

### コードドキュメント
- パブリックAPIには必ずJSDocを記述
- 複雑なロジックには説明コメントを追加

## 依存関係管理

### 追加前の確認
- ライセンスの確認
- パッケージサイズの確認
- メンテナンス状況の確認

### ロックファイル
- `pnpm-lock.yaml` を必ずコミット
- 定期的に依存関係を更新
