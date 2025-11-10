# Implementation Plan

- [ ] 1. 基盤実装：型定義とウォレットAPI
  - ウォレット関連の型定義を作成
  - ウォレットプロバイダー設定を定義
  - CIP-30 APIラッパーを実装
  - localStorage管理ユーティリティを実装
  - _Requirements: 1, 3, 8_

- [x] 1.1 型定義ファイルの作成
  - `pkgs/frontend/lib/wallet/types.ts`を作成
  - `WalletName`, `WalletProvider`, `Cip30WalletApi`等の型を定義
  - エラー型（`WalletError`, `WalletErrorCode`）を定義
  - _Requirements: 1, 3_

- [x] 1.1.1 CIP-30 API型定義の拡張
  - `getUnusedAddresses()`メソッドを追加
  - `getChangeAddress()`メソッドを追加
  - CIP-30標準の完全なサポートを実現
  - _Requirements: 3_

- [x] 1.2 ウォレットプロバイダー設定
  - `pkgs/frontend/lib/wallet/providers.ts`を作成
  - 4つのウォレット（Lace, Nami, Eternl, Flint）の設定を定義
  - アイコンパス、インストールURL、windowキーを設定
  - _Requirements: 1, 8_

- [x] 1.3 ウォレットAPI実装
  - `pkgs/frontend/lib/wallet/wallet-api.ts`を作成
  - `detectWallets()`関数を実装（インストール済みウォレット検出）
  - `connectWallet()`関数を実装（ウォレット接続）
  - `getAddress()`関数を実装（プライマリアドレス取得）
  - エラーハンドリングを実装
  - _Requirements: 3, 6, 8_

- [x] 1.3.1 アドレス取得のフォールバック実装
  - `getAddress()`に複数の取得方法を実装
  - `getUsedAddresses()` → `getUnusedAddresses()` → `getChangeAddress()`の順で試行
  - 各メソッドの失敗時に警告ログを出力
  - すべて失敗時にユーザーフレンドリーなエラーメッセージを表示
  - _Requirements: 3, 6_

- [x] 1.4 localStorage管理
  - `pkgs/frontend/lib/wallet/wallet-storage.ts`を作成
  - `saveConnection()`関数を実装（接続情報保存）
  - `loadConnection()`関数を実装（接続情報読み込み）
  - `clearConnection()`関数を実装（接続情報削除）
  - _Requirements: 3_

- [ ] 2. 状態管理：Context とフック
  - React Contextでウォレット状態を管理
  - カスタムフックで状態とアクションを提供
  - ページリロード時の自動再接続を実装
  - _Requirements: 2, 3_

- [x] 2.1 use-walletフックの実装
  - `pkgs/frontend/hooks/use-wallet.ts`を作成
  - ウォレット状態（`isConnected`, `walletName`, `address`等）を管理
  - `connect()`, `disconnect()`, `copyAddress()`アクションを実装
  - エラー状態管理を実装
  - _Requirements: 2, 3, 5_

- [x] 2.2 WalletProvider Contextの実装
  - `pkgs/frontend/components/wallet/wallet-provider.tsx`を作成
  - `use-wallet`フックを使用してContextを構築
  - 子コンポーネントに状態とアクションを提供
  - ページリロード時の自動再接続ロジックを実装
  - _Requirements: 2, 3_

- [ ] 3. UIコンポーネント：ウォレット接続UI
  - ウォレット接続ボタンを実装
  - ウォレット選択モーダルを実装
  - ウォレット情報ドロップダウンを実装
  - _Requirements: 1, 4, 5, 7_

- [x] 3.1 WalletButtonコンポーネント
  - `pkgs/frontend/components/wallet/wallet-button.tsx`を作成
  - 未接続時: "Connect Wallet"ボタンを表示
  - 接続中: ローディングスピナーを表示
  - 接続済み: 短縮アドレス + ウォレットアイコンを表示
  - クリックイベントハンドラーを実装
  - _Requirements: 1, 4, 7_

- [x] 3.2 WalletSelectionModalコンポーネント
  - `pkgs/frontend/components/wallet/wallet-modal.tsx`を作成
  - shadcn/ui Dialogコンポーネントを使用
  - 4つのウォレットをリスト表示
  - インストール済み/未インストールを視覚的に区別
  - "Connect" / "Install"ボタンを実装
  - _Requirements: 1, 3, 6, 7, 8_

- [x] 3.3 WalletDropdownコンポーネント
  - `pkgs/frontend/components/wallet/wallet-dropdown.tsx`を作成
  - shadcn/ui DropdownMenuコンポーネントを使用
  - 完全なアドレス表示
  - "Copy Address"ボタンを実装
  - "Disconnect"ボタンを実装
  - _Requirements: 4, 5_

- [ ] 4. 統合：アプリケーションへの組み込み
  - WalletProviderをアプリケーションルートに追加
  - ヘッダーにWalletButtonを追加
  - スタイリングを調整
  - _Requirements: 1, 2, 7_

- [x] 4.1 layout.tsxの更新
  - `pkgs/frontend/app/layout.tsx`を更新
  - `WalletProvider`で子コンポーネントをラップ
  - _Requirements: 2_

- [x] 4.2 ヘッダーコンポーネントの作成
  - `pkgs/frontend/components/header.tsx`を作成（または既存を更新）
  - `WalletButton`をヘッダー右上に配置
  - レスポンシブデザインを実装
  - _Requirements: 1, 7_

- [x] 4.3 ウォレットアイコンの追加
  - `pkgs/frontend/public/wallet-icons/`ディレクトリを作成
  - Lace, Nami, Eternl, FlintのSVGアイコンを追加
  - _Requirements: 1, 7_

- [x] 4.4 スタイリング調整
  - Midnightブランドカラーを適用
  - アニメーション効果を追加
  - レスポンシブデザインを確認
  - _Requirements: 7_

- [ ]* 5. テスト：品質保証
  - 単体テストを実装
  - 統合テストを実装
  - 手動テストを実施
  - _Requirements: All_

- [ ]* 5.1 単体テストの実装
  - `wallet-api.test.ts`を作成
  - `detectWallets()`, `connectWallet()`, `getAddress()`をテスト
  - エラーケースをテスト
  - _Requirements: 3, 6, 8_

- [ ]* 5.2 統合テストの実装
  - `wallet-flow.test.tsx`を作成
  - ウォレット接続フロー全体をテスト
  - モーダル開閉をテスト
  - 状態管理をテスト
  - _Requirements: All_

- [ ]* 5.3 手動テスト
  - 各ウォレットで接続テスト
  - エラーケースの確認
  - レスポンシブデザインの確認
  - アクセシビリティの確認
  - _Requirements: All_

- [ ] 6. ドキュメント：使用方法の記載
  - READMEにウォレット接続機能を追加
  - 開発者向けドキュメントを作成
  - _Requirements: All_

- [x] 6.1 READMEの更新
  - ウォレット接続機能の説明を追加
  - 対応ウォレット一覧を記載
  - スクリーンショットを追加
  - _Requirements: 1, 7_

- [ ]* 6.2 開発者ドキュメント
  - `pkgs/frontend/docs/wallet-integration.md`を作成
  - API仕様を記載
  - 使用例を記載
  - トラブルシューティングを記載
  - _Requirements: All_
