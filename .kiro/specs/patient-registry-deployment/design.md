# Patient Registry Deployment - 設計書

## 概要

本設計書は、Patient Registryコントラクトのデプロイメント戦略を定義します。
既存のcounterデプロイスクリプトをベースに、Patient Registry専用のデプロイ・検証スクリプトを実装します。

## アーキテクチャ

### デプロイフロー

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Machine                         │
│                                                              │
│  1. 環境変数設定 (.env)                                      │
│     ├─ NETWORK_ENV_VAR=testnet                              │
│     ├─ SEED_ENV_VAR=your-seed                               │
│     └─ CACHE_FILE_ENV_VAR=patient-registry.state            │
│                                                              │
│  2. デプロイスクリプト実行                                   │
│     └─ pnpm deploy:patient-registry                         │
│                                                              │
│  3. デプロイ情報保存                                         │
│     └─ deployment-patient-registry.json                     │
│                                                              │
│  4. 検証スクリプト実行                                       │
│     └─ pnpm verify:patient-registry                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Midnight Blockchain Network                     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Patient Registry Contract                          │    │
│  │  Address: 0x...                                     │    │
│  │  State: registrationCount = 0                       │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## ファイル構成

```
pkgs/cli/
├── scripts/
│   ├── deploy.ts                           # 既存（Counter用）
│   ├── deploy-patient-registry.ts          # 新規（Patient Registry用）
│   ├── increment.ts                        # 既存（Counter用）
│   └── verify-patient-registry.ts          # 新規（検証用）
├── src/
│   ├── api.ts                              # 既存（共通API）
│   ├── config.ts                           # 既存（環境設定）
│   └── utils/
│       └── logger-utils.ts                 # 既存（ログ）
├── .env.example                            # 更新（Patient Registry用の例を追加）
├── deployment-patient-registry.json        # 新規（デプロイ情報）
└── package.json                            # 更新（スクリプト追加）
```

## コンポーネント設計

### 1. deploy-patient-registry.ts

**目的**: Patient Registryコントラクトをデプロイ

**主要機能**:
```typescript
// 環境変数から設定を読み込み
const network = resolveNetwork(NETWORK_ENV_VAR);
const seed = ensureSeed(SEED_ENV_VAR);
const cacheFileName = CACHE_FILE_ENV_VAR ?? defaultCacheName(seed, network);

// ウォレット作成と資金確認
const wallet = await api.buildWalletAndWaitForFunds(config, seed, cacheFileName);

// プロバイダー設定
const providers = await api.configureProviders(wallet, config);

// Patient Registryコントラクトをデプロイ
const contract = await deployPatientRegistry(providers);

// デプロイ情報を保存
await saveDeploymentInfo(contract, 'deployment-patient-registry.json');
```

**参考**: `scripts/deploy.ts`のパターンを踏襲

### 2. verify-patient-registry.ts

**目的**: デプロイされたコントラクトの動作確認

**検証フロー**:
```typescript
// 1. デプロイ情報を読み込み
const deployment = loadDeploymentInfo('deployment-patient-registry.json');

// 2. コントラクトに接続
const contract = await connectToContract(deployment.contractAddress);

// 3. 初期状態を確認
const initialStats = await contract.getRegistrationStats();
assert(initialStats[0] === 0n, "Initial count should be 0");

// 4. テスト登録を実行
const result = await contract.registerPatient(
  BigInt(30),    // age
  BigInt(0),     // gender (MALE)
  BigInt(12345)  // condition hash
);
assert(result === true, "Registration should succeed");

// 5. 統計を再確認
const updatedStats = await contract.getRegistrationStats();
assert(updatedStats[0] === 1n, "Count should be 1 after registration");

console.log("✅ Verification successful!");
```

### 3. api.ts拡張

**新規関数**:
```typescript
/**
 * Patient Registryコントラクトをデプロイ
 */
export async function deployPatientRegistry(
  providers: Providers
): Promise<DeployedContract> {
  const { PatientRegistry } = await import('contract');
  
  // コントラクトインスタンスを作成
  const contract = new PatientRegistry.Contract(
    providers,
    {} // witnesses（現在は不要）
  );
  
  // デプロイ実行
  await contract.deploy();
  
  return {
    contract,
    deployTxData: contract.deployTxData
  };
}
```

## データモデル

### DeploymentInfo

```typescript
interface DeploymentInfo {
  contractAddress: string;
  transactionHash: string;
  deployedAt: string;        // ISO 8601 timestamp
  network: string;           // "standalone" | "testnet-local" | "testnet"
  deployer: string;          // wallet address
  initialState: {
    registrationCount: number;
    maleCount: number;
    femaleCount: number;
    otherCount: number;
  };
}
```

### 保存形式

```json
{
  "contractAddress": "0x1234567890abcdef...",
  "transactionHash": "0xabcdef1234567890...",
  "deployedAt": "2025-01-15T04:30:00.000Z",
  "network": "testnet",
  "deployer": "addr1...",
  "initialState": {
    "registrationCount": 0,
    "maleCount": 0,
    "femaleCount": 0,
    "otherCount": 0
  }
}
```

## 環境設定

### .env.example

```bash
# Network configuration
# Options: standalone, testnet-local, testnet
NETWORK_ENV_VAR=testnet

# Wallet seed (KEEP SECRET!)
SEED_ENV_VAR=your-wallet-seed-here

# Cache file for wallet state
CACHE_FILE_ENV_VAR=patient-registry.state

# Optional: Custom RPC endpoint
# RPC_URL=https://rpc.testnet-02.midnight.network/

# Optional: Custom Indexer endpoint
# INDEXER_URL=https://indexer.testnet-02.midnight.network/
```

## エラーハンドリング

### エラーケースと対処

1. **ウォレットシード未設定**
   ```typescript
   if (!seed || seed.trim() === '') {
     throw new Error('SEED_ENV_VAR is required. Please set your wallet seed.');
   }
   ```

2. **ネットワーク接続失敗**
   ```typescript
   try {
     await wallet.connect();
   } catch (error) {
     logger.error('Failed to connect to network', { error });
     throw new Error('Network connection failed. Check your network settings.');
   }
   ```

3. **資金不足**
   ```typescript
   const balance = await wallet.getBalance();
   if (balance < MINIMUM_BALANCE) {
     throw new Error(`Insufficient funds. Required: ${MINIMUM_BALANCE}, Current: ${balance}`);
   }
   ```

4. **デプロイ失敗**
   ```typescript
   try {
     await contract.deploy();
   } catch (error) {
     logger.error('Deployment failed', { error });
     await saveFailedDeploymentLog(error);
     throw error;
   }
   ```

5. **リソースクリーンアップ**
   ```typescript
   try {
     // デプロイ処理
   } finally {
     await closeIfPossible(providers.privateStateProvider, 'private state provider');
     await closeIfPossible(wallet, 'wallet');
   }
   ```

## デプロイ手順

### Standalone環境

```bash
# 1. Docker環境起動
cd pkgs/cli
docker compose -f standalone.yml up -d

# 2. 環境変数設定
export NETWORK_ENV_VAR=standalone
export SEED_ENV_VAR=test-seed-for-standalone

# 3. デプロイ実行
pnpm deploy:patient-registry

# 4. 検証実行
pnpm verify:patient-registry
```

### Testnet環境

```bash
# 1. 環境変数設定
export NETWORK_ENV_VAR=testnet
export SEED_ENV_VAR=your-testnet-wallet-seed

# 2. デプロイ実行
pnpm deploy:patient-registry

# 3. 検証実行
pnpm verify:patient-registry
```

## ログ出力

### デプロイログ

```
[INFO] Deploying Patient Registry contract to 'testnet' network
[INFO] Using cache file 'patient-registry.state'
[INFO] Wallet address: addr1...
[INFO] Wallet balance: 1000 tDUST
[INFO] Deploying contract...
[INFO] Deployment transaction: 0xabcdef...
[INFO] Contract address: 0x123456...
[INFO] Saving deployment info to 'deployment-patient-registry.json'
[INFO] Deployment successful!
```

### 検証ログ

```
[INFO] Verifying Patient Registry contract
[INFO] Contract address: 0x123456...
[INFO] Initial state: { total: 0, male: 0, female: 0, other: 0 }
[INFO] Executing test registration...
[INFO] Registration successful: true
[INFO] Updated state: { total: 1, male: 1, female: 0, other: 0 }
[INFO] ✅ Verification successful!
```

## セキュリティ考慮事項

### 1. シード管理

- ✅ 環境変数で管理
- ✅ .gitignoreに.envを追加
- ✅ .env.exampleにはダミー値のみ
- ❌ コードにハードコード禁止

### 2. 状態キャッシュ

- ✅ .gitignoreに*.stateを追加
- ✅ ファイル名にシードプレフィックスを使用
- ✅ 環境ごとに異なるキャッシュファイル

### 3. デプロイ情報

- ✅ deployment-*.jsonは公開可能
- ✅ コントラクトアドレスは公開情報
- ❌ シードやプライベートキーは含めない

## テスト戦略

### 1. ローカルテスト（Standalone）

```bash
# Docker環境でテスト
pnpm test:deploy:standalone
```

### 2. Testnetテスト

```bash
# Testnetでテスト
pnpm test:deploy:testnet
```

### 3. 検証テスト

```bash
# デプロイ後の検証
pnpm test:verify
```

## トラブルシューティング

### よくある問題

1. **"SEED_ENV_VAR is required"**
   - 原因: 環境変数が設定されていない
   - 解決: `export SEED_ENV_VAR=your-seed`

2. **"Network connection failed"**
   - 原因: ネットワークに接続できない
   - 解決: RPC URLを確認、ネットワーク状態を確認

3. **"Insufficient funds"**
   - 原因: ウォレットの残高不足
   - 解決: FaucetからtDUSTを取得

4. **"Deployment failed"**
   - 原因: コントラクトのコンパイルエラー
   - 解決: `pnpm compact`でコントラクトを再コンパイル

## 参考資料

- [Midnight Documentation](https://docs.midnight.network/)
- [Counter Example](https://github.com/midnight-ntwrk/example-counter)
- helixchain: `references/helixchain/contracts/scripts/deploy.js`
