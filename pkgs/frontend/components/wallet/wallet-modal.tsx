/**
 * ウォレット選択モーダルコンポーネント
 * Supports both Midnight DApp Connector (Lace) and CIP-30 wallets
 * 
 * Dark glassmorphism design to match NextMed aesthetic
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, Check, Shield, Sparkles, X, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "./wallet-provider";
import type { WalletName } from "@/lib/wallet/types";
import { getAllWalletProviders, type ExtendedWalletProvider } from "@/lib/wallet/providers";
import { detectWallets, openWalletInstallPage } from "@/lib/wallet/wallet-api";
import { isLaceInstalled } from "@/lib/wallet/midnight-wallet";
import { useMidnightWalletContext } from "./midnight-wallet-provider";
import { cn } from "@/lib/utils";


/**
 * WalletSelectionModal Props
 */
interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * WalletSelectionModal Component
 */
export function WalletSelectionModal({
  isOpen,
  onClose,
}: WalletSelectionModalProps) {
  const { connect, isConnecting } = useWalletContext();
  const midnightWallet = useMidnightWalletContext();
  const [installedWallets, setInstalledWallets] = useState<WalletName[]>([]);
  const [midnightInstalled, setMidnightInstalled] = useState(false);

  // インストール済みウォレットを検出
  useEffect(() => {
    if (isOpen) {
      const detected = detectWallets();
      setInstalledWallets(detected);
      setMidnightInstalled(isLaceInstalled());
    }
  }, [isOpen]);

  /**
   * Handle Midnight wallet (Lace) connection
   */
  const handleMidnightConnect = async () => {
    const success = await midnightWallet.connect();
    if (success) {
      onClose();
    }
  };

  /**
   * Handle CIP-30 wallet connection
   */
  const handleCip30Connect = async (walletName: WalletName) => {
    await connect(walletName);
    onClose();
  };

  /**
   * インストールページを開く
   */
  const handleInstall = (provider: ExtendedWalletProvider) => {
    if (provider.isMidnight) {
      window.open(provider.installUrl, "_blank");
    } else {
      openWalletInstallPage(provider.name);
    }
  };

  const walletProviders = getAllWalletProviders();
  const isAnyConnecting = isConnecting || midnightWallet.isConnecting;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 bg-transparent p-0 shadow-none">
        {/* Custom dark glassmorphism container */}
        <div className="relative rounded-2xl border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Gradient accent at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-white" />
          </button>

          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="flex items-center gap-3 text-xl text-white">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                <Shield className="h-5 w-5 text-indigo-400" />
              </div>
              Connect Wallet
            </DialogTitle>
            <p className="text-sm text-gray-400 mt-2">
              Choose a wallet to connect to NextMed
            </p>
          </DialogHeader>

          <div className="px-6 py-4 space-y-3">
            {walletProviders.map((provider) => {
              // Determine if wallet is installed
              const isInstalled = provider.isMidnight 
                ? midnightInstalled 
                : installedWallets.includes(provider.name);
              
              // Determine if this wallet is currently connected
              const isConnected = provider.isMidnight 
                ? midnightWallet.isConnected 
                : false;

              return (
                <div
                  key={provider.name}
                  className={cn(
                    "relative rounded-xl p-4 transition-all duration-200",
                    provider.isMidnight
                      ? "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/30 hover:border-indigo-400/50"
                      : "bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10",
                  )}
                >
                  {/* Recommended badge for Midnight */}
                  {provider.badge && (
                    <div className="absolute -top-2 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
                      <span className="flex items-center gap-1">
                        <Zap className="h-2.5 w-2.5" />
                        {provider.badge}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Wallet icon */}
                      <div className={cn(
                        "relative h-12 w-12 rounded-xl overflow-hidden flex items-center justify-center",
                        provider.isMidnight
                          ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
                          : "bg-white/10 border border-white/10"
                      )}>
                        <Image
                          src={provider.icon}
                          alt={provider.displayName}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                        {provider.isMidnight && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                            <Sparkles className="h-2.5 w-2.5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Wallet info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={cn(
                            "font-semibold",
                            provider.isMidnight ? "text-white" : "text-gray-200"
                          )}>
                            {provider.displayName}
                          </h3>
                          {isInstalled && !isConnected && (
                            <div className="flex items-center gap-1 text-emerald-400">
                              <Check className="h-3.5 w-3.5" />
                              <span className="text-[10px] font-medium">Installed</span>
                            </div>
                          )}
                          {isConnected && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Connected
                            </span>
                          )}
                        </div>
                        <p className={cn(
                          "text-xs mt-0.5",
                          provider.isMidnight ? "text-indigo-300/80" : "text-gray-500"
                        )}>
                          {provider.description}
                        </p>
                      </div>
                    </div>

                    {/* Action button */}
                    {isConnected ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : isInstalled ? (
                      <Button
                        onClick={() => 
                          provider.isMidnight 
                            ? handleMidnightConnect() 
                            : handleCip30Connect(provider.name)
                        }
                        disabled={isAnyConnecting}
                        size="sm"
                        className={cn(
                          "min-w-[90px] font-medium",
                          provider.isMidnight
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                            : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                        )}
                      >
                        {isAnyConnecting ? (
                          <span className="flex items-center gap-2">
                            <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>...</span>
                          </span>
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleInstall(provider)}
                        variant="outline"
                        size="sm"
                        className="min-w-[90px] bg-transparent border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                      >
                        <span>Install</span>
                        <ExternalLink className="h-3 w-3 ml-1.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/20">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 shrink-0">
                <Shield className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-xs text-gray-400 leading-relaxed">
                <span className="text-indigo-300 font-medium">Midnight wallets</span> enable zero-knowledge privacy features. Your medical data stays private while still being verifiable.
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

