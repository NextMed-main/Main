import { WalletConnection } from "./WalletConnection";
import "./App.css";

export function WalletApp() {
	return (
		<div className="app">
			<header className="header">
				<h1>Midnight Network Wallet Connection</h1>
			</header>

			<main className="main">
				<div className="content">
					<WalletConnection />
				</div>
			</main>
		</div>
	);
}

