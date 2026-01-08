/**
 * ウォレット接続ボタンコンポーネント
 * Supports both Midnight DApp Connector and CIP-30 wallets
 */

"use client";

import { useState } from "react";
import { Wallet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "./wallet-provider";
import { useMidnightWalletContext } from "./midnight-wallet-provider";
import { WalletSelectionModal } from "./wallet-modal";
import { WalletDropdown } from "./wallet-dropdown";
import { cn } from "@/lib/utils";


/**
 * WalletButton Props
 */
interface WalletButtonProps {
  className?: string;
}

/**
 * WalletButton Component
 * Shows Midnight wallet state if connected via Lace, otherwise shows CIP-30 wallet state
 */
export function WalletButton({ className }: WalletButtonProps) {
  const cip30Wallet = useWalletContext();
  const midnightWallet = useMidnightWalletContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Determine which wallet is connected (prioritize Midnight)
  const isMidnightConnected = midnightWallet.isConnected;
  const isCip30Connected = cip30Wallet.isConnected;
  const isAnyConnected = isMidnightConnected || isCip30Connected;
  const isAnyConnecting = midnightWallet.isConnecting || cip30Wallet.isConnecting;

  // Get display address
  const displayAddress = isMidnightConnected
    ? midnightWallet.formattedAddress
    : cip30Wallet.formattedAddress;

  /**
   * ボタンクリックハンドラー
   */
  const handleClick = () => {
    if (isAnyConnected) {
      // 接続済み: ドロップダウンを開く
      setIsDropdownOpen(true);
    } else {
      // 未接続: モーダルを開く
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isAnyConnecting}
        className={cn(
          "relative gap-2",
          isMidnightConnected
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            : isAnyConnected
            ? "bg-gray-700 hover:bg-gray-800"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
          className,
        )}
      >
        {isMidnightConnected ? (
          <Sparkles className="h-4 w-4" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        {isAnyConnecting ? (
          <span>Connecting...</span>
        ) : isAnyConnected ? (
          <span>{displayAddress}</span>
        ) : (
          <span>Connect Wallet</span>
        )}
      </Button>

      {/* ウォレット選択モーダル */}
      <WalletSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* ウォレット情報ドロップダウン (CIP-30 only for now) */}
      {isCip30Connected && cip30Wallet.walletName && (
        <WalletDropdown
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          walletName={cip30Wallet.walletName}
        />
      )}

      {/* Midnight wallet dropdown (simplified for now) */}
      {isMidnightConnected && isDropdownOpen && (
        <div 
          className="fixed inset-0 z-50"
          onClick={() => setIsDropdownOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsDropdownOpen(false)}
          role="button"
          tabIndex={0}
        >
          <div 
            className="absolute right-4 top-16 w-72 rounded-lg border bg-background shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span className="font-semibold">Midnight Wallet</span>
              </div>
              <div className="text-sm text-muted-foreground break-all">
                {midnightWallet.walletState?.address}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    midnightWallet.copyAddress();
                    setIsDropdownOpen(false);
                  }}
                  className="flex-1"
                >
                  Copy Address
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    midnightWallet.disconnect();
                    setIsDropdownOpen(false);
                  }}
                  className="flex-1"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
