# Midnight Blockchain 基礎知識

## Midnight とは

Midnight は、ゼロ知識証明（Zero-Knowledge Proofs）を活用したプライバシー保護型ブロックチェーンプラットフォームです。

### 主要な特徴
- **データ保護**: ゼロ知識証明により、データを公開せずに検証可能
- **選択的開示**: 必要な情報のみを選択的に開示
- **Compact言語**: スマートコントラクト専用のドメイン固有言語

## Compact 言語

### 基本構造
```compact
pragma language_version >= 0.16 && <= 0.25;
import CompactStandardLibrary;

// 公開状態（Ledger）
export ledger <name>: <Type>;

// 状態遷移関数（Circuit）
export circuit <functionName>(<params>): <ReturnType> {
    // 実装
}

// Witness関数（プライベート入力）
witness <functionName>(<params>): <ReturnType>;
```

### 主要な概念

#### 1. Ledger（公開状態）
- ブロックチェーン上に保存される公開データ
- 誰でも読み取り可能
- 型: `Counter`, `Set<T>`, `Map<K, V>`, `List<T>`, `MerkleTree<n, T>` など

#### 2. Circuit（状態遷移関数）
- スマートコントラクトのメイン処理
- ゼロ知識証明として実行される
- `export circuit` でエントリーポイントとして公開

#### 3. Witness（プライベート入力）
- オフチェーンで実行される関数
- プライベートデータの提供
- TypeScriptで実装

### データ型

#### プリミティブ型
- `Boolean`: 真偽値
- `Field`: フィールド要素
- `Uint<n>`: n ビット符号なし整数
- `Uint<0..n>`: 0 から n までの範囲の整数
- `Bytes<n>`: n バイトのバイト配列

#### Ledger型
- `Counter`: カウンター
- `Set<T>`: セット
- `Map<K, V>`: マップ
- `List<T>`: リスト
- `MerkleTree<n, T>`: Merkleツリー（深さn）
- `HistoricMerkleTree<n, T>`: 履歴付きMerkleツリー

## Midnight SDK

### 主要なパッケージ

#### @midnight-ntwrk/compact-runtime
- Compactランタイム
- コントラクトの実行環境

#### @midnight-ntwrk/midnight-js-contracts
- コントラクトとのインタラクション
- トランザクション送信

#### @midnight-ntwrk/wallet
- ウォレット管理
- 秘密鍵・公開鍵の管理

#### @midnight-ntwrk/ledger
- Ledger状態の管理
- 状態の読み取り・更新

#### @midnight-ntwrk/zswap
- Zswap（プライベートトークン転送）
- トークンの送受信

## 開発フロー

### 1. Compactコントラクト開発
```compact
// counter.compact
pragma language_version >= 0.16 && <= 0.25;
import CompactStandardLibrary;

export ledger round: Counter;

export circuit increment(): [] {
    round.increment(1);
}
```

### 2. Witness実装（TypeScript）
```typescript
// witnesses.ts
import { WitnessContext } from '@midnight-ntwrk/compact-runtime';

export const witnesses = {
  // Witness関数の実装
};
```

### 3. コンパイル
```bash
pnpm compact
```
- Compactコンパイラが以下を生成:
  - TypeScript型定義
  - ゼロ知識証明回路
  - Prover/Verifier鍵

### 4. デプロイ
```typescript
// deploy.ts
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';

const contract = await deployContract({
  // コントラクト設定
});
```

### 5. インタラクション
```typescript
// increment.ts
import { callContract } from '@midnight-ntwrk/midnight-js-contracts';

await callContract({
  contract: contractAddress,
  circuit: 'increment',
  args: [],
});
```

## ゼロ知識証明の仕組み

### ZK-SNARK
- **Succinct**: 証明サイズが小さい
- **Non-interactive**: 対話不要
- **Argument of Knowledge**: 知識の証明

### プライバシー保護
1. **データの機密化**: 生データは公開されない
2. **計算の検証**: 計算が正しく行われたことを証明
3. **選択的開示**: 必要な情報のみを開示

## テスト環境

### Standalone環境
- Docker Composeでローカル環境を構築
- 完全にオフライン
- 開発・テストに最適

### Testnet環境
- Midnight公式テストネット
- 実際のネットワークでテスト
- tDUST（テストトークン）を使用

### 環境の選択
- **開発初期**: Standalone環境
- **統合テスト**: Testnet環境
- **本番前**: Testnet環境で十分なテスト

## セキュリティ考慮事項

### Witness関数の信頼性
- Witness関数の実装は信頼できないものとして扱う
- 結果を必ずCircuit内で検証

### プライベートデータの管理
- 秘密鍵は環境変数で管理
- ハードコード禁止
- Witness関数でのみプライベートデータを扱う

### ゼロ知識証明の検証
- すべてのCircuitは証明を生成
- 証明は自動的に検証される
- 不正な証明は拒否される

## パフォーマンス考慮事項

### 証明生成時間
- ZK証明の生成には時間がかかる
- 複雑なCircuitほど時間がかかる
- タイムアウト設定を適切に

### ガス費用
- トランザクションにはガス費用が必要
- 複雑な処理ほど高額
- 最適化を検討

## デバッグ

### ログ出力
```typescript
import pino from 'pino';

const logger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
  },
});
```

### エラーハンドリング
- すべてのトランザクションはエラーを返す可能性がある
- 適切なエラーハンドリングを実装
- リトライ機構を検討

## リソース

### 公式ドキュメント
- Midnight Docs: https://docs.midnight.network/
- Compact言語リファレンス
- SDK APIドキュメント

### サンプルコード
- example-counter: 基本的なカウンターコントラクト
- example-bulletin-board: 掲示板コントラクト
