/**
 * ウォレット選択モーダルコンポーネント
 * 4つのウォレットから選択
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, Check } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "./wallet-provider";
import type { WalletName } from "@/lib/wallet/types";
import { getAllWalletProviders } from "@/lib/wallet/providers";
import {
	detectWallets,
	openWalletInstallPage,
} from "@/lib/wallet/wallet-api";
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
	const [installedWallets, setInstalledWallets] = useState<WalletName[]>([]);

	// インストール済みウォレットを検出
	useEffect(() => {
		if (isOpen) {
			const detected = detectWallets();
			setInstalledWallets(detected);
		}
	}, [isOpen]);

	/**
	 * ウォレット接続ハンドラー
	 */
	const handleConnect = async (walletName: WalletName) => {
		await connect(walletName);
		onClose();
	};

	/**
	 * インストールページを開く
	 */
	const handleInstall = (walletName: WalletName) => {
		openWalletInstallPage(walletName);
	};

	const walletProviders = getAllWalletProviders();

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Select Wallet</DialogTitle>
					<DialogDescription>
						Choose a Midnight-compatible wallet to connect
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-3 py-4">
					{walletProviders.map((provider) => {
						const isInstalled = installedWallets.includes(provider.name);

						return (
							<div
								key={provider.name}
								className={cn(
									"flex items-center justify-between rounded-lg border p-4 transition-colors",
									isInstalled
										? "border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50"
										: "border-gray-200 bg-gray-50/50",
								)}
							>
								<div className="flex items-center gap-3">
									{/* ウォレットアイコン */}
									<div className="relative h-10 w-10 overflow-hidden rounded-full bg-white">
										<Image
											src={provider.icon}
											alt={provider.displayName}
											width={32}
											height={32}
											className="object-contain"
										/>
									</div>

									{/* ウォレット情報 */}
									<div className="flex items-center gap-2">
										<h3 className="font-semibold">{provider.displayName}</h3>
										{isInstalled && (
											<Check className="h-4 w-4 text-green-600" />
										)}
									</div>
								</div>

								{/* アクションボタン */}
								{isInstalled ? (
									<Button
										onClick={() => handleConnect(provider.name)}
										disabled={isConnecting}
										size="sm"
										className="bg-indigo-600 hover:bg-indigo-700"
									>
										Connect
									</Button>
								) : (
									<Button
										onClick={() => handleInstall(provider.name)}
										variant="outline"
										size="sm"
										className="gap-1"
									>
										<span>Install</span>
										<ExternalLink className="h-3 w-3" />
									</Button>
								)}
							</div>
						);
					})}
				</div>

				<div className="text-center text-sm text-gray-500">
					<p>Don't have a wallet? Install one from above</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
