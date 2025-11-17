import { useState, useEffect } from "react";
import type {
	WalletName,
	Cip30WalletApi,
} from "../types/wallet-types";
import { WalletError } from "../types/wallet-types";
import {
	getAvailableWallets,
	connectWallet,
	getAddress,
	getBalance,
	formatAddress,
	saveConnection,
	loadConnection,
	clearConnection,
	getErrorMessage,
} from "../utils/wallet-utils";
import "../App.css";

interface WalletStatus {
	connected: boolean;
	walletName: WalletName | null;
	address: string | null;
	balance: string | null;
	api: Cip30WalletApi | null;
}

interface WalletConnectionProps {
	onConnected?: (api: Cip30WalletApi, name: WalletName, address: string) => void;
	onDisconnected?: () => void;
	onBalanceUpdate?: (balance: string) => void;
}

export function WalletConnection({
	onConnected,
	onDisconnected,
	onBalanceUpdate,
}: WalletConnectionProps) {
	const [wallets, setWallets] = useState(getAvailableWallets());
	const [status, setStatus] = useState<WalletStatus>({
		connected: false,
		walletName: null,
		address: null,
		balance: null,
		api: null,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		const saved = loadConnection();
		if (saved) {
			// Do not auto-reconnect, user must explicitly connect
		}
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setWallets(getAvailableWallets());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const handleConnect = async (walletName: WalletName) => {
		setLoading(true);
		setError("");

		try {
			const api = await connectWallet(walletName);
			const address = await getAddress(api);
			const balance = await getBalance(api);

			setStatus({
				connected: true,
				walletName,
				address,
				balance,
				api,
			});

			saveConnection(walletName, address);
			onConnected?.(api, walletName, address);
			onBalanceUpdate?.(balance);
		} catch (err) {
			let errorMessage = "Unknown error occurred";

			if (err instanceof WalletError) {
				errorMessage = getErrorMessage(err.code);
			} else if (err instanceof Error) {
				errorMessage = err.message;
			}

			setError(errorMessage);
			setStatus({
				connected: false,
				walletName: null,
				address: null,
				balance: null,
				api: null,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleDisconnect = () => {
		setStatus({
			connected: false,
			walletName: null,
			address: null,
			balance: null,
			api: null,
		});
		clearConnection();
		setError("");
		onDisconnected?.();
	};

	const handleRefresh = async () => {
		if (!status.api || !status.connected) {
			return;
		}

		setRefreshing(true);
		setError("");

		try {
			const address = await getAddress(status.api);
			const balance = await getBalance(status.api);

			setStatus((prev) => ({
				...prev,
				address,
				balance,
			}));
			onBalanceUpdate?.(balance);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to refresh",
			);
		} finally {
			setRefreshing(false);
		}
	};

	return (
		<div className="method-panel">
			<h2>Wallet Connection</h2>
			<p className="method-description-text">
				Connect to a Midnight Network compatible wallet to verify address and balance.
			</p>

			<div className="params-section">
				<h3>Available Wallets</h3>
				<div className="wallet-list">
					{wallets.map((wallet) => (
						<div 
							key={wallet.name} 
							className="wallet-item"
							style={{
								opacity: wallet.installed && !wallet.isMidnightNative ? 0.7 : 1,
								filter: wallet.installed && !wallet.isMidnightNative ? "grayscale(0.15)" : "none",
							}}
						>
							<div className="wallet-info">
								<div className="wallet-header">
									{wallet.icon && (
										<img
											src={wallet.icon}
											alt={wallet.displayName}
											className="wallet-icon-small"
										/>
									)}
									<div className="wallet-name">
										{wallet.displayName}
									</div>
								</div>
								<div
									className={`wallet-status ${
										wallet.installed ? "installed" : "not-installed"
									}`}
								>
									{wallet.installed ? "Installed" : "Not Installed"}
								</div>
								{wallet.installed && !wallet.isMidnightNative && (
									<div className="wallet-warning" style={{
										marginTop: "0.5rem",
										padding: "0.5rem",
										backgroundColor: "rgba(255, 165, 0, 0.1)",
										border: "1px solid rgba(255, 165, 0, 0.3)",
										borderRadius: "4px",
										fontSize: "0.75rem",
										color: "var(--color-text-secondary, #666)",
										width: "fit-content",
										display: "inline-block",
									}}>
										Not yet supported on Midnight Network. Cardano connection pattern kept for future compatibility.
									</div>
								)}
							</div>
							{wallet.installed ? (
								<button
									type="button"
									onClick={() => handleConnect(wallet.name)}
									disabled={
										loading ||
										(status.connected &&
											status.walletName === wallet.name)
									}
									className="wallet-connect-button"
								>
									{status.connected &&
									status.walletName === wallet.name
										? "Connected"
										: "Connect"}
								</button>
							) : (
								<button
									type="button"
									onClick={() => {
										const urls: Record<WalletName, string> = {
											lace: "https://www.lace.io/",
											yoroi: "https://yoroi-wallet.com/",
											eternl: "https://eternl.io/",
										};
										window.open(urls[wallet.name], "_blank");
									}}
									className="wallet-install-button"
								>
									Install
								</button>
							)}
						</div>
					))}
				</div>
			</div>

			{status.connected && (
				<div className="params-section">
					<h3>Connection Info</h3>
					<div className="connection-info">
						<div className="info-item">
							<label>Wallet:</label>
							<span>{status.walletName}</span>
						</div>
						<div className="info-item">
							<label>Address:</label>
							<div className="address-display">
								<span className="address-full">{status.address}</span>
								<span className="address-short">
									{status.address
										? formatAddress(status.address)
										: ""}
								</span>
								<button
									type="button"
									onClick={() => {
										if (status.address) {
											navigator.clipboard.writeText(status.address);
										}
									}}
									className="copy-button"
									title="Copy address"
								>
									Copy
								</button>
							</div>
						</div>
						<div className="info-item">
							<label>Balance:</label>
							<span className="balance-display">
								{status.balance || "Loading..."}
							</span>
						</div>
						<div className="connection-actions">
							<button
								type="button"
								onClick={handleRefresh}
								disabled={refreshing}
								className="refresh-button"
							>
								{refreshing ? "Refreshing..." : "Refresh"}
							</button>
							<button
								type="button"
								onClick={handleDisconnect}
								className="disconnect-button"
							>
								Disconnect
							</button>
						</div>
					</div>
				</div>
			)}

			{error && (
				<div className="error-panel">
					<h3>Error</h3>
					<pre>{error}</pre>
				</div>
			)}

			<div className="params-section">
				<h3>Usage</h3>
				<ol className="usage-list">
					<li>
						Install a wallet extension (Lace, Yoroi, Eternl, etc.) in your browser
					</li>
					<li>
						Create or import a wallet and obtain testnet tokens (tDUST)
					</li>
					<li>
						Click the "Connect" button on this page to connect your wallet
					</li>
					<li>
						After connection, your address and balance will be displayed
					</li>
				</ol>
				<div className="info-box">
					<strong>Note:</strong> Proof Server must be running.
					<br />
					<code>
						docker run -p 6300:6300 midnightnetwork/proof-server:latest
					</code>
				</div>
			</div>
		</div>
	);
}
