"use client";

import { GradientText } from "./heading";

/**
 * GradientText デモコンポーネント
 *
 * GradientTextコンポーネントの使用例を示すデモページ
 */
export function GradientTextDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <GradientText as="h1" className="text-5xl md:text-6xl">
            GradientText Component
          </GradientText>
          <p className="text-slate-500 text-lg">
            グラデーションテキストエフェクトのデモンストレーション
          </p>
        </div>

        {/* Gradient Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">
            グラデーションバリアント
          </h2>
          <div className="grid gap-6">
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl space-y-2">
              <p className="text-sm text-slate-500">
                Default (Primary → Cyan → Secondary)
              </p>
              <GradientText as="h3" className="text-3xl">
                NextMed - 次世代医療データプラットフォーム
              </GradientText>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl space-y-2">
              <p className="text-sm text-slate-500">Primary</p>
              <GradientText as="h3" gradient="primary" className="text-3xl">
                ゼロ知識証明で守る医療データ
              </GradientText>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl space-y-2">
              <p className="text-sm text-slate-500">Secondary</p>
              <GradientText as="h3" gradient="secondary" className="text-3xl">
                プライバシー保護とデータ活用の両立
              </GradientText>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl space-y-2">
              <p className="text-sm text-slate-500">Accent</p>
              <GradientText as="h3" gradient="accent" className="text-3xl">
                未来の医療を、今ここに
              </GradientText>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl space-y-2">
              <p className="text-sm text-slate-500">Rainbow</p>
              <GradientText as="h3" gradient="rainbow" className="text-3xl">
                革新的なZKテクノロジー
              </GradientText>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl space-y-2">
              <p className="text-sm text-slate-500">Sunset</p>
              <GradientText as="h3" gradient="sunset" className="text-3xl">
                データ主権を患者の手に
              </GradientText>
            </div>
          </div>
        </section>

        {/* Animated Gradients */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">
            アニメーション付きグラデーション
          </h2>
          <div className="grid gap-6">
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl space-y-2">
              <p className="text-sm text-slate-500">Default + Animate</p>
              <GradientText as="h3" animate className="text-3xl">
                動的なグラデーションエフェクト
              </GradientText>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl space-y-2">
              <p className="text-sm text-slate-500">Rainbow + Animate</p>
              <GradientText
                as="h3"
                gradient="rainbow"
                animate
                className="text-3xl"
              >
                カラフルなアニメーション
              </GradientText>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl space-y-2">
              <p className="text-sm text-slate-500">Sunset + Animate</p>
              <GradientText
                as="h3"
                gradient="sunset"
                animate
                className="text-3xl"
              >
                サンセットグラデーション
              </GradientText>
            </div>
          </div>
        </section>

        {/* Different HTML Elements */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">異なるHTML要素</h2>
          <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl space-y-4">
            <GradientText as="h1" className="text-5xl">
              H1 見出し
            </GradientText>
            <GradientText as="h2" className="text-4xl">
              H2 見出し
            </GradientText>
            <GradientText as="h3" className="text-3xl">
              H3 見出し
            </GradientText>
            <GradientText as="p" className="text-xl">
              段落テキストにもグラデーションを適用できます
            </GradientText>
            <GradientText as="span" className="text-lg">
              インラインスパン要素
            </GradientText>
          </div>
        </section>

        {/* Use Cases */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">実用例</h2>
          <div className="grid gap-6">
            <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-xl text-center space-y-4">
              <GradientText as="h2" animate className="text-4xl md:text-5xl">
                患者データの完全な保護
              </GradientText>
              <p className="text-slate-600 text-lg">
                ゼロ知識証明技術により、データを暗号化したまま分析が可能
              </p>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-xl space-y-4">
              <GradientText as="h3" gradient="secondary" className="text-3xl">
                主な機能
              </GradientText>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>エンドツーエンド暗号化</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>ZK証明による検証</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>データ主権の保証</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-xl text-center space-y-4">
              <p className="text-slate-600 text-lg">今すぐ始めましょう</p>
              <GradientText
                as="h2"
                gradient="accent"
                animate
                className="text-4xl"
              >
                無料トライアル実施中
              </GradientText>
            </div>
          </div>
        </section>

        {/* Accessibility Note */}
        <section className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            アクセシビリティ対応
          </h3>
          <p className="text-slate-600">
            このコンポーネントは{" "}
            <code className="text-blue-600">prefers-reduced-motion</code>{" "}
            メディアクエリに対応しており、
            ユーザーがモーション削減を設定している場合、アニメーションは自動的に無効化されます。
          </p>
        </section>
      </div>
    </div>
  );
}
