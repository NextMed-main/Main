/**
 * ウォレット接続機能の型定義
 * Midnight Blockchain対応のマルチウォレット接続
 */

// ============================================================================
// ウォレット名
// ============================================================================

/**
 * サポートされているウォレット名
 */
export type WalletName = "lace" | "yoroi" | "eternl";

// ============================================================================
// CIP-30 Wallet API
// ============================================================================

/**
 * CIP-30 Wallet API インターフェース
 * Cardano Improvement Proposal 30に準拠
 */
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

/**
 * Cardanoウォレットプロバイダーインターフェース
 * window.cardano.{walletName}経由でアクセス
 */
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

// ============================================================================
// ウォレットプロバイダー設定
// ============================================================================

/**
 * ウォレットプロバイダー情報
 */
export interface WalletProvider {
  /**
   * ウォレット識別子
   */
  name: WalletName;

  /**
   * 表示名
   */
  displayName: string;

  /**
   * アイコンパス
   */
  icon: string;

  /**
   * インストールURL
   */
  installUrl: string;

  /**
   * window.cardano.{windowKey}でアクセス
   */
  windowKey: string;
}

// ============================================================================
// ウォレット接続情報
// ============================================================================

/**
 * ウォレット接続情報（localStorage保存用）
 */
export interface WalletConnection {
  /**
   * 接続されたウォレット名
   */
  walletName: WalletName;

  /**
   * ウォレットアドレス（Bech32m形式）
   */
  address: string;

  /**
   * 接続日時（Unix timestamp）
   */
  connectedAt: number;
}

// ============================================================================
// ウォレット状態
// ============================================================================

/**
 * ウォレット接続状態
 */
export interface WalletState {
  /**
   * ウォレットが接続されているか
   */
  isConnected: boolean;

  /**
   * 接続処理中か
   */
  isConnecting: boolean;

  /**
   * 接続されているウォレット名
   */
  walletName: WalletName | null;

  /**
   * ウォレットアドレス
   */
  address: string | null;

  /**
   * 短縮形式のアドレス (例: "addr1...xyz")
   */
  formattedAddress: string | null;

  /**
   * エラーメッセージ
   */
  error: string | null;
}

/**
 * ウォレット操作アクション
 */
export interface WalletActions {
  /**
   * ウォレットに接続
   * @param walletName 接続するウォレット名
   */
  connect: (walletName: WalletName) => Promise<void>;

  /**
   * ウォレット接続を解除
   */
  disconnect: () => void;

  /**
   * アドレスをクリップボードにコピー
   */
  copyAddress: () => Promise<void>;
}

/**
 * ウォレットContext型
 */
export type WalletContextType = WalletState & WalletActions;

// ============================================================================
// エラー型
// ============================================================================

/**
 * ウォレットエラーコード
 */
export type WalletErrorCode =
  | "WALLET_NOT_INSTALLED"
  | "CONNECTION_REJECTED"
  | "CONNECTION_FAILED"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

/**
 * ウォレットエラークラス
 */
export class WalletError extends Error {
  /**
   * エラーコード
   */
  public readonly code: WalletErrorCode;

  constructor(code: WalletErrorCode, message: string) {
    super(message);
    this.name = "WalletError";
    this.code = code;
  }
}

/**
 * エラーメッセージマップ
 */
export const ERROR_MESSAGES: Record<WalletErrorCode, string> = {
  WALLET_NOT_INSTALLED: "Wallet is not installed",
  CONNECTION_REJECTED: "Connection was rejected",
  CONNECTION_FAILED: "Failed to connect wallet",
  NETWORK_ERROR: "Network error occurred",
  UNKNOWN_ERROR: "An unexpected error occurred",
};

// ============================================================================
// Window拡張
// ============================================================================

/**
 * Cardanoウォレットを含むWindow型
 */
export interface CardanoWindow extends Window {
  cardano?: {
    lace?: CardanoWalletProvider;
    yoroi?: CardanoWalletProvider;
    eternl?: CardanoWalletProvider;
  };
}
