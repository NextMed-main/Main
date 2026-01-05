# NextMed ハッカソン実装計画 - タスクリスト

## 概要

2025年1月下旬のハッカソンに向けて、既存のNextMed MVPを基盤としたインセンティブ機能付き医療データプラットフォームを4週間で実装します。各タスクは既存コードを最大限活用し、段階的に新機能を追加していきます。

## 実装アプローチ

- **既存コード活用**: patient-registry.compactとフロントエンドコンポーネントを拡張
- **段階的実装**: 毎週1つのマイルストーンを完成
- **テスト駆動**: 各機能に対してプロパティベーステストを実装
- **デモ重視**: ハッカソン審査員向けの効果的なデモンストレーション

---

## 第1週: ZKコントラクト & フロントエンド連携テスト

### マイルストーン #1: ZKDataMasking と IncentivePool の開発

- [ ] 1. ZKDataMasking Contract の実装
  - 既存のpatient-registry.compactを拡張してZKマスキング機能を追加
  - データ暗号化とハッシュ化機能の実装
  - 統計計算機能（個別データを露出せずに集計統計を提供）
  - _Requirements: 1.1, 1.3, 1.4_

- [ ] 1.1 ZKDataMasking回路の実装
  - registerPatientWithMasking回路の作成
  - applyZKMasking関数の実装
  - maskedDataStore Ledgerの追加
  - _Requirements: 1.1_

- [ ]* 1.2 ZKDataMasking単体テストの作成
  - **Property 1: データプライバシー保護**
  - **Validates: Requirements 1.1, 1.4**

- [ ] 1.3 ゼロ知識証明生成機能の実装
  - generateZKProof回路の作成
  - データアクセス時の証明生成機能
  - 証明検証機能の実装
  - _Requirements: 1.2, 1.5_

- [ ]* 1.4 ZK証明機能のテスト
  - **Property 2: ゼロ知識証明生成**
  - **Validates: Requirements 1.2, 1.5**

- [ ] 2. IncentivePool Contract の実装
  - 新規コントラクトファイルの作成（incentive-pool.compact）
  - データ料金プールの管理機能
  - 患者別残高管理システム
  - _Requirements: 2.1, 2.2, 2.4_

- [ ] 2.1 支払い受付機能の実装
  - payDataAccessFee回路の作成
  - dataFeePool Ledgerの実装
  - paymentHistory記録機能
  - _Requirements: 2.1_

- [ ]* 2.2 支払い機能のテスト
  - **Property 4: 支払いプール管理**
  - **Validates: Requirements 2.1, 2.3**

- [ ] 2.3 自動分配機能の実装
  - distributeIncentives回路の作成
  - patientBalances Map管理
  - 分配ロジックの実装
  - _Requirements: 2.2_

- [ ]* 2.4 分配機能のテスト
  - **Property 5: 自動分配機能**
  - **Validates: Requirements 2.2**

- [ ] 2.5 セキュリティ機能の実装
  - 不正支払い防止機能
  - アクセス制御の実装
  - エラーハンドリングの強化
  - _Requirements: 2.5_

- [ ]* 2.6 セキュリティ機能のテスト
  - **Property 7: セキュリティ保護**
  - **Validates: Requirements 2.5**

- [ ] 3. コントラクト統合とデプロイ
  - 既存のpatient-registry.compactとの統合
  - Midnight Testnet-02へのデプロイ
  - デプロイスクリプトの更新
  - _Requirements: 全体統合_

- [ ] 3.1 統合テストの実装
  - ZKDataMaskingとIncentivePoolの連携テスト
  - 既存機能との互換性確認
  - エンドツーエンドの基本フロー確認

- [ ] 3.2 デプロイ確認とドキュメント更新
  - Testnetでのトランザクション実行確認
  - コントラクトアドレスの記録
  - GitHubリポジトリの整備

## 第2週: 患者用「My Data Wallet」プロトタイプ

### マイルストーン #2: フロントエンド基盤 & ウォレット連携

- [ ] 4. My Data Wallet UI の実装
  - 既存のpatient-dashboard.tsxを拡張
  - NEXTトークン残高表示機能
  - データ使用履歴表示機能
  - _Requirements: 3.1, 3.2_

- [ ] 4.1 残高表示コンポーネントの作成
  - TokenBalanceCard コンポーネント実装
  - IncentivePoolコントラクトとの連携
  - リアルタイム残高更新機能
  - _Requirements: 3.1_

- [ ]* 4.2 残高表示機能のテスト
  - **Property 6: 残高計算正確性**
  - **Validates: Requirements 2.4**

- [ ] 4.3 使用履歴表示コンポーネントの作成
  - DataUsageHistory コンポーネント実装
  - 使用回数と獲得報酬の履歴表示
  - 履歴データの取得・表示機能
  - _Requirements: 3.2_

- [ ]* 4.4 履歴表示機能のテスト
  - **Property 8: 使用履歴表示**
  - **Validates: Requirements 3.2**

- [ ] 5. 同意管理機能の実装
  - Grant Accessボタンの実装
  - 研究者への同意付与・取り消し機能
  - オンチェーン同意状態の記録
  - _Requirements: 3.3, 3.4_

- [ ] 5.1 同意管理UIの作成
  - ConsentManagement コンポーネント実装
  - 研究者リストと同意状態の表示
  - 同意付与・取り消しボタンの実装
  - _Requirements: 3.3_

- [ ] 5.2 オンチェーン同意記録機能
  - midnight.sendMnTransaction統合
  - 同意状態のスマートコントラクト記録
  - トランザクション状態の監視
  - _Requirements: 3.4_

- [ ]* 5.3 同意機能のテスト
  - **Property 9: 同意状態記録**
  - **Validates: Requirements 3.4**

- [ ] 6. Lace Wallet統合の強化
  - 既存のwallet-provider.tsxの拡張
  - NEXTトークン残高の取得機能
  - トランザクション署名機能の強化
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 6.1 トークン残高取得機能
  - NEXTトークンコントラクトとの連携
  - 残高取得APIの実装
  - 残高表示の自動更新機能

- [ ] 6.2 状態永続化機能の実装
  - ローカルストレージでの状態保存
  - ページリロード後の状態復元
  - セッション管理の改善
  - _Requirements: 3.5_

- [ ]* 6.3 状態永続化のテスト
  - **Property 10: 状態永続化**
  - **Validates: Requirements 3.5**

- [ ] 7. 第2週統合テスト
  - My Data Wallet全機能の統合テスト
  - Lace Walletとの連携確認
  - ユーザビリティテストの実施

## 第3週: 研究者クエリ & データ購入機能

### マイルストーン #2継続: AI機能、クエリ機能、トークン表示の実装

- [ ] 8. Researcher Payment UI の実装
  - 既存のresearcher-dashboard.tsxを拡張
  - データセット検索機能
  - データアクセス料金支払い機能
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 8.1 データセット検索機能の実装
  - DatasetSearch コンポーネント作成
  - 利用可能データの統計情報表示
  - 検索フィルター機能の実装
  - _Requirements: 4.1_

- [ ]* 8.2 データセット検索のテスト
  - **Property 11: データセット検索**
  - **Validates: Requirements 4.1**

- [ ] 8.3 支払いUI機能の実装
  - PaymentInterface コンポーネント作成
  - 支払い金額と対象データの表示
  - IncentivePoolコントラクトとの連携
  - _Requirements: 4.2_

- [ ]* 8.4 支払いUI機能のテスト
  - **Property 12: 購入情報表示**
  - **Validates: Requirements 4.2**

- [ ] 8.5 購入完了後のUI実装
  - アクセス権確認画面の作成
  - データ利用開始案内の表示
  - 購入履歴の記録・表示機能
  - _Requirements: 4.3, 4.5_

- [ ]* 8.6 購入履歴機能のテスト
  - **Property 14: 履歴表示機能**
  - **Validates: Requirements 4.5**

- [ ] 9. データ利用機能の実装
  - 匿名化データの表示機能
  - 分析結果の可視化
  - プライバシー保護の確認
  - _Requirements: 4.4_

- [ ] 9.1 匿名化データ表示機能
  - AnonymizedDataViewer コンポーネント作成
  - 個人情報を含まないデータ表示
  - 統計データと分析結果の可視化

- [ ]* 9.2 匿名化データ表示のテスト
  - **Property 13: 匿名化データ表示**
  - **Validates: Requirements 4.4**

- [ ] 10. データ同意機能の実装
  - ZKコントラクトへのオンチェーントランザクション送信
  - 同意状態の確認・管理機能
  - 研究者と患者間の同意フロー
  - _Requirements: 3.4, 5.1_

- [ ] 10.1 同意トランザクション送信機能
  - 同意付与のトランザクション作成
  - midnight.sendMnTransactionの活用
  - トランザクション状態の監視

- [ ] 10.2 同意状態管理機能
  - 研究者別の同意状態確認
  - 同意期限の管理
  - 同意取り消し機能の実装

## 第4週: E2Eエコシステムループ & デモ制作

### マイルストーン #3: 研究者用UI、インセンティブ配布、動画撮影

- [ ] 11. E2Eインセンティブフローの実装
  - 完全なトークンフロー（研究者支払い → 患者報酬）
  - リアルタイム残高更新機能
  - 監査ログ機能の実装
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 11.1 完全トークンフローの実装
  - 研究者支払いからData Fee Poolへの追加
  - データ使用時の患者への自動分配
  - フロー全体の状態管理

- [ ]* 11.2 E2E支払いフローのテスト
  - **Property 15: E2E支払いフロー**
  - **Validates: Requirements 5.1, 5.2**

- [ ] 11.3 リアルタイム更新機能の実装
  - 残高変更の即座反映
  - WebSocketまたはポーリングによる更新
  - UI状態の同期機能

- [ ]* 11.4 リアルタイム更新のテスト
  - **Property 16: リアルタイム残高更新**
  - **Validates: Requirements 5.3**

- [ ] 11.5 監査ログ機能の実装
  - すべてのトークン移動の記録
  - 監査可能な形での記録維持
  - ログ検索・表示機能

- [ ]* 11.6 監査機能のテスト
  - **Property 17: 監査記録管理**
  - **Validates: Requirements 5.4**

- [ ] 12. デモシナリオの作成
  - ハッカソン審査員向けのデモフロー
  - サンプルデータの準備
  - デモ用リセット機能の実装
  - _Requirements: 7.1, 7.2, 7.5_

- [ ] 12.1 デモ用サンプルデータの準備
  - リアルなシナリオを再現するデータセット
  - 患者・研究者・取引データの作成
  - デモ環境での初期データ設定

- [ ] 12.2 デモフロー可視化機能
  - 各ステップの進行状況表示
  - 視覚的なフロー案内
  - デモ進行のガイド機能

- [ ] 12.3 デモリセット機能の実装
  - 初期状態への復元機能
  - 繰り返し実行可能な環境
  - デモ用データの再初期化

- [ ] 13. パフォーマンス最適化
  - 3分以内でのE2E完了確認
  - トランザクション処理の最適化
  - UI応答性の改善
  - _Requirements: 7.3_

- [ ] 13.1 トランザクション最適化
  - ガス効率の改善
  - 並列処理の実装
  - エラー処理の最適化

- [ ] 13.2 UI応答性の改善
  - ローディング状態の改善
  - 非同期処理の最適化
  - ユーザーフィードバックの強化

- [ ] 14. 最終統合テストとデモ準備
  - 全機能の統合テスト
  - デモシナリオの実行確認
  - 計算正確性の証明生成
  - _Requirements: 5.5_

- [ ] 14.1 E2E正確性証明の実装
  - 計算正確性を証明するテストログ生成
  - フロー完了時の証明出力
  - 監査用レポートの作成

- [ ]* 14.2 E2E正確性証明のテスト
  - **Property 18: E2E正確性証明**
  - **Validates: Requirements 5.5**

- [ ] 14.3 デモ動画の撮影
  - トークンフローを示すE2Eテスト動画
  - 機能説明とデモンストレーション
  - ハッカソン提出用資料の準備

- [ ] 15. 最終チェックポイント
  - すべてのマイルストーン達成確認
  - デモ環境の最終確認
  - 提出資料の準備完了

---

## 実装ガイドライン

### 既存コード活用方針
- **patient-registry.compact**: ZKDataMasking機能で拡張
- **patient-dashboard.tsx**: My Data Wallet機能で拡張
- **researcher-dashboard.tsx**: Payment UI機能で拡張
- **wallet-provider.tsx**: NEXTトークン対応で拡張

### テスト要件
- 各機能に対してプロパティベーステストを実装
- テストライブラリ: fast-check (TypeScript)
- 最小実行回数: 100回/プロパティ
- タグ形式: **Feature: hackathon-implementation-plan, Property {number}: {property_text}**

### パフォーマンス目標
- ウォレット接続: 5秒以内
- トランザクション実行: 30秒以内
- データ検索: 3秒以内
- E2Eフロー完了: 3分以内

### セキュリティ要件
- すべての外部入力の検証
- プライベートキーの適切な管理
- 不正アクセスの防止
- 監査ログの完全性保証

### デモ要件
- 3分以内での完全なE2Eデモ
- 視覚的に分かりやすいUI
- リセット機能による繰り返し実行
- 計算正確性の証明表示

このタスクリストにより、既存のNextMed MVPを基盤として、4週間でハッカソン審査員にインパクトを与えるインセンティブ機能付き医療データプラットフォームを実装できます。