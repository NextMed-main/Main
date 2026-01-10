/**
 * アニメーションユーティリティ
 * 
 * サイバーメディカルデザインのためのアニメーションヘルパー関数
 * 要件: 5.1, 5.2, 5.3, 9.4
 */

/**
 * prefers-reduced-motionメディアクエリをチェック
 * アクセシビリティ要件 9.4 に対応
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * アニメーション設定の型定義
 */
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  respectMotionPreference?: boolean;
}

/**
 * デフォルトのアニメーション設定
 */
const DEFAULT_CONFIG: Required<AnimationConfig> = {
  duration: 300,
  delay: 0,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  respectMotionPreference: true,
};

/**
 * アニメーション設定をマージ
 */
const mergeConfig = (config?: AnimationConfig): Required<AnimationConfig> => {
  return { ...DEFAULT_CONFIG, ...config };
};

/**
 * アニメーションを実行すべきかチェック
 */
const shouldAnimate = (respectMotionPreference: boolean): boolean => {
  if (!respectMotionPreference) return true;
  return !prefersReducedMotion();
};

/**
 * パルスアニメーション
 * 要件 5.2: ボタンホバー時のスケール変化とグロー効果
 * 
 * @example
 * ```tsx
 * <div className={pulseAnimation()}>Content</div>
 * ```
 */
export const pulseAnimation = (config?: AnimationConfig): string => {
  const cfg = mergeConfig(config);
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return '';
  }

  return `animate-pulse`;
};

/**
 * カスタムパルスアニメーションのスタイル生成
 */
export const customPulse = (config?: AnimationConfig): React.CSSProperties => {
  const cfg = mergeConfig(config);
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return {};
  }

  return {
    animation: `pulse ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms infinite`,
  };
};

/**
 * グローアニメーション
 * 要件 5.2: ネオングロー効果
 * 
 * @example
 * ```tsx
 * <button style={glowAnimation({ color: '#06b6d4' })}>Click me</button>
 * ```
 */
export interface GlowConfig extends AnimationConfig {
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const glowAnimation = (config?: GlowConfig): React.CSSProperties => {
  const cfg = { ...mergeConfig(config), color: config?.color || '#06b6d4', intensity: config?.intensity || 'medium' };
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return {};
  }

  const intensityMap = {
    low: '0 0 10px',
    medium: '0 0 20px',
    high: '0 0 30px',
  };

  const shadowIntensity = intensityMap[cfg.intensity];

  return {
    boxShadow: `${shadowIntensity} ${cfg.color}`,
    transition: `box-shadow ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms`,
  };
};

/**
 * フェードインアニメーション
 * 要件 5.1: ページ遷移時のフェードイン
 * 要件 3.5: データ更新時のフェードイン/アウト
 * 
 * @example
 * ```tsx
 * <div className={fadeIn()}>Content</div>
 * ```
 */
export const fadeIn = (config?: AnimationConfig): string => {
  const cfg = mergeConfig(config);
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return 'opacity-100';
  }

  return `animate-in fade-in duration-${cfg.duration}`;
};

/**
 * フェードアウトアニメーション
 */
export const fadeOut = (config?: AnimationConfig): string => {
  const cfg = mergeConfig(config);
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return 'opacity-0';
  }

  return `animate-out fade-out duration-${cfg.duration}`;
};

/**
 * カスタムフェードアニメーションのスタイル生成
 */
export const customFade = (
  direction: 'in' | 'out',
  config?: AnimationConfig
): React.CSSProperties => {
  const cfg = mergeConfig(config);
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return { opacity: direction === 'in' ? 1 : 0 };
  }

  return {
    opacity: direction === 'in' ? 1 : 0,
    transition: `opacity ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms`,
  };
};

/**
 * スライドインアニメーション
 * 要件 5.1: ページ遷移時のスライドイン
 * 
 * @example
 * ```tsx
 * <div className={slideIn('left')}>Content</div>
 * ```
 */
export type SlideDirection = 'left' | 'right' | 'top' | 'bottom';

export const slideIn = (
  direction: SlideDirection = 'bottom',
  config?: AnimationConfig
): string => {
  const cfg = mergeConfig(config);
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return '';
  }

  const directionMap = {
    left: 'slide-in-from-left',
    right: 'slide-in-from-right',
    top: 'slide-in-from-top',
    bottom: 'slide-in-from-bottom',
  };

  return `animate-in ${directionMap[direction]} duration-${cfg.duration}`;
};

/**
 * カスタムスライドアニメーションのスタイル生成
 */
export const customSlide = (
  direction: SlideDirection,
  config?: AnimationConfig
): React.CSSProperties => {
  const cfg = mergeConfig(config);
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return {};
  }

  const transformMap = {
    left: 'translateX(-100%)',
    right: 'translateX(100%)',
    top: 'translateY(-100%)',
    bottom: 'translateY(100%)',
  };

  return {
    transform: 'translateX(0) translateY(0)',
    transition: `transform ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms`,
  };
};

/**
 * スケールアニメーション
 * 要件 5.2: ボタンホバー時のスケール変化
 * 要件 5.3: モーダル開閉時のスケールアップ
 * 
 * @example
 * ```tsx
 * <div style={scaleAnimation(1.05)}>Hover me</div>
 * ```
 */
export const scaleAnimation = (
  scale: number = 1.05,
  config?: AnimationConfig
): React.CSSProperties => {
  const cfg = mergeConfig(config);
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return {};
  }

  return {
    transform: `scale(${scale})`,
    transition: `transform ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms`,
  };
};

/**
 * シェイクアニメーション
 * 要件 5.5: エラー発生時のシェイクアニメーション
 * 
 * @example
 * ```tsx
 * <div className={shakeAnimation()}>Error message</div>
 * ```
 */
export const shakeAnimation = (config?: AnimationConfig): string => {
  const cfg = mergeConfig(config);
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return '';
  }

  return `animate-shake`;
};

/**
 * カスタムシェイクアニメーションのスタイル生成
 */
export const customShake = (config?: AnimationConfig): React.CSSProperties => {
  const cfg = mergeConfig(config);
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return {};
  }

  return {
    animation: `shake ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms`,
  };
};

/**
 * シマーエフェクト（スケルトンローディング用）
 * 要件 5.4: データロード時のシマーエフェクト
 * 
 * @example
 * ```tsx
 * <div className={shimmerAnimation()}>Loading...</div>
 * ```
 */
export const shimmerAnimation = (config?: AnimationConfig): string => {
  const cfg = mergeConfig(config);
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return 'bg-gray-200';
  }

  return `animate-shimmer`;
};

/**
 * 複合アニメーション: フェードイン + スライドイン
 * 要件 5.1: ページ遷移時の複合アニメーション
 */
export const fadeSlideIn = (
  direction: SlideDirection = 'bottom',
  config?: AnimationConfig
): string => {
  const cfg = mergeConfig(config);
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return '';
  }

  return `${fadeIn(config)} ${slideIn(direction, config)}`;
};

/**
 * 複合アニメーション: スケール + フェードイン
 * 要件 5.3: モーダル開閉時の複合アニメーション
 */
export const scaleFadeIn 
= (config?: AnimationConfig): string => {
  const cfg = mergeConfig(config);
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return '';
  }

  return `${fadeIn(config)} animate-in zoom-in-95`;
};

/**
 * カスタム複合アニメーション: スケール + フェード
 */
export const customScaleFade = (
  direction: 'in' | 'out',
  config?: AnimationConfig
): React.CSSProperties => {
  const cfg = mergeConfig(config);
  
  if (!shouldAnimate(cfg.respectMotionPreference)) {
    return {
      opacity: direction === 'in' ? 1 : 0,
      transform: direction === 'in' ? 'scale(1)' : 'scale(0.95)',
    };
  }

  return {
    opacity: direction === 'in' ? 1 : 0,
    transform: direction === 'in' ? 'scale(1)' : 'scale(0.95)',
    transition: `opacity ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms, transform ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms`,
  };
};

/**
 * ホバーエフェクト用のトランジション設定
 * 要件 5.2: ボタンホバー時のスケール変化とグロー効果
 */
export const hoverTransition = (config?: AnimationConfig): React.CSSProperties => {
  const cfg = mergeConfig(config);
  
  return {
    transition: `all ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms`,
  };
};

/**
 * スムーズなトランジション設定
 * 要件 3.5, 8.4: データ更新時やレイアウト変化時のスムーズな遷移
 */
export const smoothTransition = (
  properties: string[] = ['all'],
  config?: AnimationConfig
): React.CSSProperties => {
  const cfg = mergeConfig(config);
  
  const transitionString = properties
    .map(prop => `${prop} ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms`)
    .join(', ');

  return {
    transition: transitionString,
  };
};

/**
 * カウントアップアニメーション用のフック型ヘルパー
 * 要件 3.3: 統計カード表示時の数値変化アニメーション
 * 
 * @param target - 目標値
 * @param duration - アニメーション時間（ミリ秒）
 * @returns アニメーション用の設定オブジェクト
 */
export interface CountUpConfig {
  start?: number;
  end: number;
  duration?: number;
  easing?: (t: number) => number;
}

/**
 * イージング関数
 */
export const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
};

/**
 * カウントアップアニメーションの計算
 */
export const calculateCountUp = (
  config: CountUpConfig,
  progress: number
): number => {
  const { start = 0, end, easing = easingFunctions.easeOutCubic } = config;
  const easedProgress = easing(progress);
  return Math.round(start + (end - start) * easedProgress);
};

/**
 * Tailwind CSS アニメーションクラス名の生成
 */
export const animationClasses = {
  /**
   * フェードイン
   */
  fadeIn: (duration: number = 300) => `animate-in fade-in duration-${duration}`,
  
  /**
   * フェードアウト
   */
  fadeOut: (duration: number = 300) => `animate-out fade-out duration-${duration}`,
  
  /**
   * スライドイン（下から）
   */
  slideInFromBottom: (duration: number = 300) =>
    `animate-in slide-in-from-bottom duration-${duration}`,
  
  /**
   * スライドイン（上から）
   */
  slideInFromTop: (duration: number = 300) =>
    `animate-in slide-in-from-top duration-${duration}`,
  
  /**
   * スライドイン（左から）
   */
  slideInFromLeft: (duration: number = 300) =>
    `animate-in slide-in-from-left duration-${duration}`,
  
  /**
   * スライドイン（右から）
   */
  slideInFromRight: (duration: number = 300) =>
    `animate-in slide-in-from-right duration-${duration}`,
  
  /**
   * ズームイン
   */
  zoomIn: (duration: number = 300) => `animate-in zoom-in-95 duration-${duration}`,
  
  /**
   * ズームアウト
   */
  zoomOut: (duration: number = 300) => `animate-out zoom-out-95 duration-${duration}`,
  
  /**
   * スピン（ローディング用）
   */
  spin: () => `animate-spin`,
  
  /**
   * パルス
   */
  pulse: () => `animate-pulse`,
  
  /**
   * バウンス
   */
  bounce: () => `animate-bounce`,
};

/**
 * モーダル開閉アニメーション
 * 要件 5.3: モーダル開閉時のスケールアップとフェードイン
 */
export const modalAnimation = {
  enter: (config?: AnimationConfig): string => {
    const cfg = mergeConfig(config);
    
    if (!shouldAnimate(cfg.respectMotionPreference)) {
      return '';
    }
    
    return `animate-in fade-in zoom-in-95 duration-${cfg.duration}`;
  },
  
  exit: (config?: AnimationConfig): string => {
    const cfg = mergeConfig(config);
    
    if (!shouldAnimate(cfg.respectMotionPreference)) {
      return '';
    }
    
    return `animate-out fade-out zoom-out-95 duration-${cfg.duration}`;
  },
};

/**
 * スケルトンローディングアニメーション
 * 要件 5.4: データロード時のスケルトンローディング
 */
export const skeletonAnimation = (): string => {
  if (prefersReducedMotion()) {
    return 'bg-muted';
  }
  
  return 'animate-pulse bg-muted';
};

/**
 * カスタムキーフレームアニメーションの生成
 */
export const createKeyframeAnimation = (
  name: string,
  keyframes: Record<string, React.CSSProperties>
): string => {
  const keyframeString = Object.entries(keyframes)
    .map(([key, styles]) => {
      const styleString = Object.entries(styles)
        .map(([prop, value]) => `${prop}: ${value};`)
        .join(' ');
      return `${key} { ${styleString} }`;
    })
    .join(' ');

  return `@keyframes ${name} { ${keyframeString} }`;
};

/**
 * トランジション遅延のユーティリティ
 */
export const staggerDelay = (index: number, baseDelay: number = 50): number => {
  return index * baseDelay;
};

/**
 * アニメーション遅延クラスの生成
 */
export const delayClass = (delay: number): string => {
  return `delay-${delay}`;
};

/**
 * パフォーマンス最適化されたアニメーション設定
 * 要件 10.1: CSS transformとopacityのみを使用
 */
export const performantAnimation = (
  config?: AnimationConfig
): React.CSSProperties => {
  const cfg = mergeConfig(config);
  
  return {
    willChange: 'transform, opacity',
    transition: `transform ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms, opacity ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms`,
  };
};

/**
 * グローバルアニメーション設定のCSS変数
 */
export const animationCSSVariables = {
  '--animation-duration-fast': '150ms',
  '--animation-duration-normal': '300ms',
  '--animation-duration-slow': '500ms',
  '--animation-easing-default': 'cubic-bezier(0.4, 0, 0.2, 1)',
  '--animation-easing-in': 'cubic-bezier(0.4, 0, 1, 1)',
  '--animation-easing-out': 'cubic-bezier(0, 0, 0.2, 1)',
  '--animation-easing-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
};
