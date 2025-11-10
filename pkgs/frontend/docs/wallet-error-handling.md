# ウォレットエラーハンドリング

## 概要

NextMedのウォレット接続機能は、複数のCardanoウォレット（Lace、Yoroi、Eternl）をサポートしています。各ウォレットの実装には微妙な違いがあるため、堅牢なエラーハンドリングとフォールバック機能を実装しています。

## アドレス取得のフォールバック機能

### 問題

一部のウォレット（特にEternl）では、CIP-30標準の`getUsedAddresses()`メソッドが期待通りに動作しない場合があります。

### 解決策

`getAddress()`関数は、以下の順序で複数の方法を試行します：

1. **getUsedAddresses()** - 使用済みアドレスを取得（推奨）
2. **getUnusedAddresses()** - 未使用アドレスを取得（フォールバック1）
3. **getChangeAddress()** - お釣りアドレスを取得（フォールバック2）

```typescript
export async function getAddress(api: Cip30WalletApi): Promise<string> {
  try {
    // 方法1: 使用済みアドレスを取得
    try {
      const usedAddresses = await api.getUsedAddresses();
      if (usedAddresses && usedAddresses.length > 0) {
        return usedAddresses[0];
      }
    } catch (error) {
      console.warn("getUsedAddresses failed, trying alternative methods:", error);
    }

    // 方法2: 未使用アドレスを取得
    try {
      const unusedAddresses = await api.getUnusedAddresses();
      if (unusedAddresses && unusedAddresses.length > 0) {
        return unusedAddresses[0];
      }
    } catch (error) {
      console.warn("getUnusedAddresses failed, trying change address:", error);
    }

    // 方法3: お釣りアドレスを取得
    try {
      const changeAddress = await api.getChangeAddress();
      if (changeAddress) {
        return changeAddress;
      }
    } catch (error) {
      console.warn("getChangeAddress failed:", error);
    }

    // すべての方法が失敗した場合
    throw new WalletError(
      "CONNECTION_FAILED",
      "No addresses found in wallet. Please ensure your wallet has at least one address.",
    );
  } catch (error) {
    // エラーハンドリング
  }
}
```

## エラーの種類

### WalletErrorCode

| コード | 説明 | ユーザーへの表示 |
|--------|------|------------------|
| `WALLET_NOT_INSTALLED` | ウォレットがインストールされていない | "Wallet is not installed" |
| `CONNECTION_REJECTED` | ユーザーが接続を拒否 | "Connection was rejected" |
| `CONNECTION_FAILED` | 接続に失敗 | "Failed to connect wallet" |
| `NETWORK_ERROR` | ネットワークエラー | "Network error occurred" |
| `UNKNOWN_ERROR` | 不明なエラー | "An unexpected error occurred" |

## エラーハンドリングのベストプラクティス

### 1. 段階的なフォールバック

各メソッドの失敗時に警告ログを出力し、次の方法を試行します。

```typescript
try {
  const addresses = await api.getUsedAddresses();
  if (addresses && addresses.length > 0) {
    return addresses[0];
  }
} catch (error) {
  console.warn("getUsedAddresses failed, trying alternative methods:", error);
}
```

### 2. ユーザーフレンドリーなエラーメッセージ

技術的な詳細ではなく、ユーザーが理解できるメッセージを表示します。

```typescript
throw new WalletError(
  "CONNECTION_FAILED",
  "No addresses found in wallet. Please ensure your wallet has at least one address.",
);
```

### 3. トースト通知

エラーが発生した場合、トースト通知でユーザーに通知します。

```typescript
toast({
  title: "Connection Error",
  description: errorMessage,
  variant: "destructive",
});
```

## デバッグ

### コンソールログ

各フォールバックステップで警告ログを出力しているため、開発者コンソールで問題を追跡できます。

```
getUsedAddresses failed, trying alternative methods: Error: ...
getUnusedAddresses failed, trying change address: Error: ...
getChangeAddress failed: Error: ...
```

### エラーの再現

1. ブラウザの開発者ツールを開く
2. Consoleタブを確認
3. ウォレット接続を試行
4. エラーメッセージとスタックトレースを確認

## 今後の改善

- [ ] ウォレット固有のエラーハンドリングを追加
- [ ] リトライ機能の実装
- [ ] エラーレポート機能の追加
- [ ] より詳細なエラーメッセージの提供

## 参考資料

- [CIP-30: Cardano dApp-Wallet Web Bridge](https://cips.cardano.org/cips/cip30/)
- [Lace Wallet Documentation](https://www.lace.io/developers)
- [Yoroi Wallet Documentation](https://yoroi-wallet.com/)
- [Eternl Wallet Documentation](https://eternl.io/)
