import { useState } from "react";
import { WalletConnection } from "./WalletConnection";
import { CounterContractPanel } from "./CounterContractPanel";
import { AddressesPanel } from "./AddressesPanel";
import { SignDataPanel } from "./SignDataPanel";
import { TransactionHistoryPanel } from "./TransactionHistoryPanel";
import { WalletInfoPanel } from "./WalletInfoPanel";
import type { Cip30WalletApi, WalletName } from "../types/wallet-types";
import "../App.css";

type TabType =
	| "connection"
	| "counter"
	| "addresses"
	| "sign-data"
	| "tx-history"
	| "wallet-info";

interface WalletAppProps {
	walletApi?: Cip30WalletApi | null;
	walletName?: WalletName | null;
	address?: string | null;
}

export function WalletApp() {
	const [activeTab, setActiveTab] = useState<TabType>("connection");
	const [walletApi, setWalletApi] = useState<Cip30WalletApi | null>(null);
	const [walletName, setWalletName] = useState<WalletName | null>(null);
	const [address, setAddress] = useState<string | null>(null);

	const handleWalletConnected = (
		api: Cip30WalletApi,
		name: WalletName,
		addr: string,
	) => {
		setWalletApi(api);
		setWalletName(name);
		setAddress(addr);
	};

	const handleWalletDisconnected = () => {
		setWalletApi(null);
		setWalletName(null);
		setAddress(null);
	};

	const tabs: Array<{ id: TabType; label: string; disabled?: boolean }> = [
		{ id: "connection", label: "Connection" },
		{ id: "counter", label: "Counter Contract", disabled: !walletApi },
		{ id: "addresses", label: "Addresses", disabled: !walletApi },
		{ id: "sign-data", label: "Sign Data", disabled: !walletApi },
		{ id: "tx-history", label: "Transaction History", disabled: !walletApi },
		{ id: "wallet-info", label: "Wallet Info", disabled: !walletApi },
	];

	return (
		<div className="app">
			<header className="header">
				<h1>Midnight Network Wallet Connection Tester</h1>
			</header>

			<main className="main">
				<div className="sidebar">
					<div className="tabs">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								type="button"
								className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
								onClick={() => setActiveTab(tab.id)}
								disabled={tab.disabled}
								title={
									tab.disabled
										? "Please connect a wallet"
										: undefined
								}
							>
								{tab.label}
							</button>
						))}
					</div>
				</div>

				<div className="content">
					{activeTab === "connection" && (
						<WalletConnection
							onConnected={handleWalletConnected}
							onDisconnected={handleWalletDisconnected}
						/>
					)}
					{activeTab === "counter" && walletApi && (
						<CounterContractPanel
							walletApi={walletApi}
							walletName={walletName}
							address={address}
						/>
					)}
					{activeTab === "addresses" && walletApi && (
						<AddressesPanel walletApi={walletApi} />
					)}
					{activeTab === "sign-data" && walletApi && address && (
						<SignDataPanel walletApi={walletApi} address={address} />
					)}
					{activeTab === "tx-history" && address && (
						<TransactionHistoryPanel address={address} />
					)}
					{activeTab === "wallet-info" && walletApi && walletName && (
						<WalletInfoPanel
							walletApi={walletApi}
							walletName={walletName}
						/>
					)}
				</div>
			</main>
		</div>
	);
}

