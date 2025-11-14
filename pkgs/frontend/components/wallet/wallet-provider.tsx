/**
 * ウォレットContext Provider
 * アプリケーション全体でウォレット状態を共有
 */

"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { WalletContextType } from "@/lib/wallet/types";
import { useWallet } from "@/hooks/use-wallet";

/**
 * ウォレットContext
 */
const WalletContext = createContext<WalletContextType | null>(null);

/**
 * WalletProvider Props
 */
interface WalletProviderProps {
	children: ReactNode;
}

/**
 * WalletProvider Component
 * アプリケーションのルートでラップして使用
 */
export function WalletProvider({ children }: WalletProviderProps) {
	const wallet = useWallet();

	return (
		<WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
	);
}

/**
 * useWalletContext Hook
 * ウォレット状態とアクションにアクセス
 * @throws Error WalletProvider外で使用された場合
 */
export function useWalletContext(): WalletContextType {
	const context = useContext(WalletContext);

	if (!context) {
		throw new Error("useWalletContext must be used within WalletProvider");
	}

	return context;
}
