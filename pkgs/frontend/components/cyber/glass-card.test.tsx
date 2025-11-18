import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GlassCard } from "./glass-card";

describe("GlassCard", () => {
	// 基本レンダリングテスト
	describe("基本レンダリング", () => {
		it("子要素を正しくレンダリングする", () => {
			render(<GlassCard>テストコンテンツ</GlassCard>);
			expect(screen.getByText("テストコンテンツ")).toBeInTheDocument();
		});

		it("カスタムクラス名を適用できる", () => {
			const { container } = render(
				<GlassCard className="custom-class">コンテンツ</GlassCard>
			);
			expect(container.firstChild).toHaveClass("custom-class");
		});
	});

	// バリアントプロパティのテスト
	describe("バリアントプロパティ", () => {
		it("defaultバリアントを適用する", () => {
			const { container } = render(
				<GlassCard variant="default">コンテンツ</GlassCard>
			);
			const card = container.firstChild as HTMLElement;
			expect(card.className).toContain("bg-white/10");
		});

		it("primaryバリアントを適用する", () => {
			const { container } = render(
				<GlassCard variant="primary">コンテンツ</GlassCard>
			);
			const card = container.firstChild as HTMLElement;
			expect(card.className).toContain("bg-indigo-500/10");
		});

		it("secondaryバリアントを適用する", () => {
			const { container } = render(
				<GlassCard variant="secondary">コンテンツ</GlassCard>
			);
			const card = container.firstChild as HTMLElement;
			expect(card.className).toContain("bg-emerald-500/10");
		});

		it("accentバリアントを適用する", () => {
			const { container } = render(
				<GlassCard variant="accent">コンテンツ</GlassCard>
			);
			const card = container.firstChild as HTMLElement;
			expect(card.className).toContain("bg-cyan-500/10");
		});
	});

	// グロー効果のテスト
	describe("グロー効果", () => {
		it("glow=trueで強いシャドウを適用する", () => {
			const { container } = render(
				<GlassCard glow={true}>コンテンツ</GlassCard>
			);
			const card = container.firstChild as HTMLElement;
			expect(card.className).toContain("shadow-2xl");
		});

		it("glow=falseでデフォルトシャドウを使用する", () => {
			const { container } = render(
				<GlassCard glow={false}>コンテンツ</GlassCard>
			);
			const card = container.firstChild as HTMLElement;
			expect(card.className).not.toContain("shadow-2xl");
		});
	});

	// ホバー効果のテスト
	describe("ホバー効果", () => {
		it("hover=trueでホバークラスを適用する", () => {
			const { container } = render(
				<GlassCard hover={true}>コンテンツ</GlassCard>
			);
			const card = container.firstChild as HTMLElement;
			expect(card.className).toContain("hover:scale-105");
		});

		it("hover=falseでホバークラスを適用しない", () => {
			const { container } = render(
				<GlassCard hover={false}>コンテンツ</GlassCard>
			);
			const card = container.firstChild as HTMLElement;
			expect(card.className).not.toContain("hover:scale-105");
		});
	});

	// インタラクティブ機能のテスト
	describe("インタラクティブ機能", () => {
		it("interactive=trueでtabIndex=0を設定する", () => {
			const { container } = render(
				<GlassCard interactive={true}>コンテンツ</GlassCard>
			);
			const card = container.firstChild as HTMLElement;
			expect(card).toHaveAttribute("tabIndex", "0");
		});

		it("interactive=falseでtabIndexを設定しない", () => {
			const { container } = render(
				<GlassCard interactive={false}>コンテンツ</GlassCard>
			);
			const card = container.firstChild as HTMLElement;
			expect(card).not.toHaveAttribute("tabIndex");
		});

		it("onClickハンドラーがある場合、role=buttonを設定する", () => {
			const handleClick = vi.fn();
			const { container } = render(
				<GlassCard interactive={true} onClick={handleClick}>
					コンテンツ
				</GlassCard>
			);
			const card = container.firstChild as HTMLElement;
			expect(card).toHaveAttribute("role", "button");
		});

		it("onClickハンドラーがない場合、role=articleを設定する", () => {
			const { container } = render(
				<GlassCard interactive={true}>コンテンツ</GlassCard>
			);
			const card = container.firstChild as HTMLElement;
			expect(card).toHaveAttribute("role", "article");
		});
	});

	// イベントハンドラーのテスト
	describe("イベントハンドラー", () => {
		it("クリックイベントを正しく処理する", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<GlassCard onClick={handleClick}>コンテンツ</GlassCard>
			);
			const card = screen.getByText("コンテンツ");
			await user.click(card);
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("Enterキーでクリックイベントを発火する（interactive=true）", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<GlassCard interactive={true} onClick={handleClick}>
					コンテンツ
				</GlassCard>
			);
			const card = screen.getByText("コンテンツ");
			card.focus();
			await user.keyboard("{Enter}");
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("Spaceキーでクリックイベントを発火する（interactive=true）", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<GlassCard interactive={true} onClick={handleClick}>
					コンテンツ
				</GlassCard>
			);
			const card = screen.getByText("コンテンツ");
			card.focus();
			await user.keyboard(" ");
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("interactive=falseの場合、キーボードイベントでクリックを発火しない", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<GlassCard interactive={false} onClick={handleClick}>
					コンテンツ
				</GlassCard>
			);
			const card = screen.getByText("コンテンツ");
			card.focus();
			await user.keyboard("{Enter}");
			expect(handleClick).not.toHaveBeenCalled();
		});
	});

	// アクセシビリティのテスト
	describe("アクセシビリティ", () => {
		it("aria-labelを正しく設定する", () => {
			const { container } = render(
				<GlassCard aria-label="テストラベル">コンテンツ</GlassCard>
			);
			const card = container.firstChild as HTMLElement;
			expect(card).toHaveAttribute("aria-label", "テストラベル");
		});

		it("aria-describedbyを正しく設定する", () => {
			const { container } = render(
				<GlassCard aria-describedby="description-id">
					コンテンツ
				</GlassCard>
			);
			const card = container.firstChild as HTMLElement;
			expect(card).toHaveAttribute("aria-describedby", "description-id");
		});
	});
});
