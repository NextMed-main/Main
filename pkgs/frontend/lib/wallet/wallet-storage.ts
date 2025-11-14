/**
 * ウォレット接続情報のlocalStorage管理
 */

import type { WalletConnection, WalletName } from "./types";

/**
 * localStorage キー
 */
const STORAGE_KEY = "nextmed_wallet_connection";

/**
 * ウォレット接続情報を保存
 * @param walletName ウォレット名
 * @param address ウォレットアドレス
 */
export function saveConnection(
	walletName: WalletName,
	address: string,
): void {
	try {
		const connection: WalletConnection = {
			walletName,
			address,
			connectedAt: Date.now(),
		};

		localStorage.setItem(STORAGE_KEY, JSON.stringify(connection));
	} catch (error) {
		console.error("Failed to save wallet connection:", error);
	}
}

/**
 * ウォレット接続情報を読み込み
 * @returns ウォレット接続情報（存在しない場合はnull）
 */
export function loadConnection(): WalletConnection | null {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);

		if (!stored) {
			return null;
		}

		const connection = JSON.parse(stored) as WalletConnection;

		// 基本的なバリデーション
		if (
			!connection.walletName ||
			!connection.address ||
			!connection.connectedAt
		) {
			console.warn("Invalid wallet connection data in localStorage");
			clearConnection();
			return null;
		}

		return connection;
	} catch (error) {
		console.error("Failed to load wallet connection:", error);
		clearConnection();
		return null;
	}
}

/**
 * ウォレット接続情報を削除
 */
export function clearConnection(): void {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.error("Failed to clear wallet connection:", error);
	}
}

/**
 * ウォレット接続情報が存在するか確認
 * @returns 接続情報の存在
 */
export function hasConnection(): boolean {
	try {
		return localStorage.getItem(STORAGE_KEY) !== null;
	} catch (error) {
		console.error("Failed to check wallet connection:", error);
		return false;
	}
}
