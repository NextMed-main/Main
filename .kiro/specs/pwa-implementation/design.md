# PWA実装 - 設計ドキュメント

## 概要

NextMedフロントエンドアプリケーションをProgressive Web App（PWA）化し、オフライン対応、インストール可能、高速なネイティブアプリのような体験を提供します。Next.js 16のApp Routerアーキテクチャを活用し、next-pwaライブラリとWorkboxを使用して実装します。

## アーキテクチャ

### 全体構成

```
NextMed Frontend (Next.js 16 App Router)
├── App Shell (layout.tsx)
├── Service Worker (sw.js)
│   ├── Workbox Runtime
│   ├── Cache Strategies
│   └── Background Sync
├── Web App Manifest (manifest.json)
├── PWA Assets (icons, splash screens)
└── PWA Utilities
    ├── Install Prompt Handler
    ├── Update Notifier
    └── Offline Detector
```

### レイヤー構成

1. **プレゼンテーション層**: React 19コンポーネント、Next.js App Router
2. **PWA制御層**: Service Worker、Workbox
3. **キャッシュ層**: Cache API、IndexedDB
4. **ネットワーク層**: Fetch API、Background Sync API

## コンポーネントとインターフェース

### 1. Web App Manifest

**ファイル**: `public/manifest.json`

```typescript
interface WebAppManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: "standalone" | "fullscreen" | "minimal-ui" | "browser";
  background_color: string;
  theme_color: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: "any" | "maskable" | "monochrome";
  }>;
  orientation?: "portrait" | "landscape" | "any";
  scope: string;
  categories?: string[];
}
```

### 2. Service Worker設定

**ファイル**: `next.config.mjs`

```typescript
import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    // キャッシング戦略の定義
  ],
});
```

### 3. PWAコンテキスト

**ファイル**: `lib/pwa/pwa-context.tsx`

```typescript
interface PWAContextValue {
  isOnline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  isUpdateAvailable: boolean;
  promptInstall: () => Promise<void>;
  updateServiceWorker: () => Promise<void>;
}
```


### 4. インストールプロンプトコンポーネント

**ファイル**: `components/pwa/install-prompt.tsx`

```typescript
interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}
```

### 5. 更新通知コンポーネント

**ファイル**: `components/pwa/update-banner.tsx`

```typescript
interface UpdateBannerProps {
  onUpdate: () => void;
  onDismiss: () => void;
}
```

### 6. オフラインインジケーター

**ファイル**: `components/pwa/offline-indicator.tsx`

```typescript
interface OfflineIndicatorProps {
  isOnline: boolean;
}
```

## データモデル

### 1. キャッシュストレージ

```typescript
interface CacheStorage {
  // 静的アセットキャッシュ
  "static-assets-v1": {
    urls: string[];
    strategy: "CacheFirst";
  };
  
  // APIレスポンスキャッシュ
  "api-cache-v1": {
    urls: string[];
    strategy: "NetworkFirst";
    maxAge: number;
  };
  
  // 画像キャッシュ
  "image-cache-v1": {
    urls: string[];
    strategy: "CacheFirst";
    maxEntries: number;
  };
}
```

### 2. IndexedDB スキーマ

```typescript
interface OfflineDataStore {
  // オフライン時の保留中リクエスト
  pendingRequests: {
    id: string;
    url: string;
    method: string;
    body: any;
    timestamp: number;
    retryCount: number;
  }[];
  
  // ユーザー設定
  settings: {
    installPromptDismissed: boolean;
    lastUpdateCheck: number;
    notificationsEnabled: boolean;
  };
}
```

### 3. Service Worker メッセージング

```typescript
interface ServiceWorkerMessage {
  type: "SKIP_WAITING" | "CACHE_UPDATED" | "SYNC_COMPLETE";
  payload?: any;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Service Worker登録の自動実行

*For any* アプリケーション起動時、Service Workerの登録が自動的に実行され、登録が成功すること
**Validates: Requirements 2.1**

### Property 2: App Shellリソースのキャッシング

*For any* Service Workerインストールイベント、指定されたApp Shellリソース（HTML、CSS、JS）がすべてキャッシュに保存されること
**Validates: Requirements 2.2**

### Property 3: 古いキャッシュの削除

*For any* Service Workerアクティベーションイベント、現在のバージョン以外のキャッシュがすべて削除されること
**Validates: Requirements 2.3**

### Property 4: キャッシュ優先戦略の適用

*For any* ネットワークリクエスト、キャッシュに存在する場合はキャッシュから返され、存在しない場合のみネットワークから取得されること
**Validates: Requirements 2.4**

### Property 5: Service Worker更新通知

*For any* Service Worker更新検出時、ユーザーに更新通知が表示されること
**Validates: Requirements 2.5**

### Property 6: 静的アセットのCache First戦略

*For any* 静的アセット（CSS、JS、画像）へのリクエスト、キャッシュが優先的に使用され、キャッシュミス時のみネットワークから取得されること
**Validates: Requirements 3.1**

### Property 7: APIリクエストのNetwork First戦略

*For any* APIリクエスト、ネットワークが優先的に使用され、ネットワーク失敗時のみキャッシュから返されること
**Validates: Requirements 3.2**

### Property 8: オフライン時のキャッシュフォールバック

*For any* ネットワークが利用不可能な状態でのリクエスト、キャッシュされたデータが返されること
**Validates: Requirements 3.3**

### Property 9: キャッシュサイズ制限の遵守

*For any* キャッシュエントリの追加時、キャッシュサイズが制限を超える場合は最も古いエントリが削除されること
**Validates: Requirements 3.4**

### Property 10: オフラインページの表示

*For any* ネットワークが利用不可能な状態でのページリクエスト、オフライン専用ページが表示されること
**Validates: Requirements 4.1**

### Property 11: ネットワーク復旧時の自動復帰

*For any* オフライン状態からオンライン状態への遷移、自動的に元のページにリダイレクトされること
**Validates: Requirements 4.4**

### Property 12: 初回訪問時のインストールプロンプト表示

*For any* 初回訪問ユーザー、beforeinstallpromptイベントが発火した場合にインストールプロンプトが表示されること
**Validates: Requirements 5.1**

### Property 13: プロンプト閉じ後の再表示制御

*For any* インストールプロンプトを閉じたユーザー、同一セッション内では再表示されないこと
**Validates: Requirements 5.2**

### Property 14: インストールダイアログの表示

*For any* インストールボタンのクリック、ブラウザのネイティブインストールダイアログが表示されること
**Validates: Requirements 5.3**

### Property 15: インストール済み状態の検出

*For any* すでにインストール済みのアプリ、インストールプロンプトが表示されないこと
**Validates: Requirements 5.4**

### Property 16: インストール完了時の確認表示

*For any* インストール完了イベント、ユーザーに確認メッセージが表示されること
**Validates: Requirements 5.5**

### Property 17: 更新検出時のバナー表示

*For any* 新しいService Workerの検出、更新通知バナーが表示されること
**Validates: Requirements 6.1**

### Property 18: 更新ボタンクリック時のアクティベーション

*For any* 更新ボタンのクリック、新しいService WorkerがskipWaitingを実行してアクティベートされること
**Validates: Requirements 6.2**

### Property 19: Service Worker更新後のリロード

*For any* Service Workerの更新完了、ページが自動的にリロードされること
**Validates: Requirements 6.3**

### Property 20: 更新通知の再表示

*For any* 更新通知を閉じたユーザー、次回のページ読み込み時に再度通知が表示されること
**Validates: Requirements 6.5**

### Property 21: First Contentful Paintの達成

*For any* 初回ページ読み込み、3秒以内にFirst Contentful Paintが達成されること
**Validates: Requirements 7.1**

### Property 22: 重要リソースの優先読み込み

*For any* ページ読み込み、重要なCSS、JSファイルが他のリソースより先に読み込まれること
**Validates: Requirements 7.2**

### Property 23: 画像の遅延読み込みとWebP使用

*For any* 画像要素、loading="lazy"属性が設定され、WebP形式が優先的に使用されること
**Validates: Requirements 7.3**

### Property 24: オフライン時のIndexedDB保存

*For any* オフライン状態でのデータ入力、データがIndexedDBにローカル保存されること
**Validates: Requirements 8.1**

### Property 25: ネットワーク復旧時の自動同期

*For any* オンライン復帰時、IndexedDBに保存されたデータが自動的にサーバーに送信されること
**Validates: Requirements 8.2**

### Property 26: 同期失敗時のリトライ

*For any* 同期失敗、指数バックオフを使用したリトライが実行されること
**Validates: Requirements 8.3**

### Property 27: 同期完了時の通知表示

*For any* 同期完了、ユーザーに成功通知が表示されること
**Validates: Requirements 8.4**

### Property 28: 同期ステータスの表示

*For any* 同期待ちデータの存在、UIに同期ステータスインジケーターが表示されること
**Validates: Requirements 8.5**

### Property 29: プッシュ通知購読の登録

*For any* 通知許可の付与、プッシュ通知の購読が正しく登録されること
**Validates: Requirements 9.1**

### Property 30: プッシュイベントでの通知表示

*For any* プッシュイベントの受信、Service Workerで通知が表示されること
**Validates: Requirements 9.2**

### Property 31: 通知クリック時のページ遷移

*For any* 通知のクリック、関連するページが開かれること
**Validates: Requirements 9.3**

### Property 32: 通知拒否時の機能無効化

*For any* 通知権限の拒否、通知関連機能が無効化されること
**Validates: Requirements 9.4**

### Property 33: Lighthouse PWAスコアの達成

*For any* Lighthouse PWA監査の実行、スコア90以上が達成されること
**Validates: Requirements 10.1**

### Property 34: HTTPS提供の確認

*For any* ページリクエスト、HTTPS経由で提供されること
**Validates: Requirements 10.2**

### Property 35: レスポンシブデザインの確認

*For any* ビューポートサイズ、コンテンツが正しく表示されること
**Validates: Requirements 10.3**

### Property 36: アクセシビリティ基準の達成

*For any* ページ、WCAG 2.1 AA基準を満たすこと
**Validates: Requirements 10.4**

### Property 37: Core Web Vitalsの達成

*For any* ページ、LCP、FID、CLSがCore Web Vitalsの基準を満たすこと
**Validates: Requirements 10.5**

### Property 38: Service Workerライフサイクルのロギング

*For any* Service Workerライフサイクルイベント、コンソールにログが出力されること
**Validates: Requirements 12.1**

### Property 39: キャッシュ操作のロギング

*For any* キャッシュ操作、成功/失敗がログに記録されること
**Validates: Requirements 12.2**

### Property 40: エラーの詳細キャプチャ

*For any* エラー発生、エラー詳細がキャプチャされ記録されること
**Validates: Requirements 12.3**

### Property 41: パフォーマンスメトリクスの収集

*For any* ページ読み込み、Navigation TimingとResource Timing APIを使用してメトリクスが収集されること
**Validates: Requirements 12.4**


## エラーハンドリング

### 1. Service Worker登録エラー

**エラーケース**: Service Worker登録失敗
**対処**: エラーをコンソールに記録し、通常のWebアプリとして動作を継続

```typescript
try {
  await navigator.serviceWorker.register('/sw.js');
} catch (error) {
  console.error('SW registration failed:', error);
  // アプリは通常のWebアプリとして動作を継続
}
```

### 2. キャッシュエラー

**エラーケース**: キャッシュ操作失敗（容量不足、権限エラー）
**対処**: ネットワークフォールバック、エラーログ記録

```typescript
try {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
} catch (error) {
  console.error('Cache operation failed:', error);
  // ネットワークから直接取得
  return fetch(request);
}
```

### 3. ネットワークエラー

**エラーケース**: オフライン状態でのネットワークリクエスト
**対処**: キャッシュフォールバック、オフラインページ表示

```typescript
try {
  return await fetch(request);
} catch (error) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || caches.match('/offline.html');
}
```

### 4. IndexedDB エラー

**エラーケース**: IndexedDB操作失敗
**対処**: localStorage フォールバック、エラー通知

```typescript
try {
  await saveToIndexedDB(data);
} catch (error) {
  console.error('IndexedDB failed:', error);
  // localStorageにフォールバック
  localStorage.setItem(key, JSON.stringify(data));
}
```

### 5. プッシュ通知エラー

**エラーケース**: 通知権限拒否、購読失敗
**対処**: 機能の無効化、代替通知方法の提供

```typescript
if (Notification.permission === 'denied') {
  // 通知機能を無効化
  disableNotificationFeatures();
  // UI内通知で代替
  showInAppNotification(message);
}
```


## テスト戦略

### ユニットテスト

**対象**: 個別のPWAユーティリティ関数、コンポーネント

**ツール**: Vitest、Testing Library

**テストケース例**:
- インストールプロンプトの表示/非表示ロジック
- オフライン検出ロジック
- キャッシュキー生成関数
- IndexedDB操作関数

```typescript
describe('PWA Utils', () => {
  it('should detect online status', () => {
    expect(isOnline()).toBe(navigator.onLine);
  });
  
  it('should generate correct cache key', () => {
    const key = generateCacheKey('v1', 'static');
    expect(key).toBe('nextmed-static-v1');
  });
});
```

### プロパティベーステスト

**ライブラリ**: fast-check

**テスト対象**: PWAの普遍的な動作

**Property 1: Service Worker登録の冪等性**
```typescript
// Feature: pwa-implementation, Property 1: Service Worker登録の自動実行
it('should register service worker on every app start', async () => {
  await fc.assert(
    fc.asyncProperty(fc.nat(), async (seed) => {
      // アプリを起動
      const registration = await registerServiceWorker();
      // 登録が成功すること
      expect(registration).toBeDefined();
      expect(registration.active || registration.installing).toBeTruthy();
    }),
    { numRuns: 100 }
  );
});
```

**Property 2: キャッシュ優先戦略の一貫性**
```typescript
// Feature: pwa-implementation, Property 4: キャッシュ優先戦略の適用
it('should always return cached response when available', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.webUrl(),
      fc.string(),
      async (url, content) => {
        // キャッシュにレスポンスを保存
        await cacheResponse(url, content);
        // リクエストを実行
        const response = await fetchWithCacheFirst(url);
        // キャッシュから返されること
        const text = await response.text();
        expect(text).toBe(content);
      }
    ),
    { numRuns: 100 }
  );
});
```

**Property 3: オフライン時のフォールバック**
```typescript
// Feature: pwa-implementation, Property 8: オフライン時のキャッシュフォールバック
it('should return cached data when offline', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.webUrl(),
      fc.jsonValue(),
      async (url, data) => {
        // データをキャッシュ
        await cacheData(url, data);
        // オフライン状態をシミュレート
        mockOffline();
        // リクエストを実行
        const result = await fetchData(url);
        // キャッシュされたデータが返されること
        expect(result).toEqual(data);
      }
    ),
    { numRuns: 100 }
  );
});
```


### 統合テスト

**対象**: Service WorkerとアプリケーションのE2E動作

**ツール**: Playwright、Workbox Testing

**テストケース**:
1. Service Worker登録からキャッシング、オフライン動作までの完全フロー
2. インストールプロンプトからインストール完了までのフロー
3. オンライン→オフライン→オンライン遷移時のデータ同期

```typescript
test('complete PWA installation flow', async ({ page }) => {
  // アプリにアクセス
  await page.goto('/');
  
  // Service Workerが登録されることを確認
  const swRegistered = await page.evaluate(() => {
    return navigator.serviceWorker.ready;
  });
  expect(swRegistered).toBeTruthy();
  
  // インストールプロンプトが表示されることを確認
  await page.waitForSelector('[data-testid="install-prompt"]');
  
  // インストールボタンをクリック
  await page.click('[data-testid="install-button"]');
  
  // インストール完了メッセージを確認
  await page.waitForSelector('[data-testid="install-success"]');
});
```

### パフォーマンステスト

**対象**: PWA最適化の効果測定

**ツール**: Lighthouse CI、Web Vitals

**メトリクス**:
- PWAスコア: 90以上
- Performance スコア: 90以上
- First Contentful Paint: 3秒以内
- Largest Contentful Paint: 2.5秒以内
- Cumulative Layout Shift: 0.1以下

```bash
# Lighthouse CI設定
lighthouse --pwa --output=json --output-path=./lighthouse-report.json
```

### ブラウザ互換性テスト

**対象ブラウザ**:
- Chrome/Edge (最新版)
- Firefox (最新版)
- Safari (iOS 15+)
- Samsung Internet

**テスト項目**:
- Service Worker サポート
- Cache API サポート
- IndexedDB サポート
- Push API サポート
- Notification API サポート

### 手動テスト

**テストシナリオ**:
1. オフライン動作確認
   - DevToolsでオフライン化
   - ページ遷移とデータ表示を確認
   
2. インストール体験
   - デスクトップでのインストール
   - モバイルでのホーム画面追加
   
3. 更新フロー
   - 新バージョンデプロイ後の更新通知
   - 更新適用とページリロード

4. iOS Safari特有の動作
   - ホーム画面追加
   - スタンドアロンモード起動
   - ステータスバー表示

