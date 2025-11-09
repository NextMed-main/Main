# NextMed 推奨コマンド

## パッケージ管理

### 依存関係のインストール
```bash
pnpm install
```

### 特定パッケージでのコマンド実行
```bash
pnpm cli <command>      # CLIパッケージでコマンド実行
pnpm contract <command> # Contractパッケージでコマンド実行
pnpm frontend <command> # Frontendパッケージでコマンド実行
```

## コード品質

### フォーマット
```bash
pnpm format              # プロジェクト全体をBiomeでフォーマット
```

### リント
```bash
# 各パッケージで個別に実行
cd pkgs/contract && pnpm lint
cd pkgs/cli && pnpm lint
cd pkgs/frontend && pnpm lint
```

## Contract パッケージ

### Compactコントラクトのコンパイル
```bash
cd pkgs/contract
pnpm compact  # counter.compactをコンパイル
```

### ビルド
```bash
cd pkgs/contract
pnpm build    # TypeScriptビルド + managed/counterディレクトリのコピー
```

### テスト
```bash
cd pkgs/contract
pnpm test     # Vitestでテスト実行
```

## CLI パッケージ

### テスト
```bash
cd pkgs/cli
pnpm test-api                    # Docker Composeでスタンドアロン環境テスト
pnpm test-against-testnet        # Testnet環境でテスト
```

### 実行環境
```bash
cd pkgs/cli
pnpm standalone          # スタンドアロン環境で実行
pnpm testnet-local       # ローカルTestnet環境で実行
pnpm testnet-remote      # リモートTestnet環境で実行
pnpm testnet-remote-ps   # Proof Serverを起動してリモートTestnet環境で実行
```

### デプロイとインタラクション
```bash
cd pkgs/cli
pnpm deploy              # コントラクトをデプロイ
pnpm increment           # incrementトランザクションを実行
```

### ビルド
```bash
cd pkgs/cli
pnpm build               # TypeScriptビルド
pnpm typecheck           # 型チェックのみ
```

## Frontend パッケージ

### 開発サーバー
```bash
cd pkgs/frontend
pnpm dev                 # 開発サーバー起動 (http://localhost:3000)
```

### ビルド
```bash
cd pkgs/frontend
pnpm build               # プロダクションビルド
pnpm start               # プロダクションサーバー起動
```

### リント
```bash
cd pkgs/frontend
pnpm lint                # ESLintでリント
```

## Git コマンド（macOS）

### 基本操作
```bash
git status               # 変更状態の確認
git add .                # すべての変更をステージング
git commit -m "message"  # コミット（コンベンショナルコミット形式推奨）
git push                 # リモートにプッシュ
```

### ブランチ操作
```bash
git branch               # ブランチ一覧
git checkout -b <name>   # 新規ブランチ作成と切り替え
git merge <branch>       # ブランチをマージ
```

## macOS システムコマンド

### ファイル操作
```bash
ls -la                   # ファイル一覧（詳細表示）
cd <directory>           # ディレクトリ移動
pwd                      # 現在のディレクトリパス表示
rm -rf <directory>       # ディレクトリを再帰的に削除
cp -r <src> <dest>       # ディレクトリを再帰的にコピー
```

### 検索
```bash
find . -name "*.ts"      # ファイル検索
grep -r "pattern" .      # テキスト検索
```

### プロセス管理
```bash
ps aux | grep node       # Nodeプロセスの確認
kill -9 <PID>            # プロセスの強制終了
```

## Docker コマンド

### Docker Compose
```bash
docker compose -f standalone.yml pull    # イメージのプル
docker compose -f standalone.yml up      # コンテナ起動
docker compose -f standalone.yml down    # コンテナ停止・削除
```

## タスク完了時の推奨フロー

1. コードフォーマット: `pnpm format`
2. 型チェック: 各パッケージで `pnpm typecheck` または `pnpm build`
3. リント: 各パッケージで `pnpm lint`
4. テスト: 各パッケージで `pnpm test`
5. Git コミット: コンベンショナルコミット形式で
