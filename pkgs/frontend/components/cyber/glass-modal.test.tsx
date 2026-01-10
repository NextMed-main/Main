import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  GlassModal,
  GlassModalContent,
  GlassModalDescription,
  GlassModalFooter,
  GlassModalHeader,
  GlassModalTitle,
  GlassModalTrigger,
} from "./glass-modal";

describe("GlassModal", () => {
  // 基本レンダリングテスト
  describe("基本レンダリング", () => {
    it("トリガーボタンをレンダリングする", () => {
      render(
        <GlassModal>
          <GlassModalTrigger>モーダルを開く</GlassModalTrigger>
          <GlassModalContent>
            <GlassModalHeader>
              <GlassModalTitle>タイトル</GlassModalTitle>
            </GlassModalHeader>
          </GlassModalContent>
        </GlassModal>,
      );
      expect(screen.getByText("モーダルを開く")).toBeInTheDocument();
    });

    it("トリガークリックでモーダルを開く", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>モーダルを開く</GlassModalTrigger>
          <GlassModalContent>
            <GlassModalHeader>
              <GlassModalTitle>モーダルタイトル</GlassModalTitle>
            </GlassModalHeader>
          </GlassModalContent>
        </GlassModal>,
      );

      const trigger = screen.getByText("モーダルを開く");
      await user.click(trigger);

      expect(screen.getByText("モーダルタイトル")).toBeInTheDocument();
    });
  });

  // バリアントプロパティのテスト
  describe("バリアントプロパティ", () => {
    it("defaultバリアントを適用する", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent variant="default">
            <GlassModalTitle>タイトル</GlassModalTitle>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      const content = screen
        .getByText("タイトル")
        .closest("[data-slot='glass-modal-content']");
      expect(content?.className).toContain("bg-white/10");
    });

    it("primaryバリアントを適用する", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent variant="primary">
            <GlassModalTitle>タイトル</GlassModalTitle>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      const content = screen
        .getByText("タイトル")
        .closest("[data-slot='glass-modal-content']");
      expect(content?.className).toContain("bg-indigo-500/10");
    });

    it("secondaryバリアントを適用する", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent variant="secondary">
            <GlassModalTitle>タイトル</GlassModalTitle>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      const content = screen
        .getByText("タイトル")
        .closest("[data-slot='glass-modal-content']");
      expect(content?.className).toContain("bg-emerald-500/10");
    });

    it("accentバリアントを適用する", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent variant="accent">
            <GlassModalTitle>タイトル</GlassModalTitle>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      const content = screen
        .getByText("タイトル")
        .closest("[data-slot='glass-modal-content']");
      expect(content?.className).toContain("bg-cyan-500/10");
    });
  });

  // グロー効果のテスト
  describe("グロー効果", () => {
    it("glow=trueで強いシャドウを適用する", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent glow={true}>
            <GlassModalTitle>タイトル</GlassModalTitle>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      const content = screen
        .getByText("タイトル")
        .closest("[data-slot='glass-modal-content']");
      expect(content?.className).toContain("shadow-2xl");
    });
  });

  // 閉じるボタンのテスト
  describe("閉じるボタン", () => {
    it("デフォルトで閉じるボタンを表示する", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent>
            <GlassModalTitle>タイトル</GlassModalTitle>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      expect(screen.getByText("Close")).toBeInTheDocument();
    });

    it("showCloseButton=falseで閉じるボタンを非表示にする", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent showCloseButton={false}>
            <GlassModalTitle>タイトル</GlassModalTitle>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      expect(screen.queryByText("Close")).not.toBeInTheDocument();
    });

    it("閉じるボタンクリックでモーダルを閉じる", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent>
            <GlassModalTitle>タイトル</GlassModalTitle>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      expect(screen.getByText("タイトル")).toBeInTheDocument();

      const closeButton = screen.getByText("Close");
      await user.click(closeButton);

      // モーダルが閉じられることを確認
      // Radix UIのアニメーション後に要素が削除される
      expect(screen.queryByText("タイトル")).not.toBeInTheDocument();
    });
  });

  // ヘッダーとフッターのテスト
  describe("ヘッダーとフッター", () => {
    it("GlassModalHeaderをレンダリングする", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent>
            <GlassModalHeader>
              <GlassModalTitle>ヘッダータイトル</GlassModalTitle>
            </GlassModalHeader>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      expect(screen.getByText("ヘッダータイトル")).toBeInTheDocument();
    });

    it("GlassModalFooterをレンダリングする", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent>
            <GlassModalFooter>
              <button>キャンセル</button>
              <button>確認</button>
            </GlassModalFooter>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      expect(screen.getByText("キャンセル")).toBeInTheDocument();
      expect(screen.getByText("確認")).toBeInTheDocument();
    });
  });

  // タイトルと説明のテスト
  describe("タイトルと説明", () => {
    it("GlassModalTitleをレンダリングする", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent>
            <GlassModalTitle>モーダルタイトル</GlassModalTitle>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      expect(screen.getByText("モーダルタイトル")).toBeInTheDocument();
    });

    it("GlassModalDescriptionをレンダリングする", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent>
            <GlassModalDescription>
              これはモーダルの説明文です
            </GlassModalDescription>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      expect(
        screen.getByText("これはモーダルの説明文です"),
      ).toBeInTheDocument();
    });
  });

  // オーバーレイのテスト
  describe("オーバーレイ", () => {
    it("モーダルを開くとオーバーレイを表示する", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent>
            <GlassModalTitle>タイトル</GlassModalTitle>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      // オーバーレイはポータル内にレンダリングされるため、document.bodyから検索
      const overlay = document.body.querySelector(
        "[data-slot='glass-modal-overlay']",
      );
      expect(overlay).toBeInTheDocument();
    });
  });

  // カスタムクラス名のテスト
  describe("カスタムクラス名", () => {
    it("GlassModalContentにカスタムクラスを適用できる", async () => {
      const user = userEvent.setup();
      render(
        <GlassModal>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent className="custom-modal-class">
            <GlassModalTitle>タイトル</GlassModalTitle>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      const content = screen
        .getByText("タイトル")
        .closest("[data-slot='glass-modal-content']");
      expect(content).toHaveClass("custom-modal-class");
    });
  });

  // 制御されたモーダルのテスト
  describe("制御されたモーダル", () => {
    it("openプロパティでモーダルの開閉を制御できる", () => {
      const { rerender } = render(
        <GlassModal open={false}>
          <GlassModalContent>
            <GlassModalTitle>タイトル</GlassModalTitle>
          </GlassModalContent>
        </GlassModal>,
      );

      expect(screen.queryByText("タイトル")).not.toBeInTheDocument();

      rerender(
        <GlassModal open={true}>
          <GlassModalContent>
            <GlassModalTitle>タイトル</GlassModalTitle>
          </GlassModalContent>
        </GlassModal>,
      );

      expect(screen.getByText("タイトル")).toBeInTheDocument();
    });

    it("onOpenChangeコールバックが呼ばれる", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <GlassModal onOpenChange={handleOpenChange}>
          <GlassModalTrigger>開く</GlassModalTrigger>
          <GlassModalContent>
            <GlassModalTitle>タイトル</GlassModalTitle>
          </GlassModalContent>
        </GlassModal>,
      );

      await user.click(screen.getByText("開く"));
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });
});
