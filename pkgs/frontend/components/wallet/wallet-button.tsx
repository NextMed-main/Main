/**
 * ウォレット接続ボタンコンポーネント
 * ヘッダーに表示されるメインボタン
 */

"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "./wallet-provider";
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
 */
export function WalletButton({ className }: WalletButtonProps) {
	const { isConnected, isConnecting, formattedAddress, walletName } =
		useWalletContext();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	/**
	 * ボタンクリックハンドラー
	 */
	const handleClick = () => {
		if (isConnected) {
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
				disabled={isConnecting}
				className={cn(
					"relative gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
					className,
				)}
			>
				<Wallet className="h-4 w-4" />
				{isConnecting ? (
					<span>接続中...</span>
				) : isConnected ? (
					<span>{formattedAddress}</span>
				) : (
					<span>Connect Wallet</span>
				)}
			</Button>

			{/* ウォレット選択モーダル */}
			<WalletSelectionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>

			{/* ウォレット情報ドロップダウン */}
			{isConnected && walletName && (
				<WalletDropdown
					isOpen={isDropdownOpen}
					onClose={() => setIsDropdownOpen(false)}
					walletName={walletName}
				/>
			)}
		</>
	);
}
