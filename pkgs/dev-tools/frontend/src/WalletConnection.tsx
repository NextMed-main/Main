import { useState, useEffect } from "react";
import type {
	WalletName,
	Cip30WalletApi,
} from "./wallet-types";
import { WalletError } from "./wallet-types";
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
} from "./wallet-utils";
import "./App.css";

interface WalletStatus {
	connected: boolean;
	walletName: WalletName | null;
	address: string | null;
	balance: string | null;
	api: Cip30WalletApi | null;
}

export function WalletConnection() {
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

	// ページ読み込み時に保存された接続情報を確認
	useEffect(() => {
		const saved = loadConnection();
		if (saved) {
			// 保存された接続情報がある場合、自動再接続はしない
			// ユーザーが明示的に接続ボタンを押す必要がある
		}
	}, []);

	// ウォレットの検出を定期的に更新
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
			<h2>ウォレット接続確認</h2>
			<p className="method-description-text">
				Midnight Network対応ウォレットに接続して、アドレスや残高を確認できます。
			</p>

			{/* ウォレット一覧 */}
			<div className="params-section">
				<h3>利用可能なウォレット</h3>
				<div className="wallet-list">
					{wallets.map((wallet) => (
						<div key={wallet.name} className="wallet-item">
							<div className="wallet-info">
								<div className="wallet-name">
									{wallet.displayName}
								</div>
								<div
									className={`wallet-status ${
										wallet.installed ? "installed" : "not-installed"
									}`}
								>
									{wallet.installed ? "✓ インストール済み" : "✗ 未インストール"}
								</div>
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
										? "接続済み"
										: "接続"}
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
									インストール
								</button>
							)}
						</div>
					))}
				</div>
			</div>

			{/* 接続状態 */}
			{status.connected && (
				<div className="params-section">
					<h3>接続情報</h3>
					<div className="connection-info">
						<div className="info-item">
							<label>ウォレット:</label>
							<span>{status.walletName}</span>
						</div>
						<div className="info-item">
							<label>アドレス:</label>
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
									title="アドレスをコピー"
								>
									📋
								</button>
							</div>
						</div>
						<div className="info-item">
							<label>残高:</label>
							<span className="balance-display">
								{status.balance || "取得中..."}
							</span>
						</div>
						<div className="connection-actions">
							<button
								type="button"
								onClick={handleRefresh}
								disabled={refreshing}
								className="refresh-button"
							>
								{refreshing ? "更新中..." : "🔄 更新"}
							</button>
							<button
								type="button"
								onClick={handleDisconnect}
								className="disconnect-button"
							>
								切断
							</button>
						</div>
					</div>
				</div>
			)}

			{/* エラー表示 */}
			{error && (
				<div className="error-panel">
					<h3>エラー</h3>
					<pre>{error}</pre>
				</div>
			)}

			{/* 使用方法 */}
			<div className="params-section">
				<h3>使用方法</h3>
				<ol className="usage-list">
					<li>
						ウォレット拡張機能（Lace、Yoroi、Eternlなど）をブラウザにインストールします
					</li>
					<li>
						ウォレットを作成またはインポートし、テストネットトークン（tDUST）を取得します
					</li>
					<li>
						このページで「接続」ボタンをクリックしてウォレットに接続します
					</li>
					<li>
						接続後、アドレスや残高が表示されます
					</li>
				</ol>
				<div className="info-box">
					<strong>注意:</strong> Proof Serverが起動している必要があります。
					<br />
					<code>
						docker run -p 6300:6300 midnightnetwork/proof-server:latest
					</code>
				</div>
			</div>
		</div>
	);
}

