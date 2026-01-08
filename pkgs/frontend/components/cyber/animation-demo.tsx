/**
 * アニメーションデモコンポーネント
 *
 * 実装したアニメーションユーティリティの動作確認用
 * 要件: 5.1, 5.2, 5.3, 5.4, 5.5, 9.4
 */

"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  customFade,
  fadeIn,
  fadeOut,
  fadeSlideIn,
  glowAnimation,
  hoverTransition,
  modalAnimation,
  prefersReducedMotion,
  pulseAnimation,
  type SlideDirection,
  scaleFadeIn,
  shakeAnimation,
  shimmerAnimation,
  skeletonAnimation,
  slideIn,
} from "@/lib/animations";

export function AnimationDemo() {
  const [showModal, setShowModal] = useState(false);
  const [triggerShake, setTriggerShake] = useState(false);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
  const [slideDirection, setSlideDirection] =
    useState<SlideDirection>("bottom");
  const motionReduced = prefersReducedMotion();

  const handleShake = () => {
    setTriggerShake(true);
    setTimeout(() => setTriggerShake(false), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className={fadeSlideIn("top")}>
          <h1 className="text-4xl font-bold text-white mb-2">
            アニメーションデモ
          </h1>
          <p className="text-slate-400">
            実装したアニメーションユーティリティの動作確認
          </p>
          {motionReduced && (
            <Badge
              variant="outline"
              className="mt-2 border-yellow-500 text-yellow-500"
            >
              ⚠️ アニメーション軽減モードが有効です
            </Badge>
          )}
        </div>

        {/* フェードアニメーション */}
        <Card className={fadeIn()}>
          <CardHeader>
            <CardTitle>フェードアニメーション（要件 5.1, 3.5）</CardTitle>
            <CardDescription>
              ページ遷移やデータ更新時のフェードイン/アウト
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={() => setFadeState("in")}>フェードイン</Button>
              <Button onClick={() => setFadeState("out")} variant="outline">
                フェードアウト
              </Button>
            </div>
            <div
              className={`p-4 bg-blue-500/20 rounded-lg ${
                fadeState === "in" ? fadeIn() : fadeOut()
              }`}
            >
              <p className="text-white">
                このボックスがフェード{fadeState === "in" ? "イン" : "アウト"}
                します
              </p>
            </div>
            <div
              style={customFade(fadeState, { duration: 500 })}
              className="p-4 bg-purple-500/20 rounded-lg"
            >
              <p className="text-white">カスタムフェード（500ms）</p>
            </div>
          </CardContent>
        </Card>

        {/* スライドアニメーション */}
        <Card className={slideIn("left")}>
          <CardHeader>
            <CardTitle>スライドアニメーション（要件 5.1）</CardTitle>
            <CardDescription>ページ遷移時のスライドイン</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {(["left", "right", "top", "bottom"] as SlideDirection[]).map(
                (dir) => (
                  <Button
                    key={dir}
                    onClick={() => setSlideDirection(dir)}
                    variant={slideDirection === dir ? "default" : "outline"}
                    size="sm"
                  >
                    {dir}
                  </Button>
                ),
              )}
            </div>
            <div
              key={slideDirection}
              className={`p-4 bg-green-500/20 rounded-lg ${slideIn(slideDirection)}`}
            >
              <p className="text-white">{slideDirection}からスライドイン</p>
            </div>
          </CardContent>
        </Card>

        {/* パルスとグローアニメーション */}
        <Card className={fadeSlideIn("right")}>
          <CardHeader>
            <CardTitle>パルスとグローアニメーション（要件 5.2）</CardTitle>
            <CardDescription>
              ボタンホバー時のスケール変化とグロー効果
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <div className={pulseAnimation()}>
                <Button>パルスボタン</Button>
              </div>
              <Button
                style={glowAnimation({ color: "#06b6d4", intensity: "medium" })}
                className="transition-all"
              >
                グローボタン（シアン）
              </Button>
              <Button
                style={glowAnimation({ color: "#ec4899", intensity: "high" })}
                className="transition-all"
              >
                グローボタン（ピンク）
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="p-4 bg-cyan-500/20 rounded-lg cursor-pointer transition-transform hover:scale-105"
                style={hoverTransition()}
              >
                <p className="text-white text-center">ホバーでスケール</p>
              </div>
              <div
                className="p-4 bg-pink-500/20 rounded-lg cursor-pointer"
                style={{
                  ...hoverTransition(),
                  ...glowAnimation({ color: "#ec4899", intensity: "low" }),
                }}
              >
                <p className="text-white text-center">ホバーでグロー</p>
              </div>
              <div
                className={`p-4 bg-purple-500/20 rounded-lg ${pulseAnimation()}`}
              >
                <p className="text-white text-center">常時パルス</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* モーダルアニメーション */}
        <Card>
          <CardHeader>
            <CardTitle>モーダルアニメーション（要件 5.3）</CardTitle>
            <CardDescription>
              モーダル開閉時のスケールアップとフェードイン
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowModal(true)}>モーダルを開く</Button>
          </CardContent>
        </Card>

        {/* シマーエフェクト */}
        <Card className={scaleFadeIn()}>
          <CardHeader>
            <CardTitle>シマーエフェクト（要件 5.4）</CardTitle>
            <CardDescription>
              データロード時のスケルトンローディング
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div
                className={`h-4 rounded ${skeletonAnimation()}`}
                style={{ width: "80%" }}
              />
              <div
                className={`h-4 rounded ${skeletonAnimation()}`}
                style={{ width: "60%" }}
              />
              <div
                className={`h-4 rounded ${skeletonAnimation()}`}
                style={{ width: "90%" }}
              />
            </div>
            <div className={`h-32 rounded ${shimmerAnimation()}`} />
          </CardContent>
        </Card>

        {/* シェイクアニメーション */}
        <Card>
          <CardHeader>
            <CardTitle>シェイクアニメーション（要件 5.5）</CardTitle>
            <CardDescription>
              エラー発生時のシェイクアニメーション
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleShake} variant="destructive">
              エラーをトリガー
            </Button>
            <div
              className={`p-4 bg-red-500/20 border border-red-500 rounded-lg ${
                triggerShake ? shakeAnimation() : ""
              }`}
            >
              <p className="text-red-400">⚠️ エラーメッセージ: 入力が無効です</p>
            </div>
          </CardContent>
        </Card>

        {/* 複合アニメーション */}
        <Card className={fadeSlideIn("bottom")}>
          <CardHeader>
            <CardTitle>複合アニメーション</CardTitle>
            <CardDescription>
              複数のアニメーションを組み合わせた効果
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={fadeSlideIn("left")}>
              <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                <p className="text-white">フェード + スライド（左）</p>
              </div>
            </div>
            <div className={scaleFadeIn()}>
              <div className="p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                <p className="text-white">スケール + フェード</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* モーダル */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className={`bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-md w-full ${modalAnimation.enter()}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              モーダルタイトル
            </h2>
            <p className="text-slate-400 mb-6">
              このモーダルはスケールアップとフェードインのアニメーションで表示されます。
            </p>
            <div className="flex gap-4">
              <Button onClick={() => setShowModal(false)}>閉じる</Button>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                キャンセル
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
