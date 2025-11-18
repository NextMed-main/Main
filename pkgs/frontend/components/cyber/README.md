# Cyber Components

サイバーメディカルデザインシステムの専用コンポーネントライブラリ

## コンポーネント一覧

### GlassCard

グラスモーフィズム効果を持つカードコンポーネント

```tsx
import { GlassCard } from "@/components/cyber";

<GlassCard variant="primary" glow hover>
  <h3>カードタイトル</h3>
  <p>カードコンテンツ</p>
</GlassCard>
```

**Props:**
- `variant`: "default" | "primary" | "secondary" | "accent"
- `glow`: boolean - グロー効果の有効化
- `hover`: boolean - ホバーエフェクトの有効化

### NeonButton

ネオングロー効果を持つボタンコンポーネント

```tsx
import { NeonButton } from "@/components/cyber";

<NeonButton variant="primary" size="md" glow pulse>
  クリック
</NeonButton>
```

**Props:**
- `variant`: "primary" | "secondary" | "accent"
- `size`: "sm" | "md" | "lg"
- `glow`: boolean - グロー効果の強化
- `pulse`: boolean - パルスアニメーションの有効化

### GradientText

グラデーションテキストエフェクトを持つコンポーネント

```tsx
import { GradientText } from "@/components/cyber";

<GradientText gradient="default" animate as="h1">
  グラデーションテキスト
</GradientText>
```

**Props:**
- `gradient`: "default" | "primary" | "secondary" | "accent" | "rainbow" | "sunset"
- `animate`: boolean - グラデーションアニメーションの有効化
- `as`: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" - レンダリングするHTML要素

**グラデーションバリアント:**
- `default`: 青紫 → シアン → エメラルドグリーン（デフォルト）
- `primary`: 青紫のグラデーション
- `secondary`: エメラルドグリーンのグラデーション
- `accent`: シアンのグラデーション
- `rainbow`: レインボーグラデーション（青紫 → 紫 → ピンク → シアン）
- `sunset`: サンセットグラデーション（オレンジ → ピンク → 紫）

### ParticleBackground

Canvas APIを使用した動的パーティクルエフェクト背景

```tsx
import { ParticleBackground } from "@/components/cyber";

<div className="relative">
  <ParticleBackground
    particleCount={50}
    particleColor="#06b6d4"
    particleSize={2}
    speed={0.5}
    interactive={true}
  />
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</div>
```

**Props:**
- `particleCount`: number - パーティクルの数（デフォルト: 50）
- `particleColor`: string - パーティクルの色（デフォルト: "#06b6d4"）
- `particleSize`: number - パーティクルのサイズ（デフォルト: 2）
- `speed`: number - パーティクルの速度（デフォルト: 0.5）
- `interactive`: boolean - マウスインタラクションの有効化（デフォルト: true）

**特徴:**
- Canvas APIによる高パフォーマンスレンダリング
- requestAnimationFrameによる最適化されたアニメーション
- マウス位置に反応するインタラクティブエフェクト
- 滑らかなフェードイン/アウト効果
- レスポンシブ対応（ウィンドウリサイズに自動対応）
- prefers-reduced-motion対応

### GlassModal

グラスモーフィズム効果を持つモーダルコンポーネント

```tsx
import {
  GlassModal,
  GlassModalTrigger,
  GlassModalContent,
  GlassModalHeader,
  GlassModalTitle,
  GlassModalDescription,
  GlassModalFooter,
} from "@/components/cyber";
import { NeonButton } from "@/components/cyber";

<GlassModal>
  <GlassModalTrigger asChild>
    <NeonButton variant="primary">モーダルを開く</NeonButton>
  </GlassModalTrigger>
  <GlassModalContent variant="primary" glow>
    <GlassModalHeader>
      <GlassModalTitle>モーダルタイトル</GlassModalTitle>
      <GlassModalDescription>
        モーダルの説明文がここに入ります。
      </GlassModalDescription>
    </GlassModalHeader>
    <div className="py-4">
      {/* モーダルコンテンツ */}
    </div>
    <GlassModalFooter>
      <NeonButton variant="secondary" size="sm">キャンセル</NeonButton>
      <NeonButton variant="primary" size="sm">確認</NeonButton>
    </GlassModalFooter>
  </GlassModalContent>
</GlassModal>
```

**Props (GlassModalContent):**
- `variant`: "default" | "primary" | "secondary" | "accent" - カラーバリアント
- `glow`: boolean - グロー効果の有効化
- `showCloseButton`: boolean - 閉じるボタンの表示（デフォルト: true）

**コンポーネント:**
- `GlassModal`: モーダルのルートコンポーネント
- `GlassModalTrigger`: モーダルを開くトリガー
- `GlassModalContent`: モーダルのコンテンツコンテナ
- `GlassModalHeader`: ヘッダーセクション
- `GlassModalTitle`: タイトル
- `GlassModalDescription`: 説明文
- `GlassModalFooter`: フッターセクション（アクションボタン用）
- `GlassModalClose`: 閉じるボタン（カスタム用）
- `GlassModalOverlay`: オーバーレイ（カスタム用）
- `GlassModalPortal`: ポータル（カスタム用）

**特徴:**
- グラスモーフィズムオーバーレイ（backdrop-blur-sm + bg-black/50）
- スケールアップ + フェードインアニメーション
- 統一されたぼかし効果（backdrop-blur-md）と透明度（bg-white/10）
- カラーバリアント対応（default, primary, secondary, accent）
- キーボードナビゲーション対応（Escape キーで閉じる）
- フォーカストラップ（モーダル内でフォーカスが循環）
- アクセシビリティ対応（ARIA属性、スクリーンリーダー対応）

### CyberChart

Rechartsをラップしたサイバーメディカルスタイルのチャートコンポーネント

```tsx
import { CyberChart } from "@/components/cyber";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
];

<CyberChart
  data={data}
  type="line"
  dataKey="value"
  xAxisKey="name"
  gradient={true}
  glow={true}
  height={300}
/>
```

**Props:**
- `data`: ChartDataPoint[] - チャートデータ（必須）
- `type`: "line" | "bar" | "area" | "pie" - チャートタイプ（デフォルト: "line"）
- `dataKey`: string - データのキー（デフォルト: "value"）
- `xAxisKey`: string - X軸のキー（デフォルト: "name"）
- `gradient`: boolean - グラデーション塗りつぶしの有効化（デフォルト: true）
- `glow`: boolean - グロー効果の有効化（デフォルト: true）
- `height`: number - チャートの高さ（デフォルト: 300）
- `colors`: object - カスタムカラーパレット
  - `primary`: string - プライマリカラー（デフォルト: "#6366f1"）
  - `secondary`: string - セカンダリカラー（デフォルト: "#10b981"）
  - `accent`: string - アクセントカラー（デフォルト: "#06b6d4"）
- `showGrid`: boolean - グリッド線の表示（デフォルト: true）
- `showLegend`: boolean - 凡例の表示（デフォルト: false）
- `showTooltip`: boolean - ツールチップの表示（デフォルト: true）
- `animate`: boolean - アニメーションの有効化（デフォルト: true）

**チャートタイプ:**
- `line`: 折れ線グラフ - トレンドの可視化に最適
- `bar`: 棒グラフ - カテゴリ別の比較に最適
- `area`: エリアチャート - 累積データの可視化に最適
- `pie`: 円グラフ - 割合の可視化に最適

**特徴:**
- グラデーション塗りつぶしによる美しいビジュアル
- SVGフィルターによるグロー効果
- カスタマイズ可能なカラーパレット
- グラスモーフィズムスタイルのツールチップ
- レスポンシブ対応（ResponsiveContainer使用）
- prefers-reduced-motion対応

## アクセシビリティ

すべてのコンポーネントは `prefers-reduced-motion` メディアクエリに対応しており、ユーザーがモーション削減を設定している場合、アニメーションは自動的に無効化されます。

## デモ

各コンポーネントのデモページが用意されています：

- `glass-card-demo.tsx`
- `neon-button-demo.tsx`
- `gradient-text-demo.tsx`
- `particle-background-demo.tsx`
- `cyber-chart-demo.tsx`
- `glass-modal-demo.tsx`

## 要件対応

- **GlassCard**: 要件 6.1-6.5（グラスモーフィズムコンポーネント）
- **NeonButton**: 要件 2.5, 5.2（ネオングロー効果とパルスアニメーション）
- **GradientText**: 要件 4.3（グラデーションテキストエフェクト）
- **ParticleBackground**: 要件 7.1-7.5（パーティクルエフェクト）
- **CyberChart**: 要件 3.2（データチャートにグラデーション付きチャートを表示）
- **GlassModal**: 要件 5.3, 6.1（モーダルのスケールアップアニメーション、グラスモーフィズム）
