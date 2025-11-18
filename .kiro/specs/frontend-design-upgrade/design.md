# フロントエンドデザインアップグレード - 設計書

## 概要

NextMedのフロントエンドを「サイバーメディカル」デザインコンセプトで刷新する。ZK技術とプライバシー保護を視覚的に表現し、未来的で洗練されたユーザー体験を提供する。

## アーキテクチャ

### デザインシステム階層

```
Design System
├── Tokens (色、スペーシング、タイポグラフィ)
├── Primitives (基本コンポーネント)
├── Patterns (複合コンポーネント)
└── Templates (ページレイアウト)
```

### コンポーネント構成

```
components/
├── ui/                    # shadcn/ui基本コンポーネント
├── cyber/                 # サイバーメディカル専用コンポーネント
│   ├── glass-card.tsx
│   ├── neon-button.tsx
│   ├── particle-background.tsx
│   ├── gradient-text.tsx
│   └── cyber-chart.tsx
├── layouts/               # レイアウトコンポーネント
└── features/              # 機能別コンポーネント
```

## コンポーネントとインターフェース

### 1. GlassCard コンポーネント

グラスモーフィズム効果を持つカードコンポーネント

```typescript
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  glow?: boolean;
  hover?: boolean;
}
```

**実装詳細**:
- `backdrop-blur-md` でぼかし効果
- `bg-white/10` で半透明背景
- `border border-white/20` で繊細なボーダー
- `shadow-lg shadow-cyan-500/20` で色付きシャドウ
- ホバー時に `scale-105` と `shadow-xl` でリフトアップ

### 2. NeonButton コンポーネント

ネオングロー効果を持つボタンコンポーネント

```typescript
interface NeonButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  pulse?: boolean;
  onClick?: () => void;
}
```

**実装詳細**:
- `box-shadow` で多層グロー効果
- `animation: pulse` でパルスアニメーション
- ホバー時にグローの強度を増加
- `transition-all duration-300` で滑らかな変化

### 3. ParticleBackground コンポーネント

Canvas APIを使用したパーティクルエフェクト

```typescript
interface ParticleBackgroundProps {
  particleCount?: number;
  particleColor?: string;
  particleSize?: number;
  speed?: number;
  interactive?: boolean;
}
```

**実装詳細**:
- Canvas APIで描画
- `requestAnimationFrame` でアニメーション
- マウス位置に応じてパーティクルが反応
- パフォーマンス最適化のため、パーティクル数を制限

### 4. GradientText コンポーネント

グラデーションテキストエフェクト

```typescript
interface GradientTextProps {
  children: React.ReactNode;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
}
```

**実装詳細**:
- `background-clip: text` でグラデーション適用
- `animate` プロパティで色相回転アニメーション
- `text-transparent` で背景を透過

### 5. CyberChart コンポーネント

Rechartsをラップしたサイバースタイルチャート

```typescript
interface CyberChartProps {
  data: any[];
  type: 'line' | 'bar' | 'area' | 'pie';
  gradient?: boolean;
  glow?: boolean;
}
```

**実装詳細**:
- グラデーション塗りつぶし
- グロー効果のストローク
- アニメーション付きデータ表示
- ダークモード最適化

## データモデル

### カラートークン

```typescript
interface ColorTokens {
  // Primary - 深い青紫
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',  // メイン
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  };
  
  // Secondary - エメラルドグリーン
  secondary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',  // メイン
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  };
  
  // Accent - ネオンシアン
  accent: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',  // メイン
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  };
  
  // Background - 深い紺色
  background: {
    dark: '#0a0e27',
    darker: '#060918',
    card: '#0f1629',
  };
}
```

### スペーシングトークン

```typescript
interface SpacingTokens {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
}
```

### タイポグラフィトークン

```typescript
interface TypographyTokens {
  fontFamily: {
    sans: 'Geist, sans-serif',
    mono: 'Geist Mono, monospace',
  };
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  };
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  };
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  };
}
```

## 正確性プロパティ

*プロパティは、システムのすべての有効な実行において真であるべき特性または動作です。*

### プロパティ1: カラーコントラスト準拠

*すべての*テキストと背景の組み合わせにおいて、カラーコントラスト比はWCAG AA基準（4.5:1以上）を満たす必要がある

**検証**: 要件1.1, 1.2, 1.3, 1.4

### プロパティ2: アニメーションパフォーマンス

*すべての*アニメーションは、CSS transformとopacityのみを使用し、60FPSを維持する必要がある

**検証**: 要件5.1, 5.2, 5.3, 10.1

### プロパティ3: レスポンシブレイアウト

*すべての*画面サイズ（320px〜2560px）において、UIは適切にレイアウトされ、コンテンツが読める必要がある

**検証**: 要件8.1, 8.2, 8.3, 8.4

### プロパティ4: グラスモーフィズム一貫性

*すべての*グラスモーフィズムコンポーネントは、統一されたぼかし強度（backdrop-blur-md）と透明度（bg-white/10）を使用する必要がある

**検証**: 要件6.1, 6.2, 6.3

### プロパティ5: キーボードナビゲーション

*すべての*インタラクティブ要素は、Tabキーでフォーカス可能であり、Enterキーで操作可能である必要がある

**検証**: 要件9.2, 9.3

## エラーハンドリング

### アニメーションエラー

- **prefers-reduced-motion**: ユーザーがモーション削減を設定している場合、アニメーションを無効化
- **パフォーマンス低下**: FPSが30以下になった場合、パーティクル数を自動削減

### レンダリングエラー

- **Canvas未対応**: Canvas APIが使えない場合、静的グラデーション背景にフォールバック
- **画像読み込み失敗**: プレースホルダー画像を表示

### レスポンシブエラー

- **極小画面**: 320px未満の場合、警告メッセージを表示
- **極大画面**: 2560px以上の場合、最大幅を制限

## テスト戦略

### ユニットテスト

- 各コンポーネントの基本的なレンダリング
- プロパティの正しい適用
- イベントハンドラーの動作

### ビジュアルリグレッションテスト

- Storybookでコンポーネントのスナップショット
- 各ブレークポイントでのレイアウト確認
- ダーク/ライトモードの切り替え

### パフォーマンステスト

- Lighthouse スコア 90以上
- FPS 60維持
- バンドルサイズ 500KB以下（gzip後）

### アクセシビリティテスト

- axe-core でWCAG AA準拠確認
- キーボードナビゲーションテスト
- スクリーンリーダーテスト

### プロパティベーステスト

各プロパティに対して、ランダムな入力で検証：

**プロパティ1テスト**: ランダムなカラーペアを生成し、コントラスト比を計算
**プロパティ2テスト**: ランダムなアニメーションを実行し、FPSを測定
**プロパティ3テスト**: ランダムな画面サイズでレンダリングし、レイアウトを検証
**プロパティ4テスト**: ランダムなグラスカードを生成し、スタイルを検証
**プロパティ5テスト**: ランダムな要素をTabキーで巡回し、フォーカス可能性を検証

## 実装計画

### フェーズ1: デザイントークンとユーティリティ

1. カラートークンの定義
2. スペーシングトークンの定義
3. タイポグラフィトークンの定義
4. グローバルCSSの更新

### フェーズ2: 基本コンポーネント

1. GlassCard コンポーネント
2. NeonButton コンポーネント
3. GradientText コンポーネント
4. アニメーションユーティリティ

### フェーズ3: 高度なコンポーネント

1. ParticleBackground コンポーネント
2. CyberChart コンポーネント
3. グラスモーフィズムモーダル
4. サイバーサイドバー

### フェーズ4: ページ刷新

1. ランディングページ
2. ログイン画面
3. 患者ダッシュボード
4. 研究者ダッシュボード
5. 医療機関ダッシュボード

### フェーズ5: 最適化とテスト

1. パフォーマンス最適化
2. アクセシビリティ改善
3. レスポンシブ調整
4. ブラウザ互換性テスト
