# ウォレット接続デモ機能 要件定義

## Introduction

NextMedプラットフォームのハッカソンデモ用に、Midnight Blockchainのウォレット（Lace Wallet）との統合をアピールする機能を実装します。この機能は、実際の認証障壁を設けずに、ウォレット接続機能を視覚的に示し、Midnight技術の活用をデモンストレーションします。ユーザーは認証なしでもすべての機能にアクセスでき、オプションでウォレットを接続してアドレスを表示できます。

## Glossary

- **Lace Wallet**: Midnight Blockchain用の公式ブラウザ拡張ウォレット
- **Nami Wallet**: Cardanoエコシステムの人気ウォレット（Midnight対応）
- **Eternl Wallet**: Cardanoエコシステムのマルチ機能ウォレット（Midnight対応）
- **Flint Wallet**: Cardanoエコシステムのモバイル対応ウォレット（Midnight対応）
- **CIP-30**: Cardano Improvement Proposal 30 - ウォレットとDAppの標準インターフェース
- **Wallet Provider**: ブラウザに注入されるウォレットAPIオブジェクト（`window.cardano.*`）
- **Primary Address**: ウォレットのメインアドレス（Bech32m形式）
- **Multi-Wallet Support**: 複数のウォレットプロバイダーに対応する機能

## Requirements

### Requirement 1: マルチウォレット対応UI

**User Story:** As a デモ視聴者, I want 複数のウォレットから選択できる, so that 自分の好きなウォレットでMidnight統合を体験できる

#### Acceptance Criteria

1. THE システム SHALL ヘッダーに「Connect Wallet」ボタンを常に表示する
2. WHEN ユーザーがボタンをクリックする, THE システム SHALL 利用可能なウォレット一覧をモーダルで表示する
3. THE システム SHALL Lace、Nami、Eternl、Flintの4つのウォレットをサポートする
4. THE システム SHALL 各ウォレットのアイコンと名前を表示する
5. THE システム SHALL インストール済みウォレットと未インストールウォレットを視覚的に区別する
6. THE システム SHALL 未インストールウォレットにはインストールリンクを表示する
7. THE システム SHALL ウォレット接続時はアドレスの短縮形（例: "0x1234...5678"）とウォレット名を表示する

### Requirement 2: 非ブロッキングウォレット接続

**User Story:** As a ユーザー, I want ウォレットなしでもすべての機能にアクセスできる, so that デモをスムーズに体験できる

#### Acceptance Criteria

1. THE システム SHALL ウォレット接続なしでもすべてのページにアクセスを許可する
2. THE システム SHALL ウォレット接続状態に関わらず同じコンテンツを表示する
3. THE システム SHALL ウォレット接続をオプショナル機能として扱う
4. THE システム SHALL ページ遷移をウォレット状態でブロックしない
5. THE システム SHALL ウォレット未接続でもエラーを表示しない

### Requirement 3: マルチウォレット接続フロー

**User Story:** As a ユーザー, I want 好きなウォレットを選んで接続できる, so that 簡単にMidnight統合を体験できる

#### Acceptance Criteria

1. WHEN ユーザーがウォレット選択モーダルでウォレットをクリックする, THE システム SHALL 選択されたウォレットの存在を確認する
2. IF 選択されたウォレットがインストールされている, THEN THE システム SHALL CIP-30接続ダイアログを表示する
3. IF 選択されたウォレットが未インストール, THEN THE システム SHALL インストールページを新しいタブで開く
4. WHEN ウォレット接続が成功する, THE システム SHALL プライマリアドレスを取得する
5. THE システム SHALL 接続成功を示すトーストメッセージを表示する（例: "Lace Walletに接続しました"）
6. THE システム SHALL ボタン表示をアドレスとウォレット名に更新する
7. THE システム SHALL 接続情報をlocalStorageに保存する（リロード時の復元用）

### Requirement 4: ウォレット情報の視覚的表示

**User Story:** As a デモ視聴者, I want 接続されたウォレット情報が明確に表示される, so that Midnight統合の動作を確認できる

#### Acceptance Criteria

1. THE システム SHALL 接続されたウォレットアドレスをBech32m形式で表示する
2. THE システム SHALL アドレスをクリップボードにコピーする機能を提供する
3. THE システム SHALL ウォレットアイコンと共にアドレスを表示する
4. THE システム SHALL ホバー時に完全なアドレスをツールチップで表示する
5. THE システム SHALL 接続状態を視覚的に区別できるデザインを使用する

### Requirement 5: ウォレット切断機能

**User Story:** As a ユーザー, I want ウォレット接続を解除できる, so that 別のウォレットで試せる

#### Acceptance Criteria

1. THE システム SHALL ウォレットアドレス表示をクリックするとメニューを表示する
2. THE システム SHALL メニューに「切断」オプションを含める
3. WHEN ユーザーが切断を選択する, THE システム SHALL ウォレット状態をクリアする
4. THE システム SHALL ボタン表示を「Connect Wallet」に戻す
5. THE システム SHALL 切断成功のトーストメッセージを表示する

### Requirement 6: エラーハンドリング（非侵入的）

**User Story:** As a ユーザー, I want ウォレットエラーが発生しても操作を続けられる, so that デモ体験が中断されない

#### Acceptance Criteria

1. IF Lace Walletがインストールされていない, THEN THE システム SHALL インストールリンク付きのトーストを表示する
2. WHEN ユーザーが接続をキャンセルする, THE システム SHALL 静かに元の状態に戻る
3. THE システム SHALL エラーをコンソールにログ出力する
4. THE システム SHALL エラー時もページ機能は正常に動作する
5. THE システム SHALL ユーザーフレンドリーなエラーメッセージを日本語で表示する

### Requirement 7: デモ用の視覚的アピール

**User Story:** As a ハッカソン審査員, I want Midnight統合が一目でわかる, so that 技術的な実装を評価できる

#### Acceptance Criteria

1. THE システム SHALL ウォレット接続ボタンにMidnightブランドカラーを使用する
2. THE システム SHALL ウォレット選択モーダルに各ウォレットの公式アイコンを表示する
3. THE システム SHALL 接続時にアニメーション効果を表示する
4. THE システム SHALL ウォレットアイコンを目立つ位置に配置する
5. THE システム SHALL 接続状態の変化を視覚的にフィードバックする
6. THE システム SHALL モダンで洗練されたUIデザインを採用する
7. THE システム SHALL マルチウォレット対応を明示的に示すUI要素を含める

### Requirement 8: ウォレット自動検出

**User Story:** As a ユーザー, I want インストール済みウォレットが自動的に検出される, so that スムーズに接続できる

#### Acceptance Criteria

1. WHEN ウォレット選択モーダルが開く, THE システム SHALL `window.cardano`オブジェクトをスキャンする
2. THE システム SHALL Lace（`window.cardano.lace`）の存在を確認する
3. THE システム SHALL Nami（`window.cardano.nami`）の存在を確認する
4. THE システム SHALL Eternl（`window.cardano.eternl`）の存在を確認する
5. THE システム SHALL Flint（`window.cardano.flint`）の存在を確認する
6. THE システム SHALL 検出されたウォレットを「利用可能」として表示する
7. THE システム SHALL 未検出のウォレットを「インストールが必要」として表示する
