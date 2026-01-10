/**
 * ウォレット状態管理フック
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  WalletName,
  WalletState,
  WalletActions,
} from "@/lib/wallet/types";
import { WalletError, ERROR_MESSAGES } from "@/lib/wallet/types";
import {
  connectWallet,
  getAddress,
  formatAddress,
} from "@/lib/wallet/wallet-api";
import {
  saveConnection,
  loadConnection,
  clearConnection,
} from "@/lib/wallet/wallet-storage";
import { useToast } from "@/hooks/use-toast";

/**
 * ウォレット状態管理フック
 */
export function useWallet() {
  const { toast } = useToast();

  // ウォレット状態
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    walletName: null,
    address: null,
    formattedAddress: null,
    error: null,
  });

  /**
   * エラーメッセージを取得
   */
  const getErrorMessage = useCallback((error: unknown): string => {
    if (error instanceof WalletError) {
      return ERROR_MESSAGES[error.code] || error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return ERROR_MESSAGES.UNKNOWN_ERROR;
  }, []);

  /**
   * ウォレットに接続
   */
  const connect = useCallback(
    async (walletName: WalletName) => {
      // 既に接続中の場合は何もしない
      if (state.isConnecting) {
        return;
      }

      setState((prev) => ({
        ...prev,
        isConnecting: true,
        error: null,
      }));

      try {
        // ウォレットに接続
        const api = await connectWallet(walletName);

        // アドレスを取得
        const address = await getAddress(api);

        // 接続情報を保存
        saveConnection(walletName, address);

        // 状態を更新
        setState({
          isConnected: true,
          isConnecting: false,
          walletName,
          address,
          formattedAddress: formatAddress(address),
          error: null,
        });

        // 成功トースト
        toast({
          title: "Wallet Connected",
          description: `Connected to ${walletName.charAt(0).toUpperCase() + walletName.slice(1)} Wallet`,
        });
      } catch (error) {
        const errorMessage = getErrorMessage(error);

        setState((prev) => ({
          ...prev,
          isConnecting: false,
          error: errorMessage,
        }));

        // エラートースト
        toast({
          title: "Connection Error",
          description: errorMessage,
          variant: "destructive",
        });

        console.error("Wallet connection error:", error);
      }
    },
    [state.isConnecting, toast, getErrorMessage],
  );

  /**
   * ウォレット接続を解除
   */
  const disconnect = useCallback(() => {
    // 接続情報をクリア
    clearConnection();

    // 状態をリセット
    setState({
      isConnected: false,
      isConnecting: false,
      walletName: null,
      address: null,
      formattedAddress: null,
      error: null,
    });

    // 成功トースト
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  }, [toast]);

  /**
   * アドレスをクリップボードにコピー
   */
  const copyAddress = useCallback(async () => {
    if (!state.address) {
      return;
    }

    try {
      await navigator.clipboard.writeText(state.address);

      toast({
        title: "Copied",
        description: "Address copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy address:", error);

      toast({
        title: "Copy Failed",
        description: "Failed to copy address",
        variant: "destructive",
      });
    }
  }, [state.address, toast]);

  /**
   * 保存された接続情報から自動再接続
   */
  useEffect(() => {
    const savedConnection = loadConnection();

    if (savedConnection) {
      // 保存された接続情報を復元
      setState({
        isConnected: true,
        isConnecting: false,
        walletName: savedConnection.walletName,
        address: savedConnection.address,
        formattedAddress: formatAddress(savedConnection.address),
        error: null,
      });
    }
  }, []);

  const actions: WalletActions = {
    connect,
    disconnect,
    copyAddress,
  };

  return {
    ...state,
    ...actions,
    // ヘルパー関数
    formattedAddress: state.address ? formatAddress(state.address) : null,
  };
}
