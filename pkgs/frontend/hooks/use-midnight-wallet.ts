/**
 * Midnight Wallet Hook
 * 
 * React hook for managing Midnight Lace wallet connection state.
 * Uses the Midnight DApp Connector API instead of CIP-30.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import type { DAppConnectorWalletAPI } from "@midnight-ntwrk/dapp-connector-api";
import {
  isLaceInstalled,
  isLaceAuthorized,
  connectLace,
  getWalletState,
  getServiceConfig,
  formatMidnightAddress,
  getLaceInstallUrl,
  type MidnightWalletState,
  type MidnightServiceConfig,
} from "@/lib/wallet/midnight-wallet";
import { useToast } from "@/hooks/use-toast";

/**
 * Midnight wallet connection state
 */
export interface MidnightWalletHookState {
  /** Whether wallet is connected */
  isConnected: boolean;
  /** Whether connection is in progress */
  isConnecting: boolean;
  /** Whether Lace wallet is installed */
  isLaceInstalled: boolean;
  /** Wallet API instance (null if not connected) */
  walletApi: DAppConnectorWalletAPI | null;
  /** Wallet state (address, public keys) */
  walletState: MidnightWalletState | null;
  /** Service configuration (node, indexer, proof server URLs) */
  serviceConfig: MidnightServiceConfig | null;
  /** Formatted address for display */
  formattedAddress: string | null;
  /** Error message if any */
  error: string | null;
}

/**
 * Midnight wallet hook actions
 */
export interface MidnightWalletHookActions {
  /** Connect to Lace wallet */
  connect: () => Promise<void>;
  /** Disconnect wallet */
  disconnect: () => void;
  /** Copy address to clipboard */
  copyAddress: () => Promise<void>;
  /** Check if wallet is installed */
  checkInstallation: () => boolean;
  /** Get Lace wallet install URL */
  getInstallUrl: () => string;
}

/**
 * Combined hook return type
 */
export type UseMidnightWalletReturn = MidnightWalletHookState & MidnightWalletHookActions;

/**
 * Local storage key for wallet connection state
 */
const STORAGE_KEY = "midnight_wallet_connection";

/**
 * Save connection state to local storage
 */
function saveConnectionState(address: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      address,
      connectedAt: Date.now(),
    })
  );
}

/**
 * Clear connection state from local storage
 */
function clearConnectionState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Load connection state from local storage
 */
function loadConnectionState(): { address: string } | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * React hook for Midnight Lace wallet connection
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isConnected, connect, walletState, error } = useMidnightWallet();
 *
 *   if (!isConnected) {
 *     return <button onClick={connect}>Connect Wallet</button>;
 *   }
 *
 *   return <p>Connected: {walletState?.address}</p>;
 * }
 * ```
 */
export function useMidnightWallet(): UseMidnightWalletReturn {
  const { toast } = useToast();

  // State
  const [state, setState] = useState<MidnightWalletHookState>({
    isConnected: false,
    isConnecting: false,
    isLaceInstalled: false,
    walletApi: null,
    walletState: null,
    serviceConfig: null,
    formattedAddress: null,
    error: null,
  });

  /**
   * Check if Lace wallet is installed
   */
  const checkInstallation = useCallback((): boolean => {
    const installed = isLaceInstalled();
    setState((prev) => ({ ...prev, isLaceInstalled: installed }));
    return installed;
  }, []);

  /**
   * Get Lace install URL
   */
  const getInstallUrl = useCallback((): string => {
    return getLaceInstallUrl();
  }, []);

  /**
   * Connect to Lace wallet
   */
  const connect = useCallback(async (): Promise<void> => {
    // Check if already connecting
    if (state.isConnecting) return;

    // Check if wallet is installed
    if (!isLaceInstalled()) {
      setState((prev) => ({
        ...prev,
        error: "Lace wallet is not installed. Please install the Lace Midnight Preview extension.",
        isLaceInstalled: false,
      }));
      toast({
        title: "Wallet Not Found",
        description: "Please install the Lace Midnight Preview extension.",
        variant: "destructive",
      });
      return;
    }

    setState((prev) => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    try {
      // Connect to wallet
      const walletApi = await connectLace();

      // Get wallet state and service config in parallel
      const [walletState, serviceConfig] = await Promise.all([
        getWalletState(walletApi),
        getServiceConfig(),
      ]);

      // Save connection state
      saveConnectionState(walletState.address);

      // Update state
      setState({
        isConnected: true,
        isConnecting: false,
        isLaceInstalled: true,
        walletApi,
        walletState,
        serviceConfig,
        formattedAddress: formatMidnightAddress(walletState.address),
        error: null,
      });

      toast({
        title: "Wallet Connected",
        description: `Connected to Midnight Network via Lace`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to connect to wallet";

      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });

      console.error("Midnight wallet connection error:", error);
    }
  }, [state.isConnecting, toast]);

  /**
   * Disconnect wallet
   */
  const disconnect = useCallback((): void => {
    clearConnectionState();

    setState({
      isConnected: false,
      isConnecting: false,
      isLaceInstalled: isLaceInstalled(),
      walletApi: null,
      walletState: null,
      serviceConfig: null,
      formattedAddress: null,
      error: null,
    });

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  }, [toast]);

  /**
   * Copy address to clipboard
   */
  const copyAddress = useCallback(async (): Promise<void> => {
    if (!state.walletState?.address) return;

    try {
      await navigator.clipboard.writeText(state.walletState.address);
      toast({
        title: "Copied",
        description: "Address copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy address:", error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    }
  }, [state.walletState?.address, toast]);

  /**
   * Initialize wallet state on mount
   */
  useEffect(() => {
    // Check if wallet is installed
    const installed = isLaceInstalled();
    setState((prev) => ({ ...prev, isLaceInstalled: installed }));

    // If wallet is installed and we have saved connection, try to reconnect
    const savedConnection = loadConnectionState();
    if (installed && savedConnection) {
      // Check if wallet is still authorized
      isLaceAuthorized().then((authorized) => {
        if (authorized) {
          // Auto-reconnect
          connect();
        } else {
          // Clear saved state if no longer authorized
          clearConnectionState();
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    connect,
    disconnect,
    copyAddress,
    checkInstallation,
    getInstallUrl,
  };
}
