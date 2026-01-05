# NextMed デザインパターンとガイドライン

## アーキテクチャ

### AI駆動開発ガイドライン (`AGENTS.md`)
- **日本語優先**: 特段の指定がない限り、自然な日本語で回答・コメントを記述。
- **品質基準**: TDD（テスト駆動開発）の原則、ボーイスカウトルール、DRY原則を徹底。
- **エラーハンドリング**: 根本原因の修正を優先し、エラーを握りつぶさない。
- **セキュリティ**: APIキーや秘密鍵のハードコード禁止。環境変数での管理を徹底。

## Compact コントラクトパターン

### 患者登録パターン
```compact
pragma language_version >= 0.16 && <= 0.25;
import CompactStandardLibrary;

export ledger patients: Map<Bytes<32>, Patient>;

struct Patient {
    name_hash: Bytes<32>,
    age_range: Uint<8>, // 0: 0-18, 1: 19-64, 2: 65+
    registration_date: Uint<64>
}

export circuit register_patient(id: Bytes<32>, age: Uint<8>): [] {
    patients.insert(id, Patient { 
        name_hash: id, 
        age_range: age, 
        registration_date: 123456789 
    });
}
```

## ロギングと検証
- **pino**: 構造化ロギングによる可観測性の確保。
- **Zod**: FrontendおよびCLIでのランタイム型検証。
