/**
 * Midnight Wallet統合用のユーティリティ関数
 */

import type {
	WalletName,
	Cip30WalletApi,
	CardanoWindow,
	WalletConnection,
	WalletInfo,
} from "../types/wallet-types";
import { WalletError } from "../types/wallet-types";

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
 * ウォレットアイコンのパスを取得
 */
export function getWalletIconPath(walletName: WalletName): string {
	const icons: Record<WalletName, string> = {
		lace: "/wallet-icons/lace.png",
		yoroi: "/wallet-icons/yoroi.png",
		eternl: "/wallet-icons/eternl.png",
	};
	return icons[walletName];
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
	const windowObj = window as CardanoWindow;
	
	// CIP-30ウォレットをチェック（通常のLace Walletを含む）
	const cardano = windowObj.cardano;
	if (cardano?.[walletName]) {
		return true;
	}
	
	// Midnight Network用のLace Walletをチェック（フォールバック）
	if (walletName === "lace" && windowObj.midnight?.mnLace) {
		return true;
	}
	
	return false;
}

/**
 * 利用可能なウォレット情報を取得
 */
export function getAvailableWallets(): WalletInfo[] {
	const windowObj = window as CardanoWindow;
	const cardano = windowObj.cardano;
	const walletNames: WalletName[] = ["lace", "yoroi", "eternl"];

	// デバッグ: windowオブジェクトの状態を確認
	if (typeof window !== "undefined") {
		console.log("[Wallet Debug] window.cardano:", cardano);
		console.log("[Wallet Debug] window.midnight:", windowObj.midnight);
		if (cardano) {
			console.log("[Wallet Debug] cardano keys:", Object.keys(cardano));
			console.log("[Wallet Debug] cardano.lace:", cardano.lace);
			console.log("[Wallet Debug] cardano.yoroi:", cardano.yoroi);
			console.log("[Wallet Debug] cardano.eternl:", cardano.eternl);
		}
		if (windowObj.midnight) {
			console.log("[Wallet Debug] window.midnight keys:", Object.keys(windowObj.midnight));
			console.log("[Wallet Debug] window.midnight.mnLace:", windowObj.midnight.mnLace);
			// Midnight専用APIの可能性をチェック
			console.log("[Wallet Debug] window.midnight.mnYoroi:", (windowObj.midnight as any).mnYoroi);
			console.log("[Wallet Debug] window.midnight.mnEternl:", (windowObj.midnight as any).mnEternl);
		}
	}

	return walletNames.map((name) => {
		let installed = false;
		let provider: WalletInfo["provider"];
		let isMidnightNative = false;
		
		// まずMidnight Network専用APIをチェック
		const midnightKey = `mn${name.charAt(0).toUpperCase() + name.slice(1)}` as keyof typeof windowObj.midnight;
		if (windowObj.midnight && (windowObj.midnight as any)[midnightKey]) {
			installed = true;
			isMidnightNative = true;
			const midnightApi = (windowObj.midnight as any)[midnightKey];
			provider = {
				enable: async () => {
					const api = await midnightApi.enable();
					// Midnight専用APIの場合はアダプターを使用
					return createMidnightLaceAdapter(api);
				},
				isEnabled: () => midnightApi.isEnabled ? midnightApi.isEnabled() : Promise.resolve(false),
				apiVersion: "1.0.0",
				name: `${getWalletDisplayName(name)} (Midnight)`,
				icon: getWalletIconPath(name),
			};
			console.log(`[Wallet Debug] Found ${name} via window.midnight.${midnightKey} (Midnight Native)`);
		} else if (name === "lace" && windowObj.midnight?.mnLace) {
			// Midnight Network用のLace Walletをフォールバックとしてチェック
			installed = true;
			isMidnightNative = true;
			// mnLaceをCIP-30互換のプロバイダーとして扱う
			provider = {
				enable: async () => {
					const api = await windowObj.midnight!.mnLace!.enable();
					return createMidnightLaceAdapter(api);
				},
				isEnabled: () => windowObj.midnight!.mnLace!.isEnabled(),
				apiVersion: "1.0.0",
				name: "Lace (Midnight)",
				icon: getWalletIconPath("lace"),
			};
			console.log("[Wallet Debug] Found lace via window.midnight.mnLace");
		} else if (cardano?.[name]) {
			// 通常のCIP-30ウォレットをチェック（Cardano用）
			installed = true;
			provider = cardano[name];
			console.log(`[Wallet Debug] Found ${name} via cardano.${name} (Cardano only - may not support Midnight)`);
		} else {
			console.log(`[Wallet Debug] ${name} not found`);
		}
		
		return {
			name,
			displayName: getWalletDisplayName(name) + (isMidnightNative ? " (Midnight)" : " (Cardano)"),
			installed,
			provider,
			icon: getWalletIconPath(name),
			isMidnightNative,
		};
	});
}

/**
 * ウォレットに接続
 */
export async function connectWallet(
	walletName: WalletName,
): Promise<Cip30WalletApi> {
	const windowObj = window as CardanoWindow;
	const cardano = windowObj.cardano;

	console.log(`[Wallet Debug] Attempting to connect to ${walletName}`);
	console.log("[Wallet Debug] window.cardano:", cardano);
	console.log("[Wallet Debug] cardano?.[walletName]:", cardano?.[walletName]);
	console.log("[Wallet Debug] window.midnight?.mnLace:", windowObj.midnight?.mnLace);
	
	// まずMidnight Network専用APIをチェック
	const midnightKey = `mn${walletName.charAt(0).toUpperCase() + walletName.slice(1)}` as keyof typeof windowObj.midnight;
	if (windowObj.midnight && (windowObj.midnight as any)[midnightKey]) {
		console.log(`[Wallet Debug] Found Midnight native API: window.midnight.${midnightKey}`);
		const midnightApi = (windowObj.midnight as any)[midnightKey];
		try {
			const api = await midnightApi.enable();
			console.log("[Wallet Debug] Successfully enabled Midnight native wallet");
			return createMidnightLaceAdapter(api);
		} catch (error) {
			console.error(`[Wallet Debug] Error enabling Midnight native ${walletName}:`, error);
			if (error instanceof WalletError) {
				throw error;
			}
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
					: "Failed to connect to Midnight native wallet",
			);
		}
	}

	// まず通常のCIP-30ウォレットをチェック（通常のLace Walletを含む）
	if (cardano?.[walletName]) {
		const provider = cardano[walletName];
		console.log(`[Wallet Debug] Found provider for ${walletName}, attempting to enable...`);
		
		try {
			// ウォレットを有効化
			const api = await provider.enable();
			console.log(`[Wallet Debug] Successfully enabled ${walletName}`);

			if (!api) {
				throw new WalletError(
					"CONNECTION_FAILED",
					"Failed to enable wallet API",
				);
			}

			return api;
		} catch (error) {
			console.error(`[Wallet Debug] Error enabling ${walletName}:`, error);
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

	// Midnight Network用のLace Walletの場合（フォールバック）
	if (walletName === "lace" && windowObj.midnight?.mnLace) {
		console.log("[Wallet Debug] Attempting to connect via window.midnight.mnLace");
		try {
			const api = await windowObj.midnight.mnLace.enable();
			console.log("[Wallet Debug] Successfully enabled Midnight Network Lace Wallet");
			console.log("[Wallet Debug] API object:", api);
			console.log("[Wallet Debug] API keys:", api ? Object.keys(api) : "null");
			
			// APIがCIP-30互換かどうかを確認
			if (api && typeof api.getUsedAddresses === "function") {
				console.log("[Wallet Debug] API is CIP-30 compatible");
				return api as Cip30WalletApi;
			}
			
			// CIP-30互換でない場合、アダプターを作成
			console.log("[Wallet Debug] API is not CIP-30 compatible, creating adapter");
			return createMidnightLaceAdapter(api);
		} catch (error) {
			console.error("[Wallet Debug] Error enabling Midnight Network Lace Wallet:", error);
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
					: "Failed to connect to Midnight Network Lace Wallet",
			);
		}
	}

	// ウォレットが見つからない場合
	if (!cardano) {
		console.log("[Wallet Debug] window.cardano is undefined");
		throw new WalletError(
			"WALLET_NOT_INSTALLED",
			"Cardano wallet extension is not installed",
		);
	}

	console.log(`[Wallet Debug] ${walletName} not found in cardano object`);
	throw new WalletError(
		"WALLET_NOT_INSTALLED",
		`${getWalletDisplayName(walletName)} wallet is not installed`,
	);

}

/**
 * Midnight Network Lace Wallet APIをCIP-30互換のAPIに変換するアダプター
 * 
 * Midnight NetworkのLace Walletは独自のDApp Connector APIを使用しており、
 * CIP-30とは異なる構造を持っています。
 * - state()メソッドでアドレスを取得（state.address）
 * - getUsedAddresses()やgetBalance()のようなCIP-30メソッドは存在しない
 */
function createMidnightLaceAdapter(api: any): Cip30WalletApi {
	console.log("[Wallet Debug] Creating adapter for Midnight Lace Wallet API");
	console.log("[Wallet Debug] Available methods:", Object.keys(api));
	
	// state()メソッドでアドレスを取得するヘルパー関数
	const getAddressFromState = async (): Promise<string> => {
		if (typeof api.state === "function") {
			const state = await api.state();
			if (state && state.address) {
				return state.address;
			}
		}
		throw new Error("Could not get address from Midnight Lace Wallet API state");
	};
	
	// CIP-30互換のAPIを作成
	return {
		getUsedAddresses: async () => {
			// Midnight Lace Walletではstate()でアドレスを取得
			const address = await getAddressFromState();
			return [address];
		},
		getUnusedAddresses: async () => {
			// Midnight Lace Walletでは未使用アドレスの概念がない
			// 使用済みアドレスと同じものを返す
			const address = await getAddressFromState();
			return [address];
		},
		getChangeAddress: async () => {
			// Midnight Lace Walletではstate()でアドレスを取得
			return await getAddressFromState();
		},
		getBalance: async () => {
			// Midnight Lace Wallet APIには残高取得メソッドが直接存在しない
			// state()から残高情報を取得できる可能性があるが、ドキュメントでは未確認
			// とりあえず"0"を返す（実際の実装では、indexer APIなどから取得する必要がある可能性）
			console.warn("[Wallet Debug] Midnight Lace Wallet API does not provide balance directly. Returning '0'.");
			return "0";
		},
		signData: api.sign ? async (address: string, payload: string) => {
			// Midnight Lace Walletのsign()メソッドを使用
			// ただし、sign()のシグネチャがCIP-30のsignDataと異なる可能性がある
			if (typeof api.sign === "function") {
				try {
					return await api.sign(payload);
				} catch (error) {
					console.error("[Wallet Debug] Error signing data:", error);
					throw error;
				}
			}
			return undefined;
		} : undefined,
	};
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
		WALLET_NOT_INSTALLED: "Wallet is not installed",
		CONNECTION_REJECTED: "Connection was rejected",
		CONNECTION_FAILED: "Failed to connect to wallet",
		NETWORK_ERROR: "Network error occurred",
		UNKNOWN_ERROR: "An unexpected error occurred",
	};

	return messages[code] || messages.UNKNOWN_ERROR;
}

