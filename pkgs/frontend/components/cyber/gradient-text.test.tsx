import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GradientText } from "./gradient-text";

describe("GradientText", () => {
  // 基本レンダリングテスト
  describe("基本レンダリング", () => {
    it("子要素を正しくレンダリングする", () => {
      render(<GradientText>グラデーションテキスト</GradientText>);
      expect(screen.getByText("グラデーションテキスト")).toBeInTheDocument();
    });

    it("デフォルトでspanタグとしてレンダリングされる", () => {
      const { container } = render(<GradientText>テキスト</GradientText>);
      const element = screen.getByText("テキスト");
      expect(element.tagName).toBe("SPAN");
    });

    it("カスタムクラス名を適用できる", () => {
      render(<GradientText className="custom-class">テキスト</GradientText>);
      const element = screen.getByText("テキスト");
      expect(element).toHaveClass("custom-class");
    });
  });

  // asプロパティのテスト
  describe("asプロパティ", () => {
    it("h1タグとしてレンダリングできる", () => {
      render(<GradientText as="h1">見出し1</GradientText>);
      const element = screen.getByText("見出し1");
      expect(element.tagName).toBe("H1");
    });

    it("h2タグとしてレンダリングできる", () => {
      render(<GradientText as="h2">見出し2</GradientText>);
      const element = screen.getByText("見出し2");
      expect(element.tagName).toBe("H2");
    });

    it("h3タグとしてレンダリングできる", () => {
      render(<GradientText as="h3">見出し3</GradientText>);
      const element = screen.getByText("見出し3");
      expect(element.tagName).toBe("H3");
    });

    it("pタグとしてレンダリングできる", () => {
      render(<GradientText as="p">段落</GradientText>);
      const element = screen.getByText("段落");
      expect(element.tagName).toBe("P");
    });
  });

  // グラデーションバリアントのテスト
  describe("グラデーションバリアント", () => {
    it("defaultグラデーションを適用する", () => {
      render(<GradientText gradient="default">テキスト</GradientText>);
      const element = screen.getByText("テキスト");
      expect(element.className).toContain("from-indigo-500");
      expect(element.className).toContain("via-cyan-500");
      expect(element.className).toContain("to-emerald-500");
    });

    it("primaryグラデーションを適用する", () => {
      render(<GradientText gradient="primary">テキスト</GradientText>);
      const element = screen.getByText("テキスト");
      expect(element.className).toContain("from-indigo-400");
      expect(element.className).toContain("to-indigo-600");
    });

    it("secondaryグラデーションを適用する", () => {
      render(<GradientText gradient="secondary">テキスト</GradientText>);
      const element = screen.getByText("テキスト");
      expect(element.className).toContain("from-emerald-400");
      expect(element.className).toContain("to-emerald-600");
    });

    it("accentグラデーションを適用する", () => {
      render(<GradientText gradient="accent">テキスト</GradientText>);
      const element = screen.getByText("テキスト");
      expect(element.className).toContain("from-cyan-400");
      expect(element.className).toContain("to-cyan-600");
    });

    it("rainbowグラデーションを適用する", () => {
      render(<GradientText gradient="rainbow">テキスト</GradientText>);
      const element = screen.getByText("テキスト");
      expect(element.className).toContain("from-indigo-500");
      // Tailwind CSSは複数のvia-クラスを最後の1つにマージする
      expect(element.className).toContain("via-pink-500");
      expect(element.className).toContain("to-cyan-500");
    });

    it("sunsetグラデーションを適用する", () => {
      render(<GradientText gradient="sunset">テキスト</GradientText>);
      const element = screen.getByText("テキスト");
      expect(element.className).toContain("from-orange-500");
      expect(element.className).toContain("via-pink-500");
      expect(element.className).toContain("to-purple-600");
    });
  });

  // アニメーションのテスト
  describe("アニメーション", () => {
    it("animate=trueでアニメーションクラスを適用する", async () => {
      render(<GradientText animate={true}>テキスト</GradientText>);
      const element = screen.getByText("テキスト");
      // useEffectが実行されるまで待つ
      await waitFor(() => {
        expect(element.className).toContain("animate-gradient");
      });
    });

    it("animate=falseでアニメーションクラスを適用しない", () => {
      render(<GradientText animate={false}>テキスト</GradientText>);
      const element = screen.getByText("テキスト");
      expect(element.className).not.toContain("animate-gradient");
    });
  });

  // 基本スタイルのテスト
  describe("基本スタイル", () => {
    it("bg-clip-textクラスを持つ", () => {
      render(<GradientText>テキスト</GradientText>);
      const element = screen.getByText("テキスト");
      expect(element.className).toContain("bg-clip-text");
    });

    it("text-transparentクラスを持つ", () => {
      render(<GradientText>テキスト</GradientText>);
      const element = screen.getByText("テキスト");
      expect(element.className).toContain("text-transparent");
    });

    it("font-boldクラスを持つ", () => {
      render(<GradientText>テキスト</GradientText>);
      const element = screen.getByText("テキスト");
      expect(element.className).toContain("font-bold");
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

      render(<GradientText animate={true}>テキスト</GradientText>);
      const element = screen.getByText("テキスト");

      // useEffectが実行されるまで待つ
      await waitFor(() => {
        // モーション削減時はアニメーションが適用されない
        expect(element.className).not.toContain("animate-gradient");
      });
    });
  });

  // HTML属性のテスト
  describe("HTML属性", () => {
    it("カスタムHTML属性を渡せる", () => {
      render(
        <GradientText data-testid="gradient-text" id="test-id">
          テキスト
        </GradientText>,
      );
      const element = screen.getByText("テキスト");
      expect(element).toHaveAttribute("data-testid", "gradient-text");
      expect(element).toHaveAttribute("id", "test-id");
    });
  });

  // React.memoのテスト
  describe("メモ化", () => {
    it("同じpropsで再レンダリングされない", () => {
      const { rerender } = render(
        <GradientText gradient="primary">テキスト</GradientText>,
      );

      const element = screen.getByText("テキスト");
      const firstRender = element;

      // 同じpropsで再レンダリング
      rerender(<GradientText gradient="primary">テキスト</GradientText>);

      const secondRender = screen.getByText("テキスト");
      // React.memoにより同じインスタンスが使用される
      expect(firstRender).toBe(secondRender);
    });
  });
});
