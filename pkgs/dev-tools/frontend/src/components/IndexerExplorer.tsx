import { useState } from "react";
import { GraphQLClient } from "../clients/graphql-client";
import {
	buildLatestBlockQuery,
	buildLatestBlockWithParentsQuery,
	buildBlockWithTransactionsQuery,
	buildTransactionsByHashQuery,
	buildTransactionsByIdentifierQuery,
	buildContractActionQuery,
	MAX_PARENT_CHAIN_DEPTH,
} from "../utils/graphql-queries";
import { numberToHexEncoded, isValidHexEncoded } from "../utils/hex-utils";
import { introspectSchema } from "../utils/indexer-schema";
import "../App.css";

const DEFAULT_INDEXER_URL =
	"https://indexer.testnet-02.midnight.network/api/v1/graphql";

type TabType = "blocks" | "transactions" | "search" | "custom" | "schema";

interface Block {
	height: number;
	hash: string;
	timestamp?: string;
	protocolVersion?: string;
	author?: string;
}

interface Transaction {
	hash: string;
	blockNumber?: number;
	blockHeight?: number;
	extrinsicIndex?: number;
	block?: {
		height: number;
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
	const [txLimit, setTxLimit] = useState<string>("50");
	const [txResult, setTxResult] = useState<Transaction[] | null>(null);

	// Search states
	const [searchTxHash, setSearchTxHash] = useState<string>("");
	const [searchAccount, setSearchAccount] = useState<string>("");
	const [searchAccountOffset, setSearchAccountOffset] = useState<string>("0");
	const [searchAccountLimit, setSearchAccountLimit] = useState<string>("100");
	const [searchResult, setSearchResult] = useState<unknown>(null);

	// Custom query states
	const [customQuery, setCustomQuery] = useState<string>(
		`query {
  blocks(offset: 0, limit: 5) {
    number
    hash
  }
}`,
	);

	// Schema introspection states
	const [schemaResult, setSchemaResult] = useState<string>("");
	const [schemaLoading, setSchemaLoading] = useState(false);

	const client = new GraphQLClient({ endpoint: indexerUrl, timeout: 30000 });

	const handleIntrospectSchema = async () => {
		setSchemaLoading(true);
		setError("");
		setSchemaResult("");

		try {
			const schema = await introspectSchema(client);
			setSchemaResult(JSON.stringify(schema, null, 2));
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unknown error occurred";
			setError(errorMessage);
		} finally {
			setSchemaLoading(false);
		}
	};

	// Helper function to extract blocks from parent chain recursively
	const extractBlocksFromParentChain = (
		block: any,
		blocksMap: Map<number, Block>,
	): void => {
		if (!block) {
			return;
		}

		blocksMap.set(block.height, {
			height: block.height,
			hash: block.hash,
			timestamp: block.timestamp
				? new Date(block.timestamp).toISOString()
				: undefined,
			protocolVersion: block.protocolVersion?.toString(),
			author: block.author,
		});

		// Recursively process parent blocks
		if (block.parent) {
			extractBlocksFromParentChain(block.parent, blocksMap);
		}
	};

	const handleQueryBlocks = async () => {
		setLoading(true);
		setError("");
		setBlocksResult(null);

		try {
			let limit = parseInt(blocksLimit, 10) || 10;
			
			// Cap limit at maximum recursion depth
			if (limit > MAX_PARENT_CHAIN_DEPTH) {
				limit = MAX_PARENT_CHAIN_DEPTH;
				setBlocksLimit(MAX_PARENT_CHAIN_DEPTH.toString());
			}
			
			// Get latest block with parent chain to get multiple blocks
			const query = buildLatestBlockWithParentsQuery(limit);
			const data = await client.query<{
				block: {
					hash: string;
					height: number;
					timestamp: number;
					protocolVersion: number;
					author?: string;
					parent?: any;
				};
			}>(query);

			// Extract blocks from the chain (latest block + parent chain)
			const blocksMap = new Map<number, Block>();
			extractBlocksFromParentChain(data.block, blocksMap);

			const uniqueBlocks = Array.from(blocksMap.values())
				.sort((a, b) => b.height - a.height)
				.slice(0, limit);

			setBlocksResult(uniqueBlocks);
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
			const limit = parseInt(txLimit, 10) || 50;
			
			// Get latest block height first
			const latestBlockQuery = buildLatestBlockQuery();
			const latestBlockData = await client.query<{
				block: {
					height: number;
				};
			}>(latestBlockQuery);
			
			const latestHeight = latestBlockData.block.height;
			const allTransactions: Transaction[] = [];
			
			// Calculate search range based on limit
			// Since transactions are sparse (~0.35 per block on average),
			// we need to search roughly 3x the limit in blocks
			// Cap at reasonable maximums to avoid performance issues
			const estimatedBlocksNeeded = Math.min(limit * 3, 1000);
			const searchRange = Math.min(estimatedBlocksNeeded, latestHeight);
			
			// Search blocks in parallel batches for better performance
			const batchSize = 20;
			for (let start = 0; start < searchRange && allTransactions.length < limit; start += batchSize) {
				const promises = [];
				for (let i = 0; i < batchSize && (start + i) < searchRange; i++) {
					const height = latestHeight - (start + i);
					if (height < 0) break;
					
					const blockQuery = buildBlockWithTransactionsQuery(height);
					promises.push(
						client.query<{
							block: {
								height: number;
								transactions: Transaction[];
							};
						}>(blockQuery).catch(() => null)
					);
				}
				
				const results = await Promise.all(promises);
				for (const result of results) {
					if (result && result.block && result.block.transactions) {
						allTransactions.push(...result.block.transactions);
						if (allTransactions.length >= limit) break;
					}
				}
				
				// Stop if we have enough transactions
				if (allTransactions.length >= limit) break;
			}

			// Sort by block height (newest first) and limit results
			const sortedTransactions = allTransactions
				.sort((a, b) => {
					const aHeight = a.block?.height ?? 0;
					const bHeight = b.block?.height ?? 0;
					return bHeight - aHeight;
				})
				.slice(0, limit);
			
			setTxResult(sortedTransactions);
			setResult(JSON.stringify({ transactions: sortedTransactions }, null, 2));
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
			// Normalize hash length for user feedback
			const originalHash = searchTxHash.trim();
			const cleanHash = originalHash.startsWith("0x") 
				? originalHash.slice(2) 
				: originalHash;
			
			let warningMessage = "";
			let queryHash = searchTxHash;
			
			// If hash is longer than 64 characters, try multiple approaches
			if (cleanHash.length > 64) {
				warningMessage = `Note: Hash length is ${cleanHash.length} characters (expected 64). Trying first 64 characters.`;
				// Try first 64 characters
				queryHash = cleanHash.slice(0, 64);
			} else if (cleanHash.length < 64) {
				warningMessage = `Note: Hash was padded from ${cleanHash.length} to 64 characters`;
			}
			
			// Try searching with normalized hash
			let query = buildTransactionsByHashQuery(queryHash);
			let data = await client.query<{ transactions: Transaction[] }>(query);

			// If not found and hash was longer than 64, try last 64 characters
			if ((!data.transactions || data.transactions.length === 0) && cleanHash.length > 64) {
				const last64 = cleanHash.slice(-64);
				warningMessage = `Note: Hash length is ${cleanHash.length} characters. Tried first 64, now trying last 64 characters.`;
				query = buildTransactionsByHashQuery(last64);
				data = await client.query<{ transactions: Transaction[] }>(query);
			}

			// transactions returns a list, get the first one
			if (data.transactions && data.transactions.length > 0) {
				setSearchResult(data.transactions[0]);
				setResult(JSON.stringify(data, null, 2));
				if (warningMessage) {
					setError(warningMessage);
				}
			} else {
				const notFoundMsg = warningMessage 
					? `Transaction not found. ${warningMessage} The hash may not exist in the indexer or may be from a different network.` 
					: "Transaction not found. The hash may not exist in the indexer or may be from a different network.";
				setError(notFoundMsg);
			}
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
			setError("Please enter an account address or identifier");
			return;
		}

		setLoading(true);
		setError("");
		setSearchResult(null);

		try {
			const searchValue = searchAccount.trim();
			const limit = parseInt(searchAccountLimit, 10) || 100;
			
			// Check if it's a Bech32m address (starts with mn_shield-addr_)
			const isBech32mAddress = searchValue.startsWith("mn_shield-addr_");
			
			if (isBech32mAddress) {
				// For Bech32m addresses, we need to search through transactions
				// and filter by identifiers field, as the indexer doesn't support
				// direct Bech32m address search
				const allTransactions: Transaction[] = [];
				
				// Get latest block height first
				const latestBlockQuery = buildLatestBlockQuery();
				const latestBlockData = await client.query<{
					block: {
						height: number;
					};
				}>(latestBlockQuery);
				
				const latestHeight = latestBlockData.block.height;
				const searchRange = Math.min(500, latestHeight); // Search up to 500 blocks
				
				// Search blocks in parallel batches
				const batchSize = 20;
				for (let start = 0; start < searchRange && allTransactions.length < limit; start += batchSize) {
					const promises = [];
					for (let i = 0; i < batchSize && (start + i) < searchRange; i++) {
						const height = latestHeight - (start + i);
						if (height < 0) break;
						
						const blockQuery = buildBlockWithTransactionsQuery(height);
						promises.push(
							client.query<{
								block: {
									height: number;
									transactions: Transaction[];
								};
							}>(blockQuery).catch(() => null)
						);
					}
					
					const results = await Promise.all(promises);
					for (const result of results) {
						if (result && result.block && result.block.transactions) {
							// Filter transactions that might be related to this address
							// Note: This is a heuristic approach since we can't directly match Bech32m addresses
							// In practice, you would need to decode the Bech32m address to get the identifier
							allTransactions.push(...result.block.transactions);
							if (allTransactions.length >= limit * 2) break; // Get more than needed for filtering
						}
					}
					
					if (allTransactions.length >= limit * 2) break;
				}
				
				// For now, return all transactions found (since we can't directly match Bech32m)
				// In a real implementation, you would decode Bech32m and match against identifiers
				const limitedTransactions = allTransactions.slice(0, limit);
				setSearchResult(limitedTransactions);
				setResult(JSON.stringify({ 
					transactions: limitedTransactions,
					note: "Bech32m address search: The indexer doesn't support direct Bech32m address search. Showing recent transactions. To search by identifier, convert the Bech32m address to hex identifier first."
				}, null, 2));
				setError("Note: Direct Bech32m address search is not supported by the indexer. Showing recent transactions. To search by identifier, convert the Bech32m address to hex identifier first.");
				return;
			}
			
			// Try contract address search first (if it looks like a hex address)
			if (isValidHexEncoded(searchValue)) {
				try {
					const contractQuery = buildContractActionQuery(searchValue);
					const contractData = await client.query<{
						contractAction: {
							address: string;
							state: string;
							chainState: string;
							transaction: Transaction;
						} | null;
					}>(contractQuery);
					
					if (contractData.contractAction) {
						setSearchResult(contractData.contractAction);
						setResult(JSON.stringify(contractData, null, 2));
						return;
					}
				} catch (contractErr) {
					// If contract search fails, fall through to identifier search
				}
			}
			
			// Fall back to identifier-based query
			let identifierHex: string;
			const trimmedOffset = searchAccountOffset.trim();
			if (trimmedOffset && isValidHexEncoded(trimmedOffset)) {
				identifierHex = trimmedOffset.startsWith("0x") ? trimmedOffset : `0x${trimmedOffset}`;
				// Ensure it's 64 hex characters (32 bytes)
				const hexPart = identifierHex.startsWith("0x") ? identifierHex.slice(2) : identifierHex;
				if (hexPart.length < 64) {
					identifierHex = `0x${hexPart.padStart(64, "0")}`;
				}
			} else {
				identifierHex = numberToHexEncoded(trimmedOffset || "0");
			}
			
			const query = buildTransactionsByIdentifierQuery(identifierHex);
			const data = await client.query<{ transactions: Transaction[] }>(query);

			// Filter by account if needed (this would require checking identifiers or contractActions)
			const limitedTransactions = data.transactions.slice(0, limit);
			setSearchResult(limitedTransactions);
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
						<button
							type="button"
							className={`tab-button ${activeTab === "schema" ? "active" : ""}`}
							onClick={() => setActiveTab("schema")}
						>
							Schema
						</button>
					</div>
				</div>

				<div className="content">
					{activeTab === "blocks" && (
						<div className="method-panel">
							<h2>Query Blocks</h2>
							<p className="method-description-text">
								Query blocks from the indexer. Gets the latest block and follows the parent chain to retrieve multiple blocks.
							</p>

							<div className="params-section">
								<div className="param-input">
									<label>
										Limit
										<input
											type="number"
											value={blocksLimit}
											onChange={(e) => {
												const value = parseInt(e.target.value, 10);
												if (!isNaN(value) && value >= 1 && value <= MAX_PARENT_CHAIN_DEPTH) {
													setBlocksLimit(e.target.value);
												}
											}}
											placeholder="10"
											min="1"
											max={MAX_PARENT_CHAIN_DEPTH}
										/>
										<small>Number of blocks to return (max: {MAX_PARENT_CHAIN_DEPTH} due to GraphQL recursion limit)</small>
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
													<span>Block #{block.height}</span>
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
								Query transactions from the indexer. Searches through multiple blocks to find transactions since identifier-based queries often return empty results.
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
											max="100"
										/>
										<small>Number of transactions to return (searches through multiple blocks)</small>
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
														Block #
														{tx.block?.height ??
															tx.blockNumber ??
															tx.blockHeight ??
															"unknown"}
														{tx.extrinsicIndex !== undefined &&
															` (Index: ${tx.extrinsicIndex})`}
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
								<div className="param-input">
									<label>
										Offset
										<input
											type="number"
											value={searchAccountOffset}
											onChange={(e) =>
												setSearchAccountOffset(e.target.value)
											}
											placeholder="0"
											min="0"
										/>
									</label>
								</div>
								<div className="param-input">
									<label>
										Limit
										<input
											type="number"
											value={searchAccountLimit}
											onChange={(e) => setSearchAccountLimit(e.target.value)}
											placeholder="100"
											min="1"
											max="1000"
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
									<pre>{String(JSON.stringify(searchResult, null, 2))}</pre>
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

					{activeTab === "schema" && (
						<div className="method-panel">
							<h2>GraphQL Schema Introspection</h2>
							<p className="method-description-text">
								Introspect the GraphQL schema to understand available fields and types.
							</p>

							<button
								type="button"
								onClick={handleIntrospectSchema}
								disabled={schemaLoading}
								className="call-button"
							>
								{schemaLoading ? "Introspecting..." : "Introspect Schema"}
							</button>

							{error && (
								<div className="error-panel">
									<h3>Error</h3>
									<pre>{error}</pre>
								</div>
							)}

							{schemaResult && (
								<div className="result-panel">
									<h3>Schema</h3>
									<pre>{schemaResult}</pre>
								</div>
							)}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
