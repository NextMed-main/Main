# Implementation Plan - Patient Data Registration

このドキュメントは、患者データ登録機能の実装タスクリストです。
各タスクは要件と設計に基づいており、段階的に実装を進めます。

## タスク一覧

- [x] 1. プロジェクト構造のセットアップ
  - プロジェクトの基本構造を作成し、必要な設定ファイルを配置
  - _Requirements: 要件1.1, 要件2.1_

- [x] 1.1 package.jsonの設定
  - ビルドスクリプトとテストスクリプトを設定
  - 依存関係を追加
  - _Requirements: 要件1.1_

- [x] 1.2 TypeScript設定ファイルの作成
  - tsconfig.jsonとtsconfig.build.jsonを作成
  - コンパイラオプションを設定
  - _Requirements: 要件1.1_

- [x] 1.3 Vitest設定ファイルの作成
  - vitest.config.tsを作成
  - テスト環境を設定
  - _Requirements: 要件1.1_

- [x] 2. Compactコントラクトの実装
  - patient-registry.compactファイルを作成し、コアロジックを実装
  - _Requirements: 要件1.1, 要件1.2, 要件1.3, 要件1.4, 要件1.5_

- [x] 2.1 基本構造とenumの定義
  - Gender enumを定義
  - RegistrationState enumを定義
  - pragma文とimport文を追加
  - _Requirements: 要件1.1_

- [x] 2.2 Ledger状態の定義
  - registrationCountフィールドを定義
  - 性別カウンターフィールドを定義
  - stateフィールドを定義
  - _Requirements: 要件1.1, 要件2.1_

- [x] 2.3 Constructorの実装
  - すべてのカウンターを0で初期化
  - 状態をUNREGISTEREDで初期化
  - _Requirements: 要件1.1_

- [x] 2.4 registerPatient circuitの実装
  - 年齢検証ロジックを実装
  - カウンター更新ロジックを実装
  - 性別カウンター更新ロジックを実装
  - 状態更新ロジックを実装
  - _Requirements: 要件1.1, 要件1.2, 要件1.3, 要件1.4, 要件1.5_

- [x] 2.5 getRegistrationStats circuitの実装
  - 統計情報を返すロジックを実装
  - タプル形式で返却
  - _Requirements: 要件2.1, 要件2.2_

- [x] 2.6 verifyAgeRange circuitの実装
  - 年齢範囲検証ロジックを実装
  - Boolean値を返却
  - _Requirements: 要件4.1, 要件4.3_

- [x] 3. TypeScript型定義の作成
  - types.tsファイルを作成し、型定義を実装
  - _Requirements: 要件1.1, 要件2.1_

- [x] 3.1 Gender型の定義
  - TypeScript enumを定義
  - Compact enumとの対応を確保
  - _Requirements: 要件1.1_

- [x] 3.2 RegistrationState型の定義
  - TypeScript enumを定義
  - Compact enumとの対応を確保
  - _Requirements: 要件1.1_

- [x] 3.3 RegistrationStats型の定義
  - 統計情報の型を定義
  - タプル型との対応を確保
  - _Requirements: 要件2.1_

- [x] 4. ユーティリティ関数の実装
  - utils.tsファイルを作成し、ヘルパー関数を実装
  - _Requirements: 要件1.1, 要件1.5_

- [x] 4.1 年齢検証関数の実装
  - validateAge関数を実装
  - 0-150歳の範囲チェック
  - _Requirements: 要件1.5_

- [x] 4.2 性別コード変換関数の実装
  - genderToCode関数を実装
  - codeToGender関数を実装
  - _Requirements: 要件1.1_

- [x] 4.3 条件ハッシュ生成関数の実装
  - hashCondition関数を実装
  - Field型への変換
  - _Requirements: 要件1.1, 要件1.3_

- [x] 5. TypeScriptエクスポートの実装
  - index.tsファイルを作成し、公開APIを定義
  - _Requirements: 要件1.1_

- [x] 5.1 型定義のエクスポート
  - types.tsからすべての型をエクスポート
  - _Requirements: 要件1.1_

- [x] 5.2 ユーティリティ関数のエクスポート
  - utils.tsからすべての関数をエクスポート
  - _Requirements: 要件1.1_

- [x] 5.3 コントラクトのエクスポート
  - managed/patient-registryからコントラクトをエクスポート
  - _Requirements: 要件1.1_

- [x] 6. Compactコントラクトのコンパイル
  - compactcコマンドでコントラクトをコンパイル
  - _Requirements: 要件1.1_

- [x] 6.1 コンパイルスクリプトの実行
  - pnpm compactを実行
  - エラーがないことを確認
  - _Requirements: 要件1.1_

- [x] 6.2 生成ファイルの確認
  - src/managed/patient-registry/が生成されることを確認
  - 必要なファイルがすべて存在することを確認
  - _Requirements: 要件1.1_

- [x] 7. ユニットテストの実装
  - patient-registry.test.tsファイルを作成し、テストを実装
  - _Requirements: 要件1.1, 要件1.2, 要件1.3, 要件1.4, 要件1.5, 要件2.1, 要件2.2, 要件4.1_

- [x] 7.1 registerPatient正常系テストの実装
  - 有効なデータで患者登録が成功することをテスト
  - _Requirements: 要件1.1, 要件1.4_

- [x] 7.2 registerPatient異常系テストの実装
  - 年齢が150歳を超える場合にエラーになることをテスト
  - _Requirements: 要件1.5_

- [x] 7.3 カウンター更新テストの実装
  - 登録ごとにカウンターが増加することをテスト
  - _Requirements: 要件2.1_

- [x] 7.4 性別カウンター更新テストの実装
  - 性別ごとにカウンターが正しく更新されることをテスト
  - _Requirements: 要件2.1_

- [x] 7.5 年齢範囲検証テストの実装
  - verifyAgeRangeが正しく動作することをテスト
  - _Requirements: 要件4.1_

- [x] 7.6 統計取得テストの実装
  - getRegistrationStatsが正しい値を返すことをテスト
  - _Requirements: 要件2.1, 要件2.2_

- [ ]* 8. 統合テストの実装
  - integration.test.tsファイルを作成し、E2Eテストを実装
  - _Requirements: 要件1.1, 要件1.4_

- [ ]* 8.1 E2Eテストの実装
  - スタンドアロン環境でのテストを実装
  - testcontainersを使用
  - _Requirements: 要件1.1, 要件1.4_

- [ ]* 8.2 並行処理テストの実装
  - 複数の登録が同時に行われる場合のテストを実装
  - _Requirements: 要件1.1_

- [x] 9. TypeScriptビルドの実行
  - tscコマンドでTypeScriptをコンパイル
  - _Requirements: 要件1.1_

- [x] 9.1 ビルドスクリプトの実行
  - pnpm buildを実行
  - エラーがないことを確認
  - _Requirements: 要件1.1_

- [x] 9.2 生成ファイルの確認
  - dist/が生成されることを確認
  - 必要なファイルがすべて存在することを確認
  - _Requirements: 要件1.1_

- [x] 10. テストの実行と検証
  - すべてのテストを実行し、パスすることを確認
  - _Requirements: 要件1.1, 要件1.2, 要件1.3, 要件1.4, 要件1.5, 要件2.1, 要件2.2, 要件4.1_

- [x] 10.1 ユニットテストの実行
  - pnpm testを実行
  - すべてのテストがパスすることを確認
  - _Requirements: 要件1.1, 要件1.2, 要件1.3, 要件1.4, 要件1.5, 要件2.1, 要件2.2, 要件4.1_

- [ ]* 10.2 統合テストの実行
  - pnpm test:integrationを実行
  - すべてのテストがパスすることを確認
  - _Requirements: 要件1.1, 要件1.4_

- [x] 10.3 カバレッジの確認
  - テストカバレッジを確認
  - 主要なロジックがカバーされていることを確認
  - _Requirements: 要件1.1_

## 実装の注意事項

### コーディング規約
- Compact言語バージョン: 0.17.0を使用
- TypeScript: strictモードを有効化
- インデント: タブを使用（Biome設定に従う）
- 命名規則: camelCaseを使用

### テスト規約
- すべてのCircuitに対してユニットテストを作成
- 正常系と異常系の両方をテスト
- エッジケースも考慮
- テストは独立して実行可能にする

### エラーハンドリング
- assertで明確なエラーメッセージを提供
- TypeScriptでの型チェックを活用
- フロントエンドでの事前検証を推奨

### パフォーマンス
- Field型を活用した効率的な演算
- シンプルな構造でデバッグを容易に
- 不要な複雑さを避ける

## 参考資料

### helixchain実装
- `references/helixchain/contracts/src/genomic_verifier_working.compact`
- `references/helixchain/contracts/src/genomic_working.compact`
- `references/helixchain/contracts/package.json`

### Midnight公式ドキュメント
- [Compact Language Reference](https://docs.midnight.network/develop/reference/compact/lang-ref)
- [Ledger Data Types](https://docs.midnight.network/develop/reference/compact/ledger-adt)
- [Writing a Contract](https://docs.midnight.network/develop/reference/compact/writing)

## 完了条件

このspecは以下の条件がすべて満たされた時点で完了とします:

1. ✅ すべてのCompactコントラクトが正常にコンパイルされる
2. ✅ すべてのTypeScriptコードが正常にビルドされる
3. ✅ すべてのユニットテストがパスする
4. ✅ 主要なロジックのテストカバレッジが80%以上
5. ✅ 年齢検証が正しく動作する（0-150歳）
6. ✅ カウンターが正しく更新される
7. ✅ 統計情報が正しく取得できる
8. ✅ エラーハンドリングが適切に実装されている
