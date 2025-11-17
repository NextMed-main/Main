/**
 * Midnight Wallet統合用のユーティリティ関数
 */

import type {
	WalletName,
	Cip30WalletApi,
	CardanoWindow,
	WalletConnection,
	WalletInfo,
} from "./wallet-types";
import { WalletError } from "./wallet-types";

/**
 * ウォレットの表示名を取得
 */
export function getWalletDisplayName(walletName: WalletName): string {
	const names: Record<WalletName, string> = {
		lace: "Lace Wallet",
		yoroi: "Yoroi",
		eternl: "Eternl",
	};
	return names[walletName];
}

/**
 * インストールされているウォレットを検出
 */
export function detectWallets(): WalletName[] {
	const cardano = (window as CardanoWindow).cardano;

	if (!cardano) {
		return [];
	}

	const installedWallets: WalletName[] = [];

	if (cardano.lace) installedWallets.push("lace");
	if (cardano.yoroi) installedWallets.push("yoroi");
	if (cardano.eternl) installedWallets.push("eternl");

	return installedWallets;
}

/**
 * ウォレットがインストールされているか確認
 */
export function isWalletInstalled(walletName: WalletName): boolean {
	const cardano = (window as CardanoWindow).cardano;
	return !!cardano?.[walletName];
}

/**
 * 利用可能なウォレット情報を取得
 */
export function getAvailableWallets(): WalletInfo[] {
	const cardano = (window as CardanoWindow).cardano;
	const walletNames: WalletName[] = ["lace", "yoroi", "eternl"];

	return walletNames.map((name) => ({
		name,
		displayName: getWalletDisplayName(name),
		installed: !!cardano?.[name],
		provider: cardano?.[name],
	}));
}

/**
 * ウォレットに接続
 */
export async function connectWallet(
	walletName: WalletName,
): Promise<Cip30WalletApi> {
	const cardano = (window as CardanoWindow).cardano;

	if (!cardano) {
		throw new WalletError(
			"WALLET_NOT_INSTALLED",
			"Cardano wallet extension is not installed",
		);
	}

	const provider = cardano[walletName];

	if (!provider) {
		throw new WalletError(
			"WALLET_NOT_INSTALLED",
			`${getWalletDisplayName(walletName)} wallet is not installed`,
		);
	}

	try {
		// ウォレットを有効化
		const api = await provider.enable();

		if (!api) {
			throw new WalletError(
				"CONNECTION_FAILED",
				"Failed to enable wallet API",
			);
		}

		return api;
	} catch (error) {
		if (error instanceof WalletError) {
			throw error;
		}

		// ユーザーが接続を拒否した場合
		if (
			error instanceof Error &&
			(error.message.includes("reject") ||
				error.message.includes("denied") ||
				error.message.includes("cancel"))
		) {
			throw new WalletError(
				"CONNECTION_REJECTED",
				"Connection was rejected by user",
			);
		}

		throw new WalletError(
			"CONNECTION_FAILED",
			error instanceof Error
				? error.message
				: "Failed to connect to wallet",
		);
	}
}

/**
 * アドレスを取得（複数の方法を試行）
 */
export async function getAddress(
	api: Cip30WalletApi,
): Promise<string> {
	// 方法1: 使用済みアドレスを取得
	try {
		const usedAddresses = await api.getUsedAddresses();
		if (usedAddresses && usedAddresses.length > 0) {
			return usedAddresses[0];
		}
	} catch (error) {
		console.warn("getUsedAddresses failed, trying alternative methods", error);
	}

	// 方法2: 未使用アドレスを取得
	try {
		const unusedAddresses = await api.getUnusedAddresses();
		if (unusedAddresses && unusedAddresses.length > 0) {
			return unusedAddresses[0];
		}
	} catch (error) {
		console.warn(
			"getUnusedAddresses failed, trying change address",
			error,
		);
	}

	// 方法3: お釣りアドレスを取得
	try {
		const changeAddress = await api.getChangeAddress();
		if (changeAddress) {
			return changeAddress;
		}
	} catch (error) {
		console.warn("getChangeAddress failed", error);
	}

	throw new Error("No addresses found in wallet");
}

/**
 * 残高を取得
 */
export async function getBalance(api: Cip30WalletApi): Promise<string> {
	return await api.getBalance();
}

/**
 * アドレスをフォーマット（短縮表示）
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
 * 接続情報を保存
 */
export function saveConnection(
	walletName: WalletName,
	address: string,
): void {
	const connection: WalletConnection = {
		walletName,
		address,
		connectedAt: Date.now(),
	};
	localStorage.setItem("wallet_connection", JSON.stringify(connection));
}

/**
 * 保存された接続情報を読み込む
 */
export function loadConnection(): WalletConnection | null {
	try {
		const saved = localStorage.getItem("wallet_connection");
		return saved ? JSON.parse(saved) : null;
	} catch {
		return null;
	}
}

/**
 * 接続情報をクリア
 */
export function clearConnection(): void {
	localStorage.removeItem("wallet_connection");
}

/**
 * エラーメッセージを取得
 */
export function getErrorMessage(code: string): string {
	const messages: Record<string, string> = {
		WALLET_NOT_INSTALLED: "ウォレットがインストールされていません",
		CONNECTION_REJECTED: "接続が拒否されました",
		CONNECTION_FAILED: "ウォレットへの接続に失敗しました",
		NETWORK_ERROR: "ネットワークエラーが発生しました",
		UNKNOWN_ERROR: "予期しないエラーが発生しました",
	};

	return messages[code] || messages.UNKNOWN_ERROR;
}

