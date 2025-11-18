"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const glassCardVariants = cva(
	"relative rounded-xl backdrop-blur-md border transition-all duration-300",
	{
		variants: {
			variant: {
				default: [
					"bg-white/10",
					"border-white/20",
					"shadow-lg shadow-cyan-500/20",
				],
				primary: [
					"bg-indigo-500/10",
					"border-indigo-400/30",
					"shadow-lg shadow-indigo-500/30",
				],
				secondary: [
					"bg-emerald-500/10",
					"border-emerald-400/30",
					"shadow-lg shadow-emerald-500/30",
				],
				accent: [
					"bg-cyan-500/10",
					"border-cyan-400/30",
					"shadow-lg shadow-cyan-500/30",
				],
			},
			glow: {
				true: "shadow-2xl",
				false: "",
			},
			hover: {
				true: "hover:scale-105 hover:shadow-xl cursor-pointer",
				false: "",
			},
		},
		defaultVariants: {
			variant: "default",
			glow: false,
			hover: true,
		},
	}
);

export interface GlassCardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof glassCardVariants> {
	children: React.ReactNode;
	/**
	 * カードをインタラクティブにする（クリック可能）
	 * 要件 9.2: キーボードナビゲーションサポート
	 */
	interactive?: boolean;
	/**
	 * アクセシビリティラベル
	 * 要件 9.5: ARIAラベル
	 */
	"aria-label"?: string;
	/**
	 * アクセシビリティ説明
	 */
	"aria-describedby"?: string;
}

const GlassCard = React.memo(React.forwardRef<HTMLDivElement, GlassCardProps>(
	({ 
		className, 
		variant, 
		glow, 
		hover, 
		children, 
		interactive = false,
		onClick,
		onKeyDown,
		...props 
	}, ref) => {
		// キーボードナビゲーション対応（要件 9.2）
		// useCallback for optimization (要件 10.4)
		const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
			if (interactive && (e.key === "Enter" || e.key === " ")) {
				e.preventDefault();
				onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
			}
			onKeyDown?.(e);
		}, [interactive, onClick, onKeyDown]);

		// useMemo for interactive props (要件 10.4)
		const interactiveProps = React.useMemo(() => 
			interactive ? {
				tabIndex: 0,
				role: onClick ? "button" : "article",
			} : {},
			[interactive, onClick]
		);

		return (
			<div
				ref={ref}
				className={cn(glassCardVariants({ variant, glow, hover }), className)}
				// インタラクティブな場合はtabindexとroleを追加（要件 9.2）
				{...interactiveProps}
				onClick={onClick}
				onKeyDown={handleKeyDown}
				{...props}
			>
				{children}
			</div>
		);
	}
));

GlassCard.displayName = "GlassCard";

export { GlassCard, glassCardVariants };
