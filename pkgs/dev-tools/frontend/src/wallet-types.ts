/**
 * Midnight Wallet統合用の型定義
 * CIP-30プロトコルに準拠
 */

export type WalletName = "lace" | "yoroi" | "eternl";

export interface Cip30WalletApi {
	/**
	 * 使用済みアドレスのリストを取得
	 * @returns Bech32m形式のアドレス配列
	 */
	getUsedAddresses: () => Promise<string[]>;

	/**
	 * 未使用アドレスのリストを取得
	 * @returns Bech32m形式のアドレス配列
	 */
	getUnusedAddresses: () => Promise<string[]>;

	/**
	 * お釣りアドレスを取得
	 * @returns Bech32m形式のアドレス
	 */
	getChangeAddress: () => Promise<string>;

	/**
	 * ウォレットの残高を取得
	 * @returns 残高（文字列形式）
	 */
	getBalance: () => Promise<string>;

	/**
	 * データに署名（オプション）
	 * @param address 署名に使用するアドレス
	 * @param payload 署名するデータ（HEX形式）
	 * @returns 署名結果
	 */
	signData?: (
		address: string,
		payload: string,
	) => Promise<{ signature: string }>;
}

export interface CardanoWalletProvider {
	/**
	 * ウォレットを有効化してAPIを取得
	 * @returns CIP-30 Wallet API
	 */
	enable: () => Promise<Cip30WalletApi>;

	/**
	 * ウォレットが既に有効化されているか確認
	 * @returns 有効化状態
	 */
	isEnabled: () => Promise<boolean>;

	/**
	 * APIバージョン
	 */
	apiVersion: string;

	/**
	 * ウォレット名
	 */
	name: string;

	/**
	 * ウォレットアイコン（Data URL）
	 */
	icon: string;
}

export interface CardanoWindow extends Window {
	cardano?: {
		[key in WalletName]?: CardanoWalletProvider;
	};
}

export type WalletErrorCode =
	| "WALLET_NOT_INSTALLED"
	| "CONNECTION_REJECTED"
	| "CONNECTION_FAILED"
	| "NETWORK_ERROR"
	| "UNKNOWN_ERROR";

export class WalletError extends Error {
	constructor(
		public code: WalletErrorCode,
		message: string,
	) {
		super(message);
		this.name = "WalletError";
	}
}

export interface WalletConnection {
	walletName: WalletName;
	address: string;
	connectedAt: number;
}

export interface WalletInfo {
	name: WalletName;
	displayName: string;
	installed: boolean;
	provider?: CardanoWalletProvider;
}

