/**
 * ウォレット情報ドロップダウンコンポーネント
 * 接続済みウォレットの詳細情報を表示
 */

"use client";

import { Copy, LogOut, Wallet } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "./wallet-provider";
import type { WalletName } from "@/lib/wallet/types";
import { getWalletProvider } from "@/lib/wallet/providers";

/**
 * WalletDropdown Props
 */
interface WalletDropdownProps {
	isOpen: boolean;
	onClose: () => void;
	walletName: WalletName;
}

/**
 * WalletDropdown Component
 */
export function WalletDropdown({
	isOpen,
	onClose,
	walletName,
}: WalletDropdownProps) {
	const { address, disconnect, copyAddress } = useWalletContext();

	const provider = getWalletProvider(walletName);

	/**
	 * アドレスコピーハンドラー
	 */
	const handleCopy = async () => {
		await copyAddress();
		onClose();
	};

	/**
	 * 切断ハンドラー
	 */
	const handleDisconnect = () => {
		disconnect();
		onClose();
	};

	return (
		<DropdownMenu open={isOpen} onOpenChange={onClose}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-0 w-0 p-0 opacity-0">
					Trigger
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-80">
				<DropdownMenuLabel className="font-normal">
					<div className="flex items-center gap-3">
						{/* ウォレットアイコン */}
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
							<Wallet className="h-5 w-5 text-indigo-600" />
						</div>

						{/* ウォレット情報 */}
						<div className="flex-1">
							<p className="text-sm font-semibold">{provider.displayName}</p>
							<p className="text-xs text-gray-500">Connected</p>
						</div>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* アドレス表示 */}
				<div className="px-2 py-3">
					<p className="mb-1 text-xs text-gray-500">Wallet Address</p>
					<p className="break-all rounded bg-gray-100 p-2 font-mono text-xs">
						{address}
					</p>
				</div>

				<DropdownMenuSeparator />

				{/* アクション */}
				<DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
					<Copy className="mr-2 h-4 w-4" />
					<span>Copy Address</span>
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={handleDisconnect}
					className="cursor-pointer text-red-600 focus:text-red-600"
				>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Disconnect</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
