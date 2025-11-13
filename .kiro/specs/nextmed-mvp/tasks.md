# NextMed MVP 実装タスク

## 概要

HelixChainのハッカソン入賞パターンを参考に、段階的かつ実装可能な医療データプライバシー保護プラットフォームを構築します。各タスクは独立して実行可能で、前のタスクの成果物を基に構築されます。

## 実装優先順位

### Phase 1: 基本インフラ構築
### Phase 2: コアスマートコントラクト
### Phase 3: フロントエンド統合
### Phase 4: AI分析機能
### Phase 5: 統合テスト

---

## Phase 1: 基本インフラ構築

- [ ] 1. プロジェクト構造とビルドシステムの構築
  - モノレポ構造の確立（pkgs/contract, pkgs/cli, pkgs/frontend）
  - pnpmワークスペース設定とpackage.json構成
  - TypeScript設定とビルドスクリプト作成
  - _Requirements: 全体アーキテクチャ設計_

- [ ] 1.1 Compact開発環境のセットアップ
  - Compact Compiler (compactc) のインストールと設定
  - COMPACT_HOME環境変数の設定
  - VSCode Compact拡張機能の設定
  - _Requirements: 開発環境要件_

- [ ] 1.2 Midnight SDK統合の準備
  - @midnight-ntwrk/* パッケージのインストール
  - Midnight Testnet-02接続設定
  - Lace Wallet統合の基盤準備
  - _Requirements: Midnight Network統合_

- [ ] 1.3 Docker開発環境の構築
  - スタンドアロン環境用Docker Compose設定
  - PostgreSQL, Redis, Midnight Node設定
  - 開発用データベーススキーマ作成
  - _Requirements: 開発環境の分離_

## Phase 2: コアスマートコントラクト

- [ ] 2. 基本スマートコントラクトの実装（HelixChain simple_finalパターン）
  - 最小限の動作するCompactコントラクト作成
  - 基本的なカウンター機能とデータ検証
  - コンパイルとデプロイの確認
  - _Requirements: 基本機能要件_

- [ ] 2.1 データ構造とLedger状態の定義
  - PatientRecord, AnalysisResult構造体の実装
  - Map, Counter, HistoricMerkleTreeの設定
  - 型安全性とバリデーションの組み込み
  - _Requirements: データ管理要件_

- [ ] 2.2 患者データ登録回路の実装
  - registerPatient回路の実装
  - commitMedicalData回路の実装
  - プライバシー保護機能（disclose()の適切な使用）
  - _Requirements: 患者データ登録機能_

- [ ] 2.3 研究者認証システムの実装
  - addAuthorizedResearcher回路の実装
  - アクセス制御とセキュリティチェック
  - 緊急停止機能（emergencyPause）の実装
  - _Requirements: アクセス制御要件_

- [ ] 2.4 Witness関数の実装
  - getMedicalData, getPatientPrivateKey witness実装
  - TypeScript側のwitness関数実装
  - プライベート状態管理の実装
  - _Requirements: プライバシー保護要件_

- [ ]* 2.5 スマートコントラクト単体テストの作成
  - Vitest環境でのテストセットアップ
  - 各回路の正常系・異常系テスト
  - テストシミュレーターの実装
  - _Requirements: テスト要件_

## Phase 3: フロントエンド統合

- [ ] 3. Next.js フロントエンドの基盤構築
  - Next.js 16.0.0 App Routerプロジェクト作成
  - TailwindCSS, shadcn/ui, Framer Motionの設定
  - レスポンシブデザインとダークテーマ実装
  - _Requirements: UI/UX要件_

- [ ] 3.1 ウォレット統合とコンテキスト管理
  - Lace Wallet DApp Connector統合
  - React Context APIでのウォレット状態管理
  - 接続・切断・ネットワーク切り替え処理
  - _Requirements: ウォレット統合要件_

- [ ] 3.2 患者ダッシュボードの実装
  - 患者データ登録フォーム（リッチデータ対応）
  - データプライバシーレベルの可視化
  - 登録済みデータの確認・管理機能
  - _Requirements: 患者ポータル要件_

- [ ] 3.3 研究者ダッシュボードの実装
  - 認証済み研究者向けインターフェース
  - データセット検索・統計表示機能
  - 分析結果の可視化（Recharts使用）
  - _Requirements: 研究者ポータル要件_

- [ ] 3.4 スマートコントラクト統合
  - 生成されたTypeScript APIの統合
  - トランザクション送信・状態監視
  - エラーハンドリングとユーザーフィードバック
  - _Requirements: ブロックチェーン統合要件_

- [ ]* 3.5 フロントエンドコンポーネントテスト
  - React Testing Library環境構築
  - 主要コンポーネントの単体テスト
  - ウォレット統合のモックテスト
  - _Requirements: フロントエンドテスト要件_

## Phase 4: AI分析機能

- [ ] 4. AI分析回路の実装（HelixChain分析パターン）
  - executeAIAnalysis回路の実装
  - プライバシー保護AI分析機能
  - 分析結果のハッシュ化と検証
  - _Requirements: AI分析要件_

- [ ] 4.1 AI分析Witness関数の実装
  - prepareAIAnalysisInput witness実装
  - executeAIModel witness実装（オフチェーン）
  - 分析結果の信頼度計算
  - _Requirements: AI分析プライバシー要件_

- [ ] 4.2 分析結果管理システム
  - 分析履歴の記録・管理
  - 結果の検証・監査機能
  - 集計統計の生成・表示
  - _Requirements: 分析結果管理要件_

- [ ] 4.3 AI分析フロントエンド統合
  - 分析リクエストフォーム
  - リアルタイム分析進捗表示
  - 結果の可視化・ダウンロード機能
  - _Requirements: AI分析UI要件_

- [ ]* 4.4 AI分析機能テスト
  - AI分析回路の単体テスト
  - 分析結果の正確性検証
  - パフォーマンステスト
  - _Requirements: AI分析テスト要件_

## Phase 5: 統合テスト

- [ ] 5. バックエンドAPI実装
  - Express.js REST APIサーバー構築
  - データベース統合（PostgreSQL）
  - キャッシュシステム（Redis）統合
  - _Requirements: バックエンドAPI要件_

- [ ] 5.1 CLI ツールの実装
  - コントラクトデプロイスクリプト
  - データ管理・監視ツール
  - 開発・テスト用ユーティリティ
  - _Requirements: 開発ツール要件_

- [ ] 5.2 エンドツーエンドテスト
  - Playwright E2Eテスト環境構築
  - 主要ユーザーフローのテスト
  - クロスブラウザ・レスポンシブテスト
  - _Requirements: E2Eテスト要件_

- [ ] 5.3 パフォーマンス最適化
  - フロントエンドバンドル最適化
  - スマートコントラクトガス最適化
  - データベースクエリ最適化
  - _Requirements: パフォーマンス要件_

- [ ] 5.4 セキュリティ監査
  - スマートコントラクトセキュリティ検証
  - フロントエンドセキュリティ検証
  - プライバシー保護機能の検証
  - _Requirements: セキュリティ要件_

- [ ]* 5.5 ドキュメント作成
  - API仕様書の作成
  - ユーザーガイドの作成
  - 開発者向けドキュメント作成
  - _Requirements: ドキュメント要件_

## Phase 6: デプロイメント準備

- [ ] 6. 本番環境準備
  - Midnight Testnet-02デプロイ設定
  - 環境変数・設定管理
  - 監視・ログシステム構築
  - _Requirements: 本番環境要件_

- [ ] 6.1 CI/CD パイプライン構築
  - GitHub Actions ワークフロー作成
  - 自動テスト・ビルド・デプロイ
  - 品質ゲートとセキュリティチェック
  - _Requirements: CI/CD要件_

- [ ] 6.2 最終統合テスト
  - 本番環境での動作確認
  - パフォーマンス・負荷テスト
  - セキュリティ・プライバシーテスト
  - _Requirements: 最終検証要件_

---

## 実装ガイドライン

### コード品質基準
- TypeScript strict mode使用
- ESLint + Prettier設定遵守
- 単体テストカバレッジ80%以上
- コードレビュー必須

### セキュリティ要件
- すべての外部入力の検証
- プライベートキーの適切な管理
- disclose()の明示的使用
- 定期的なセキュリティ監査

### パフォーマンス目標
- フロントエンド初期ロード < 3秒
- スマートコントラクト実行 < 10秒
- API レスポンス時間 < 500ms
- 同時ユーザー数 100+対応

### プライバシー保護
- 個人識別情報の完全秘匿
- 医療データのハッシュ化保存
- ゼロ知識証明による検証
- 集計統計のみの公開

このタスクリストにより、HelixChainの成功パターンを活用しながら、段階的かつ確実にNextMed MVPを構築できます。