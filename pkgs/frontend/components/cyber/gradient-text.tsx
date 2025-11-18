"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

/**
 * GradientText コンポーネント
 * 
 * グラデーションテキストエフェクトを持つコンポーネント
 * 要件: 4.3 (重要なテキストにグラデーションテキストエフェクト)
 */

const gradientTextVariants = cva(
	"inline-block bg-clip-text text-transparent font-bold",
	{
		variants: {
			gradient: {
				default: "bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500",
				primary: "bg-gradient-to-r from-indigo-400 to-indigo-600",
				secondary: "bg-gradient-to-r from-emerald-400 to-emerald-600",
				accent: "bg-gradient-to-r from-cyan-400 to-cyan-600",
				rainbow: "bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-cyan-500",
				sunset: "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600",
			},
			animate: {
				true: "bg-[length:200%_auto] animate-gradient",
				false: "",
			},
		},
		defaultVariants: {
			gradient: "default",
			animate: false,
		},
	}
);

export interface GradientTextProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "ref">,
		VariantProps<typeof gradientTextVariants> {
	children: React.ReactNode;
	as?: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
}

function GradientTextInner({ 
	className, 
	gradient, 
	animate, 
	children, 
	as: Component = "span", 
	...props 
}: GradientTextProps) {
	// prefers-reduced-motion対応
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

	// アニメーションを無効化する場合はanimateをfalseに
	const effectiveAnimate = shouldAnimate ? animate : false;

	return (
		<Component
			className={cn(
				gradientTextVariants({ gradient, animate: effectiveAnimate }),
				className
			)}
			{...props}
		>
			{children}
		</Component>
	);
}

const GradientText = React.memo(GradientTextInner);
GradientText.displayName = "GradientText";

export { GradientText, gradientTextVariants };
