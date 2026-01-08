/**
 * Midnight Wallet Context Provider
 * Shares Midnight wallet connection state across the application
 */

"use client";

import { createContext, type ReactNode, useContext } from "react";
import {
  type UseMidnightWalletReturn,
  useMidnightWallet,
} from "@/hooks/use-midnight-wallet";

/**
 * Midnight wallet context
 */
const MidnightWalletContext = createContext<UseMidnightWalletReturn | null>(
  null,
);

/**
 * MidnightWalletProvider Props
 */
interface MidnightWalletProviderProps {
  children: ReactNode;
}

/**
 * MidnightWalletProvider Component
 * Wrap at the application root to share Midnight wallet state
 */
export function MidnightWalletProvider({
  children,
}: MidnightWalletProviderProps) {
  const wallet = useMidnightWallet();

  return (
    <MidnightWalletContext.Provider value={wallet}>
      {children}
    </MidnightWalletContext.Provider>
  );
}

/**
 * useMidnightWalletContext Hook
 * Access shared Midnight wallet state and actions
 * @throws Error if used outside MidnightWalletProvider
 */
export function useMidnightWalletContext(): UseMidnightWalletReturn {
  const context = useContext(MidnightWalletContext);

  if (!context) {
    throw new Error(
      "useMidnightWalletContext must be used within MidnightWalletProvider",
    );
  }

  return context;
}
