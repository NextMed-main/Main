import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ParticleBackground } from "./particle-background";

describe("ParticleBackground", () => {
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    // Canvas APIのモック
    mockContext = {
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      createRadialGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      scale: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    mockCanvas = {
      getContext: vi.fn(() => mockContext),
      getBoundingClientRect: vi.fn(() => ({
        width: 800,
        height: 600,
        top: 0,
        left: 0,
        right: 800,
        bottom: 600,
      })),
      width: 800,
      height: 600,
    } as unknown as HTMLCanvasElement;

    // HTMLCanvasElement.prototype.getContextをモック
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      mockContext,
    );
    vi.spyOn(
      HTMLCanvasElement.prototype,
      "getBoundingClientRect",
    ).mockReturnValue({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    // requestAnimationFrameのモック
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      setTimeout(() => cb(0), 0);
      return 1;
    });

    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 基本レンダリングテスト
  describe("基本レンダリング", () => {
    it("canvasタグとしてレンダリングされる", () => {
      const { container } = render(<ParticleBackground />);
      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
    });

    it("固定位置でレンダリングされる", () => {
      const { container } = render(<ParticleBackground />);
      const canvas = container.querySelector("canvas");
      expect(canvas).toHaveClass("fixed");
      expect(canvas).toHaveClass("inset-0");
    });

    it("カスタムクラス名を適用できる", () => {
      const { container } = render(
        <ParticleBackground className="custom-class" />,
      );
      const canvas = container.querySelector("canvas");
      expect(canvas).toHaveClass("custom-class");
    });
  });

  // プロパティのテスト
  describe("プロパティ", () => {
    it("particleCountプロパティを受け取る", () => {
      const { container } = render(<ParticleBackground particleCount={100} />);
      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
    });

    it("particleColorプロパティを受け取る", () => {
      const { container } = render(
        <ParticleBackground particleColor="#ff0000" />,
      );
      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
    });

    it("particleSizeプロパティを受け取る", () => {
      const { container } = render(<ParticleBackground particleSize={5} />);
      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
    });

    it("speedプロパティを受け取る", () => {
      const { container } = render(<ParticleBackground speed={1.5} />);
      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
    });

    it("interactiveプロパティを受け取る", () => {
      const { container } = render(<ParticleBackground interactive={false} />);
      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
    });
  });

  // Canvas APIの使用テスト
  describe("Canvas API", () => {
    it("2Dコンテキストを取得する", () => {
      render(<ParticleBackground />);
      expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith("2d");
    });

    it("requestAnimationFrameを呼び出す", () => {
      render(<ParticleBackground />);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  // アクセシビリティのテスト
  describe("アクセシビリティ", () => {
    it("aria-hidden属性を持つ", () => {
      const { container } = render(<ParticleBackground />);
      const canvas = container.querySelector("canvas");
      expect(canvas).toHaveAttribute("aria-hidden", "true");
    });

    it("role=presentation属性を持つ", () => {
      const { container } = render(<ParticleBackground />);
      const canvas = container.querySelector("canvas");
      expect(canvas).toHaveAttribute("role", "presentation");
    });

    it("pointer-events-noneクラスを持つ", () => {
      const { container } = render(<ParticleBackground />);
      const canvas = container.querySelector("canvas");
      expect(canvas).toHaveClass("pointer-events-none");
    });
  });

  // クリーンアップのテスト
  describe("クリーンアップ", () => {
    it("アンマウント時にanimationFrameをキャンセルする", () => {
      const { unmount } = render(<ParticleBackground />);
      unmount();
      expect(window.cancelAnimationFrame).toHaveBeenCalled();
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

      render(<ParticleBackground />);
      expect(matchMediaMock).toHaveBeenCalledWith(
        "(prefers-reduced-motion: reduce)",
      );
    });
  });

  // スタイルのテスト
  describe("スタイル", () => {
    it("width: 100%のインラインスタイルを持つ", () => {
      const { container } = render(<ParticleBackground />);
      const canvas = container.querySelector("canvas");
      expect(canvas).toHaveStyle({ width: "100%" });
    });

    it("height: 100%のインラインスタイルを持つ", () => {
      const { container } = render(<ParticleBackground />);
      const canvas = container.querySelector("canvas");
      expect(canvas).toHaveStyle({ height: "100%" });
    });
  });
});
