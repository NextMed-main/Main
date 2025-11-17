import { useState } from "react";
import { RpcClient } from "./rpc-client";
import {
	searchTransactionByHash,
	searchTransactionsByAccount,
	type TransactionSearchResult,
} from "./tx-search";
import "./App.css";

const DEFAULT_ENDPOINT = "https://rpc.testnet-02.midnight.network/";

interface RpcMethod {
	name: string;
	description: string;
	params?: Array<{ name: string; type: string; required: boolean }>;
}

const RPC_METHODS: RpcMethod[] = [
	{ name: "system_chain", description: "チェーン名を取得" },
	{ name: "system_name", description: "ノード名を取得" },
	{ name: "system_version", description: "ノードバージョンを取得" },
	{ name: "system_health", description: "ノードのヘルス状態を取得" },
	{ name: "system_peers", description: "接続されているピアのリストを取得" },
	{ name: "system_properties", description: "チェーンのプロパティを取得" },
	{
		name: "chain_getBlock",
		description: "ブロックのヘッダーとボディを取得",
		params: [{ name: "hash", type: "string", required: false }],
	},
	{
		name: "chain_getBlockHash",
		description: "特定のブロックのハッシュを取得",
		params: [{ name: "blockNumber", type: "string", required: false }],
	},
	{
		name: "chain_getFinalizedHead",
		description: "最終確定されたブロックのハッシュを取得",
	},
	{
		name: "chain_getHeader",
		description: "特定のブロックのヘッダーを取得",
		params: [{ name: "hash", type: "string", required: false }],
	},
	{
		name: "state_getStorage",
		description: "ストレージエントリを取得",
		params: [
			{ name: "key", type: "string", required: true },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "state_getMetadata",
		description: "ランタイムメタデータを取得",
		params: [{ name: "at", type: "string", required: false }],
	},
	{
		name: "state_getRuntimeVersion",
		description: "ランタイムバージョンを取得",
		params: [{ name: "at", type: "string", required: false }],
	},
	{ name: "rpc_methods", description: "利用可能なRPCメソッドのリストを取得" },
	{
		name: "midnight_jsonContractState",
		description: "JSONエンコードされたコントラクト状態を取得",
		params: [
			{ name: "address", type: "string", required: true },
			{ name: "block", type: "string", required: false },
		],
	},
	{
		name: "midnight_contractState",
		description: "生の（バイナリエンコードされた）コントラクト状態を取得",
		params: [
			{ name: "address", type: "string", required: true },
			{ name: "block", type: "string", required: false },
		],
	},
	{
		name: "midnight_unclaimedAmount",
		description: "未請求トークンまたは報酬の額を取得",
		params: [
			{ name: "beneficiary", type: "string", required: true },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "midnight_zswapChainState",
		description: "ZSwapチェーン状態を取得",
		params: [
			{ name: "address", type: "string", required: true },
			{ name: "block", type: "string", required: false },
		],
	},
	{
		name: "midnight_apiVersions",
		description: "サポートされているRPC APIバージョンのリストを取得",
	},
	{
		name: "midnight_ledgerVersion",
		description: "レジャーバージョンを取得",
		params: [{ name: "at", type: "string", required: false }],
	},
	{
		name: "midnight_jsonBlock",
		description: "JSONエンコードされたブロック情報を取得（extrinsicを含む）",
		params: [{ name: "at", type: "string", required: false }],
	},
	{
		name: "midnight_decodeEvents",
		description: "イベントをデコード",
		params: [{ name: "events", type: "string", required: true }],
	},
	{
		name: "midnight_zswapStateRoot",
		description: "ZSwap状態ルートを取得",
		params: [{ name: "at", type: "string", required: false }],
	},
];

type TabType = "rpc" | "search-tx" | "search-account";

function App() {
	const [endpoint, setEndpoint] = useState(DEFAULT_ENDPOINT);
	const [activeTab, setActiveTab] = useState<TabType>("rpc");
	const [selectedMethod, setSelectedMethod] = useState<string>("system_chain");
	const [params, setParams] = useState<Record<string, string>>({});
	const [result, setResult] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");

	// Transaction search states
	const [txHash, setTxHash] = useState<string>("");
	const [accountAddress, setAccountAddress] = useState<string>("");
	const [searchStartBlock, setSearchStartBlock] = useState<string>("");
	const [searchEndBlock, setSearchEndBlock] = useState<string>("");
	const [maxBlocks, setMaxBlocks] = useState<string>("");
	const [searchResults, setSearchResults] = useState<
		TransactionSearchResult | TransactionSearchResult[] | null
	>(null);

	const client = new RpcClient({ endpoint, timeout: 30000 });

	const selectedMethodInfo = RPC_METHODS.find((m) => m.name === selectedMethod);

	const handleMethodChange = (methodName: string) => {
		setSelectedMethod(methodName);
		setParams({});
		setResult("");
		setError("");
	};

	const handleParamChange = (paramName: string, value: string) => {
		setParams((prev) => ({ ...prev, [paramName]: value }));
	};

	const handleCall = async () => {
		setLoading(true);
		setError("");
		setResult("");

		try {
			const methodInfo = RPC_METHODS.find((m) => m.name === selectedMethod);
			if (!methodInfo) {
				throw new Error("Method not found");
			}

			const methodParams: unknown[] = [];
			if (methodInfo.params) {
				for (const param of methodInfo.params) {
					const value = params[param.name];
					if (param.required && !value) {
						throw new Error(`Parameter ${param.name} is required`);
					}
					if (value) {
						methodParams.push(value);
					}
				}
			}

			const response = await client.call(selectedMethod, methodParams);
			setResult(JSON.stringify(response, null, 2));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleSearchTx = async () => {
		if (!txHash.trim()) {
			setError("トランザクションハッシュを入力してください");
			return;
		}

		setLoading(true);
		setError("");
		setSearchResults(null);

		try {
			const result = await searchTransactionByHash(client, txHash, {
				startBlock: searchStartBlock
					? parseInt(searchStartBlock, 10)
					: undefined,
				endBlock: searchEndBlock ? parseInt(searchEndBlock, 10) : undefined,
				maxBlocks: maxBlocks ? parseInt(maxBlocks, 10) : undefined,
			});

			if (result) {
				setSearchResults(result);
			} else {
				setError("トランザクションが見つかりませんでした");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleSearchAccount = async () => {
		if (!accountAddress.trim()) {
			setError("アカウントアドレスを入力してください");
			return;
		}

		setLoading(true);
		setError("");
		setSearchResults(null);

		try {
			const results = await searchTransactionsByAccount(
				client,
				accountAddress,
				{
					startBlock: searchStartBlock
						? parseInt(searchStartBlock, 10)
						: undefined,
					endBlock: searchEndBlock ? parseInt(searchEndBlock, 10) : undefined,
					maxBlocks: maxBlocks ? parseInt(maxBlocks, 10) : undefined,
				},
			);

			setSearchResults(results);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="app">
			<header className="header">
				<h1>Midnight Network RPC Explorer</h1>
				<div className="endpoint-config">
					<label>
						RPC Endpoint:
						<input
							type="text"
							value={endpoint}
							onChange={(e) => setEndpoint(e.target.value)}
							className="endpoint-input"
						/>
					</label>
				</div>
			</header>

			<main className="main">
				<div className="sidebar">
					<div className="tabs">
						<button
							type="button"
							className={`tab-button ${activeTab === "rpc" ? "active" : ""}`}
							onClick={() => setActiveTab("rpc")}
						>
							RPC Methods
						</button>
						<button
							type="button"
							className={`tab-button ${
								activeTab === "search-tx" ? "active" : ""
							}`}
							onClick={() => setActiveTab("search-tx")}
						>
							Search TX
						</button>
						<button
							type="button"
							className={`tab-button ${
								activeTab === "search-account" ? "active" : ""
							}`}
							onClick={() => setActiveTab("search-account")}
						>
							Search Account
						</button>
					</div>

					{activeTab === "rpc" && (
						<>
							<h2>RPC Methods</h2>
							<div className="method-list">
								{RPC_METHODS.map((method) => (
									<button
										type="button"
										key={method.name}
										onClick={() => handleMethodChange(method.name)}
										className={`method-button ${
											selectedMethod === method.name ? "active" : ""
										}`}
									>
										<div className="method-name">{method.name}</div>
										<div className="method-description">
											{method.description}
										</div>
									</button>
								))}
							</div>
						</>
					)}
				</div>

				<div className="content">
					{activeTab === "rpc" && (
						<div className="method-panel">
							<h2>{selectedMethod}</h2>
							<p className="method-description-text">
								{selectedMethodInfo?.description}
							</p>

							{selectedMethodInfo?.params &&
								selectedMethodInfo.params.length > 0 && (
									<div className="params-section">
										<h3>Parameters</h3>
										{selectedMethodInfo.params.map((param) => (
											<div key={param.name} className="param-input">
												<label>
													{param.name} ({param.type})
													{param.required && (
														<span className="required">*</span>
													)}
													<input
														type="text"
														value={params[param.name] || ""}
														onChange={(e) =>
															handleParamChange(param.name, e.target.value)
														}
														placeholder={
															param.required ? "Required" : "Optional"
														}
													/>
												</label>
											</div>
										))}
									</div>
								)}

							<button
								type="button"
								onClick={handleCall}
								disabled={loading}
								className="call-button"
							>
								{loading ? "Calling..." : "Call RPC Method"}
							</button>

							{error && (
								<div className="error-panel">
									<h3>Error</h3>
									<pre>{error}</pre>
								</div>
							)}

							{result && (
								<div className="result-panel">
									<h3>Result</h3>
									<pre>{result}</pre>
								</div>
							)}
						</div>
					)}

					{activeTab === "search-tx" && (
						<div className="method-panel">
							<h2>トランザクションハッシュで検索</h2>
							<p className="method-description-text">
								トランザクションハッシュを入力して、トランザクションを検索します。
							</p>

							<div className="params-section">
								<div className="param-input">
									<label>
										トランザクションハッシュ
										<span className="required">*</span>
										<input
											type="text"
											value={txHash}
											onChange={(e) => setTxHash(e.target.value)}
											placeholder="0x..."
										/>
									</label>
								</div>
								<div className="param-input">
									<label>
										検索開始ブロック番号（オプション）
										<input
											type="number"
											value={searchStartBlock}
											onChange={(e) => setSearchStartBlock(e.target.value)}
											placeholder="例: 1000"
										/>
									</label>
								</div>
								<div className="param-input">
									<label>
										検索終了ブロック番号（オプション）
										<input
											type="number"
											value={searchEndBlock}
											onChange={(e) => setSearchEndBlock(e.target.value)}
											placeholder="例: 2000"
										/>
									</label>
								</div>
								<div className="param-input">
									<label>
										最大検索ブロック数（デフォルト: 1000）
										<input
											type="number"
											value={maxBlocks}
											onChange={(e) => setMaxBlocks(e.target.value)}
											placeholder="1000"
										/>
									</label>
								</div>
							</div>

							<button
								type="button"
								onClick={handleSearchTx}
								disabled={loading}
								className="call-button"
							>
								{loading ? "検索中..." : "検索"}
							</button>

							{error && (
								<div className="error-panel">
									<h3>Error</h3>
									<pre>{error}</pre>
								</div>
							)}

							{searchResults && (
								<div className="result-panel">
									<h3>検索結果</h3>
									<pre>{JSON.stringify(searchResults, null, 2)}</pre>
								</div>
							)}
						</div>
					)}

					{activeTab === "search-account" && (
						<div className="method-panel">
							<h2>アカウントアドレスで検索</h2>
							<p className="method-description-text">
								アカウントアドレスを入力して、関連するトランザクションを検索します。
							</p>

							<div className="params-section">
								<div className="param-input">
									<label>
										アカウントアドレス
										<span className="required">*</span>
										<input
											type="text"
											value={accountAddress}
											onChange={(e) => setAccountAddress(e.target.value)}
											placeholder="mn_shield-addr_..."
										/>
									</label>
								</div>
								<div className="param-input">
									<label>
										検索開始ブロック番号（オプション）
										<input
											type="number"
											value={searchStartBlock}
											onChange={(e) => setSearchStartBlock(e.target.value)}
											placeholder="例: 1000"
										/>
									</label>
								</div>
								<div className="param-input">
									<label>
										検索終了ブロック番号（オプション）
										<input
											type="number"
											value={searchEndBlock}
											onChange={(e) => setSearchEndBlock(e.target.value)}
											placeholder="例: 2000"
										/>
									</label>
								</div>
								<div className="param-input">
									<label>
										最大検索ブロック数（デフォルト: 100）
										<input
											type="number"
											value={maxBlocks}
											onChange={(e) => setMaxBlocks(e.target.value)}
											placeholder="100"
										/>
									</label>
								</div>
							</div>

							<button
								type="button"
								onClick={handleSearchAccount}
								disabled={loading}
								className="call-button"
							>
								{loading ? "検索中..." : "検索"}
							</button>

							{error && (
								<div className="error-panel">
									<h3>Error</h3>
									<pre>{error}</pre>
								</div>
							)}

							{searchResults && Array.isArray(searchResults) && (
								<div className="result-panel">
									<h3>検索結果 ({searchResults.length}件)</h3>
									<pre>{JSON.stringify(searchResults, null, 2)}</pre>
								</div>
							)}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

export default App;
