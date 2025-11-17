import { useState } from "react";
import { GraphQLClient } from "./graphql-client";
import "./App.css";

const DEFAULT_INDEXER_URL =
	"https://indexer.testnet-02.midnight.network/api/v1/graphql";

type TabType = "blocks" | "transactions" | "search" | "custom";

interface Block {
	number: number;
	hash: string;
	timestamp?: string;
	transactionCount?: number;
}

interface Transaction {
	id: string;
	hash: string;
	blockNumber: number;
	extrinsicIndex?: number;
	block?: {
		number: number;
		hash: string;
	};
}

export function IndexerExplorer() {
	const [indexerUrl, setIndexerUrl] = useState(DEFAULT_INDEXER_URL);
	const [activeTab, setActiveTab] = useState<TabType>("blocks");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [result, setResult] = useState<string>("");

	// Blocks query states
	const [blocksLimit, setBlocksLimit] = useState<string>("10");
	const [blocksResult, setBlocksResult] = useState<Block[] | null>(null);

	// Transactions query states
	const [txLimit, setTxLimit] = useState<string>("10");
	const [txResult, setTxResult] = useState<Transaction[] | null>(null);

	// Search states
	const [searchTxHash, setSearchTxHash] = useState<string>("");
	const [searchAccount, setSearchAccount] = useState<string>("");
	const [searchResult, setSearchResult] = useState<unknown>(null);

	// Custom query states
	const [customQuery, setCustomQuery] = useState<string>(
		`query {
  blocks(limit: 5) {
    number
    hash
  }
}`,
	);

	const client = new GraphQLClient({ endpoint: indexerUrl, timeout: 30000 });

	const handleQueryBlocks = async () => {
		setLoading(true);
		setError("");
		setBlocksResult(null);

		try {
			const limit = parseInt(blocksLimit, 10) || 10;
			const data = await client.query<{ blocks: Block[] }>(`
        query {
          blocks(limit: ${limit}) {
            number
            hash
            timestamp
            transactionCount
          }
        }
      `);

			setBlocksResult(data.blocks);
			setResult(JSON.stringify(data, null, 2));
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unknown error occurred";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleQueryTransactions = async () => {
		setLoading(true);
		setError("");
		setTxResult(null);

		try {
			const limit = parseInt(txLimit, 10) || 10;
			const data = await client.query<{ transactions: Transaction[] }>(`
        query {
          transactions(limit: ${limit}) {
            id
            hash
            blockNumber
            extrinsicIndex
            block {
              number
              hash
            }
          }
        }
      `);

			setTxResult(data.transactions);
			setResult(JSON.stringify(data, null, 2));
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unknown error occurred";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleSearchTransaction = async () => {
		if (!searchTxHash.trim()) {
			setError("Please enter a transaction hash");
			return;
		}

		setLoading(true);
		setError("");
		setSearchResult(null);

		try {
			const data = await client.query<{ transaction: Transaction }>(`
        query {
          transaction(hash: "${searchTxHash}") {
            id
            hash
            blockNumber
            extrinsicIndex
            block {
              number
              hash
            }
          }
        }
      `);

			setSearchResult(data.transaction);
			setResult(JSON.stringify(data, null, 2));
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unknown error occurred";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleSearchAccount = async () => {
		if (!searchAccount.trim()) {
			setError("Please enter an account address");
			return;
		}

		setLoading(true);
		setError("");
		setSearchResult(null);

		try {
			const data = await client.query<{ transactions: Transaction[] }>(`
        query {
          transactions(
            filter: { account: "${searchAccount}" }
            limit: 100
          ) {
            id
            hash
            blockNumber
            extrinsicIndex
            block {
              number
              hash
            }
          }
        }
      `);

			setSearchResult(data.transactions);
			setResult(JSON.stringify(data, null, 2));
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unknown error occurred";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleCustomQuery = async () => {
		if (!customQuery.trim()) {
			setError("Please enter a GraphQL query");
			return;
		}

		setLoading(true);
		setError("");
		setResult("");

		try {
			const data = await client.query(customQuery);
			setResult(JSON.stringify(data, null, 2));
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unknown error occurred";
			setError(errorMessage);
			setResult("");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="app">
			<header className="header">
				<h1>Midnight Network Indexer Explorer</h1>
				<div className="endpoint-config">
					<label>
						Indexer URL:
						<input
							type="text"
							value={indexerUrl}
							onChange={(e) => setIndexerUrl(e.target.value)}
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
							className={`tab-button ${activeTab === "blocks" ? "active" : ""}`}
							onClick={() => setActiveTab("blocks")}
						>
							Blocks
						</button>
						<button
							type="button"
							className={`tab-button ${
								activeTab === "transactions" ? "active" : ""
							}`}
							onClick={() => setActiveTab("transactions")}
						>
							Transactions
						</button>
						<button
							type="button"
							className={`tab-button ${activeTab === "search" ? "active" : ""}`}
							onClick={() => setActiveTab("search")}
						>
							Search
						</button>
						<button
							type="button"
							className={`tab-button ${activeTab === "custom" ? "active" : ""}`}
							onClick={() => setActiveTab("custom")}
						>
							Custom Query
						</button>
					</div>
				</div>

				<div className="content">
					{activeTab === "blocks" && (
						<div className="method-panel">
							<h2>Query Blocks</h2>
							<p className="method-description-text">
								Query recent blocks from the indexer.
							</p>

							<div className="params-section">
								<div className="param-input">
									<label>
										Limit
										<input
											type="number"
											value={blocksLimit}
											onChange={(e) => setBlocksLimit(e.target.value)}
											placeholder="10"
											min="1"
											max="1000"
										/>
									</label>
								</div>
							</div>

							<button
								type="button"
								onClick={handleQueryBlocks}
								disabled={loading}
								className="call-button"
							>
								{loading ? "Querying..." : "Query Blocks"}
							</button>

							{error && (
								<div className="error-panel">
									<h3>Error</h3>
									<pre>{error}</pre>
								</div>
							)}

							{blocksResult && (
								<div className="result-panel">
									<h3>Results ({blocksResult.length} blocks)</h3>
									<div className="search-results-list">
										{blocksResult.map((block, index) => (
											<div key={index} className="search-result-item">
												<div className="result-item-header">
													<span>Block #{block.number}</span>
												</div>
												<pre className="result-item-content">
													{JSON.stringify(block, null, 2)}
												</pre>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					)}

					{activeTab === "transactions" && (
						<div className="method-panel">
							<h2>Query Transactions</h2>
							<p className="method-description-text">
								Query recent transactions from the indexer.
							</p>

							<div className="params-section">
								<div className="param-input">
									<label>
										Limit
										<input
											type="number"
											value={txLimit}
											onChange={(e) => setTxLimit(e.target.value)}
											placeholder="10"
											min="1"
											max="1000"
										/>
									</label>
								</div>
							</div>

							<button
								type="button"
								onClick={handleQueryTransactions}
								disabled={loading}
								className="call-button"
							>
								{loading ? "Querying..." : "Query Transactions"}
							</button>

							{error && (
								<div className="error-panel">
									<h3>Error</h3>
									<pre>{error}</pre>
								</div>
							)}

							{txResult && (
								<div className="result-panel">
									<h3>Results ({txResult.length} transactions)</h3>
									<div className="search-results-list">
										{txResult.map((tx, index) => (
											<div key={index} className="search-result-item">
												<div className="result-item-header">
													<span>
														Block #{tx.blockNumber} (Index: {tx.extrinsicIndex})
													</span>
												</div>
												<pre className="result-item-content">
													{JSON.stringify(tx, null, 2)}
												</pre>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					)}

					{activeTab === "search" && (
						<div className="method-panel">
							<h2>Search</h2>
							<p className="method-description-text">
								Search for transactions by hash or account address.
							</p>

							<div className="params-section">
								<div className="param-input">
									<label>
										Transaction Hash
										<input
											type="text"
											value={searchTxHash}
											onChange={(e) => setSearchTxHash(e.target.value)}
											placeholder="0x..."
										/>
									</label>
								</div>
								<button
									type="button"
									onClick={handleSearchTransaction}
									disabled={loading || !searchTxHash.trim()}
									className="call-button"
								>
									{loading ? "Searching..." : "Search by Hash"}
								</button>

								<div className="param-input" style={{ marginTop: "2rem" }}>
									<label>
										Account Address
										<input
											type="text"
											value={searchAccount}
											onChange={(e) => setSearchAccount(e.target.value)}
											placeholder="mn_shield-addr_..."
										/>
									</label>
								</div>
								<button
									type="button"
									onClick={handleSearchAccount}
									disabled={loading || !searchAccount.trim()}
									className="call-button"
								>
									{loading ? "Searching..." : "Search by Account"}
								</button>
							</div>

							{error && (
								<div className="error-panel">
									<h3>Error</h3>
									<pre>{error}</pre>
								</div>
							)}

							{searchResult && (
								<div className="result-panel">
									<h3>Search Results</h3>
									<pre>{JSON.stringify(searchResult, null, 2)}</pre>
								</div>
							)}
						</div>
					)}

					{activeTab === "custom" && (
						<div className="method-panel">
							<h2>Custom GraphQL Query</h2>
							<p className="method-description-text">
								Execute a custom GraphQL query against the indexer.
							</p>

							<div className="params-section">
								<div className="param-input">
									<label>
										GraphQL Query
										<textarea
											value={customQuery}
											onChange={(e) => setCustomQuery(e.target.value)}
											placeholder="query { ... }"
											rows={15}
											style={{
												width: "100%",
												padding: "0.5rem 0.75rem",
												border: "1px solid var(--color-border)",
												borderRadius: "2px",
												fontSize: "0.875rem",
												fontFamily:
													'"Monaco", "Menlo", "Ubuntu Mono", monospace',
												resize: "vertical",
											}}
										/>
									</label>
								</div>
							</div>

							<button
								type="button"
								onClick={handleCustomQuery}
								disabled={loading}
								className="call-button"
							>
								{loading ? "Executing..." : "Execute Query"}
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
				</div>
			</main>
		</div>
	);
}

