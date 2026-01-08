import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CyberChart } from "./cyber-chart";

// テスト用のサンプルデータ
const sampleData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
];

describe("CyberChart", () => {
  // 基本レンダリングテスト
  describe("基本レンダリング", () => {
    it("チャートコンテナをレンダリングする", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("カスタムクラス名を適用できる", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("w-fullクラスを持つ", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" />,
      );
      expect(container.firstChild).toHaveClass("w-full");
    });
  });

  // チャートタイプのテスト
  describe("チャートタイプ", () => {
    it("lineチャートをレンダリングする", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" />,
      );
      // ResponsiveContainerが存在することを確認
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });

    it("barチャートをレンダリングする", () => {
      const { container } = render(<CyberChart data={sampleData} type="bar" />);
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });

    it("areaチャートをレンダリングする", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="area" />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });

    it("pieチャートをレンダリングする", () => {
      const { container } = render(<CyberChart data={sampleData} type="pie" />);
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });

    it("デフォルトでlineチャートをレンダリングする", () => {
      const { container } = render(<CyberChart data={sampleData} />);
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });
  });

  // プロパティのテスト
  describe("プロパティ", () => {
    it("dataKeyプロパティを受け取る", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" dataKey="value" />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });

    it("xAxisKeyプロパティを受け取る", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" xAxisKey="name" />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });

    it("heightプロパティを受け取る", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" height={400} />,
      );
      const responsiveContainer = container.querySelector(
        ".recharts-responsive-container",
      );
      expect(responsiveContainer).toBeInTheDocument();
    });

    it("カスタムカラーを受け取る", () => {
      const customColors = {
        primary: "#ff0000",
        secondary: "#00ff00",
        accent: "#0000ff",
      };
      const { container } = render(
        <CyberChart data={sampleData} type="line" colors={customColors} />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });
  });

  // グラデーション効果のテスト
  describe("グラデーション効果", () => {
    it("gradient=trueでコンポーネントをレンダリングする", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="area" gradient={true} />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });

    it("gradient=falseでコンポーネントをレンダリングする", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" gradient={false} />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });
  });

  // グロー効果のテスト
  describe("グロー効果", () => {
    it("glow=trueでコンポーネントをレンダリングする", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" glow={true} />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });
  });

  // グリッド表示のテスト
  describe("グリッド表示", () => {
    it("showGrid=trueでコンポーネントをレンダリングする", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" showGrid={true} />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });

    it("showGrid=falseでコンポーネントをレンダリングする", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" showGrid={false} />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });
  });

  // 凡例表示のテスト
  describe("凡例表示", () => {
    it("showLegend=trueでコンポーネントをレンダリングする", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" showLegend={true} />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });

    it("showLegend=falseでコンポーネントをレンダリングする", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" showLegend={false} />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });
  });

  // ツールチップ表示のテスト
  describe("ツールチップ表示", () => {
    it("showTooltip=trueでコンポーネントをレンダリングする", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" showTooltip={true} />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });
  });

  // アニメーションのテスト
  describe("アニメーション", () => {
    it("animate=trueでコンポーネントをレンダリングする", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" animate={true} />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });

    it("animate=falseでコンポーネントをレンダリングする", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" animate={false} />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });
  });

  // prefers-reduced-motionのテスト
  describe("prefers-reduced-motion対応", () => {
    it("モーション削減設定を検出する", () => {
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

      render(<CyberChart data={sampleData} type="line" animate={true} />);
      expect(matchMediaMock).toHaveBeenCalledWith(
        "(prefers-reduced-motion: reduce)",
      );
    });
  });

  // 空データのテスト
  describe("空データ", () => {
    it("空配列でもエラーなくレンダリングする", () => {
      const { container } = render(<CyberChart data={[]} type="line" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // ResponsiveContainerのテスト
  describe("ResponsiveContainer", () => {
    it("ResponsiveContainerを使用する", () => {
      const { container } = render(
        <CyberChart data={sampleData} type="line" />,
      );
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });
  });
});
