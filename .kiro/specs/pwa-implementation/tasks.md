# PWA実装 - タスクリスト

- [x] 1. プロジェクトセットアップとPWA基盤構築
- [x] 1.1 next-pwaライブラリのインストールと設定
  - next-pwaとworkboxをインストール
  - next.config.mjsにPWA設定を追加
  - 開発環境ではService Workerを無効化
  - _Requirements: 2.1, 2.2_

- [x] 1.2 Web App Manifestファイルの作成
  - public/manifest.jsonを作成
  - アプリ名、短縮名、説明を定義
  - テーマカラー（#6366f1）とbackground_colorを設定
  - display: "standalone"を設定
  - start_url: "/"を設定
  - _Requirements: 1.1, 1.3, 1.4, 1.5_

- [x] 1.3 PWAアイコンの作成と配置
  - 192x192と512x512のPNGアイコンを作成
  - public/icons/ディレクトリに配置
  - manifest.jsonにアイコン定義を追加
  - maskable iconとして設定
  - _Requirements: 1.2_

- [x] 1.4 layout.tsxにmanifestとメタタグを追加
  - manifestファイルへのリンクを追加
  - theme-colorメタタグを追加
  - iOS用メタタグ（apple-touch-icon等）を追加
  - viewport-fitメタタグを追加
  - _Requirements: 1.1, 11.1, 11.2, 11.3, 11.5_

- [ ]* 1.5 プロパティテスト: Manifestファイルの検証
  - **Property 1: Service Worker登録の自動実行**
  - **Validates: Requirements 2.1**

- [ ] 2. Service Workerとキャッシング戦略の実装
- [ ] 2.1 Workboxキャッシング戦略の設定
  - next.config.mjsにruntimeCaching設定を追加
  - 静的アセット用のCacheFirst戦略を設定
  - API用のNetworkFirst戦略を設定
  - 画像用のCacheFirst戦略を設定（maxEntries: 60）
  - _Requirements: 2.4, 3.1, 3.2, 3.4_

- [ ]* 2.2 プロパティテスト: App Shellリソースのキャッシング
  - **Property 2: App Shellリソースのキャッシング**
  - **Validates: Requirements 2.2**

- [ ]* 2.3 プロパティテスト: キャッシュ優先戦略
  - **Property 4: キャッシュ優先戦略の適用**
  - **Validates: Requirements 2.4**

- [ ]* 2.4 プロパティテスト: 静的アセットのCache First戦略
  - **Property 6: 静的アセットのCache First戦略**
  - **Validates: Requirements 3.1**

- [ ]* 2.5 プロパティテスト: APIリクエストのNetwork First戦略
  - **Property 7: APIリクエストのNetwork First戦略**
  - **Validates: Requirements 3.2**

- [ ]* 2.6 プロパティテスト: オフライン時のキャッシュフォールバック
  - **Property 8: オフライン時のキャッシュフォールバック**
  - **Validates: Requirements 3.3**

- [ ] 3. オフライン対応の実装
- [ ] 3.1 オフラインフォールバックページの作成
  - app/offline/page.tsxを作成
  - オフライン状態を示すUIを実装
  - 接続確認ボタンを追加
  - キャッシュされた機能の案内を表示
  - ブランドカラーとロゴを使用
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [ ] 3.2 オフライン検出とリダイレクト機能
  - lib/pwa/offline-detector.tsを作成
  - navigator.onLineを使用したオンライン/オフライン検出
  - オンライン復帰時の自動リダイレクト
  - _Requirements: 4.4_

- [ ]* 3.3 プロパティテスト: オフラインページの表示
  - **Property 10: オフラインページの表示**
  - **Validates: Requirements 4.1**

- [ ]* 3.4 プロパティテスト: ネットワーク復旧時の自動復帰
  - **Property 11: ネットワーク復旧時の自動復帰**
  - **Validates: Requirements 4.4**


- [ ] 4. PWAコンテキストとユーティリティの実装
- [ ] 4.1 PWAコンテキストの作成
  - lib/pwa/pwa-context.tsxを作成
  - isOnline, isInstallable, isInstalled, isUpdateAvailable状態を管理
  - promptInstall, updateServiceWorker関数を実装
  - _Requirements: 5.1, 5.3, 5.4, 6.1, 6.2_

- [ ] 4.2 PWAコンテキストプロバイダーの統合
  - app/layout.tsxにPWAProviderを追加
  - 全ページでPWAコンテキストを利用可能にする
  - _Requirements: 2.1_

- [ ] 4.3 オフラインインジケーターコンポーネント
  - components/pwa/offline-indicator.tsxを作成
  - オンライン/オフライン状態を視覚的に表示
  - トースト通知で状態変化を通知
  - _Requirements: 8.5_

- [ ]* 4.4 ユニットテスト: PWAユーティリティ関数
  - オンライン検出ロジックのテスト
  - キャッシュキー生成関数のテスト
  - _Requirements: 2.1, 3.1_

- [ ] 5. インストールプロンプトの実装

- [ ] 5.1 インストールプロンプトコンポーネントの作成
  - components/pwa/install-prompt.tsxを作成
  - beforeinstallpromptイベントをリッスン
  - インストールボタンとクローズボタンを実装
  - ローカルストレージで表示状態を管理
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 5.2 インストール完了通知の実装
  - appinstalledイベントをリッスン
  - 確認メッセージをトースト表示
  - インストールプロンプトを非表示
  - _Requirements: 5.5_

- [ ] 5.3 インストール済み状態の検出
  - display-modeメディアクエリを使用
  - navigator.standaloneを確認（iOS用）
  - インストール済みの場合はプロンプトを非表示
  - _Requirements: 5.4_

- [ ]* 5.4 プロパティテスト: 初回訪問時のインストールプロンプト表示
  - **Property 12: 初回訪問時のインストールプロンプト表示**
  - **Validates: Requirements 5.1**

- [ ]* 5.5 プロパティテスト: プロンプト閉じ後の再表示制御
  - **Property 13: プロンプト閉じ後の再表示制御**
  - **Validates: Requirements 5.2**

- [ ]* 5.6 プロパティテスト: インストールダイアログの表示
  - **Property 14: インストールダイアログの表示**
  - **Validates: Requirements 5.3**

- [ ]* 5.7 プロパティテスト: インストール済み状態の検出
  - **Property 15: インストール済み状態の検出**
  - **Validates: Requirements 5.4**

- [ ]* 5.8 プロパティテスト: インストール完了時の確認表示
  - **Property 16: インストール完了時の確認表示**
  - **Validates: Requirements 5.5**

- [ ] 6. Service Worker更新通知の実装

- [ ] 6.1 更新通知バナーコンポーネントの作成
  - components/pwa/update-banner.tsxを作成
  - 更新ボタンとクローズボタンを実装
  - 更新内容の概要を表示
  - _Requirements: 6.1, 6.4_

- [ ] 6.2 Service Worker更新検出ロジック
  - updatefoundイベントをリッスン
  - 新しいService Workerの状態を監視
  - 更新通知バナーを表示
  - _Requirements: 2.5, 6.1_

- [ ] 6.3 Service Worker更新適用機能
  - skipWaiting()メッセージを送信
  - controllerchangeイベントでページリロード
  - _Requirements: 6.2, 6.3_

- [ ] 6.4 更新通知の再表示ロジック
  - セッションストレージで通知状態を管理
  - 次回ページ読み込み時に再表示
  - _Requirements: 6.5_

- [ ]* 6.5 プロパティテスト: 更新検出時のバナー表示
  - **Property 17: 更新検出時のバナー表示**
  - **Validates: Requirements 6.1**

- [ ]* 6.6 プロパティテスト: 更新ボタンクリック時のアクティベーション
  - **Property 18: 更新ボタンクリック時のアクティベーション**
  - **Validates: Requirements 6.2**

- [ ]* 6.7 プロパティテスト: Service Worker更新後のリロード
  - **Property 19: Service Worker更新後のリロード**
  - **Validates: Requirements 6.3**

- [ ]* 6.8 プロパティテスト: 更新通知の再表示
  - **Property 20: 更新通知の再表示**
  - **Validates: Requirements 6.5**


- [ ] 7. パフォーマンス最適化

- [ ] 7.1 重要リソースのプリロード設定
  - layout.tsxにpreloadリンクを追加
  - 重要なCSS、JSファイルを指定
  - フォントファイルをプリロード
  - _Requirements: 7.2_

- [ ] 7.2 画像最適化の実装
  - Next.js Imageコンポーネントを使用
  - loading="lazy"を設定
  - WebP形式を優先的に使用
  - _Requirements: 7.3_

- [ ] 7.3 フォント読み込み最適化
  - font-display: swapを設定
  - フォントファイルをプリロード
  - _Requirements: 7.4_

- [ ] 7.4 コード分割とTree Shaking
  - 動的インポートを使用
  - React.lazyでコンポーネントを遅延読み込み
  - バンドルサイズを最適化
  - _Requirements: 7.5_

- [ ]* 7.5 プロパティテスト: First Contentful Paintの達成
  - **Property 21: First Contentful Paintの達成**
  - **Validates: Requirements 7.1**

- [ ]* 7.6 プロパティテスト: 重要リソースの優先読み込み
  - **Property 22: 重要リソースの優先読み込み**
  - **Validates: Requirements 7.2**

- [ ]* 7.7 プロパティテスト: 画像の遅延読み込みとWebP使用
  - **Property 23: 画像の遅延読み込みとWebP使用**
  - **Validates: Requirements 7.3**

- [ ] 8. オフラインデータ同期の実装

- [ ] 8.1 IndexedDBユーティリティの作成
  - lib/pwa/indexed-db.tsを作成
  - データベース初期化関数
  - CRUD操作関数（save, get, delete）
  - _Requirements: 8.1_

- [ ] 8.2 オフラインデータ保存機能
  - フォーム送信時にオフライン状態を確認
  - オフライン時はIndexedDBに保存
  - 保存成功時にトースト通知
  - _Requirements: 8.1_

- [ ] 8.3 Background Sync実装
  - Service Workerにsyncイベントハンドラーを追加
  - オンライン復帰時に保存データを送信
  - 指数バックオフでリトライ
  - _Requirements: 8.2, 8.3_

- [ ] 8.4 同期ステータス表示
  - 同期待ちデータ数を表示
  - 同期中インジケーターを表示
  - 同期完了時にトースト通知
  - _Requirements: 8.4, 8.5_

- [ ]* 8.5 プロパティテスト: オフライン時のIndexedDB保存
  - **Property 24: オフライン時のIndexedDB保存**
  - **Validates: Requirements 8.1**

- [ ]* 8.6 プロパティテスト: ネットワーク復旧時の自動同期
  - **Property 25: ネットワーク復旧時の自動同期**
  - **Validates: Requirements 8.2**

- [ ]* 8.7 プロパティテスト: 同期失敗時のリトライ
  - **Property 26: 同期失敗時のリトライ**
  - **Validates: Requirements 8.3**

- [ ]* 8.8 プロパティテスト: 同期完了時の通知表示
  - **Property 27: 同期完了時の通知表示**
  - **Validates: Requirements 8.4**

- [ ]* 8.9 プロパティテスト: 同期ステータスの表示
  - **Property 28: 同期ステータスの表示**
  - **Validates: Requirements 8.5**

- [ ] 9. プッシュ通知の基盤実装

- [ ] 9.1 プッシュ通知購読機能
  - lib/pwa/push-notifications.tsを作成
  - Notification.requestPermission()を実装
  - PushManagerで購読を登録
  - 購読情報をサーバーに送信
  - _Requirements: 9.1_

- [ ] 9.2 Service Workerプッシュイベントハンドラー
  - pushイベントリスナーを追加
  - 通知を表示
  - 通知データを解析
  - _Requirements: 9.2_

- [ ] 9.3 通知クリックハンドラー
  - notificationclickイベントリスナーを追加
  - 関連ページを開く
  - 既存のウィンドウにフォーカス
  - _Requirements: 9.3_

- [ ] 9.4 通知設定管理
  - 通知権限状態を確認
  - 拒否時は機能を無効化
  - 設定画面で通知を管理
  - _Requirements: 9.4, 9.5_

- [ ]* 9.5 プロパティテスト: プッシュ通知購読の登録
  - **Property 29: プッシュ通知購読の登録**
  - **Validates: Requirements 9.1**

- [ ]* 9.6 プロパティテスト: プッシュイベントでの通知表示
  - **Property 30: プッシュイベントでの通知表示**
  - **Validates: Requirements 9.2**

- [ ]* 9.7 プロパティテスト: 通知クリック時のページ遷移
  - **Property 31: 通知クリック時のページ遷移**
  - **Validates: Requirements 9.3**

- [ ]* 9.8 プロパティテスト: 通知拒否時の機能無効化
  - **Property 32: 通知拒否時の機能無効化**
  - **Validates: Requirements 9.4**


- [ ] 10. iOS対応の最適化

- [ ] 10.1 iOS用メタタグの追加
  - apple-touch-iconメタタグを追加
  - apple-mobile-web-app-capableメタタグを追加
  - apple-mobile-web-app-status-bar-styleメタタグを追加
  - viewport-fitメタタグを追加
  - _Requirements: 11.1, 11.2, 11.3, 11.5_

- [ ] 10.2 iOS用スプラッシュスクリーンの作成
  - 各種iOSデバイス用のスプラッシュ画像を作成
  - apple-touch-startup-imageリンクタグを追加
  - _Requirements: 11.4_

- [ ]* 10.3 ユニットテスト: iOS用メタタグの検証
  - メタタグの存在確認
  - 正しい値が設定されているか確認
  - _Requirements: 11.1, 11.2, 11.3, 11.5_

- [ ] 11. デバッグとモニタリング

- [ ] 11.1 Service Workerロギングの実装
  - install, activate, fetchイベントでログ出力
  - エラー発生時の詳細ログ
  - 開発環境でのみ詳細ログを出力
  - _Requirements: 12.1, 12.2, 12.3_

- [ ] 11.2 パフォーマンスメトリクス収集
  - lib/pwa/performance-metrics.tsを作成
  - Navigation Timing APIを使用
  - Resource Timing APIを使用
  - Core Web Vitals（LCP, FID, CLS）を測定
  - _Requirements: 12.4_

- [ ] 11.3 エラートラッキング統合（オプション）
  - Sentryまたは類似サービスの統合
  - Service Workerエラーをキャプチャ
  - ユーザーコンテキストを含める
  - _Requirements: 12.5_

- [ ]* 11.4 プロパティテスト: Service Workerライフサイクルのロギング
  - **Property 38: Service Workerライフサイクルのロギング**
  - **Validates: Requirements 12.1**

- [ ]* 11.5 プロパティテスト: キャッシュ操作のロギング
  - **Property 39: キャッシュ操作のロギング**
  - **Validates: Requirements 12.2**

- [ ]* 11.6 プロパティテスト: エラーの詳細キャプチャ
  - **Property 40: エラーの詳細キャプチャ**
  - **Validates: Requirements 12.3**

- [ ]* 11.7 プロパティテスト: パフォーマンスメトリクスの収集
  - **Property 41: パフォーマンスメトリクスの収集**
  - **Validates: Requirements 12.4**
- [ ] 12. PWA品質検証とテスト

- [ ] 12.1 Lighthouse PWA監査の実行
  - Lighthouse CIをセットアップ
  - PWAスコア90以上を確認
  - パフォーマンススコア90以上を確認
  - _Requirements: 10.1_

- [ ] 12.2 HTTPS設定の確認
  - すべてのページがHTTPS経由で提供されることを確認
  - 本番環境でのSSL証明書を確認
  - _Requirements: 10.2_

- [ ] 12.3 レスポンシブデザインの検証
  - 各ビューポートサイズでの表示確認
  - モバイル、タブレット、デスクトップでテスト
  - _Requirements: 10.3_

- [ ] 12.4 アクセシビリティ監査
  - axe-coreを使用したテスト
  - WCAG 2.1 AA基準を確認
  - キーボードナビゲーションをテスト
  - _Requirements: 10.4_

- [ ] 12.5 Core Web Vitalsの測定
  - LCP（Largest Contentful Paint）を測定
  - FID（First Input Delay）を測定
  - CLS（Cumulative Layout Shift）を測定
  - すべてが基準値を満たすことを確認
  - _Requirements: 10.5_

- [ ]* 12.6 プロパティテスト: Lighthouse PWAスコアの達成
  - **Property 33: Lighthouse PWAスコアの達成**
  - **Validates: Requirements 10.1**

- [ ]* 12.7 プロパティテスト: HTTPS提供の確認
  - **Property 34: HTTPS提供の確認**
  - **Validates: Requirements 10.2**

- [ ]* 12.8 プロパティテスト: レスポンシブデザインの確認
  - **Property 35: レスポンシブデザインの確認**
  - **Validates: Requirements 10.3**

- [ ]* 12.9 プロパティテスト: アクセシビリティ基準の達成
  - **Property 36: アクセシビリティ基準の達成**
  - **Validates: Requirements 10.4**

- [ ]* 12.10 プロパティテスト: Core Web Vitalsの達成
  - **Property 37: Core Web Vitalsの達成**
  - **Validates: Requirements 10.5**

- [ ] 13. 最終チェックポイント

- [ ] 13.1 すべてのテストが通過することを確認
  - ユニットテストを実行
  - プロパティベーステストを実行
  - 統合テストを実行
  - すべてのテストが成功することを確認
  - ユーザーに質問がある場合は確認

- [ ] 13.2 ブラウザ互換性テスト
  - Chrome/Edgeでの動作確認
  - Firefoxでの動作確認
  - Safari（iOS）での動作確認
  - Samsung Internetでの動作確認

- [ ] 13.3 本番環境デプロイ準備
  - 環境変数の確認
  - ビルドエラーがないことを確認
  - Service Workerが正しく登録されることを確認
  - PWA機能が本番環境で動作することを確認
