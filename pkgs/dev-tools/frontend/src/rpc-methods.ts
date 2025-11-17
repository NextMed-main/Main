/**
 * RPC Method Definitions
 * Methods extracted from Insomnia file, organized by category
 */

export interface RpcMethod {
	name: string;
	description: string;
	category: string;
	params?: Array<{ name: string; type: string; required: boolean; description?: string }>;
}

export const RPC_METHODS: RpcMethod[] = [
	// System
	{
		name: "system_chain",
		description: "Get chain name",
		category: "system",
	},
	{
		name: "system_name",
		description: "Get node name",
		category: "system",
	},
	{
		name: "system_version",
		description: "Get node version",
		category: "system",
	},
	{
		name: "system_health",
		description: "Get node health status",
		category: "system",
	},
	{
		name: "system_peers",
		description: "Get list of connected peers",
		category: "system",
	},
	{
		name: "system_properties",
		description: "Get chain properties",
		category: "system",
	},
	{
		name: "system_chainType",
		description: "Get chain type",
		category: "system",
	},
	{
		name: "system_nodeRoles",
		description: "Get node roles",
		category: "system",
	},
	{
		name: "system_localPeerId",
		description: "Get local peer ID",
		category: "system",
	},
	{
		name: "system_localListenAddresses",
		description: "Get local listen addresses",
		category: "system",
	},
	{
		name: "system_reservedPeers",
		description: "Get list of reserved peers",
		category: "system",
	},
	{
		name: "system_addReservedPeer",
		description: "Add reserved peer",
		category: "system",
		params: [{ name: "peer", type: "string", required: true }],
	},
	{
		name: "system_removeReservedPeer",
		description: "Remove reserved peer",
		category: "system",
		params: [{ name: "peer", type: "string", required: true }],
	},
	{
		name: "system_accountNextIndex",
		description: "Get account next index",
		category: "system",
		params: [{ name: "accountId", type: "string", required: true }],
	},
	{
		name: "system_dryRun",
		description: "Dry run transaction",
		category: "system",
		params: [
			{ name: "extrinsic", type: "string", required: true },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "system_dryRunAt",
		description: "Dry run transaction at specific block",
		category: "system",
		params: [
			{ name: "extrinsic", type: "string", required: true },
			{ name: "at", type: "string", required: true },
		],
	},
	{
		name: "system_addLogFilter",
		description: "Add log filter",
		category: "system",
		params: [{ name: "filter", type: "string", required: true }],
	},
	{
		name: "system_resetLogFilter",
		description: "Reset log filter",
		category: "system",
	},
	{
		name: "system_syncState",
		description: "Get sync state",
		category: "system",
	},
	{
		name: "system_unstable_networkState",
		description: "Get network state (unstable API)",
		category: "system",
	},

	// Chain
	{
		name: "chain_getBlock",
		description: "Get block header and body",
		category: "chain",
		params: [{ name: "hash", type: "string", required: false }],
	},
	{
		name: "chain_getBlockHash",
		description: "Get hash of specific block",
		category: "chain",
		params: [{ name: "blockNumber", type: "string", required: false }],
	},
	{
		name: "chain_getHead",
		description: "Get latest block hash",
		category: "chain",
	},
	{
		name: "chain_getFinalizedHead",
		description: "Get finalized block hash",
		category: "chain",
	},
	{
		name: "chain_getFinalisedHead",
		description: "Get finalized block hash (British spelling)",
		category: "chain",
	},
	{
		name: "chain_getHeader",
		description: "Get header of specific block",
		category: "chain",
		params: [{ name: "hash", type: "string", required: false }],
	},
	{
		name: "chain_getRuntimeVersion",
		description: "Get runtime version",
		category: "chain",
		params: [{ name: "at", type: "string", required: false }],
	},
	{
		name: "chain_subscribeNewHead",
		description: "Subscribe to new block headers",
		category: "chain",
	},
	{
		name: "chain_subscribeNewHeads",
		description: "Subscribe to new block headers (plural)",
		category: "chain",
	},
	{
		name: "chain_subscribeAllHeads",
		description: "Subscribe to all block headers",
		category: "chain",
	},
	{
		name: "chain_subscribeFinalizedHeads",
		description: "Subscribe to finalized block headers",
		category: "chain",
	},
	{
		name: "chain_subscribeFinalisedHeads",
		description: "Subscribe to finalized block headers (British spelling)",
		category: "chain",
	},
	{
		name: "chain_subscribeRuntimeVersion",
		description: "Subscribe to runtime version changes",
		category: "chain",
	},
	{
		name: "chain_unsubscribeNewHead",
		description: "Unsubscribe from new block headers",
		category: "chain",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},
	{
		name: "chain_unsubscribeNewHeads",
		description: "Unsubscribe from new block headers (plural)",
		category: "chain",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},
	{
		name: "chain_unsubscribeAllHeads",
		description: "Unsubscribe from all block headers",
		category: "chain",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},
	{
		name: "chain_unsubscribeFinalizedHeads",
		description: "Unsubscribe from finalized block headers",
		category: "chain",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},
	{
		name: "chain_unsubscribeFinalisedHeads",
		description: "Unsubscribe from finalized block headers (British spelling)",
		category: "chain",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},
	{
		name: "chain_unsubscribeRuntimeVersion",
		description: "Unsubscribe from runtime version",
		category: "chain",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},

	// State
	{
		name: "state_getStorage",
		description: "Get storage entry",
		category: "state",
		params: [
			{ name: "key", type: "string", required: true },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "state_getStorageAt",
		description: "Get storage entry at specific block",
		category: "state",
		params: [
			{ name: "key", type: "string", required: true },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "state_getStorageHash",
		description: "Get storage entry hash",
		category: "state",
		params: [
			{ name: "key", type: "string", required: true },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "state_getStorageHashAt",
		description: "Get storage entry hash at specific block",
		category: "state",
		params: [
			{ name: "key", type: "string", required: true },
			{ name: "at", type: "string", required: true },
		],
	},
	{
		name: "state_getStorageSize",
		description: "Get storage entry size",
		category: "state",
		params: [
			{ name: "key", type: "string", required: true },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "state_getStorageSizeAt",
		description: "Get storage entry size at specific block",
		category: "state",
		params: [
			{ name: "key", type: "string", required: true },
			{ name: "at", type: "string", required: true },
		],
	},
	{
		name: "state_getKeys",
		description: "Get list of storage keys",
		category: "state",
		params: [
			{ name: "prefix", type: "string", required: false },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "state_getKeysPaged",
		description: "Get paginated list of storage keys",
		category: "state",
		params: [
			{ name: "prefix", type: "string", required: false },
			{ name: "count", type: "number", required: false },
			{ name: "startKey", type: "string", required: false },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "state_getKeysPagedAt",
		description: "Get paginated list of storage keys at specific block",
		category: "state",
		params: [
			{ name: "prefix", type: "string", required: false },
			{ name: "count", type: "number", required: false },
			{ name: "startKey", type: "string", required: false },
			{ name: "at", type: "string", required: true },
		],
	},
	{
		name: "state_getPairs",
		description: "Get storage key-value pairs",
		category: "state",
		params: [
			{ name: "prefix", type: "string", required: false },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "state_getMetadata",
		description: "Get runtime metadata",
		category: "state",
		params: [{ name: "at", type: "string", required: false }],
	},
	{
		name: "state_getRuntimeVersion",
		description: "Get runtime version",
		category: "state",
		params: [{ name: "at", type: "string", required: false }],
	},
	{
		name: "state_getReadProof",
		description: "Get storage read proof",
		category: "state",
		params: [
			{ name: "keys", type: "array", required: true },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "state_getChildReadProof",
		description: "Get child storage read proof",
		category: "state",
		params: [
			{ name: "childStorageKey", type: "string", required: true },
			{ name: "keys", type: "array", required: true },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "state_queryStorage",
		description: "Query storage",
		category: "state",
		params: [
			{ name: "keys", type: "array", required: true },
			{ name: "fromBlock", type: "string", required: false },
			{ name: "toBlock", type: "string", required: false },
		],
	},
	{
		name: "state_queryStorageAt",
		description: "Query storage at specific block",
		category: "state",
		params: [
			{ name: "keys", type: "array", required: true },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "state_subscribeStorage",
		description: "Subscribe to storage changes",
		category: "state",
		params: [{ name: "keys", type: "array", required: false }],
	},
	{
		name: "state_unsubscribeStorage",
		description: "Unsubscribe from storage",
		category: "state",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},
	{
		name: "state_subscribeRuntimeVersion",
		description: "Subscribe to runtime version changes",
		category: "state",
	},
	{
		name: "state_unsubscribeRuntimeVersion",
		description: "Unsubscribe from runtime version",
		category: "state",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},
	{
		name: "state_call",
		description: "Call runtime function",
		category: "state",
		params: [
			{ name: "method", type: "string", required: true },
			{ name: "data", type: "string", required: true },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "state_callAt",
		description: "Call runtime function at specific block",
		category: "state",
		params: [
			{ name: "method", type: "string", required: true },
			{ name: "data", type: "string", required: true },
			{ name: "at", type: "string", required: true },
		],
	},
	{
		name: "state_traceBlock",
		description: "Get block trace",
		category: "state",
		params: [
			{ name: "block", type: "string", required: true },
			{ name: "targets", type: "string", required: false },
			{ name: "storageKeys", type: "string", required: false },
		],
	},

	// Author
	{
		name: "author_submitExtrinsic",
		description: "Submit extrinsic",
		category: "author",
		params: [{ name: "extrinsic", type: "string", required: true }],
	},
	{
		name: "author_submitAndWatchExtrinsic",
		description: "Submit and watch extrinsic",
		category: "author",
		params: [{ name: "extrinsic", type: "string", required: true }],
	},
	{
		name: "author_pendingExtrinsics",
		description: "Get list of pending extrinsics",
		category: "author",
	},
	{
		name: "author_removeExtrinsic",
		description: "Remove extrinsic",
		category: "author",
		params: [{ name: "extrinsics", type: "array", required: true }],
	},
	{
		name: "author_unwatchExtrinsic",
		description: "Unwatch extrinsic",
		category: "author",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},
	{
		name: "author_rotateKeys",
		description: "Rotate session keys",
		category: "author",
	},
	{
		name: "author_insertKey",
		description: "Insert key",
		category: "author",
		params: [
			{ name: "keyType", type: "string", required: true },
			{ name: "suri", type: "string", required: true },
			{ name: "publicKey", type: "string", required: true },
		],
	},
	{
		name: "author_hasKey",
		description: "Check if key exists",
		category: "author",
		params: [
			{ name: "publicKey", type: "string", required: true },
			{ name: "keyType", type: "string", required: true },
		],
	},
	{
		name: "author_hasSessionKeys",
		description: "Check if session keys exist",
		category: "author",
		params: [{ name: "sessionKeys", type: "string", required: true }],
	},

	// Midnight
	{
		name: "midnight_jsonBlock",
		description: "Get JSON-encoded block information (including extrinsics)",
		category: "midnight",
		params: [{ name: "at", type: "string", required: false }],
	},
	{
		name: "midnight_jsonContractState",
		description: "Get JSON-encoded contract state",
		category: "midnight",
		params: [
			{ name: "address", type: "string", required: true },
			{ name: "block", type: "string", required: false },
		],
	},
	{
		name: "midnight_contractState",
		description: "Get raw (binary-encoded) contract state",
		category: "midnight",
		params: [
			{ name: "address", type: "string", required: true },
			{ name: "block", type: "string", required: false },
		],
	},
	{
		name: "midnight_decodeEvents",
		description: "Decode events",
		category: "midnight",
		params: [{ name: "events", type: "string", required: true }],
	},
	{
		name: "midnight_zswapChainState",
		description: "Get ZSwap chain state",
		category: "midnight",
		params: [
			{ name: "address", type: "string", required: true },
			{ name: "block", type: "string", required: false },
		],
	},
	{
		name: "midnight_apiVersions",
		description: "Get list of supported RPC API versions",
		category: "midnight",
	},

	// Child State
	{
		name: "childstate_getStorage",
		description: "Get child storage entry",
		category: "childstate",
		params: [
			{ name: "childStorageKey", type: "string", required: true },
			{ name: "key", type: "string", required: true },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "childstate_getStorageHash",
		description: "Get child storage entry hash",
		category: "childstate",
		params: [
			{ name: "childStorageKey", type: "string", required: true },
			{ name: "key", type: "string", required: true },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "childstate_getStorageSize",
		description: "Get child storage entry size",
		category: "childstate",
		params: [
			{ name: "childStorageKey", type: "string", required: true },
			{ name: "key", type: "string", required: true },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "childstate_getKeys",
		description: "Get list of child storage keys",
		category: "childstate",
		params: [
			{ name: "childStorageKey", type: "string", required: true },
			{ name: "prefix", type: "string", required: false },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "childstate_getKeysPaged",
		description: "Get paginated list of child storage keys",
		category: "childstate",
		params: [
			{ name: "childStorageKey", type: "string", required: true },
			{ name: "prefix", type: "string", required: false },
			{ name: "count", type: "number", required: false },
			{ name: "startKey", type: "string", required: false },
			{ name: "at", type: "string", required: false },
		],
	},
	{
		name: "childstate_getKeysPagedAt",
		description: "Get paginated list of child storage keys at specific block",
		category: "childstate",
		params: [
			{ name: "childStorageKey", type: "string", required: true },
			{ name: "prefix", type: "string", required: false },
			{ name: "count", type: "number", required: false },
			{ name: "startKey", type: "string", required: false },
			{ name: "at", type: "string", required: true },
		],
	},
	{
		name: "childstate_getStorageEntries",
		description: "Get list of child storage entries",
		category: "childstate",
		params: [
			{ name: "childStorageKey", type: "string", required: true },
			{ name: "prefix", type: "string", required: false },
			{ name: "at", type: "string", required: false },
		],
	},

	// Archive (Unstable API)
	{
		name: "archive_unstable_call",
		description: "Call runtime function on archive node (unstable API)",
		category: "archive",
		params: [
			{ name: "method", type: "string", required: true },
			{ name: "data", type: "string", required: true },
			{ name: "at", type: "string", required: true },
		],
	},
	{
		name: "archive_unstable_storage",
		description: "Get storage entry on archive node (unstable API)",
		category: "archive",
		params: [
			{ name: "key", type: "string", required: true },
			{ name: "at", type: "string", required: true },
		],
	},
	{
		name: "archive_unstable_header",
		description: "Get block header on archive node (unstable API)",
		category: "archive",
		params: [{ name: "hash", type: "string", required: true }],
	},
	{
		name: "archive_unstable_body",
		description: "Get block body on archive node (unstable API)",
		category: "archive",
		params: [{ name: "hash", type: "string", required: true }],
	},
	{
		name: "archive_unstable_genesisHash",
		description: "Get genesis block hash (unstable API)",
		category: "archive",
	},
	{
		name: "archive_unstable_hashByHeight",
		description: "Get block hash by height (unstable API)",
		category: "archive",
		params: [{ name: "height", type: "number", required: true }],
	},
	{
		name: "archive_unstable_finalizedHeight",
		description: "Get finalized block height (unstable API)",
		category: "archive",
	},

	// ChainHead (Unstable API)
	{
		name: "chainHead_unstable_follow",
		description: "Follow chain head (unstable API)",
		category: "chainhead",
		params: [{ name: "withRuntime", type: "boolean", required: false }],
	},
	{
		name: "chainHead_unstable_unfollow",
		description: "Unfollow chain head (unstable API)",
		category: "chainhead",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},
	{
		name: "chainHead_unstable_header",
		description: "Get chain head header (unstable API)",
		category: "chainhead",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},
	{
		name: "chainHead_unstable_call",
		description: "Call runtime function on chain head (unstable API)",
		category: "chainhead",
		params: [
			{ name: "subscriptionId", type: "string", required: true },
			{ name: "method", type: "string", required: true },
			{ name: "callParameters", type: "string", required: true },
		],
	},
	{
		name: "chainHead_unstable_storage",
		description: "Get storage entry on chain head (unstable API)",
		category: "chainhead",
		params: [
			{ name: "subscriptionId", type: "string", required: true },
			{ name: "key", type: "string", required: true },
			{ name: "childStorageKey", type: "string", required: false },
		],
	},
	{
		name: "chainHead_unstable_body",
		description: "Get block body on chain head (unstable API)",
		category: "chainhead",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},
	{
		name: "chainHead_unstable_unpin",
		description: "Unpin chain head (unstable API)",
		category: "chainhead",
		params: [
			{ name: "subscriptionId", type: "string", required: true },
			{ name: "blockHash", type: "string", required: true },
		],
	},
	{
		name: "chainHead_unstable_continue",
		description: "Continue chain head operation (unstable API)",
		category: "chainhead",
		params: [
			{ name: "subscriptionId", type: "string", required: true },
			{ name: "operationId", type: "string", required: true },
		],
	},
	{
		name: "chainHead_unstable_stopOperation",
		description: "Stop chain head operation (unstable API)",
		category: "chainhead",
		params: [
			{ name: "subscriptionId", type: "string", required: true },
			{ name: "operationId", type: "string", required: true },
		],
	},

	// TransactionWatch (Unstable API)
	{
		name: "transactionWatch_unstable_submitAndWatch",
		description: "Submit and watch transaction (unstable API)",
		category: "transactionwatch",
		params: [{ name: "extrinsic", type: "string", required: true }],
	},
	{
		name: "transactionWatch_unstable_unwatch",
		description: "Unwatch transaction (unstable API)",
		category: "transactionwatch",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},

	// Sidechain
	{
		name: "sidechain_getRegistrations",
		description: "Get sidechain registration information",
		category: "sidechain",
	},
	{
		name: "sidechain_getParams",
		description: "Get sidechain parameters",
		category: "sidechain",
	},
	{
		name: "sidechain_getStatus",
		description: "Get sidechain status",
		category: "sidechain",
	},
	{
		name: "sidechain_getEpochCommittee",
		description: "Get epoch committee",
		category: "sidechain",
		params: [{ name: "epoch", type: "number", required: true }],
	},
	{
		name: "sidechain_getAriadneParameters",
		description: "Get Ariadne parameters",
		category: "sidechain",
		params: [{ name: "epoch", type: "number", required: true }],
	},

	// Offchain
	{
		name: "offchain_localStorageGet",
		description: "Get value from offchain local storage",
		category: "offchain",
		params: [
			{ name: "kind", type: "string", required: true },
			{ name: "key", type: "string", required: true },
		],
	},
	{
		name: "offchain_localStorageSet",
		description: "Set value in offchain local storage",
		category: "offchain",
		params: [
			{ name: "kind", type: "string", required: true },
			{ name: "key", type: "string", required: true },
			{ name: "value", type: "string", required: true },
		],
	},

	// Grandpa
	{
		name: "grandpa_subscribeJustifications",
		description: "Subscribe to Grandpa justifications",
		category: "grandpa",
	},
	{
		name: "grandpa_unsubscribeJustifications",
		description: "Unsubscribe from Grandpa justifications",
		category: "grandpa",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},
	{
		name: "grandpa_roundState",
		description: "Get Grandpa round state",
		category: "grandpa",
	},
	{
		name: "grandpa_proveFinality",
		description: "Get finality proof",
		category: "grandpa",
		params: [
			{ name: "block", type: "string", required: true },
			{ name: "authoritiesSetId", type: "number", required: false },
		],
	},

	// Other
	{
		name: "rpc_methods",
		description: "Get list of available RPC methods",
		category: "other",
	},
	{
		name: "account_nextIndex",
		description: "Get account next index (deprecated)",
		category: "other",
		params: [{ name: "accountId", type: "string", required: true }],
	},
	{
		name: "subscribe_newHead",
		description: "Subscribe to new block headers (deprecated)",
		category: "other",
	},
	{
		name: "unsubscribe_newHead",
		description: "Unsubscribe from new block headers (deprecated)",
		category: "other",
		params: [{ name: "subscriptionId", type: "string", required: true }],
	},
];

/**
 * Group methods by category
 */
export function getMethodsByCategory(): Record<string, RpcMethod[]> {
	const grouped: Record<string, RpcMethod[]> = {};
	for (const method of RPC_METHODS) {
		if (!grouped[method.category]) {
			grouped[method.category] = [];
		}
		grouped[method.category].push(method);
	}
	return grouped;
}

/**
 * Category name display
 */
export const CATEGORY_NAMES: Record<string, string> = {
	system: "System",
	chain: "Chain",
	state: "State",
	author: "Author",
	midnight: "Midnight",
	childstate: "Child State",
	archive: "Archive (Unstable)",
	chainhead: "ChainHead (Unstable)",
	transactionwatch: "TransactionWatch (Unstable)",
	sidechain: "Sidechain",
	offchain: "Offchain",
	grandpa: "Grandpa",
	other: "Other",
};

