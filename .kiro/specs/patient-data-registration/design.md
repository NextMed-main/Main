# Patient Data Registration - 設計書（緻密化版）

## 概要

本設計書は、Midnight Blockchain上で患者データを安全に登録するスマートコントラクトの技術設計を定義します。
**helixchainの実証済み実装パターン**を参考に、シンプルで堅牢な設計を採用します。

## 設計方針

### helixchainからの学び

1. **シンプルさ優先**: Witness関数を使わず、直接パラメータで受け取る
2. **Field型の活用**: カウンターは`Field`型で統一（`genomic_working.compact`パターン）
3. **Boolean返却**: 成功/失敗を明確に返す（`genomic_verifier_working.compact`パターン）
4. **統計重視**: 個別データよりも集計統計を優先
5. **テスト駆動**: testcontainersを使った統合テスト

### MVPスコープ

- ✅ 患者データの登録
- ✅ 統計情報の取得
- ✅ 年齢範囲の検証
- ❌ 個別患者データの証明（将来実装）
- ❌ Witness関数（将来実装）
- ❌ MerkleTree（将来実装）

## アーキテクチャ

### システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Patient UI   │  │ Researcher UI│  │ Wallet Connect│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Midnight.js SDK / Compact Runtime               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Contract API │  │ Witness Impl │  │ Proof Server │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│           Midnight Blockchain (Compact Contract)             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PatientRegistry Contract                             │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │ Ledger     │  │ Circuits   │  │ Witnesses  │    │  │
│  │  │ State      │  │ (ZK Proof) │  │ (Private)  │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### ディレクトリ構造

```
pkgs/contract/
├── src/
│   ├── patient-registry.compact      # メインコントラクト
│   ├── index.ts                       # TypeScriptエクスポート
│   ├── types.ts                       # 型定義
│   ├── utils.ts                       # ユーティリティ関数
│   ├── managed/                       # コンパイル済みコントラクト
│   │   └── patient-registry/          # compactcが生成
│   └── test/
│       ├── patient-registry.test.ts   # ユニットテスト
│       └── integration.test.ts        # 統合テスト
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── vitest.config.ts
```

### コンポーネント構成

#### 1. Compact Contract (`pkgs/contract/src/patient-registry.compact`)
- **言語バージョン**: `pragma language_version 0.17.0`（helixchainと同じ）
- **役割**: 患者データの登録と統計管理
- **責務**:
  - 患者データの登録
  - カウンターの更新
  - 統計情報の提供
  - 年齢検証
- **参考実装**: `genomic_verifier_working.compact`のパターンを踏襲

#### 2. TypeScript API (`pkgs/contract/src/index.ts`)
- **役割**: コントラクトとの統合インターフェース
- **責務**:
  - 型定義のエクスポート
  - ユーティリティ関数
- **エクスポート内容**:
  ```typescript
  export { PatientRegistryContract } from './managed/patient-registry';
  export * from './types';
  export * from './utils';
  ```

#### 3. SDK Layer（将来実装）
- **役割**: フロントエンドからの簡易アクセス
- **参考**: helixchainのProofSDK構造
- **機能**:
  - 患者登録のラッパー関数
  - エラーハンドリング
  - モックモード対応

## データモデル

### 1. Gender (列挙型)

```compact
enum Gender {
  MALE,
  FEMALE,
  OTHER
}
```

**設計判断**:
- 3つの性別オプションを提供
- 列挙型により型安全性を確保
- **参考**: `genomic_verifier_working.compact`のenum使用パターン

### 2. RegistrationState (列挙型)

```compact
enum RegistrationState {
  UNREGISTERED,
  REGISTERED,
  VERIFIED
}
```

**設計判断**:
- 患者の登録状態を管理
- 将来的な検証機能の拡張に対応
- **参考**: `genomic_verifier_working.compact`のVerificationState

### 3. Ledger State

```compact
// 登録患者数のカウンター（helixchainパターン）
export ledger registrationCount: Field;

// 年齢別カウンター（統計用）
export ledger ageGroupCount: Field;

// 性別カウンター（統計用）
export ledger maleCount: Field;
export ledger femaleCount: Field;
export ledger otherCount: Field;

// 登録状態
export ledger state: RegistrationState;
```

**設計判断**:
- helixchainの`genomic_working.compact`パターンを踏襲
- `Field`型でカウンターを統一（シンプルで効率的）
- 統計情報を直接Ledgerで管理（クエリ効率化）
- **参考**: `genomic_working.compact`のField型カウンター

### 4. Constructor

```compact
constructor() {
  registrationCount = 0;
  ageGroupCount = 0;
  maleCount = 0;
  femaleCount = 0;
  otherCount = 0;
  state = RegistrationState.UNREGISTERED;
}
```

**設計判断**:
- すべてのカウンターを0で初期化
- 状態をUNREGISTEREDで初期化
- **参考**: `genomic_working.compact`のconstructor

## コンポーネントとインターフェース

### 1. Exported Circuits

#### registerPatient()
```compact
export circuit registerPatient(
  age: Uint<64>,
  gender_code: Uint<64>,
  condition_hash: Field
): Boolean;
```

**設計判断**:
- **入力**: 直接パラメータとして受け取る（Witness関数不使用）
- **出力**: 成功/失敗のBoolean（helixchainパターン）
- **処理フロー**:
  1. 年齢検証（0-150歳）
  2. 登録カウンターをインクリメント
  3. 性別カウンターを更新
  4. 状態をREGISTEREDに変更
  5. trueを返却

**実装例**:
```compact
export circuit registerPatient(
  age: Uint<64>,
  gender_code: Uint<64>,
  condition_hash: Field
): Boolean {
  // 年齢検証
  assert(age <= (150 as Uint<64>), "Age must be between 0 and 150");
  
  // カウンター更新
  registrationCount = registrationCount + (1 as Field);
  
  // 性別カウンター更新
  if (gender_code == (0 as Uint<64>)) {
    maleCount = maleCount + (1 as Field);
  } else if (gender_code == (1 as Uint<64>)) {
    femaleCount = femaleCount + (1 as Field);
  } else {
    otherCount = otherCount + (1 as Field);
  }
  
  // 状態更新
  state = RegistrationState.REGISTERED;
  
  return true;
}
```

**参考**: `genomic_verifier_working.compact`の`verify_brca1`パターン

#### getRegistrationStats()
```compact
export circuit getRegistrationStats(): [Field, Field, Field, Field];
```

**設計判断**:
- **入力**: なし
- **出力**: [総登録数, 男性数, 女性数, その他数]
- **処理フロー**:
  1. 各カウンターを読み取り
  2. タプルで返却

**実装例**:
```compact
export circuit getRegistrationStats(): [Field, Field, Field, Field] {
  return [registrationCount, maleCount, femaleCount, otherCount];
}
```

**参考**: helixchainの統計取得パターン

#### verifyAgeRange()
```compact
export circuit verifyAgeRange(
  age: Uint<64>,
  min_age: Uint<64>,
  max_age: Uint<64>
): Boolean;
```

**設計判断**:
- **入力**: 年齢、最小年齢、最大年齢
- **出力**: 範囲内ならtrue
- **用途**: 研究者が特定年齢層のデータ存在を確認

**実装例**:
```compact
export circuit verifyAgeRange(
  age: Uint<64>,
  min_age: Uint<64>,
  max_age: Uint<64>
): Boolean {
  return age >= min_age && age <= max_age;
}
```

**参考**: `genomic_verifier_working.compact`の比較ロジック

## エラーハンドリング

### 1. 年齢検証エラー

```compact
assert(age <= (150 as Uint<64>), "Age must be between 0 and 150");
```

**エラーケース**:
- 年齢が150歳を超える場合

**対処**:
- トランザクションを拒否
- 明確なエラーメッセージを返す

### 2. 型変換エラー

**エラーケース**:
- 不正な性別コード（0, 1, 2以外）

**対処**:
- デフォルトで「その他」として扱う
- フロントエンドでバリデーション実装

## テスト戦略

helixchainの`test-blockchain-integration.js`パターンを参考にした実装:

### 1. Unit Tests (Vitest)

```typescript
// src/test/patient-registry.test.ts
import { describe, test, expect, beforeAll } from 'vitest';
import { PatientRegistryContract } from '../managed/patient-registry';

describe('PatientRegistry Contract', () => {
  let contract: PatientRegistryContract;

  beforeAll(() => {
    // コントラクトの初期化
    contract = new PatientRegistryContract();
  });

  test('should register patient with valid data', async () => {
    // 正常系: 有効なデータで患者登録
    const result = await contract.registerPatient(
      BigInt(30),  // age
      BigInt(0),   // gender (MALE)
      BigInt(12345) // condition hash
    );
    expect(result).toBe(true);
  });

  test('should reject patient with age > 150', async () => {
    // 異常系: 年齢が150歳を超える場合
    await expect(
      contract.registerPatient(BigInt(151), BigInt(0), BigInt(12345))
    ).rejects.toThrow('Age must be between 0 and 150');
  });

  test('should increment registration counter', async () => {
    // カウンター: 登録ごとにカウンターが増加
    const statsBefore = await contract.getRegistrationStats();
    await contract.registerPatient(BigInt(25), BigInt(1), BigInt(67890));
    const statsAfter = await contract.getRegistrationStats();
    
    expect(statsAfter[0]).toBe(statsBefore[0] + BigInt(1));
  });

  test('should update gender counters correctly', async () => {
    // 性別カウンター: 性別ごとにカウンターが更新される
    const statsBefore = await contract.getRegistrationStats();
    
    // 男性登録
    await contract.registerPatient(BigInt(40), BigInt(0), BigInt(11111));
    const statsAfterMale = await contract.getRegistrationStats();
    expect(statsAfterMale[1]).toBe(statsBefore[1] + BigInt(1));
    
    // 女性登録
    await contract.registerPatient(BigInt(35), BigInt(1), BigInt(22222));
    const statsAfterFemale = await contract.getRegistrationStats();
    expect(statsAfterFemale[2]).toBe(statsBefore[2] + BigInt(1));
  });

  test('should verify age range correctly', async () => {
    // 年齢範囲検証
    expect(
      await contract.verifyAgeRange(BigInt(30), BigInt(20), BigInt(40))
    ).toBe(true);
    
    expect(
      await contract.verifyAgeRange(BigInt(50), BigInt(20), BigInt(40))
    ).toBe(false);
  });
});
```

**参考**: helixchainの`genomic_verifier.test.js`パターン

### 2. Integration Tests (TypeScript)

```typescript
// src/test/integration.test.ts
import { describe, test, expect } from 'vitest';
import { testcontainers } from 'testcontainers';

describe('Patient Registration Integration', () => {
  test('should register patient end-to-end', async () => {
    // E2E: スタンドアロン環境でのテスト
    // helixchainのtest-blockchain-integration.jsパターン
    
    // 1. Dockerコンテナ起動
    // 2. コントラクトデプロイ
    // 3. 患者登録
    // 4. 統計確認
    // 5. クリーンアップ
  });

  test('should handle multiple concurrent registrations', async () => {
    // 並行処理: 複数の登録が同時に行われる場合
    const registrations = Array.from({ length: 10 }, (_, i) => 
      contract.registerPatient(
        BigInt(20 + i),
        BigInt(i % 3),
        BigInt(10000 + i)
      )
    );
    
    const results = await Promise.all(registrations);
    expect(results.every(r => r === true)).toBe(true);
  });
});
```

**参考**: helixchainの`test-e2e-workflow.js`

### 3. テスト実行コマンド

```json
// package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  }
}
```

**参考**: helixchainの`package.json`スクリプト構成

## セキュリティ考慮事項

### 1. データプライバシー

**現在の設計**:
- 統計情報のみを公開
- 個別患者データは保存しない

**将来の拡張**:
- MerkleTreeによる個別データの証明
- Witness関数によるプライベートデータ処理

### 2. 入力検証

**実装済み**:
- 年齢範囲チェック（0-150歳）
- 性別コードの検証

**推奨**:
- フロントエンドでの事前検証
- TypeScriptでの型チェック

## パフォーマンス最適化

### 1. Field型の使用

- **最適化**: すべてのカウンターを`Field`型で統一
- **利点**: 算術演算が効率的
- **参考**: helixchainの`genomic_working.compact`

### 2. シンプルな構造

- **最適化**: Witness関数を使わない
- **利点**: デバッグとテストが容易
- **トレードオフ**: プライバシー保護レベルは中程度

## デプロイメント戦略

helixchainの実装パターンを踏襲:

### 1. ビルドスクリプト設定

```json
// pkgs/contract/package.json
{
  "scripts": {
    "compact": "compact compile ./src/patient-registry.compact ./src/managed/patient-registry",
    "build": "rm -rf dist && tsc --project tsconfig.build.json && cp -Rf ./src/managed ./dist/managed && cp ./src/patient-registry.compact ./dist",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src"
  }
}
```

**参考**: helixchainの`package.json`ビルドスクリプト

### 2. コンパイルフロー

```bash
# 1. Compactコントラクトのコンパイル
cd pkgs/contract
pnpm compact

# 2. TypeScriptビルド
pnpm build

# 3. テスト実行
pnpm test
```

**生成物**:
- `src/managed/patient-registry/` - コンパイル済みコントラクト
- `dist/` - TypeScriptビルド成果物
- `dist/managed/` - コントラクトのコピー

### 3. デプロイスクリプト

```typescript
// pkgs/cli/scripts/deploy.ts
import { PatientRegistryContract } from '../../contract/dist';
import * as fs from 'fs';

async function deploy() {
  console.log('🚀 Deploying PatientRegistry contract...');
  
  // 1. コントラクトの初期化
  const contract = new PatientRegistryContract();
  
  // 2. デプロイ
  const address = await contract.deploy();
  
  // 3. デプロイ情報を保存
  const deployment = {
    contractAddress: address,
    deployedAt: new Date().toISOString(),
    network: process.env.NETWORK || 'testnet'
  };
  
  fs.writeFileSync(
    'deployment.json',
    JSON.stringify(deployment, null, 2)
  );
  
  console.log('✅ Contract deployed at:', address);
  console.log('📝 Deployment info saved to deployment.json');
}

deploy().catch(console.error);
```

**参考**: helixchainの`scripts/deploy.js`

### 4. 検証スクリプト

```typescript
// pkgs/cli/scripts/verify.ts
import { PatientRegistryContract } from '../../contract/dist';
import * as fs from 'fs';

async function verify() {
  console.log('🔍 Verifying contract deployment...');
  
  // 1. デプロイ情報を読み込み
  const deployment = JSON.parse(
    fs.readFileSync('deployment.json', 'utf8')
  );
  
  // 2. コントラクトに接続
  const contract = new PatientRegistryContract(deployment.contractAddress);
  
  // 3. 初期状態を確認
  const stats = await contract.getRegistrationStats();
  console.log('📊 Initial stats:', stats);
  
  // 4. テスト登録
  console.log('🧪 Testing registration...');
  const result = await contract.registerPatient(
    BigInt(30),
    BigInt(0),
    BigInt(12345)
  );
  console.log('✅ Test registration:', result);
  
  // 5. 統計を再確認
  const newStats = await contract.getRegistrationStats();
  console.log('📊 Updated stats:', newStats);
}

verify().catch(console.error);
```

**参考**: helixchainの`scripts/verify.js`

### 5. 環境設定

```bash
# .env.example
NETWORK=testnet
CONTRACT_ADDRESS=
PROOF_SERVER_URL=http://localhost:6300
NODE_URL=https://rpc.testnet-02.midnight.network/
INDEXER_URL=
```

**参考**: helixchainの`.env.example`

## 今後の拡張性

### Phase 1: MVP（現在）
- ✅ 基本的な患者登録
- ✅ 統計情報の取得
- ✅ 年齢範囲検証

### Phase 2: プライバシー強化
- ⬜ Witness関数の追加
- ⬜ MerkleTreeによる個別データ証明
- ⬜ コミットメント/ヌリファイアパターン

### Phase 3: 高度な機能
- ⬜ 同意管理
- ⬜ データ更新
- ⬜ クロスコントラクト呼び出し

## 参考資料

### Midnight公式ドキュメント
- [Midnight Documentation](https://docs.midnight.network/)
- [Compact Language Reference](https://docs.midnight.network/develop/reference/compact/lang-ref)
- [Building Blocks](https://docs.midnight.network/develop/how-midnight-works/building-blocks)
- [How to Keep Data Private](https://docs.midnight.network/develop/how-midnight-works/keeping-data-private)

### helixchain参考実装
- `references/helixchain/contracts/src/genomic_verifier_working.compact`
- `references/helixchain/contracts/src/genomic_working.compact`
- `references/helixchain/contracts/src/sdk/ProofSDK.ts`
- `references/helixchain/contracts/test-blockchain-integration.js`

## 設計判断の記録

### 1. Witness関数を使わない理由
- helixchainの実証済みパターン
- デバッグとテストが容易
- MVPには十分な機能

### 2. Field型カウンターを採用した理由
- helixchainで実証済み
- シンプルで効率的
- 統計クエリに最適

### 3. MerkleTreeを使わない理由
- MVPでは統計情報が優先
- 実装の複雑さを回避
- 将来のPhase 2で追加予定

### 4. Boolean返却を採用した理由
- helixchainのパターンに準拠
- 成功/失敗が明確
- エラーハンドリングが容易
