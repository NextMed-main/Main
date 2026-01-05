# NextMed 推奨コマンド

## パッケージ別実行コマンド

### 共通
```bash
pnpm format              # 全体のコードフォーマット (Biome)
```

### Contract パッケージ (`pkgs/contract`)
```bash
cd pkgs/contract
pnpm compact             # patient-registry.compact のコンパイル
pnpm build               # ビルド (Compactコンパイル + TSビルド)
pnpm test                # Vitestによるテスト実行
```

### CLI パッケージ (`pkgs/cli`)
```bash
cd pkgs/cli
pnpm deploy:patient-registry    # 患者レジストリをデプロイ
pnpm register:patient           # 患者を新しく登録
pnpm stats:patient-registry    # 登録済み統計を取得
pnpm verify:patient-registry    # コントラクトの検証
pnpm standalone                 # Docker Compose環境で実行
pnpm test-api                   # スタンドアロン環境でのAPIテスト
```

### Frontend パッケージ (`pkgs/frontend`)
```bash
cd pkgs/frontend
pnpm dev                 # 開発サーバー起動 (http://localhost:3000)
pnpm build               # プロダクションビルド
```

## AIエージェント用フロー
1. 作業開始前にプロジェクトをアクティベート (`mcp_serena_activate_project`)
2. 実装前に `AGENTS.md` を確認
3. コード変更後は `pnpm format` を実行
4. 最終的に `pnpm test` で品質を確認
