# ウォレット接続デモ機能 設計書

## Overview

NextMedプラットフォームのハッカソンデモ用に、Midnight Blockchainのマルチウォレット接続機能を実装します。この機能は、認証障壁を設けずに、Lace、Nami、Eternl、Flintの4つのウォレットとの統合を視覚的にアピールします。

## Architecture

### コンポーネント構成

```
┌─────────────────────────────────────────────────────────────┐
│                    App Layout (layout.tsx)                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              WalletProvider (Context)                  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │           Header Component                       │  │  │
│  │  │  ┌──────────────────────────────────────────┐   │  │  │
│  │  │  │    WalletButton Component                │   │  │  │
│  │  │  │  - Connect Wallet / Address Display      │   │  │  │
│  │  │  └──────────────────────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │    WalletSelectionModal Component               │  │  │
│  │  │  - Wallet List (Lace, Nami, Eternl, Flint)     │  │  │
│  │  │  - Install Status Detection                     │  │  │
│  │  │  - Connect / Install Actions                    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │    WalletDropdown Component                     │  │  │
│  │  │  - Full Address Display                         │  │  │
│  │  │  - Copy to Clipboard                            │  │  │
│  │  │  - Disconnect Action                            │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Page Content (page.tsx)                  │  │
│  │  - Landing Page                                       │  │
│  │  - Dashboard Components                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### ディレクトリ構造

```
pkgs/frontend/
├── lib/
│   └── wallet/
│       ├── types.ts              # 型定義
│       ├── providers.ts          # ウォレットプロバイダー定義
│       ├── wallet-api.ts         # CIP-30 API実装
│       └── wallet-storage.ts     # localStorage管理
├── hooks/
│   └── use-wallet.ts             # ウォレット状態管理フック
├── components/
│   ├── wallet/
│   │   ├── wallet-button.tsx     # ウォレット接続ボタン
│   │   ├── wallet-modal.tsx      # ウォレット選択モーダル
│   │   ├── wallet-dropdown.tsx   # ウォレット情報ドロップダウン
│   │   └── wallet-provider.tsx   # Context Provider
│   └── ui/
│       └── (shadcn/ui components)
└── app/
    ├── layout.tsx                # WalletProviderでラップ
    └── page.tsx                  # 既存ページ
```

## Components

### 1. WalletProvider (Context)

**責務**: アプリケーション全体でウォレット状態を管理

**State**:
```typescript
interface WalletState {
  // 接続状態
  isConnected: boolean;
  isConnecting: boolean;
  
  // ウォレット情報
  walletName: WalletName | null;
  address: string | null;
  
  // エラー状態
  error: string | null;
}
```

**Actions**:
```typescript
interface WalletActions {
  connect: (walletName: WalletName) => Promise<void>;
  disconnect: () => void;
  copyAddress: () => Promise<void>;
}
```

**実装**:
- React Context APIを使用
- localStorageで接続状態を永続化
- ページリロード時に自動再接続

### 2. WalletButton Component

**責務**: ヘッダーに表示されるウォレット接続/アドレス表示ボタン

**Props**:
```typescript
interface WalletButtonProps {
  className?: string;
}
```

**表示状態**:
- **未接続**: "Connect Wallet" + ウォレットアイコン
- **接続中**: "Connecting..." + スピナー
- **接続済み**: 短縮アドレス + ウォレットアイコン

**動作**:
- 未接続時: クリックでWalletSelectionModalを開く
- 接続済み時: クリックでWalletDropdownを開く

### 3. WalletSelectionModal Component

**責務**: ウォレット選択UI

**Props**:
```typescript
interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**表示内容**:
- 4つのウォレット（Lace, Nami, Eternl, Flint）
- 各ウォレット:
  - アイコン
  - 名前
  - インストール状態（"Connect" / "Install"）

**動作**:
- インストール済み: クリックで接続
- 未インストール: クリックでインストールページを開く
- 接続成功: モーダルを閉じてトースト表示

### 4. WalletDropdown Component

**責務**: 接続済みウォレットの詳細情報表示

**Props**:
```typescript
interface WalletDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  walletName: WalletName;
}
```

**表示内容**:
- ウォレット名 + アイコン
- 完全なアドレス（Bech32m形式）
- "Copy Address" ボタン
- "Disconnect" ボタン

**動作**:
- Copy Address: クリップボードにコピー + トースト表示
- Disconnect: ウォレット切断 + トースト表示

## Data Models

### Wallet Types

```typescript
// ウォレット名
export type WalletName = 'lace' | 'nami' | 'eternl' | 'flint';

// ウォレットプロバイダー情報
export interface WalletProvider {
  name: WalletName;
  displayName: string;
  icon: string; // アイコンパス
  installUrl: string;
  windowKey: string; // window.cardano.{key}
}

// CIP-30 Wallet API
export interface Cip30WalletApi {
  getUsedAddresses: () => Promise<string[]>;
  getBalance: () => Promise<string>;
  signData?: (address: string, payload: string) => Promise<{ signature: string }>;
}

// ウォレットプロバイダーオブジェクト
export interface CardanoWalletProvider {
  enable: () => Promise<Cip30WalletApi>;
  isEnabled: () => Promise<boolean>;
  apiVersion: string;
  name: string;
  icon: string;
}

// ウォレット接続情報（localStorage保存用）
export interface WalletConnection {
  walletName: WalletName;
  address: string;
  connectedAt: number;
}
```

### Wallet Providers Configuration

```typescript
export const WALLET_PROVIDERS: Record<WalletName, WalletProvider> = {
  lace: {
    name: 'lace',
    displayName: 'Lace',
    icon: '/wallet-icons/lace.svg',
    installUrl: 'https://www.lace.io/',
    windowKey: 'lace',
  },
  nami: {
    name: 'nami',
    displayName: 'Nami',
    icon: '/wallet-icons/nami.svg',
    installUrl: 'https://namiwallet.io/',
    windowKey: 'nami',
  },
  eternl: {
    name: 'eternl',
    displayName: 'Eternl',
    icon: '/wallet-icons/eternl.svg',
    installUrl: 'https://eternl.io/',
    windowKey: 'eternl',
  },
  flint: {
    name: 'flint',
    displayName: 'Flint',
    icon: '/wallet-icons/flint.svg',
    installUrl: 'https://flint-wallet.com/',
    windowKey: 'flint',
  },
};
```

## Error Handling

### エラー型定義

```typescript
export class WalletError extends Error {
  constructor(
    public code: WalletErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'WalletError';
  }
}

export type WalletErrorCode =
  | 'WALLET_NOT_INSTALLED'
  | 'CONNECTION_REJECTED'
  | 'CONNECTION_FAILED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';
```

### エラーメッセージ

```typescript
export const ERROR_MESSAGES: Record<WalletErrorCode, string> = {
  WALLET_NOT_INSTALLED: 'ウォレットがインストールされていません',
  CONNECTION_REJECTED: 'ウォレット接続がキャンセルされました',
  CONNECTION_FAILED: 'ウォレット接続に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN_ERROR: '予期しないエラーが発生しました',
};
```

### エラーハンドリング戦略

1. **非侵入的**: エラーが発生してもページ機能は正常動作
2. **ユーザーフレンドリー**: 日本語でわかりやすいメッセージ
3. **ログ出力**: すべてのエラーをコンソールに記録
4. **トースト通知**: エラーをトーストで表示（自動消去）

## Testing Strategy

### 単体テスト

**対象**:
- `wallet-api.ts`: ウォレットAPI関数
- `wallet-storage.ts`: localStorage操作
- `use-wallet.ts`: フック

**ツール**: Vitest

**テストケース例**:
```typescript
describe('detectWallets', () => {
  it('should detect installed wallets', () => {
    // window.cardano.lace をモック
    const wallets = detectWallets();
    expect(wallets).toContain('lace');
  });
  
  it('should return empty array when no wallets installed', () => {
    // window.cardano を空にする
    const wallets = detectWallets();
    expect(wallets).toEqual([]);
  });
});
```

### 統合テスト

**対象**:
- ウォレット接続フロー全体
- モーダル開閉
- 状態管理

**ツール**: Vitest + Testing Library

**テストケース例**:
```typescript
describe('Wallet Connection Flow', () => {
  it('should open modal when clicking connect button', async () => {
    render(<App />);
    const button = screen.getByText('Connect Wallet');
    await userEvent.click(button);
    expect(screen.getByText('Select Wallet')).toBeInTheDocument();
  });
});
```

### E2Eテスト（オプション）

**対象**: 実際のウォレット拡張との統合

**ツール**: Playwright（時間があれば）

## UI/UX Design

### カラースキーム

```typescript
// Midnightブランドカラー
const MIDNIGHT_COLORS = {
  primary: '#6366f1',      // Indigo
  secondary: '#8b5cf6',    // Purple
  accent: '#ec4899',       // Pink
  success: '#10b981',      // Green
  error: '#ef4444',        // Red
};
```

### アニメーション

- **接続時**: フェードイン + スケールアップ
- **モーダル**: スライドアップ
- **トースト**: スライドイン（右から）
- **ボタンホバー**: スケール 1.05

### レスポンシブデザイン

- **デスクトップ**: ヘッダー右上にボタン
- **タブレット**: 同様
- **モバイル**: ボタンサイズ調整、モーダルフルスクリーン

## Implementation Plan

### Phase 1: 基盤実装
1. 型定義（`types.ts`）
2. ウォレットプロバイダー設定（`providers.ts`）
3. ウォレットAPI実装（`wallet-api.ts`）
4. localStorage管理（`wallet-storage.ts`）

### Phase 2: 状態管理
1. `use-wallet` フック実装
2. `WalletProvider` Context実装

### Phase 3: UIコンポーネント
1. `WalletButton` 実装
2. `WalletSelectionModal` 実装
3. `WalletDropdown` 実装

### Phase 4: 統合
1. `layout.tsx` に `WalletProvider` 追加
2. ヘッダーに `WalletButton` 追加
3. スタイリング調整

### Phase 5: テスト & 改善
1. 単体テスト実装
2. 統合テスト実装
3. バグ修正
4. パフォーマンス最適化

## Security Considerations

### 1. XSS対策
- ユーザー入力（アドレス等）は常にサニタイズ
- `dangerouslySetInnerHTML` は使用しない

### 2. localStorage
- 機密情報（秘密鍵等）は保存しない
- 接続情報のみ保存（アドレス、ウォレット名）

### 3. ウォレットAPI
- `window.cardano` の存在確認を必ず行う
- エラーハンドリングを徹底

### 4. HTTPS
- 本番環境では必ずHTTPSを使用

## Performance Optimization

### 1. コード分割
- ウォレット関連コードを動的インポート
- モーダルは遅延ロード

### 2. メモ化
- `useMemo` でウォレットリストをキャッシュ
- `useCallback` でイベントハンドラーを最適化

### 3. 画像最適化
- ウォレットアイコンはSVG使用
- Next.js Image コンポーネント活用

## Accessibility

### 1. キーボード操作
- すべてのボタンにフォーカス可能
- Escキーでモーダルを閉じる
- Tabキーで要素間移動

### 2. スクリーンリーダー
- 適切な `aria-label` 設定
- `role` 属性の使用
- フォーカス管理

### 3. コントラスト
- WCAG AA基準を満たす色使い
- テキストの可読性確保

## Monitoring & Logging

### ログ出力

```typescript
// 接続成功
logger.info('Wallet connected', {
  walletName,
  address: address.slice(0, 10) + '...',
});

// 接続失敗
logger.error('Wallet connection failed', {
  walletName,
  error: error.message,
});

// 切断
logger.info('Wallet disconnected', {
  walletName,
});
```

### メトリクス（将来的に）

- 接続成功率
- 使用ウォレット分布
- エラー発生率
- 平均接続時間

## Future Enhancements

### 短期（MVP後）
- [ ] ウォレット残高表示
- [ ] トランザクション履歴
- [ ] ネットワーク切り替え（Testnet/Mainnet）

### 中期
- [ ] 署名機能の実装
- [ ] マルチアカウント対応
- [ ] ウォレット切り替え

### 長期
- [ ] WalletConnect対応
- [ ] モバイルウォレット対応
- [ ] ハードウェアウォレット対応
