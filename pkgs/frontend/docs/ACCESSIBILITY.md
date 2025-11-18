# アクセシビリティガイドライン

このドキュメントは、NextMedフロントエンドのアクセシビリティ実装について説明します。

## 概要

NextMedは、すべてのユーザーがアクセス可能なUIを提供することを目指しています。WCAG 2.1 AA基準に準拠し、以下の要件を満たしています：

- **要件 9.1**: カラーコントラストをWCAG AA基準（4.5:1以上）に調整
- **要件 9.2**: キーボードナビゲーションをサポート
- **要件 9.3**: 明確なフォーカスリングを表示
- **要件 9.4**: prefers-reduced-motionを尊重
- **要件 9.5**: 適切なARIAラベルとalt属性を設定

## 実装された機能

### 1. カラーコントラスト（要件 9.1）

すべてのテキストと背景の組み合わせは、WCAG AA基準（4.5:1以上）を満たしています。

#### 実装箇所
- `pkgs/frontend/app/globals.css`: テキストカラーの調整
  - `.text-slate-400`: より明るいグレー（rgb(156 163 175)）
  - `.text-slate-300`: より明るいグレー（rgb(203 213 225)）
  - 小さいテキスト（`.text-xs`, `.text-sm`）: より明るい色（rgb(226 232 240)）

#### ユーティリティ関数
- `lib/accessibility.ts`: `calculateContrastRatio()` - コントラスト比を計算
- `lib/accessibility.ts`: `meetsWCAGAA()` - WCAG AA基準を満たしているかチェック

#### 使用例
```typescript
import { calculateContrastRatio, meetsWCAGAA } from "@/lib/accessibility";

const ratio = calculateContrastRatio("#ffffff", "#0a0e27");
const isAccessible = meetsWCAGAA(ratio); // true if ratio >= 4.5
```

### 2. キーボードナビゲーション（要件 9.2）

すべてのインタラクティブ要素は、Tabキーでフォーカス可能であり、EnterキーまたはSpaceキーで操作可能です。

#### 実装箇所
- `components/cyber/glass-card.tsx`: `interactive` propでキーボード操作をサポート
- `components/cyber/neon-button.tsx`: 標準のボタン要素を使用（自動的にキーボード対応）
- `components/landing-page.tsx`: スキップリンクを追加

#### スキップリンク
ページの先頭に「Skip to main content」リンクを配置し、キーボードユーザーがメインコンテンツに直接ジャンプできるようにしています。

```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

#### GlassCardのキーボード対応
```tsx
<GlassCard 
  interactive 
  onClick={handleClick}
  aria-label="Feature card"
>
  {/* content */}
</GlassCard>
```

### 3. フォーカスリング（要件 9.3）

明確なフォーカスリングをすべてのインタラクティブ要素に表示します。

#### 実装箇所
- `pkgs/frontend/app/globals.css`: フォーカススタイルの定義

#### スタイル
```css
/* すべてのインタラクティブ要素 */
*:focus-visible {
  outline: 3px solid rgb(var(--accent-500));
  outline-offset: 2px;
  border-radius: 4px;
}

/* ボタンとリンク */
button:focus-visible,
a:focus-visible {
  outline: 3px solid rgb(var(--accent-500));
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(var(--accent-500), 0.2);
}

/* インプット要素 */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid rgb(var(--primary-500));
  outline-offset: 1px;
  border-color: rgb(var(--primary-500));
}
```

### 4. モーション削減（要件 9.4）

`prefers-reduced-motion`メディアクエリを尊重し、ユーザーがモーション削減を設定している場合はアニメーションを無効化します。

#### 実装箇所
- `components/cyber/neon-button.tsx`: パルスアニメーションの制御
- `components/cyber/gradient-text.tsx`: グラデーションアニメーションの制御
- `components/cyber/particle-background.tsx`: パーティクルアニメーションの制御

#### 実装例
```typescript
const [shouldAnimate, setShouldAnimate] = useState(true);

useEffect(() => {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  setShouldAnimate(!mediaQuery.matches);

  const handleChange = (e: MediaQueryListEvent) => {
    setShouldAnimate(!e.matches);
  };

  mediaQuery.addEventListener("change", handleChange);
  return () => mediaQuery.removeEventListener("change", handleChange);
}, []);
```

### 5. ARIAラベルとセマンティックHTML（要件 9.5）

適切なARIA属性とセマンティックHTMLを使用して、スクリーンリーダーのサポートを強化しています。

#### 実装箇所
- `components/landing-page.tsx`: 
  - `role="banner"` - ヘッダー
  - `role="main"` - メインコンテンツ
  - `role="contentinfo"` - フッター
  - `aria-label` - ボタンとリンク
  - `aria-labelledby` - セクションとカード
  - `aria-hidden="true"` - 装飾的なアイコン

#### セマンティックHTML
```tsx
<header role="banner">
  {/* ヘッダーコンテンツ */}
</header>

<main id="main-content" role="main">
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">Medical Data Platform</h1>
  </section>
</main>

<footer role="contentinfo">
  {/* フッターコンテンツ */}
</footer>
```

#### ARIAラベル
```tsx
<NeonButton 
  onClick={onGetStarted}
  aria-label="Get started with NextMed platform"
>
  Get Started
  <ArrowRight aria-hidden="true" />
</NeonButton>
```

## ユーティリティクラス

### スクリーンリーダー専用テキスト

視覚的には非表示だが、スクリーンリーダーには読み上げられるテキスト用のクラス：

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

使用例：
```tsx
<h2 className="sr-only">Platform Features</h2>
```

### フォーカス時に表示

```css
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  /* ... */
}
```

## テスト

### 手動テスト

1. **キーボードナビゲーション**
   - Tabキーですべてのインタラクティブ要素にフォーカスできることを確認
   - EnterキーまたはSpaceキーで要素を操作できることを確認
   - フォーカスリングが明確に表示されることを確認

2. **スクリーンリーダー**
   - NVDA（Windows）またはVoiceOver（macOS）でページを読み上げ
   - すべてのコンテンツが適切に読み上げられることを確認
   - ARIAラベルが正しく機能することを確認

3. **カラーコントラスト**
   - ブラウザの開発者ツールでコントラスト比を確認
   - すべてのテキストが4.5:1以上のコントラスト比を持つことを確認

4. **モーション削減**
   - OSの設定で「モーションを減らす」を有効化
   - アニメーションが無効化されることを確認

### 自動テスト

#### axe-core（推奨）

```bash
npm install --save-dev @axe-core/react
```

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<LandingPage onGetStarted={() => {}} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### Lighthouse

```bash
npm install --save-dev lighthouse
```

Lighthouseを実行してアクセシビリティスコアを確認：
```bash
lighthouse http://localhost:3000 --only-categories=accessibility
```

## ベストプラクティス

### 1. セマンティックHTML

常に適切なHTML要素を使用：
- `<button>` - クリック可能な要素
- `<a>` - リンク
- `<nav>` - ナビゲーション
- `<main>` - メインコンテンツ
- `<header>` - ヘッダー
- `<footer>` - フッター
- `<article>` - 独立したコンテンツ
- `<section>` - セクション

### 2. ARIAの使用

ARIAは最後の手段として使用：
1. セマンティックHTMLで解決できないか確認
2. 必要な場合のみARIA属性を追加
3. `aria-label`、`aria-labelledby`、`aria-describedby`を適切に使用

### 3. フォーカス管理

- モーダルを開いたときは、モーダル内の最初の要素にフォーカス
- モーダルを閉じたときは、元の要素にフォーカスを戻す
- フォーカストラップを実装（モーダル内でTabキーを押したときに外に出ない）

### 4. エラーメッセージ

- エラーメッセージは明確で具体的に
- `aria-live`を使用してスクリーンリーダーに通知
- エラーが発生したフィールドにフォーカスを移動

### 5. 画像とアイコン

- すべての画像に`alt`属性を設定
- 装飾的な画像は`alt=""`または`aria-hidden="true"`
- アイコンのみのボタンには`aria-label`を設定

## リソース

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

## 今後の改善

- [ ] フォーカストラップの実装（モーダル用）
- [ ] キーボードショートカットの追加
- [ ] より詳細なARIAライブリージョンの実装
- [ ] 高コントラストモードのサポート
- [ ] テキストサイズ変更のサポート（200%まで）
