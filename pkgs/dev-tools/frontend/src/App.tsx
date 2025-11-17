import { useState, useMemo } from "react";
import { RpcClient } from "./rpc-client";
import {
	searchTransactionByHash,
	searchTransactionsByAccount,
	type TransactionSearchResult,
} from "./tx-search";
import { RPC_METHODS, CATEGORY_NAMES } from "./rpc-methods";
import {
	getBlockExplorerUrl,
	extractBlockHashFromResult,
	extractBlockNumberFromResult,
} from "./explorer-utils";
import "./App.css";

const DEFAULT_ENDPOINT = "https://rpc.testnet-02.midnight.network/";

type TabType = "rpc" | "search-tx" | "search-account";

function App() {
	const [endpoint, setEndpoint] = useState(DEFAULT_ENDPOINT);
	const [activeTab, setActiveTab] = useState<TabType>("rpc");
	const [selectedMethod, setSelectedMethod] = useState<string>("system_chain");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [params, setParams] = useState<Record<string, string>>({});
	const [result, setResult] = useState<string>("");
	const [resultData, setResultData] = useState<unknown>(null);
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

	// Filtered method list
	const filteredMethods = useMemo(() => {
		let methods = RPC_METHODS;

		// Filter by category
		if (selectedCategory !== "all") {
			methods = methods.filter((m) => m.category === selectedCategory);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			methods = methods.filter(
				(m) =>
					m.name.toLowerCase().includes(query) ||
					m.description.toLowerCase().includes(query),
			);
		}

		return methods;
	}, [selectedCategory, searchQuery]);

	// Block explorer link
	const blockExplorerUrl = useMemo(() => {
		if (!resultData) {
			return null;
		}

		const blockHash = extractBlockHashFromResult(resultData);
		if (blockHash) {
			return getBlockExplorerUrl(blockHash);
		}

		const blockNumber = extractBlockNumberFromResult(resultData);
		if (blockNumber !== null) {
			return getBlockExplorerUrl(`0x${blockNumber.toString(16)}`);
		}

		return null;
	}, [resultData]);

	const handleMethodChange = (methodName: string) => {
		setSelectedMethod(methodName);
		setParams({});
		setResult("");
		setResultData(null);
		setError("");
	};

	const handleParamChange = (paramName: string, value: string) => {
		setParams((prev) => ({ ...prev, [paramName]: value }));
	};

	const handleCall = async () => {
		setLoading(true);
		setError("");
		setResult("");
		setResultData(null);

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
			setResultData(response);
			setResult(JSON.stringify(response, null, 2));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleSearchTx = async () => {
		if (!txHash.trim()) {
			setError("Please enter a transaction hash");
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
				setError("Transaction not found");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleSearchAccount = async () => {
		if (!accountAddress.trim()) {
			setError("Please enter an account address");
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

							{/* Search bar */}
							<div className="search-bar">
								<input
									type="text"
									placeholder="Search by method name or description..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="search-input"
								/>
							</div>

							{/* Category filter */}
							<div className="category-filter">
								<button
									type="button"
									className={`category-button ${
										selectedCategory === "all" ? "active" : ""
									}`}
									onClick={() => setSelectedCategory("all")}
								>
									All
								</button>
								{Object.entries(CATEGORY_NAMES).map(([key, name]) => (
									<button
										key={key}
										type="button"
										className={`category-button ${
											selectedCategory === key ? "active" : ""
										}`}
										onClick={() => setSelectedCategory(key)}
									>
										{name}
									</button>
								))}
							</div>

							<div className="method-list">
								{filteredMethods.length === 0 ? (
									<div className="no-results">
										No methods found
									</div>
								) : (
									filteredMethods.map((method) => (
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
											<div className="method-category">
												{CATEGORY_NAMES[method.category]}
											</div>
										</button>
									))
								)}
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
									<div className="result-header">
										<h3>Result</h3>
										{blockExplorerUrl && (
											<a
												href={blockExplorerUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="explorer-link"
											>
												🔗 Open in Explorer
											</a>
										)}
									</div>
									<pre>{result}</pre>
								</div>
							)}
						</div>
					)}

					{activeTab === "search-tx" && (
						<div className="method-panel">
							<h2>Search by Transaction Hash</h2>
							<p className="method-description-text">
								Enter a transaction hash to search for the transaction.
							</p>

							<div className="params-section">
								<div className="param-input">
									<label>
										Transaction Hash
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
										Start Block Number (Optional)
										<input
											type="number"
											value={searchStartBlock}
											onChange={(e) => setSearchStartBlock(e.target.value)}
											placeholder="e.g., 1000"
										/>
									</label>
								</div>
								<div className="param-input">
									<label>
										End Block Number (Optional)
										<input
											type="number"
											value={searchEndBlock}
											onChange={(e) => setSearchEndBlock(e.target.value)}
											placeholder="e.g., 2000"
										/>
									</label>
								</div>
								<div className="param-input">
									<label>
										Max Blocks to Search (Default: 1000)
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
								{loading ? "Searching..." : "Search"}
							</button>

							{error && (
								<div className="error-panel">
									<h3>Error</h3>
									<pre>{error}</pre>
								</div>
							)}

							{searchResults && (
								<div className="result-panel">
									<div className="result-header">
										<h3>Search Results</h3>
										{!Array.isArray(searchResults) &&
											searchResults.blockHash && (
												<a
													href={getBlockExplorerUrl(searchResults.blockHash)}
													target="_blank"
													rel="noopener noreferrer"
													className="explorer-link"
												>
													🔗 Open in Explorer
												</a>
											)}
									</div>
									<pre>{JSON.stringify(searchResults, null, 2)}</pre>
								</div>
							)}
						</div>
					)}

					{activeTab === "search-account" && (
						<div className="method-panel">
							<h2>Search by Account Address</h2>
							<p className="method-description-text">
								Enter an account address to search for related transactions.
							</p>

							<div className="params-section">
								<div className="param-input">
									<label>
										Account Address
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
										Start Block Number (Optional)
										<input
											type="number"
											value={searchStartBlock}
											onChange={(e) => setSearchStartBlock(e.target.value)}
											placeholder="e.g., 1000"
										/>
									</label>
								</div>
								<div className="param-input">
									<label>
										End Block Number (Optional)
										<input
											type="number"
											value={searchEndBlock}
											onChange={(e) => setSearchEndBlock(e.target.value)}
											placeholder="e.g., 2000"
										/>
									</label>
								</div>
								<div className="param-input">
									<label>
										Max Blocks to Search (Default: 100)
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
								{loading ? "Searching..." : "Search"}
							</button>

							{error && (
								<div className="error-panel">
									<h3>Error</h3>
									<pre>{error}</pre>
								</div>
							)}

							{searchResults && Array.isArray(searchResults) && (
								<div className="result-panel">
									<h3>Search Results ({searchResults.length} found)</h3>
									<div className="search-results-list">
										{searchResults.map((result, index) => (
											<div key={index} className="search-result-item">
												<div className="result-item-header">
													<span>
														Block #{result.blockNumber} (Index:{" "}
														{result.extrinsicIndex})
													</span>
													<a
														href={getBlockExplorerUrl(result.blockHash)}
														target="_blank"
														rel="noopener noreferrer"
														className="explorer-link-small"
													>
														🔗 Explorer
													</a>
												</div>
												<pre className="result-item-content">
													{JSON.stringify(result, null, 2)}
												</pre>
											</div>
										))}
									</div>
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
