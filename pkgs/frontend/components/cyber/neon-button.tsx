"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

/**
 * NeonButton コンポーネント
 * 
 * ネオングロー効果を持つボタンコンポーネント
 * 要件: 2.5 (CTAボタンにネオングロー効果とパルスアニメーション)
 * 要件: 5.2 (ボタンホバー時のスケール変化とグロー効果)
 */

const neonButtonVariants = cva(
	"relative inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				primary: [
					"bg-indigo-600",
					"text-white",
					"border border-indigo-400",
					"shadow-lg shadow-indigo-500/50",
					"hover:bg-indigo-500",
					"hover:shadow-xl hover:shadow-indigo-500/60",
					"hover:scale-105",
					"focus-visible:ring-indigo-500",
				],
				secondary: [
					"bg-emerald-600",
					"text-white",
					"border border-emerald-400",
					"shadow-lg shadow-emerald-500/50",
					"hover:bg-emerald-500",
					"hover:shadow-xl hover:shadow-emerald-500/60",
					"hover:scale-105",
					"focus-visible:ring-emerald-500",
				],
				accent: [
					"bg-cyan-600",
					"text-white",
					"border border-cyan-400",
					"shadow-lg shadow-cyan-500/50",
					"hover:bg-cyan-500",
					"hover:shadow-xl hover:shadow-cyan-500/60",
					"hover:scale-105",
					"focus-visible:ring-cyan-500",
				],
			},
			size: {
				sm: "h-9 px-4 text-sm",
				md: "h-11 px-6 text-base",
				lg: "h-14 px-8 text-lg",
			},
			glow: {
				true: "",
				false: "",
			},
			pulse: {
				true: "animate-pulse",
				false: "",
			},
		},
		compoundVariants: [
			// Enhanced glow for primary variant
			{
				variant: "primary",
				glow: true,
				className: "shadow-2xl shadow-indigo-500/70",
			},
			// Enhanced glow for secondary variant
			{
				variant: "secondary",
				glow: true,
				className: "shadow-2xl shadow-emerald-500/70",
			},
			// Enhanced glow for accent variant
			{
				variant: "accent",
				glow: true,
				className: "shadow-2xl shadow-cyan-500/70",
			},
		],
		defaultVariants: {
			variant: "primary",
			size: "md",
			glow: false,
			pulse: false,
		},
	}
);

export interface NeonButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof neonButtonVariants> {
	children: React.ReactNode;
	asChild?: boolean;
	/**
	 * ローディング状態
	 * 要件 9.5: ARIAラベルでローディング状態を伝える
	 */
	loading?: boolean;
	/**
	 * アクセシビリティラベル
	 * 要件 9.5: ARIAラベル
	 */
	"aria-label"?: string;
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
	(
		{
			className,
			variant,
			size,
			glow,
			pulse,
			children,
			disabled,
			loading = false,
			"aria-label": ariaLabel,
			...props
		},
		ref
	) => {
		// prefers-reduced-motion対応（要件 9.4）
		const [shouldAnimate, setShouldAnimate] = React.useState(true);

		React.useEffect(() => {
			const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
			setShouldAnimate(!mediaQuery.matches);

			const handleChange = (e: MediaQueryListEvent) => {
				setShouldAnimate(!e.matches);
			};

			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		}, []);

		// アニメーションを無効化する場合はpulseをfalseに
		const effectivePulse = shouldAnimate ? pulse : false;

		// ローディング中またはdisabledの場合は無効化
		const isDisabled = disabled || loading;

		return (
			<button
				ref={ref}
				className={cn(
					neonButtonVariants({ variant, size, glow, pulse: effectivePulse }),
					className
				)}
				disabled={isDisabled}
				// アクセシビリティ属性（要件 9.2, 9.5）
				aria-label={ariaLabel}
				aria-disabled={isDisabled}
				aria-busy={loading}
				{...props}
			>
				{loading && (
					<span className="sr-only">Loading...</span>
				)}
				{children}
			</button>
		);
	}
);

NeonButton.displayName = "NeonButton";

export { NeonButton, neonButtonVariants };
