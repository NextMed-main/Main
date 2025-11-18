"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

/**
 * CyberChart コンポーネント
 *
 * Rechartsをラップしてサイバーメディカルスタイルを適用
 * 要件: 3.2 (データチャートにグラデーション付きチャートを表示)
 */

export type ChartType = "line" | "bar" | "area" | "pie";

export interface ChartDataPoint {
	[key: string]: string | number;
}

export interface CyberChartProps {
	data: ChartDataPoint[];
	type?: ChartType;
	dataKey?: string;
	xAxisKey?: string;
	gradient?: boolean;
	glow?: boolean;
	height?: number;
	className?: string;
	colors?: {
		primary?: string;
		secondary?: string;
		accent?: string;
	};
	showGrid?: boolean;
	showLegend?: boolean;
	showTooltip?: boolean;
	animate?: boolean;
}

/**
 * デフォルトカラー設定
 */
const DEFAULT_COLORS = {
	primary: "#6366f1", // Indigo
	secondary: "#10b981", // Emerald
	accent: "#06b6d4", // Cyan
};

/**
 * グラデーション定義コンポーネント
 */
const ChartGradients: React.FC<{ colors: typeof DEFAULT_COLORS }> = ({
	colors,
}) => (
	<defs>
		<linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stopColor={colors.primary} stopOpacity={0.8} />
			<stop offset="100%" stopColor={colors.primary} stopOpacity={0.1} />
		</linearGradient>
		<linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stopColor={colors.secondary} stopOpacity={0.8} />
			<stop offset="100%" stopColor={colors.secondary} stopOpacity={0.1} />
		</linearGradient>
		<linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stopColor={colors.accent} stopOpacity={0.8} />
			<stop offset="100%" stopColor={colors.accent} stopOpacity={0.1} />
		</linearGradient>
		{/* グロー効果用のフィルター */}
		<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="4" result="coloredBlur" />
			<feMerge>
				<feMergeNode in="coloredBlur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
);

/**
 * カスタムツールチップ
 * React.memo for optimization (要件 10.3)
 */
interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		name?: string;
		value?: string | number;
		color?: string;
		dataKey?: string;
	}>;
	label?: string;
}

const CustomTooltip = React.memo<CustomTooltipProps>(({
	active,
	payload,
	label,
}) => {
	if (!active || !payload || !payload.length) {
		return null;
	}

	return (
		<div className="rounded-lg border border-white/20 bg-background/95 p-3 shadow-lg shadow-cyan-500/20 backdrop-blur-md">
			<p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
			{payload.map((entry, index) => (
				<div key={`item-${entry.dataKey || index}`} className="flex items-center gap-2">
					<div
						className="h-3 w-3 rounded-full"
						style={{ backgroundColor: entry.color }}
					/>
					<span className="text-sm text-muted-foreground">{entry.name}:</span>
					<span className="text-sm font-medium text-foreground">
						{entry.value}
					</span>
				</div>
			))}
		</div>
	);
});

/**
 * LineChart実装
 * React.memo for optimization (要件 10.3)
 */
const CyberLineChart = React.memo<
	CyberChartProps & { colors: typeof DEFAULT_COLORS }
>(({
	data,
	dataKey = "value",
	xAxisKey = "name",
	gradient,
	glow,
	colors,
	showGrid = true,
	showLegend = false,
	showTooltip = true,
	animate = true,
}) => {
	return (
		<LineChart data={data}>
			{gradient && <ChartGradients colors={colors} />}
			{showGrid && (
				<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
			)}
			<XAxis
				dataKey={xAxisKey}
				stroke="rgba(255,255,255,0.5)"
				style={{ fontSize: "12px" }}
			/>
			<YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
			{showTooltip && <Tooltip content={<CustomTooltip />} />}
			{showLegend && <Legend />}
			<Line
				type="monotone"
				dataKey={dataKey}
				stroke={colors.primary}
				strokeWidth={2}
				dot={{ fill: colors.primary, r: 4 }}
				activeDot={{ r: 6, fill: colors.accent }}
				filter={glow ? "url(#glow)" : undefined}
				isAnimationActive={animate}
			/>
		</LineChart>
	);
});

/**
 * BarChart実装
 * React.memo for optimization (要件 10.3)
 */
const CyberBarChart = React.memo<
	CyberChartProps & { colors: typeof DEFAULT_COLORS }
>(({
	data,
	dataKey = "value",
	xAxisKey = "name",
	gradient,
	glow,
	colors,
	showGrid = true,
	showLegend = false,
	showTooltip = true,
	animate = true,
}) => {
	return (
		<BarChart data={data}>
			{gradient && <ChartGradients colors={colors} />}
			{showGrid && (
				<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
			)}
			<XAxis
				dataKey={xAxisKey}
				stroke="rgba(255,255,255,0.5)"
				style={{ fontSize: "12px" }}
			/>
			<YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
			{showTooltip && <Tooltip content={<CustomTooltip />} />}
			{showLegend && <Legend />}
			<Bar
				dataKey={dataKey}
				fill={gradient ? "url(#primaryGradient)" : colors.primary}
				radius={[8, 8, 0, 0]}
				filter={glow ? "url(#glow)" : undefined}
				isAnimationActive={animate}
			/>
		</BarChart>
	);
});

/**
 * AreaChart実装
 * React.memo for optimization (要件 10.3)
 */
const CyberAreaChart = React.memo<
	CyberChartProps & { colors: typeof DEFAULT_COLORS }
>(({
	data,
	dataKey = "value",
	xAxisKey = "name",
	gradient,
	glow,
	colors,
	showGrid = true,
	showLegend = false,
	showTooltip = true,
	animate = true,
}) => {
	return (
		<AreaChart data={data}>
			{gradient && <ChartGradients colors={colors} />}
			{showGrid && (
				<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
			)}
			<XAxis
				dataKey={xAxisKey}
				stroke="rgba(255,255,255,0.5)"
				style={{ fontSize: "12px" }}
			/>
			<YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
			{showTooltip && <Tooltip content={<CustomTooltip />} />}
			{showLegend && <Legend />}
			<Area
				type="monotone"
				dataKey={dataKey}
				stroke={colors.primary}
				strokeWidth={2}
				fill={gradient ? "url(#primaryGradient)" : colors.primary}
				filter={glow ? "url(#glow)" : undefined}
				isAnimationActive={animate}
			/>
		</AreaChart>
	);
});

/**
 * PieChart実装
 * React.memo for optimization (要件 10.3)
 */
const CyberPieChart = React.memo<
	CyberChartProps & { colors: typeof DEFAULT_COLORS }
>(({
	data,
	dataKey = "value",
	gradient,
	glow,
	colors,
	showLegend = true,
	showTooltip = true,
	animate = true,
}) => {
	const COLORS = [colors.primary, colors.secondary, colors.accent];

	return (
		<PieChart>
			{gradient && <ChartGradients colors={colors} />}
			{showTooltip && <Tooltip content={<CustomTooltip />} />}
			{showLegend && <Legend />}
			<Pie
				data={data}
				dataKey={dataKey}
				nameKey="name"
				cx="50%"
				cy="50%"
				outerRadius={80}
				filter={glow ? "url(#glow)" : undefined}
				isAnimationActive={animate}
			>
				{data.map((entry, index) => (
					<Cell
						key={`cell-${entry.name || index}`}
						fill={COLORS[index % COLORS.length]}
						stroke="rgba(255,255,255,0.2)"
						strokeWidth={2}
					/>
				))}
			</Pie>
		</PieChart>
	);
});

/**
 * メインCyberChartコンポーネント
 */
export const CyberChart = React.forwardRef<HTMLDivElement, CyberChartProps>(
	(
		{
			data,
			type = "line",
			dataKey = "value",
			xAxisKey = "name",
			gradient = true,
			glow = true,
			height = 300,
			className,
			colors,
			showGrid = true,
			showLegend = false,
			showTooltip = true,
			animate = true,
		},
		ref
	) => {
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

		// アニメーションを無効化する場合
		const effectiveAnimate = shouldAnimate ? animate : false;

		// カラー設定のマージ
		const effectiveColors = {
			...DEFAULT_COLORS,
			...colors,
		};

		// チャートタイプに応じたコンポーネントを選択
		const renderChart = () => {
			const commonProps = {
				data,
				dataKey,
				xAxisKey,
				gradient,
				glow,
				colors: effectiveColors,
				showGrid,
				showLegend,
				showTooltip,
				animate: effectiveAnimate,
			};

			switch (type) {
				case "bar":
					return <CyberBarChart {...commonProps} />;
				case "area":
					return <CyberAreaChart {...commonProps} />;
				case "pie":
					return <CyberPieChart {...commonProps} />;
				case "line":
				default:
					return <CyberLineChart {...commonProps} />;
			}
		};

		return (
			<div ref={ref} className={cn("w-full", className)}>
				<ResponsiveContainer width="100%" height={height}>
					{renderChart()}
				</ResponsiveContainer>
			</div>
		);
	}
);

CyberChart.displayName = "CyberChart";
