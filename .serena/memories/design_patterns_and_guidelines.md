# NextMed デザインパターンとガイドライン

## アーキテクチャパターン

### 3層アーキテクチャ

```
┌─────────────────────────────────────┐
│     Frontend (Next.js)              │
│  - Patient Dashboard                │
│  - Researcher Dashboard             │
│  - Institution Dashboard            │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│     Backend (CLI/API)               │
│  - Contract Interaction             │
│  - Wallet Management                │
│  - AI Agent Integration             │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  Smart Contract (Compact)           │
│  - Public State (Ledger)            │
│  - State Transitions (Circuit)      │
│  - Private Input (Witness)          │
└─────────────────────────────────────┘
```

## Compact コントラクトパターン

### 1. 基本的なカウンターパターン
```compact
pragma language_version >= 0.16 && <= 0.25;
import CompactStandardLibrary;

export ledger counter: Counter;

export circuit increment(): [] {
    counter.increment(1);
}

export circuit decrement(): [] {
    counter.decrement(1);
}

export circuit get(): Uint<64> {
    return counter.read();
}
```

### 2. アクセス制御パターン
```compact
// 所有者のみが実行できる関数
witness getOwnerKey(): Bytes<32>;
export ledger owner: Bytes<32>;

constructor(ownerKey: Bytes<32>) {
    owner = disclose(ownerKey);
}

export circuit restrictedAction(): [] {
    const key = getOwnerKey();
    assert(owner == key, "Not authorized");
    // アクション実行
}
```

### 3. データ登録パターン（NextMed用）
```compact
// 患者データの登録
struct PatientData {
    age: Uint<8>;
    gender: Uint<8>;  // 0: 不明, 1: 男性, 2: 女性
    condition: Bytes<32>;  // 症例のハッシュ
}

export ledger patients: Map<Bytes<32>, PatientData>;

export circuit registerPatient(
    patientId: Bytes<32>,
    data: PatientData
): [] {
    patients.insert(patientId, data);
}
```

## TypeScript パターン

### 1. Witness実装パターン
```typescript
import { WitnessContext } from '@midnight-ntwrk/compact-runtime';

export const witnesses = {
  getOwnerKey: (context: WitnessContext): Uint8Array => {
    // プライベートキーの取得
    return context.privateState.ownerKey;
  },
};
```

### 2. コントラクトデプロイパターン
```typescript
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from './contract';

async function deploy() {
  const contract = new Contract(witnesses);
  
  const deployed = await deployContract({
    contract,
    initialState: contract.initialState(privateState),
    wallet,
    providers,
  });
  
  return deployed;
}
```

### 3. トランザクション送信パターン
```typescript
async function sendTransaction(
  contract: Contract,
  circuit: string,
  args: any[]
) {
  try {
    const result = await contract.callCircuit(circuit, args);
    logger.info('Transaction successful', { result });
    return result;
  } catch (error) {
    logger.error('Transaction failed', { error });
    throw error;
  }
}
```

## React/Next.js パターン

### 1. ダッシュボードコンポーネントパターン
```typescript
interface DashboardProps {
  onLogout: () => void;
}

export function PatientDashboard({ onLogout }: DashboardProps) {
  const [data, setData] = useState<PatientData | null>(null);
  
  useEffect(() => {
    // データ取得
    fetchPatientData().then(setData);
  }, []);
  
  return (
    <div>
      {/* ダッシュボードUI */}
    </div>
  );
}
```

### 2. ロール別ルーティングパターン
```typescript
export type UserRole = "patient" | "researcher" | "institution" | null;

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  
  if (!userRole) {
    return <LoginScreen onLogin={setUserRole} />;
  }
  
  switch (userRole) {
    case "patient":
      return <PatientDashboard onLogout={() => setUserRole(null)} />;
    case "researcher":
      return <ResearcherDashboard onLogout={() => setUserRole(null)} />;
    case "institution":
      return <InstitutionDashboard onLogout={() => setUserRole(null)} />;
  }
}
```

### 3. フォーム処理パターン
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  age: z.number().min(0).max(150),
  gender: z.enum(['male', 'female', 'other']),
  condition: z.string().min(1),
});

export function PatientForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data: z.infer<typeof schema>) => {
    // データ送信
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* フォームフィールド */}
    </form>
  );
}
```

## エラーハンドリングパターン

### 1. トランザクションエラー
```typescript
async function handleTransaction() {
  try {
    await sendTransaction();
  } catch (error) {
    if (error instanceof TransactionError) {
      // トランザクション固有のエラー処理
      logger.error('Transaction failed', { error });
      showErrorToast('トランザクションが失敗しました');
    } else {
      // その他のエラー
      logger.error('Unexpected error', { error });
      showErrorToast('予期しないエラーが発生しました');
    }
  }
}
```

### 2. バリデーションエラー
```typescript
function validatePatientData(data: PatientData): Result<PatientData, Error> {
  if (data.age < 0 || data.age > 150) {
    return { success: false, error: new Error('Invalid age') };
  }
  
  if (![0, 1, 2].includes(data.gender)) {
    return { success: false, error: new Error('Invalid gender') };
  }
  
  return { success: true, data };
}
```

## テストパターン

### 1. Compactコントラクトテスト
```typescript
import { describe, it, expect } from 'vitest';
import { Contract } from './contract';

describe('Counter Contract', () => {
  it('should increment counter', async () => {
    const contract = new Contract(witnesses);
    const initialState = contract.initialState({});
    
    await contract.increment();
    
    const counter = await contract.get();
    expect(counter).toBe(1n);
  });
});
```

### 2. 統合テスト
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { startStandaloneEnvironment } from './utils/standalone';

describe('Integration Tests', () => {
  let environment: StandaloneEnvironment;
  
  beforeAll(async () => {
    environment = await startStandaloneEnvironment();
  });
  
  afterAll(async () => {
    await environment.stop();
  });
  
  it('should deploy and interact with contract', async () => {
    // テスト実装
  });
});
```

## セキュリティパターン

### 1. プライベートデータの保護
```compact
// 悪い例: プライベートデータを直接公開
export circuit badExample(privateData: Bytes<32>): [] {
    publicLedger = privateData;  // NG!
}

// 良い例: ハッシュ化して公開
export circuit goodExample(privateData: Bytes<32>): [] {
    publicLedger = disclose(persistentHash(privateData));
}
```

### 2. アクセス制御
```compact
witness getAuthorization(): Bytes<32>;
export ledger authorizedUsers: Set<Bytes<32>>;

export circuit restrictedAction(): [] {
    const auth = getAuthorization();
    assert(authorizedUsers.member(auth), "Not authorized");
    // アクション実行
}
```

## パフォーマンス最適化パターン

### 1. バッチ処理
```typescript
// 悪い例: 1件ずつ処理
for (const data of dataList) {
  await processData(data);
}

// 良い例: バッチ処理
await Promise.all(dataList.map(processData));
```

### 2. キャッシング
```typescript
const cache = new Map<string, PatientData>();

async function getPatientData(id: string): Promise<PatientData> {
  if (cache.has(id)) {
    return cache.get(id)!;
  }
  
  const data = await fetchPatientData(id);
  cache.set(id, data);
  return data;
}
```

## ロギングパターン

### 1. 構造化ログ
```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

logger.info({ userId: '123', action: 'login' }, 'User logged in');
```

### 2. エラーログ
```typescript
try {
  await riskyOperation();
} catch (error) {
  logger.error(
    {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { userId, operation: 'riskyOperation' },
    },
    'Operation failed'
  );
  throw error;
}
```

## 状態管理パターン（Frontend）

### 1. ローカル状態
```typescript
// シンプルな状態管理
const [state, setState] = useState<State>(initialState);
```

### 2. グローバル状態（必要に応じて）
```typescript
// Context API
const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
```

## ベストプラクティス

### 1. 型安全性
- すべての関数に型アノテーションを付ける
- `any`型の使用を避ける
- Zodなどでランタイム検証を行う

### 2. エラーハンドリング
- すべての非同期処理にエラーハンドリングを実装
- ユーザーフレンドリーなエラーメッセージを表示
- エラーログを適切に記録

### 3. テスト
- すべての重要な機能にテストを書く
- 単体テストと統合テストを組み合わせる
- エッジケースもテストする

### 4. ドキュメント
- 複雑なロジックにはコメントを付ける
- パブリックAPIにはJSDocを記述
- READMEを最新に保つ
