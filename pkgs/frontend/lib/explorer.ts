/**
 * Midnight Network Explorer Utilities
 * 
 * Provides helper functions for generating blockchain explorer links
 * and formatting transaction hashes for display.
 * 
 * @module lib/explorer
 */

/**
 * Explorer configuration for different network environments.
 * Currently supports testnet; mainnet URL to be updated when available.
 */
const EXPLORER_CONFIG = {
  testnet: {
    baseUrl: "https://midnightexplorer.com",
    name: "Midnight Explorer",
  },
  mainnet: {
    baseUrl: "https://midnightexplorer.com", // Update when mainnet launches
    name: "Midnight Explorer",
  },
} as const;

type NetworkType = keyof typeof EXPLORER_CONFIG;

/**
 * Get the current network type from environment or default to testnet
 */
function getCurrentNetwork(): NetworkType {
  const network = process.env.NEXT_PUBLIC_MIDNIGHT_NETWORK;
  return network === "mainnet" ? "mainnet" : "testnet";
}

/**
 * Get the base explorer URL for the current network
 */
export function getExplorerBaseUrl(): string {
  const network = getCurrentNetwork();
  return EXPLORER_CONFIG[network].baseUrl;
}

/**
 * Generate a URL to view a specific transaction on the explorer
 * 
 * @param txHash - The transaction hash (with or without 0x prefix)
 * @returns Full URL to the transaction page
 * 
 * @example
 * ```ts
 * const url = getTxUrl("00000000cedb75e9c6315a3fa646718dc64290399e92dcc7401f00d7a1ab1dfc");
 * // Returns: "https://midnightexplorer.com/tx/00000000cedb75e9..."
 * ```
 */
export function getTxUrl(txHash: string): string {
  const cleanHash = txHash.startsWith("0x") ? txHash.slice(2) : txHash;
  return `${getExplorerBaseUrl()}/tx/${cleanHash}`;
}

/**
 * Generate a URL to view a specific block on the explorer
 * 
 * @param blockHeight - The block height number
 * @returns Full URL to the block page
 */
export function getBlockUrl(blockHeight: number): string {
  return `${getExplorerBaseUrl()}/block/${blockHeight}`;
}

/**
 * Generate a URL to view an address on the explorer
 * 
 * @param address - The wallet or contract address
 * @returns Full URL to the address page
 */
export function getAddressUrl(address: string): string {
  return `${getExplorerBaseUrl()}/address/${address}`;
}

/**
 * Generate a URL to view a contract on the explorer
 * 
 * @param contractAddress - The contract address
 * @returns Full URL to the contract page
 */
export function getContractUrl(contractAddress: string): string {
  return `${getExplorerBaseUrl()}/contract/${contractAddress}`;
}

/**
 * Format a transaction hash for display with truncation
 * 
 * @param txHash - The full transaction hash
 * @param options - Formatting options
 * @returns Truncated hash string (e.g., "0x00000000...ab1dfc")
 * 
 * @example
 * ```ts
 * formatTxHash("00000000cedb75e9c6315a3fa646718dc64290399e92dcc7401f00d7a1ab1dfc")
 * // Returns: "00000000...ab1dfc"
 * 
 * formatTxHash("00000000cedb75e9...", { prefixLength: 10, suffixLength: 8, showPrefix: true })
 * // Returns: "0x00000000ce...1f00d7a1ab1dfc"
 * ```
 */
export function formatTxHash(
  txHash: string,
  options: {
    prefixLength?: number;
    suffixLength?: number;
    showPrefix?: boolean;
  } = {}
): string {
  const { prefixLength = 8, suffixLength = 6, showPrefix = false } = options;

  if (!txHash) return "";

  const cleanHash = txHash.startsWith("0x") ? txHash.slice(2) : txHash;

  if (cleanHash.length <= prefixLength + suffixLength) {
    return showPrefix ? `0x${cleanHash}` : cleanHash;
  }

  const prefix = cleanHash.slice(0, prefixLength);
  const suffix = cleanHash.slice(-suffixLength);
  const formatted = `${prefix}...${suffix}`;

  return showPrefix ? `0x${formatted}` : formatted;
}

/**
 * Format a block height for display with locale-specific formatting
 * 
 * @param blockHeight - The block height number
 * @returns Formatted block height (e.g., "2,599,043")
 */
export function formatBlockHeight(blockHeight: number): string {
  return blockHeight.toLocaleString();
}

/**
 * Validate if a string is a valid Midnight transaction hash
 * 
 * @param hash - The string to validate
 * @returns True if valid transaction hash format
 */
export function isValidTxHash(hash: string): boolean {
  if (!hash) return false;
  
  const cleanHash = hash.startsWith("0x") ? hash.slice(2) : hash;
  
  // Midnight TX hashes are 72 hex characters
  const validLength = cleanHash.length === 72 || cleanHash.length === 64;
  const isHex = /^[0-9a-fA-F]+$/.test(cleanHash);
  
  return validLength && isHex;
}

/**
 * Get explorer name for UI display
 */
export function getExplorerName(): string {
  const network = getCurrentNetwork();
  return EXPLORER_CONFIG[network].name;
}
