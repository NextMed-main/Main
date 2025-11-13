# プロジェクト概要

## 1. コンセプト

「さくらねっと、セルビアネット、富士通EHR等の国内主要医療情報基盤と連携し、患者のデータ主権を完全に保護しながら医療AIの発展を加速させる、ZKネイティブな次世代EHR分析基盤」

## 2. Midnightを活用するメリット（プロジェクトの核）

- **データの機密化**: 患者のEHRデータ（国内システムから連携されたものを含む）は、Midnight上で暗号化されたまま（あるいは機密情報として）扱われます。AI開発者や研究者は、生データに一切アクセスできません。

- **分析ロジックの機密化**: 研究者が実行するAIモデルや分析クエリも機密化できます。

- **ZK-ML（ゼロ知識機械学習）**: MidnightのZK機能を活用し、「あるAIモデルが、機密化されたEHRデータを分析した結果」とその**証明(Proof)**のみを取り出します。生データは一切漏洩しません。

## 3. ターゲットユーザー

- **データ主体（患者）**: 自身の医療データの所有者
- **データ提供者（医療機関）**: （特に）さくらねっと、セルビアネット参加機関や、富士通EHRシステム導入機関
- **データ利用者（研究機関・製薬会社・AI開発者）**: 機密データを分析したい組織・個人

## 4. 主な機能要件

ユーザーごとに必要な機能を分類します。

### A. データ主体（患者）向け機能

#### データ連携（Opt-in）
- 自身のEHRデータ（連携ネットワーク経由のものを含む）をNextMedに提供することを許可する機能

#### 同意管理ダッシュボード
- 「どの研究機関が」「いつ」「どのような目的で」自分のデータ（の証明）を利用したかを追跡できる監査ログ
- データ提供の同意をいつでも撤回（Opt-out）できる機能

#### （オプション）データ収益化
- 自身のデータがAI分析に利用された場合に、インセンティブを受け取るウォレット機能

### B. データ提供者（医療機関）向け機能

#### 国内EHR連携コネクタ（最重要）

**地域医療連携ネットワーク（SS-MIX2対応）**
- 「さくらねっと」「セルビアネット」など、SS-MIX2標準ストレージを採用している地域の医療情報ネットワークから、安全にデータをMidnightネットワークに連携（あるいはZK化）するための標準インターフェース

**富士通EHRシステム連携モジュール**
- 富士通の主要EHRシステム（HOPE LifeMarkシリーズ等）とシームレスに連携し、必要なデータを抽出・機密化してNextMedに連携するための専用APIまたはアダプタ

#### データ管理
- 提供するデータの種類やアクセス権限（ポリシー）を設定する管理画面
- 日本の「医療情報システムの安全管理に関するガイドライン」や個人情報保護法を遵守していることを証明（ZK Proof）する機能

### C. データ利用者（研究者・AI開発者）向け機能

#### データ・マーケットプレイス
- 「どのような種類のデータが、どれくらい（統計情報のみ）存在するか」を検索できる機能

#### AI分析実行環境（"Confidential Sandbox"）
- 機密化されたデータセットに対し、AIモデルや分析クエリを実行依頼する機能
- MidnightのZKVM上でZK-MLモデルを実行し、その計算結果の正当性を示すZK Proofを生成・取得する

#### 結果の取得
- 生データではなく、「分析結果（例：相関係数、リスクスコア）」と「その計算が正しく行われたことの証明」のみを受け取る

### D. コア・ロジック（Midnightスマートコントラクト）

#### アクセス制御コントラクト
- 患者の同意（A）と研究者のリクエスト（C）を照合し、分析実行の可否を決定する機密コントラクト

#### ZK計算証明コントラクト
- AI分析が機密データ上で「確かに実行されたこと」と「結果が改ざんされていないこと」を検証するロジック

#### 報酬分配コントラクト
- 研究者から支払われた利用料を、データを提供した患者（A）や医療機関（B）に分配するロジック

## 5. 非機能要件

### プライバシー（最重要）
- エンドツーエンドでの暗号化と、ZKによる「計算の証明」の徹底

### 相互運用性
- SS-MIX2、FHIRなど、日本の医療情報における標準規格への完全準拠
- 富士通EHRシステムやその他主要ベンダーのシステムとの接続性担保

### コンプライアンス
- 医療情報システムの安全管理に関するガイドライン、次世代医療基盤法、個人情報保護法など、日本の厳格な法規制を設計段階から組み込む

### スケーラビリティ
- 大量のEHRデータと複雑なAIモデルの計算処理（ZK Proofの生成）への対応

---

## 6. アーキテクチャ

### 6.1 フロントエンドレイヤー
1. ウォレット接続
2. バックエンドの機能呼び出し
3. コントラクトの機能呼び出し

### 6.2 バックエンドレイヤー
1. コントラクトに登録されたデータの取り出し
2. AI Agentに推論させること

### 6.3 コントラクトレイヤー
以下の3つのデータの登録・保存ができればOK:
1. 年齢
2. 性別
3. 症例

## 7. 取り扱う医療データのサンプルフォーマット

本プロジェクトで取り扱おうと考えているデータのサンプルフォーマットを提示します。

実装時に参考してください。

患者からはこれらのデータが登録される想定です。

```csv
Full Name,Age,Gender,Region,Address,Symptoms,Medication History,Past Visits,Phone Number,Insurance ID
Linda Brown,69,Female,"Texas, USA","592 High St, Austin, TX","Depression, Type 2 Diabetes",Amoxicillin,[2025-06-05: Type 2 Diabetes],+1-437-555-8543,90227541970
Yuko Kobayashi,61,Female,"Hokkaido, Japan",6-19 Hakodate-shi,Type 2 Diabetes,Atorvastatin,"[2024-05-16: Influenza A], [2024-04-02: Influenza A], [2023-11-06: Gastroenteritis]",+81-70-8831-5929,40510500365
Mary Johnson,62,Female,"Wales, UK","5481 High St, Swansea",Depression,None,[2025-07-07: Common Cold],+44-7633-603739,5335944364
Makoto Nakamura,6,Male,"Hokkaido, Japan","9-6 Chuo-ku, Sapporo",Bronchial Asthma,None,"[2024-10-06: Fever], [2024-08-16: Allergic Rhinitis], [2024-01-28: Dermatitis], [2024-01-24: Lower Back Pain], [2024-01-04: Influenza A]",+81-80-6927-0066,48416632358
Hiroshi Suzuki,92,Male,"Chubu, Japan","8-23 Kanazawa-shi, Ishikawa",Rheumatoid Arthritis,Amlodipine,[2025-04-15: Acute Bronchitis],+81-70-6948-4803,53727056181
Mika Yamamoto,91,Female,"Kansai, Japan","1-21 Chuo-ku, Kobe","Insomnia, Chronic Kidney Disease",None,"[2024-09-17: Allergic Rhinitis], [2024-08-31: Lower Back Pain]",+81-70-8266-5410,66138863580
Yuta Ito,83,Male,"Kanto, Japan","5-2 Shinjuku-ku, Tokyo",Bronchial Asthma,Lisinopril,"[2025-05-21: Acute Bronchitis], [2024-11-21: Lower Back Pain], [2024-03-30: Bronchial Asthma], [2024-03-16: Fever], [2024-02-28: Acute Bronchitis]",+81-80-8903-5253,38065447495
Hina Ito,19,Female,"Tohoku, Japan","2-16 Morioka-shi, Iwate",None,None,"[2025-08-08: Headache], [2025-04-16: Fever]",+81-90-6783-6779,90507825745
Yoko Ito,71,Female,"Kansai, Japan","1-17 Nakagyo-ku, Kyoto",Osteoporosis,Sertraline,"[2024-08-12: Dermatitis], [2024-05-17: Dermatitis], [2024-05-03: Allergic Rhinitis]",+81-80-5322-1680,62272684114
Misaki Ito,53,Female,"Kyushu, Japan",1-7 Kumamoto-shi,"Depression, Dyslipidemia",Amlodipine,"[2025-07-21: COVID-19], [2025-02-04: Headache], [2024-10-29: Common Cold]",+81-70-8003-6137,8633192726
Sakura Watanabe,31,Female,"Kyushu, Japan",1-1 Kumamoto-shi,"Migraine, GERD",Atorvastatin,"[2025-01-30: Influenza A], [2024-10-15: Gastroenteritis]",+81-70-7716-9412,24559426050
Sakura Ito,84,Female,"Tohoku, Japan","2-3 Aoba-ku, Sendai","Dyslipidemia, Chronic Kidney Disease",Furosemide,"[2025-10-10: Dyslipidemia], [2025-08-26: Headache], [2025-04-16: Lower Back Pain]",+81-90-7993-0275,56499446286
```