/**
 * アクセシビリティユーティリティ関数
 * 要件 9: アクセシビリティ
 */

/**
 * カラーコントラスト比を計算する
 * WCAG AA基準: 4.5:1以上（通常テキスト）、3:1以上（大きいテキスト）
 * 要件 9.1: カラーコントラストをWCAG AA基準に調整
 *
 * @param foreground - 前景色（RGB形式: "rgb(255, 255, 255)" または "#ffffff"）
 * @param background - 背景色（RGB形式: "rgb(0, 0, 0)" または "#000000"）
 * @returns コントラスト比（1-21の範囲）
 */
export function calculateContrastRatio(
  foreground: string,
  background: string,
): number {
  const fgLuminance = getRelativeLuminance(foreground);
  const bgLuminance = getRelativeLuminance(background);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 相対輝度を計算する
 * @param color - 色（RGB形式: "rgb(255, 255, 255)" または "#ffffff"）
 * @returns 相対輝度（0-1の範囲）
 */
function getRelativeLuminance(color: string): number {
  const rgb = parseColor(color);
  const [r, g, b] = rgb.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * 色文字列をRGB配列に変換する
 * @param color - 色（RGB形式: "rgb(255, 255, 255)" または "#ffffff"）
 * @returns RGB配列 [r, g, b]
 */
function parseColor(color: string): [number, number, number] {
  // RGB形式: "rgb(255, 255, 255)"
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return [
      Number.parseInt(rgbMatch[1], 10),
      Number.parseInt(rgbMatch[2], 10),
      Number.parseInt(rgbMatch[3], 10),
    ];
  }

  // HEX形式: "#ffffff" または "#fff"
  const hex = color.replace("#", "");
  if (hex.length === 3) {
    return [
      Number.parseInt(hex[0] + hex[0], 16),
      Number.parseInt(hex[1] + hex[1], 16),
      Number.parseInt(hex[2] + hex[2], 16),
    ];
  }
  if (hex.length === 6) {
    return [
      Number.parseInt(hex.substring(0, 2), 16),
      Number.parseInt(hex.substring(2, 4), 16),
      Number.parseInt(hex.substring(4, 6), 16),
    ];
  }

  // デフォルト: 黒
  return [0, 0, 0];
}

/**
 * WCAG AA基準を満たしているかチェックする
 * @param contrastRatio - コントラスト比
 * @param isLargeText - 大きいテキストかどうか（18pt以上または14pt太字以上）
 * @returns WCAG AA基準を満たしているか
 */
export function meetsWCAGAA(
  contrastRatio: number,
  isLargeText = false,
): boolean {
  return isLargeText ? contrastRatio >= 3 : contrastRatio >= 4.5;
}

/**
 * WCAG AAA基準を満たしているかチェックする
 * @param contrastRatio - コントラスト比
 * @param isLargeText - 大きいテキストかどうか（18pt以上または14pt太字以上）
 * @returns WCAG AAA基準を満たしているか
 */
export function meetsWCAGAAA(
  contrastRatio: number,
  isLargeText = false,
): boolean {
  return isLargeText ? contrastRatio >= 4.5 : contrastRatio >= 7;
}

/**
 * prefers-reduced-motionメディアクエリをチェックする
 * 要件 9.4: prefers-reduced-motionを尊重
 *
 * @returns ユーザーがモーション削減を設定しているか
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * キーボードイベントがEnterまたはSpaceキーかチェックする
 * 要件 9.2: キーボードナビゲーションをサポート
 *
 * @param event - キーボードイベント
 * @returns EnterまたはSpaceキーが押されたか
 */
export function isActivationKey(
  event: React.KeyboardEvent | KeyboardEvent,
): boolean {
  return event.key === "Enter" || event.key === " ";
}

/**
 * 要素にフォーカスを設定する（アクセシビリティ対応）
 * @param element - フォーカスを設定する要素
 * @param options - フォーカスオプション
 */
export function setFocus(
  element: HTMLElement | null,
  options?: FocusOptions,
): void {
  if (!element) return;
  element.focus(options);
}

/**
 * スクリーンリーダー用のライブリージョンを作成する
 * @param message - アナウンスするメッセージ
 * @param priority - 優先度（"polite" または "assertive"）
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite",
): void {
  if (typeof document === "undefined") return;

  const liveRegion = document.createElement("div");
  liveRegion.setAttribute("role", "status");
  liveRegion.setAttribute("aria-live", priority);
  liveRegion.setAttribute("aria-atomic", "true");
  liveRegion.className = "sr-only";
  liveRegion.textContent = message;

  document.body.appendChild(liveRegion);

  // 3秒後に削除
  setTimeout(() => {
    document.body.removeChild(liveRegion);
  }, 3000);
}

/**
 * 要素がキーボードでフォーカス可能かチェックする
 * @param element - チェックする要素
 * @returns フォーカス可能か
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.hasAttribute("disabled")) return false;
  if (element.hasAttribute("aria-disabled")) return false;
  if (element.tabIndex < 0) return false;

  const tagName = element.tagName.toLowerCase();
  const focusableTags = ["a", "button", "input", "select", "textarea"];

  return (
    focusableTags.includes(tagName) ||
    element.tabIndex >= 0 ||
    element.hasAttribute("contenteditable")
  );
}

/**
 * 次のフォーカス可能な要素を取得する
 * @param currentElement - 現在の要素
 * @param reverse - 逆方向に検索するか
 * @returns 次のフォーカス可能な要素
 */
export function getNextFocusableElement(
  currentElement: HTMLElement,
  reverse = false,
): HTMLElement | null {
  const focusableElements = Array.from(
    document.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );

  const currentIndex = focusableElements.indexOf(currentElement);
  if (currentIndex === -1) return null;

  const nextIndex = reverse ? currentIndex - 1 : currentIndex + 1;
  return focusableElements[nextIndex] || null;
}
