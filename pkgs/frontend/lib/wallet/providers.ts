/**
 * ウォレットプロバイダー設定
 * サポートされている4つのウォレットの設定情報
 */

import type { WalletName, WalletProvider } from "./types";

/**
 * ウォレットプロバイダー設定マップ
 */
export const WALLET_PROVIDERS: Record<WalletName, WalletProvider> = {
	lace: {
		name: "lace",
		displayName: "Lace",
		icon: "/wallet-icons/lace.png",
		installUrl: "https://www.lace.io/",
		windowKey: "lace",
	},
	yoroi: {
		name: "yoroi",
		displayName: "Yoroi",
		icon: "/wallet-icons/yoroi.png",
		installUrl: "https://yoroi-wallet.com/",
		windowKey: "yoroi",
	},
	eternl: {
		name: "eternl",
		displayName: "Eternl",
		icon: "/wallet-icons/eternl.png",
		installUrl: "https://eternl.io/",
		windowKey: "eternl",
	},
};

/**
 * サポートされているウォレット名の配列
 */
export const SUPPORTED_WALLETS: WalletName[] = ["lace", "yoroi", "eternl"];

/**
 * ウォレット名からプロバイダー情報を取得
 * @param walletName ウォレット名
 * @returns ウォレットプロバイダー情報
 */
export function getWalletProvider(walletName: WalletName): WalletProvider {
	return WALLET_PROVIDERS[walletName];
}

/**
 * すべてのウォレットプロバイダー情報を取得
 * @returns ウォレットプロバイダー情報の配列
 */
export function getAllWalletProviders(): WalletProvider[] {
	return SUPPORTED_WALLETS.map((name) => WALLET_PROVIDERS[name]);
}
