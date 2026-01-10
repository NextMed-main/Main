/**
 * ウォレットプロバイダー設定
 * サポートされている4つのウォレットの設定情報
 */

import type { WalletName, WalletProvider } from "./types";

/**
 * Extended wallet provider with Midnight support flag
 */
export interface ExtendedWalletProvider extends WalletProvider {
  /** Whether this wallet uses Midnight DApp Connector API (vs CIP-30) */
  isMidnight: boolean;
  /** Description of the wallet */
  description: string;
  /** Badge text to display (e.g., "Recommended") */
  badge?: string;
}

/**
 * ウォレットプロバイダー設定マップ
 */
export const WALLET_PROVIDERS: Record<WalletName, ExtendedWalletProvider> = {
  lace: {
    name: "lace",
    displayName: "Lace (Midnight)",
    icon: "/wallet-icons/lace.png",
    installUrl:
      "https://chromewebstore.google.com/detail/lace-midnight-preview/hgeekaiplokcnmakghbdfbgnlfheichg",
    windowKey: "lace",
    isMidnight: true,
    description:
      "Connect via Midnight DApp Connector for zero-knowledge proofs",
    badge: "Recommended",
  },
  yoroi: {
    name: "yoroi",
    displayName: "Yoroi",
    icon: "/wallet-icons/yoroi.png",
    installUrl: "https://yoroi-wallet.com/",
    windowKey: "yoroi",
    isMidnight: false,
    description: "Cardano wallet (CIP-30)",
  },
  eternl: {
    name: "eternl",
    displayName: "Eternl",
    icon: "/wallet-icons/eternl.png",
    installUrl: "https://eternl.io/",
    windowKey: "eternl",
    isMidnight: false,
    description: "Cardano wallet (CIP-30)",
  },
};

/**
 * サポートされているウォレット名の配列
 * Lace (Midnight) is listed first as preferred option
 */
export const SUPPORTED_WALLETS: WalletName[] = ["lace", "yoroi", "eternl"];

/**
 * ウォレット名からプロバイダー情報を取得
 * @param walletName ウォレット名
 * @returns ウォレットプロバイダー情報
 */
export function getWalletProvider(
  walletName: WalletName,
): ExtendedWalletProvider {
  return WALLET_PROVIDERS[walletName];
}

/**
 * すべてのウォレットプロバイダー情報を取得
 * @returns ウォレットプロバイダー情報の配列
 */
export function getAllWalletProviders(): ExtendedWalletProvider[] {
  return SUPPORTED_WALLETS.map((name) => WALLET_PROVIDERS[name]);
}

/**
 * Get only Midnight-compatible wallet providers
 * @returns Array of Midnight wallet providers
 */
export function getMidnightWalletProviders(): ExtendedWalletProvider[] {
  return getAllWalletProviders().filter((provider) => provider.isMidnight);
}
