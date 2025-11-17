# Midnight Wallet - Developer Guide

## 概要

Midnight Walletは、Midnight Network上でプライバシー保護された取引やアプリケーションの利用を可能にする自己管理型ウォレットです。ユーザーは自身の資産とデータを完全に管理でき、プライバシーを重視したブロックチェーン体験を提供します。

Midnight Networkは、分散型プライバシープラットフォームであり、安全でプライベートな取引と通信を可能にします。Midnight上で動作するDAppは、ゼロ知識証明（ZKP）を活用して、データのプライバシーを保護しながら、スマートコントラクトを実行できます。

## 開発者向けリソース

### Midnight.js 1.0.0

Midnight.jsは、Midnight上でスマートコントラクトと対話し、プライベートでコンポーザブルなDAppを構築するための公式TypeScriptクライアントライブラリです。

**主な機能:**

* トランザクションの作成と送信
* ウォレットとの統合
* ブロックとステート情報のクエリ
* チェーンイベントの購読
* プライバシー機能（スマートコントラクトのローカル実行、プライベートステートの管理）

**バージョン1.0.0の新機能:**

* Wallet SDK 4.0.0のサポート
* Bech32mアドレスフォーマットのサポート

### Bech32mアドレスフォーマット

Midnightは、ウォレットアドレスと公開鍵の新しい標準としてBech32mを採用しています。

**Bech32mの特徴:**

* 人間が読みやすい形式
* エラーチェック機能を内蔵
* ネットワークやアドレスの種類などのメタデータを含む
* より安全でユーザーフレンドリー

**アドレス形式の例:**

```
mn_shield-addr_test187fpj5ryfsea7gwaa8d0rr6kpruq44kt9s0e2f6unqnngj73q2asxq86hc8q56dm4snlxeanet6hy39rrp0fet8rxtfwrjtkgq5mxve95yzdl8yv
```

## ウォレットパートナーシップ

Midnight Networkは、以下のウォレットプロバイダーと提携し、ユーザーがMidnightと安全にやり取りできる環境を整えています：

### 主要ウォレット

* **Lace Wallet**: Midnightエコシステムにおいて重要な役割を果たす公式ウォレット。最新のプロトコルアップデートに完全に対応
* **Yoroi**: Cardanoエコシステムの人気ウォレット（Midnight対応）
* **Eternl**: Cardanoエコシステムのマルチ機能ウォレット。2025年4月にMidnight Networkの公式ウォレットパートナー8社の1つとして発表され、Midnight対応を進めています

### その他のサポートウォレット

* SubWallet
* NuFi
* Vespr
* Gero
* Tokeo Pay
* Keystone
* Begin Wallet

## CIP-30プロトコル

Midnight Walletは、Cardano Improvement Proposal 30（CIP-30）に準拠したDApp Connector APIを提供しています。この標準化されたAPIにより、DAppはウォレットと安全に統合できます。

### CIP-30 Wallet API インターフェース

```typescript
interface Cip30WalletApi {
  /**
   * 使用済みアドレスのリストを取得
   * @returns Bech32m形式のアドレス配列
   */
  getUsedAddresses: () => Promise<string[]>;

  /**
   * 未使用アドレスのリストを取得
   * @returns Bech32m形式のアドレス配列
   */
  getUnusedAddresses: () => Promise<string[]>;

  /**
   * お釣りアドレスを取得
   * @returns Bech32m形式のアドレス
   */
  getChangeAddress: () => Promise<string>;

  /**
   * ウォレットの残高を取得
   * @returns 残高（文字列形式）
   */
  getBalance: () => Promise<string>;

  /**
   * データに署名（オプション）
   * @param address 署名に使用するアドレス
   * @param payload 署名するデータ（HEX形式）
   * @returns 署名結果
   */
  signData?: (
    address: string,
    payload: string,
  ) => Promise<{ signature: string }>;
}
```

### Cardano Wallet Provider インターフェース

```typescript
interface CardanoWalletProvider {
  /**
   * ウォレットを有効化してAPIを取得
   * @returns CIP-30 Wallet API
   */
  enable: () => Promise<Cip30WalletApi>;

  /**
   * ウォレットが既に有効化されているか確認
   * @returns 有効化状態
   */
  isEnabled: () => Promise<boolean>;

  /**
   * APIバージョン
   */
  apiVersion: string;

  /**
   * ウォレット名
   */
  name: string;

  /**
   * ウォレットアイコン（Data URL）
   */
  icon: string;
}
```

## ウォレット統合の実装

### 1. ウォレットの検出

```typescript
function detectWallets(): WalletName[] {
  const cardano = (window as CardanoWindow).cardano;
  
  if (!cardano) {
    return [];
  }

  const installedWallets: WalletName[] = [];
  
  if (cardano.lace) installedWallets.push("lace");
  if (cardano.yoroi) installedWallets.push("yoroi");
  if (cardano.eternl) installedWallets.push("eternl");

  return installedWallets;
}
```

### 2. ウォレットへの接続

```typescript
async function connectWallet(walletName: WalletName): Promise<Cip30WalletApi> {
  const cardano = (window as CardanoWindow).cardano;
  
  if (!cardano) {
    throw new Error("Cardano wallet extension is not installed");
  }

  const provider = cardano[walletName];
  
  if (!provider) {
    throw new Error(`${walletName} wallet is not installed`);
  }

  // ウォレットを有効化
  const api = await provider.enable();
  
  if (!api) {
    throw new Error("Failed to enable wallet API");
  }

  return api;
}
```

### 3. アドレスの取得

```typescript
async function getAddress(api: Cip30WalletApi): Promise<string> {
  // 方法1: 使用済みアドレスを取得
  try {
    const usedAddresses = await api.getUsedAddresses();
    if (usedAddresses && usedAddresses.length > 0) {
      return usedAddresses[0];
    }
  } catch (error) {
    console.warn("getUsedAddresses failed, trying alternative methods");
  }

  // 方法2: 未使用アドレスを取得
  try {
    const unusedAddresses = await api.getUnusedAddresses();
    if (unusedAddresses && unusedAddresses.length > 0) {
      return unusedAddresses[0];
    }
  } catch (error) {
    console.warn("getUnusedAddresses failed, trying change address");
  }

  // 方法3: お釣りアドレスを取得
  const changeAddress = await api.getChangeAddress();
  if (changeAddress) {
    return changeAddress;
  }

  throw new Error("No addresses found in wallet");
}
```

### 4. 残高の取得

```typescript
async function getBalance(api: Cip30WalletApi): Promise<string> {
  return await api.getBalance();
}
```

## エラーハンドリング

### エラーコード

```typescript
type WalletErrorCode =
  | "WALLET_NOT_INSTALLED"
  | "CONNECTION_REJECTED"
  | "CONNECTION_FAILED"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";
```

### エラーハンドリングの実装例

```typescript
try {
  const api = await connectWallet("lace");
  const address = await getAddress(api);
  console.log("Connected:", address);
} catch (error) {
  if (error instanceof WalletError) {
    switch (error.code) {
      case "WALLET_NOT_INSTALLED":
        // ウォレットがインストールされていない場合の処理
        break;
      case "CONNECTION_REJECTED":
        // ユーザーが接続を拒否した場合の処理
        break;
      case "CONNECTION_FAILED":
        // 接続に失敗した場合の処理
        break;
      default:
        // その他のエラー
        break;
    }
  }
}
```

## 開発環境のセットアップ

### 前提条件

1. **Docker**: 最新バージョンがインストールされていること
2. **Chromeブラウザ**: バージョン119以上（ウォレット拡張機能の統合に必要）
3. **Lace Wallet拡張機能**: Chrome Web Storeからインストール

### Lace Walletのインストール

1. Chrome Web StoreからLace Walletをインストール
   * URL: https://chromewebstore.google.com/detail/lace-midnight-preview/hgeekaiplokcnmakghbdfbgnlfheichg
2. ウォレットを作成またはインポート
3. テストネットトークン（tDUST）を取得
   * フォーセット: https://midnight.network/test-faucet

### Proof Serverのセットアップ

MidnightのZK機能は、ローカルで証明を生成するProof Serverによって提供されます。

**重要**: Proof Serverは、Chrome拡張機能（Lace Wallet）がインストールされているのと同じマシンで実行する必要があります。リモート開発マシンで実行すると、拡張機能との接続に問題が発生する可能性があります。

```bash
# Proof Serverイメージをプル
docker pull midnightnetwork/proof-server:latest

# Proof Serverを起動
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

## Midnight.jsとの統合

### 基本的な使用例

```typescript
import { Midnight } from '@midnight-network/midnight-js';

// Midnightインスタンスを作成
const midnight = new Midnight({
  network: 'testnet',
  proofServerUrl: 'http://localhost:6300',
});

// ウォレットAPIを取得
const walletApi = await connectWallet('lace');

// アドレスを取得
const address = await getAddress(walletApi);

// トランザクションを作成
const tx = await midnight.createTransaction({
  from: address,
  to: recipientAddress,
  amount: '1000000', // tDUST
});

// トランザクションに署名
const signedTx = await walletApi.signTx(tx);

// トランザクションを送信
const txHash = await midnight.submitTransaction(signedTx);
```

## ベストプラクティス

### 1. ウォレットの検出とインストール状態の確認

```typescript
// ウォレットがインストールされているか確認
function isWalletInstalled(walletName: WalletName): boolean {
  const cardano = (window as CardanoWindow).cardano;
  return !!cardano?.[walletName];
}

// インストールされていない場合はインストールページを開く
if (!isWalletInstalled('lace')) {
  window.open('https://www.lace.io/', '_blank');
}
```

### 2. 接続状態の管理

```typescript
// localStorageに接続情報を保存
function saveConnection(walletName: WalletName, address: string) {
  localStorage.setItem('wallet_connection', JSON.stringify({
    walletName,
    address,
    connectedAt: Date.now(),
  }));
}

// 保存された接続情報を読み込む
function loadConnection(): WalletConnection | null {
  const saved = localStorage.getItem('wallet_connection');
  return saved ? JSON.parse(saved) : null;
}
```

### 3. アドレスのフォーマット

```typescript
function formatAddress(
  address: string,
  prefixLength = 6,
  suffixLength = 4,
): string {
  if (address.length <= prefixLength + suffixLength) {
    return address;
  }

  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);

  return `${prefix}...${suffix}`;
}
```

### 4. エラーメッセージのユーザーフレンドリーな表示

```typescript
const ERROR_MESSAGES: Record<WalletErrorCode, string> = {
  WALLET_NOT_INSTALLED: "ウォレットがインストールされていません",
  CONNECTION_REJECTED: "接続が拒否されました",
  CONNECTION_FAILED: "ウォレットへの接続に失敗しました",
  NETWORK_ERROR: "ネットワークエラーが発生しました",
  UNKNOWN_ERROR: "予期しないエラーが発生しました",
};
```

## リソース

### 公式ドキュメント

* [Midnight Network Developer Hub](https://docs.midnight.network/)
* [Midnight.js Documentation](https://docs.midnight.network/develop/reference/midnight-api)
* [Lace Wallet Documentation](https://www.lace.io/)

### 開発ツール

* [Compact Compiler](https://github.com/midnightntwrk/compact)
* [Midnight.js SDK](https://www.npmjs.com/package/@midnight-network/midnight-js)
* [Example Counter DApp](https://github.com/midnightntwrk/examples)

### テストネットリソース

* [Testnet Faucet](https://midnight.network/test-faucet)
* [Testnet RPC Endpoint](https://rpc.testnet-02.midnight.network/)

## まとめ

Midnight Walletは、Midnight Network上でプライバシー保護されたDAppを構築するための重要なツールです。CIP-30プロトコルに準拠した標準化されたAPIにより、開発者は複数のウォレットプロバイダーと簡単に統合できます。Midnight.jsと組み合わせることで、プライバシーを重視したDAppを効率的に開発できます。
