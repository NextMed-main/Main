/**
 * Midnight Lace Wallet Integration
 *
 * Uses the Midnight DApp Connector API to connect to the Lace wallet.
 * This replaces the CIP-30 approach with Midnight's native wallet API.
 *
 * @see https://docs.midnight.network/develop/reference/midnight-api/dapp-connector
 * @see https://docs.midnight.network/how-to/nextjs-wallet-connect
 */

import "@midnight-ntwrk/dapp-connector-api";

// Re-export types from dapp-connector-api
export type {
  DAppConnectorAPI,
  DAppConnectorWalletAPI,
  ServiceUriConfig,
} from "@midnight-ntwrk/dapp-connector-api";

/**
 * Wallet state returned from the Lace wallet
 */
export interface MidnightWalletState {
  address: string;
  coinPublicKey: string;
  encryptionPublicKey: string;
}

/**
 * Service configuration from the wallet
 */
export interface MidnightServiceConfig {
  node: string;
  indexer: string;
  indexerWS: string;
  proofServer: string;
}

/**
 * Connection result containing wallet API and state
 */
export interface WalletConnection {
  api: import("@midnight-ntwrk/dapp-connector-api").DAppConnectorWalletAPI;
  state: MidnightWalletState;
  serviceConfig: MidnightServiceConfig;
}

/**
 * Check if Lace wallet is installed in the browser
 *
 * The Lace wallet injects `window.midnight.mnLace` when installed.
 */
export function isLaceInstalled(): boolean {
  if (typeof window === "undefined") {
    return false; // SSR environment
  }
  
  const hasMidnight = window.midnight !== undefined;
  // @ts-ignore - Debug check
  const hasMnLace = hasMidnight && window.midnight.mnLace !== undefined;
  
  // Debug log only if midnight exists but lace is missing (common issue)
  if (hasMidnight && !hasMnLace) {
    console.debug('Midnight object found, but mnLace is missing:', Object.keys(window.midnight || {}));
  }

  return hasMnLace;
}

/**
 * Check if the DApp is already authorized with Lace wallet
 *
 * Note: Lace v4.0.0 uses isConnected() instead of isEnabled()
 *
 * @returns true if already authorized, false otherwise
 */
export async function isLaceAuthorized(): Promise<boolean> {
  if (!isLaceInstalled()) {
    return false;
  }
  try {
    // Try isConnected first (Lace v4.0.0+)
    const mnLace = window.midnight!.mnLace as unknown as Record<
      string,
      unknown
    >;
    if (typeof mnLace.isConnected === "function") {
      return await (mnLace.isConnected as () => Promise<boolean>)();
    }
    // Fallback to isEnabled for older versions
    if (typeof mnLace.isEnabled === "function") {
      return await (mnLace.isEnabled as () => Promise<boolean>)();
    }
    return false;
  } catch (error) {
    console.error("Error checking Lace authorization:", error);
    return false;
  }
}

/**
 * Supported Midnight network IDs
 */
export type MidnightNetworkId =
  | "mainnet"
  | "preprod"
  | "preview"
  | "undeployed";

/**
 * Default network ID for connection
 * Using 'preview' as this is the current testnet
 */
export const DEFAULT_NETWORK_ID: MidnightNetworkId = "preview";

/**
 * Connect to Lace wallet
 *
 * This will prompt the user with a popup to authorize the DApp if not already authorized.
 *
 * Note: Lace v4.0.0 uses connect(networkId) instead of enable()
 *
 * @param networkId - Network to connect to (default: 'preview')
 * @returns DAppConnectorWalletAPI instance for interacting with the wallet
 * @throws Error if Lace is not installed or user rejects the connection
 */
export async function connectLace(
  networkId: MidnightNetworkId = DEFAULT_NETWORK_ID,
): Promise<
  import("@midnight-ntwrk/dapp-connector-api").DAppConnectorWalletAPI
> {
  if (!isLaceInstalled()) {
    throw new Error(
      "Lace wallet is not installed. Please install the Lace Midnight Preview extension from Chrome Web Store.",
    );
  }

  try {
    const mnLace = window.midnight!.mnLace as unknown as Record<
      string,
      unknown
    >;

    // Try connect first (Lace v4.0.0+) - requires networkId parameter
    if (typeof mnLace.connect === "function") {
      console.log(`Connecting to Midnight network: ${networkId}`);
      const api = await (
        mnLace.connect as (
          networkId: string,
        ) => Promise<
          import("@midnight-ntwrk/dapp-connector-api").DAppConnectorWalletAPI
        >
      )(networkId);
      return api;
    }

    // Fallback to enable for older versions (no networkId)
    if (typeof mnLace.enable === "function") {
      console.log("Using legacy enable() method");
      const api = await (
        mnLace.enable as () => Promise<
          import("@midnight-ntwrk/dapp-connector-api").DAppConnectorWalletAPI
        >
      )();
      return api;
    }

    throw new Error("Unable to find connect or enable method on Lace wallet.");
  } catch (error) {
    if (error instanceof Error) {
      // Handle user rejection
      if (
        error.message.includes("rejected") ||
        error.message.includes("cancelled") ||
        error.message.includes("Rejected")
      ) {
        throw new Error("User rejected the wallet connection request.");
      }
      // Handle network mismatch
      if (error.message.includes("Unsupported network")) {
        throw new Error(
          `Network mismatch. Please ensure your Lace wallet is configured for the '${networkId}' network.`,
        );
      }
      throw error;
    }
    throw new Error("Failed to connect to Lace wallet.");
  }
}

/**
 * Get the wallet state (address and public keys)
 *
 * Note: Lace v4.0.0 uses getShieldedAddresses() instead of state()
 *
 * @param api - DAppConnectorWalletAPI instance from connectLace()
 * @returns Wallet state containing address and public keys
 */
export async function getWalletState(
  api: import("@midnight-ntwrk/dapp-connector-api").DAppConnectorWalletAPI,
): Promise<MidnightWalletState> {
  // Cast API to access Lace v4.0.0 methods
  const walletApi = api as unknown as Record<string, unknown>;

  // Try Lace v4.0.0 method first (getShieldedAddresses)
  if (typeof walletApi.getShieldedAddresses === "function") {
    const shielded = await (
      walletApi.getShieldedAddresses as () => Promise<{
        shieldedAddress: string;
        shieldedCoinPublicKey: string;
        shieldedEncryptionPublicKey: string;
      }>
    )();

    return {
      address: shielded.shieldedAddress,
      coinPublicKey: shielded.shieldedCoinPublicKey,
      encryptionPublicKey: shielded.shieldedEncryptionPublicKey,
    };
  }

  // Fallback to legacy state() method
  if (typeof walletApi.state === "function") {
    const state = await (
      walletApi.state as () => Promise<{
        address: string;
        coinPublicKey: string;
        encryptionPublicKey: string;
      }>
    )();
    return {
      address: state.address,
      coinPublicKey: state.coinPublicKey,
      encryptionPublicKey: state.encryptionPublicKey,
    };
  }

  throw new Error(
    "Unable to retrieve wallet state - unsupported wallet API version",
  );
}

/**
 * Get service configuration from the wallet
 *
 * Note: Lace v4.0.0 uses getConfiguration() instead of serviceUriConfig()
 *
 * This returns the URLs for the node, indexer, and proof server that the wallet is connected to.
 *
 * @param api - DAppConnectorWalletAPI instance from connectLace()
 * @returns Service configuration (node, indexer, indexerWS, proofServer URLs)
 */
export async function getServiceConfig(
  api?: import("@midnight-ntwrk/dapp-connector-api").DAppConnectorWalletAPI,
): Promise<MidnightServiceConfig> {
  // If API is provided, use it; otherwise try to get from window.midnight
  if (api) {
    const walletApi = api as unknown as Record<string, unknown>;

    // Try Lace v4.0.0 method first (getConfiguration)
    if (typeof walletApi.getConfiguration === "function") {
      const config = await (
        walletApi.getConfiguration as () => Promise<{
          indexerUri?: string;
          indexerWsUri?: string;
          substrateNodeUri?: string;
          proverServerUri?: string;
        }>
      )();

      return {
        node: config.substrateNodeUri || "",
        indexer: config.indexerUri || "",
        indexerWS: config.indexerWsUri || "",
        proofServer: config.proverServerUri || "",
      };
    }
  }

  // Fallback to legacy window.midnight.mnLace.serviceUriConfig()
  if (isLaceInstalled()) {
    const mnLace = window.midnight!.mnLace as unknown as Record<
      string,
      unknown
    >;
    if (typeof mnLace.serviceUriConfig === "function") {
      const config = await (
        mnLace.serviceUriConfig as () => Promise<{
          substrateNodeUri: string;
          indexerUri: string;
          indexerWsUri: string;
          proverServerUri: string;
        }>
      )();
      return {
        node: config.substrateNodeUri,
        indexer: config.indexerUri,
        indexerWS: config.indexerWsUri,
        proofServer: config.proverServerUri,
      };
    }
  }

  throw new Error(
    "Unable to retrieve service configuration - unsupported wallet API version",
  );
}

/**
 * Full wallet connection flow
 *
 * Connects to Lace wallet, retrieves state and service configuration in one call.
 *
 * @returns WalletConnection with api, state, and serviceConfig
 * @throws Error if connection fails
 */
export async function connectWallet(): Promise<WalletConnection> {
  const api = await connectLace();
  const [state, serviceConfig] = await Promise.all([
    getWalletState(api),
    getServiceConfig(api),
  ]);

  return {
    api,
    state,
    serviceConfig,
  };
}

/**
 * Format a Midnight address for display
 *
 * @param address - Full Midnight address
 * @param prefixLength - Number of characters to show at start (default: 12)
 * @param suffixLength - Number of characters to show at end (default: 6)
 * @returns Formatted address like "mn_shield-addr...abc123"
 */
export function formatMidnightAddress(
  address: string,
  prefixLength = 20,
  suffixLength = 6,
): string {
  if (address.length <= prefixLength + suffixLength + 3) {
    return address;
  }
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Get the Lace wallet install URL
 */
export function getLaceInstallUrl(): string {
  return "https://chromewebstore.google.com/detail/lace-midnight-preview/hgeekaiplokcnmakghbdfbgnlfheichg";
}
