"use client";

import { CyberChart } from "./cyber-chart";
import { GlassCard } from "./glass-card";

/**
 * CyberChart デモコンポーネント
 *
 * CyberChartの使用例を示すデモページ
 */

// サンプルデータ
const lineData = [
  { name: "Jan", value: 400, patients: 240 },
  { name: "Feb", value: 300, patients: 139 },
  { name: "Mar", value: 600, patients: 380 },
  { name: "Apr", value: 800, patients: 430 },
  { name: "May", value: 500, patients: 210 },
  { name: "Jun", value: 700, patients: 350 },
];

const barData = [
  { name: "Type A", value: 120 },
  { name: "Type B", value: 98 },
  { name: "Type C", value: 86 },
  { name: "Type D", value: 99 },
  { name: "Type E", value: 85 },
];

const areaData = [
  { name: "Week 1", value: 2400 },
  { name: "Week 2", value: 1398 },
  { name: "Week 3", value: 9800 },
  { name: "Week 4", value: 3908 },
  { name: "Week 5", value: 4800 },
  { name: "Week 6", value: 3800 },
];

const pieData = [
  { name: "Category A", value: 400 },
  { name: "Category B", value: 300 },
  { name: "Category C", value: 300 },
  { name: "Category D", value: 200 },
];

export function CyberChartDemo() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ヘッダー */}
        <div className="space-y-2">
          <h1 className="bg-linear-to-r from-indigo-500 via-cyan-500 to-emerald-500 bg-clip-text text-4xl font-bold text-transparent">
            CyberChart デモ
          </h1>
          <p className="text-muted-foreground">
            サイバーメディカルスタイルのチャートコンポーネント
          </p>
        </div>

        {/* LineChart */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Line Chart
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            グラデーション塗りつぶしとグロー効果付きの折れ線グラフ
          </p>
          <CyberChart
            data={lineData}
            type="line"
            dataKey="value"
            xAxisKey="name"
            gradient={true}
            glow={true}
            height={300}
          />
        </GlassCard>

        {/* BarChart */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Bar Chart
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            グラデーション塗りつぶしとグロー効果付きの棒グラフ
          </p>
          <CyberChart
            data={barData}
            type="bar"
            dataKey="value"
            xAxisKey="name"
            gradient={true}
            glow={true}
            height={300}
          />
        </GlassCard>

        {/* AreaChart */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Area Chart
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            グラデーション塗りつぶしとグロー効果付きのエリアチャート
          </p>
          <CyberChart
            data={areaData}
            type="area"
            dataKey="value"
            xAxisKey="name"
            gradient={true}
            glow={true}
            height={300}
          />
        </GlassCard>

        {/* PieChart */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Pie Chart
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            グロー効果付きの円グラフ
          </p>
          <CyberChart
            data={pieData}
            type="pie"
            dataKey="value"
            gradient={false}
            glow={true}
            height={300}
            showLegend={true}
          />
        </GlassCard>

        {/* カスタムカラー */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Custom Colors
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            カスタムカラーパレットを使用したチャート
          </p>
          <CyberChart
            data={lineData}
            type="area"
            dataKey="value"
            xAxisKey="name"
            gradient={true}
            glow={true}
            height={300}
            colors={{
              primary: "#ec4899", // Pink
              secondary: "#8b5cf6", // Purple
              accent: "#f59e0b", // Amber
            }}
          />
        </GlassCard>

        {/* グリッドなし */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Without Grid
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            グリッド線なしのクリーンなチャート
          </p>
          <CyberChart
            data={barData}
            type="bar"
            dataKey="value"
            xAxisKey="name"
            gradient={true}
            glow={true}
            height={300}
            showGrid={false}
          />
        </GlassCard>

        {/* アニメーションなし */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Without Animation
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            アニメーションなしの静的チャート（アクセシビリティ対応）
          </p>
          <CyberChart
            data={lineData}
            type="line"
            dataKey="value"
            xAxisKey="name"
            gradient={true}
            glow={false}
            height={300}
            animate={false}
          />
        </GlassCard>
      </div>
    </div>
  );
}
