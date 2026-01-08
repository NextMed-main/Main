/**
 * ウォレットAPI実装
 * CIP-30プロトコルを使用したウォレット接続機能
 */

import { WALLET_PROVIDERS } from "./providers";
import type {
  CardanoWalletProvider,
  CardanoWindow,
  Cip30WalletApi,
  WalletName,
} from "./types";
import { WalletError } from "./types";

/**
 * Cardano Window オブジェクトを取得
 * @returns CardanoWindow
 */
function getCardanoWindow(): CardanoWindow {
  if (typeof window === "undefined") {
    throw new WalletError(
      "UNKNOWN_ERROR",
      "Window object is not available (SSR environment)",
    );
  }
  return window as CardanoWindow;
}

/**
 * インストール済みウォレットを検出
 * @returns インストール済みウォレット名の配列
 */
export function detectWallets(): WalletName[] {
  try {
    const cardanoWindow = getCardanoWindow();
    const cardano = cardanoWindow.cardano;

    if (!cardano) {
      return [];
    }

    const installedWallets: WalletName[] = [];

    // 各ウォレットの存在を確認
    if (cardano.lace) installedWallets.push("lace");
    if (cardano.yoroi) installedWallets.push("yoroi");
    if (cardano.eternl) installedWallets.push("eternl");

    return installedWallets;
  } catch (error) {
    console.error("Failed to detect wallets:", error);
    return [];
  }
}

/**
 * 特定のウォレットがインストールされているか確認
 * @param walletName ウォレット名
 * @returns インストール状態
 */
export function isWalletInstalled(walletName: WalletName): boolean {
  try {
    const cardanoWindow = getCardanoWindow();
    const cardano = cardanoWindow.cardano;

    if (!cardano) {
      return false;
    }

    const provider = WALLET_PROVIDERS[walletName];
    return !!cardano[provider.windowKey as keyof typeof cardano];
  } catch (error) {
    console.error(`Failed to check wallet installation:`, error);
    return false;
  }
}

/**
 * ウォレットプロバイダーを取得
 * @param walletName ウォレット名
 * @returns ウォレットプロバイダー
 * @throws WalletError ウォレットが見つからない場合
 */
function getWalletProvider(walletName: WalletName): CardanoWalletProvider {
  const cardanoWindow = getCardanoWindow();
  const cardano = cardanoWindow.cardano;

  if (!cardano) {
    throw new WalletError(
      "WALLET_NOT_INSTALLED",
      "Cardano wallet extension is not installed",
    );
  }

  const provider = WALLET_PROVIDERS[walletName];
  const walletProvider = cardano[provider.windowKey as keyof typeof cardano];

  if (!walletProvider) {
    throw new WalletError(
      "WALLET_NOT_INSTALLED",
      `${provider.displayName} wallet is not installed`,
    );
  }

  return walletProvider;
}

/**
 * ウォレットに接続
 * @param walletName ウォレット名
 * @returns CIP-30 Wallet API
 * @throws WalletError 接続に失敗した場合
 */
export async function connectWallet(
  walletName: WalletName,
): Promise<Cip30WalletApi> {
  try {
    const provider = getWalletProvider(walletName);

    // ウォレットを有効化
    const api = await provider.enable();

    if (!api) {
      throw new WalletError("CONNECTION_FAILED", "Failed to enable wallet API");
    }

    return api;
  } catch (error) {
    // エラーハンドリング
    if (error instanceof WalletError) {
      throw error;
    }

    // ユーザーがキャンセルした場合
    if (
      error instanceof Error &&
      (error.message.includes("user rejected") ||
        error.message.includes("cancelled") ||
        error.message.includes("canceled"))
    ) {
      throw new WalletError(
        "CONNECTION_REJECTED",
        "User rejected wallet connection",
      );
    }

    // その他のエラー
    console.error("Wallet connection error:", error);
    throw new WalletError(
      "CONNECTION_FAILED",
      error instanceof Error ? error.message : "Unknown error occurred",
    );
  }
}

/**
 * プライマリアドレスを取得
 * @param api CIP-30 Wallet API
 * @returns Bech32m形式のアドレス
 * @throws WalletError アドレス取得に失敗した場合
 */
export async function getAddress(api: Cip30WalletApi): Promise<string> {
  try {
    // 方法1: 使用済みアドレスを取得
    try {
      const usedAddresses = await api.getUsedAddresses();
      if (usedAddresses && usedAddresses.length > 0) {
        return usedAddresses[0];
      }
    } catch (error) {
      console.warn(
        "getUsedAddresses failed, trying alternative methods:",
        error,
      );
    }

    // 方法2: 未使用アドレスを取得
    try {
      const unusedAddresses = await api.getUnusedAddresses();
      if (unusedAddresses && unusedAddresses.length > 0) {
        return unusedAddresses[0];
      }
    } catch (error) {
      console.warn("getUnusedAddresses failed, trying change address:", error);
    }

    // 方法3: お釣りアドレスを取得
    try {
      const changeAddress = await api.getChangeAddress();
      if (changeAddress) {
        return changeAddress;
      }
    } catch (error) {
      console.warn("getChangeAddress failed:", error);
    }

    // すべての方法が失敗した場合
    throw new WalletError(
      "CONNECTION_FAILED",
      "No addresses found in wallet. Please ensure your wallet has at least one address.",
    );
  } catch (error) {
    if (error instanceof WalletError) {
      throw error;
    }

    console.error("Failed to get address:", error);
    throw new WalletError(
      "CONNECTION_FAILED",
      error instanceof Error ? error.message : "Failed to get address",
    );
  }
}

/**
 * ウォレット残高を取得
 * @param api CIP-30 Wallet API
 * @returns 残高（文字列形式）
 * @throws WalletError 残高取得に失敗した場合
 */
export async function getBalance(api: Cip30WalletApi): Promise<string> {
  try {
    return await api.getBalance();
  } catch (error) {
    console.error("Failed to get balance:", error);
    throw new WalletError(
      "CONNECTION_FAILED",
      error instanceof Error ? error.message : "Failed to get balance",
    );
  }
}

/**
 * アドレスを短縮形式で表示
 * @param address 完全なアドレス
 * @param prefixLength 先頭の文字数（デフォルト: 6）
 * @param suffixLength 末尾の文字数（デフォルト: 4）
 * @returns 短縮されたアドレス（例: "addr1...xyz"）
 */
export function formatAddress(
  address: string,
  prefixLength = 6,
  suffixLength = 4,
): string {
  if (address.length <= prefixLength + suffixLength) {
    return address;
  }

  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);

  return `${prefix}...${suffix}`;
}

/**
 * ウォレットインストールページを開く
 * @param walletName ウォレット名
 */
export function openWalletInstallPage(walletName: WalletName): void {
  const provider = WALLET_PROVIDERS[walletName];
  window.open(provider.installUrl, "_blank", "noopener,noreferrer");
}
