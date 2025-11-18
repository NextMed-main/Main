import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NeonButton } from "./neon-button";

describe("NeonButton", () => {
	// 基本レンダリングテスト
	describe("基本レンダリング", () => {
		it("子要素を正しくレンダリングする", () => {
			render(<NeonButton>ボタンテキスト</NeonButton>);
			expect(screen.getByText("ボタンテキスト")).toBeInTheDocument();
		});

		it("カスタムクラス名を適用できる", () => {
			render(
				<NeonButton className="custom-class">ボタン</NeonButton>
			);
			const button = screen.getByText("ボタン");
			expect(button).toHaveClass("custom-class");
		});

		it("buttonタイプのHTML要素としてレンダリングされる", () => {
			render(<NeonButton>ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			expect(button.tagName).toBe("BUTTON");
		});
	});

	// バリアントプロパティのテスト
	describe("バリアントプロパティ", () => {
		it("primaryバリアント（デフォルト）を適用する", () => {
			render(<NeonButton variant="primary">ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			expect(button.className).toContain("bg-indigo-600");
		});

		it("secondaryバリアントを適用する", () => {
			render(<NeonButton variant="secondary">ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			expect(button.className).toContain("bg-emerald-600");
		});

		it("accentバリアントを適用する", () => {
			render(<NeonButton variant="accent">ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			expect(button.className).toContain("bg-cyan-600");
		});
	});

	// サイズプロパティのテスト
	describe("サイズプロパティ", () => {
		it("smサイズを適用する", () => {
			render(<NeonButton size="sm">ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			expect(button.className).toContain("h-9");
		});

		it("mdサイズ（デフォルト）を適用する", () => {
			render(<NeonButton size="md">ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			expect(button.className).toContain("h-11");
		});

		it("lgサイズを適用する", () => {
			render(<NeonButton size="lg">ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			expect(button.className).toContain("h-14");
		});
	});

	// グロー効果のテスト
	describe("グロー効果", () => {
		it("glow=trueで強いシャドウを適用する（primary）", () => {
			render(
				<NeonButton variant="primary" glow={true}>
					ボタン
				</NeonButton>
			);
			const button = screen.getByText("ボタン");
			expect(button.className).toContain("shadow-2xl");
			expect(button.className).toContain("shadow-indigo-500/70");
		});

		it("glow=trueで強いシャドウを適用する（secondary）", () => {
			render(
				<NeonButton variant="secondary" glow={true}>
					ボタン
				</NeonButton>
			);
			const button = screen.getByText("ボタン");
			expect(button.className).toContain("shadow-2xl");
			expect(button.className).toContain("shadow-emerald-500/70");
		});

		it("glow=trueで強いシャドウを適用する（accent）", () => {
			render(
				<NeonButton variant="accent" glow={true}>
					ボタン
				</NeonButton>
			);
			const button = screen.getByText("ボタン");
			expect(button.className).toContain("shadow-2xl");
			expect(button.className).toContain("shadow-cyan-500/70");
		});
	});

	// パルスアニメーションのテスト
	describe("パルスアニメーション", () => {
		it("pulse=trueでアニメーションクラスを適用する", async () => {
			render(<NeonButton pulse={true}>ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			// useEffectが実行されるまで待つ
			await waitFor(() => {
				expect(button.className).toContain("animate-pulse");
			});
		});

		it("pulse=falseでアニメーションクラスを適用しない", () => {
			render(<NeonButton pulse={false}>ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			expect(button.className).not.toContain("animate-pulse");
		});
	});

	// ローディング状態のテスト
	describe("ローディング状態", () => {
		it("loading=trueでボタンを無効化する", () => {
			render(<NeonButton loading={true}>ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			expect(button).toBeDisabled();
		});

		it("loading=trueでaria-busy属性を設定する", () => {
			render(<NeonButton loading={true}>ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			expect(button).toHaveAttribute("aria-busy", "true");
		});

		it("loading=trueでスクリーンリーダー用テキストを表示する", () => {
			render(<NeonButton loading={true}>ボタン</NeonButton>);
			expect(screen.getByText("Loading...")).toBeInTheDocument();
		});

		it("loading=falseで通常状態を維持する", () => {
			render(<NeonButton loading={false}>ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			expect(button).not.toBeDisabled();
			expect(button).toHaveAttribute("aria-busy", "false");
		});
	});

	// disabled状態のテスト
	describe("disabled状態", () => {
		it("disabled=trueでボタンを無効化する", () => {
			render(<NeonButton disabled={true}>ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			expect(button).toBeDisabled();
		});

		it("disabled=trueでaria-disabled属性を設定する", () => {
			render(<NeonButton disabled={true}>ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			expect(button).toHaveAttribute("aria-disabled", "true");
		});
	});

	// イベントハンドラーのテスト
	describe("イベントハンドラー", () => {
		it("クリックイベントを正しく処理する", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(<NeonButton onClick={handleClick}>ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			await user.click(button);
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("disabled状態ではクリックイベントを発火しない", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<NeonButton disabled={true} onClick={handleClick}>
					ボタン
				</NeonButton>
			);
			const button = screen.getByText("ボタン");
			await user.click(button);
			expect(handleClick).not.toHaveBeenCalled();
		});

		it("loading状態ではクリックイベントを発火しない", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<NeonButton loading={true} onClick={handleClick}>
					ボタン
				</NeonButton>
			);
			const button = screen.getByText("ボタン");
			await user.click(button);
			expect(handleClick).not.toHaveBeenCalled();
		});
	});

	// アクセシビリティのテスト
	describe("アクセシビリティ", () => {
		it("aria-labelを正しく設定する", () => {
			render(
				<NeonButton aria-label="送信ボタン">送信</NeonButton>
			);
			const button = screen.getByText("送信");
			expect(button).toHaveAttribute("aria-label", "送信ボタン");
		});

		it("フォーカス可能である", () => {
			render(<NeonButton>ボタン</NeonButton>);
			const button = screen.getByText("ボタン");
			button.focus();
			expect(button).toHaveFocus();
		});
	});

	// prefers-reduced-motionのテスト
	describe("prefers-reduced-motion対応", () => {
		it("モーション削減設定時にアニメーションを無効化する", async () => {
			// matchMediaをモックしてprefers-reduced-motionをtrueに
			const matchMediaMock = vi.fn().mockImplementation((query) => ({
				matches: query === "(prefers-reduced-motion: reduce)",
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			}));

			window.matchMedia = matchMediaMock;

			render(<NeonButton pulse={true}>ボタン</NeonButton>);
			const button = screen.getByText("ボタン");

			// useEffectが実行されるまで待つ
			await waitFor(() => {
				// モーション削減時はpulseアニメーションが適用されない
				expect(button.className).not.toContain("animate-pulse");
			});
		});
	});
});
