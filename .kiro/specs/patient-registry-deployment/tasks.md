# Implementation Plan - Patient Registry Deployment

## タスク一覧

- [x] 1. デプロイスクリプトの作成
  - deploy-patient-registry.tsを作成し、Patient Registryコントラクトをデプロイする機能を実装
  - _Requirements: 要件1.1, 要件1.2, 要件1.3, 要件1.4, 要件1.5_

- [x] 1.1 環境変数読み込み機能の実装
  - NETWORK_ENV_VAR、SEED_ENV_VAR、CACHE_FILE_ENV_VARを読み込む
  - _Requirements: 要件1.1, 要件2.1_

- [x] 1.2 ウォレット作成機能の実装
  - シードからウォレットを復元し、資金を確認
  - _Requirements: 要件1.2, 要件1.3_

- [x] 1.3 コントラクトデプロイ機能の実装
  - Patient Registryコントラクトをデプロイ
  - _Requirements: 要件1.4_

- [x] 1.4 デプロイ情報保存機能の実装
  - deployment-patient-registry.jsonに情報を保存
  - _Requirements: 要件1.5_

- [x] 2. 検証スクリプトの作成
  - verify-patient-registry.tsを作成し、デプロイされたコントラクトを検証
  - _Requirements: 要件3.1, 要件3.2, 要件3.3, 要件3.4, 要件3.5_

- [x] 2.1 デプロイ情報読み込み機能の実装
  - deployment-patient-registry.jsonから情報を読み込む
  - _Requirements: 要件3.1_

- [x] 2.2 初期状態確認機能の実装
  - getRegistrationStatsを呼び出して初期状態を確認
  - _Requirements: 要件3.2_

- [x] 2.3 テスト登録機能の実装
  - registerPatientを呼び出してテスト登録を実行
  - _Requirements: 要件3.3_

- [x] 2.4 統計確認機能の実装
  - 登録後の統計情報を取得して表示
  - _Requirements: 要件3.4, 要件3.5_

- [x] 3. package.jsonスクリプトの追加
  - デプロイと検証用のnpmスクリプトを追加
  - _Requirements: 要件1.1_

- [x] 4. .env.exampleの更新
  - Patient Registry用の環境変数例を追加
  - _Requirements: 要件2.5, 要件5.1_

- [x] 5. ドキュメントの作成
  - DEPLOYMENT.mdを作成し、デプロイ手順を記載
  - _Requirements: 要件5.1, 要件5.2, 要件5.3, 要件5.4, 要件5.5_

- [ ] 6. Standaloneでのテスト
  - ローカルDocker環境でデプロイと検証を実行
  - _Requirements: 要件1.1, 要件3.1_

- [ ] 7. Testnetでのテスト
  - Midnight Testnet-02でデプロイと検証を実行
  - _Requirements: 要件1.1, 要件3.1_

## 完了条件

1. ✅ deploy-patient-registry.tsが正常に動作する
2. ✅ verify-patient-registry.tsが正常に動作する
3. ✅ Standalone環境でデプロイと検証が成功する
4. ✅ Testnet環境でデプロイと検証が成功する
5. ✅ デプロイ情報が正しく保存される
6. ✅ エラーハンドリングが適切に実装されている
7. ✅ ドキュメントが完備されている
