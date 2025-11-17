/**
 * Explorer URL Generation Utility
 * Generate links to Polkadot.js.org explorer
 */

const EXPLORER_BASE_URL =
	"https://polkadot.js.org/apps/?rpc=wss://rpc.testnet-02.midnight.network#/explorer/query";

/**
 * Generate explorer URL from block hash
 */
export function getBlockExplorerUrl(blockHash: string): string {
	if (!blockHash) {
		return "";
	}
	// Add 0x prefix if block hash doesn't start with it
	const hash = blockHash.startsWith("0x") ? blockHash : `0x${blockHash}`;
	return `${EXPLORER_BASE_URL}/${hash}`;
}

/**
 * Generate explorer URL from block number
 * Note: For block numbers, you need to get the block hash first
 */
export function getBlockNumberExplorerUrl(blockNumber: number | string): string {
	if (blockNumber === undefined || blockNumber === null) {
		return "";
	}
	// Convert block number to hexadecimal
	const hexNumber =
		typeof blockNumber === "string"
			? blockNumber.startsWith("0x")
				? blockNumber
				: `0x${parseInt(blockNumber, 10).toString(16)}`
			: `0x${blockNumber.toString(16)}`;
	return `${EXPLORER_BASE_URL}/${hexNumber}`;
}

/**
 * Extract block hash from JSON response and generate explorer URL
 */
export function extractBlockHashFromResult(result: unknown): string | null {
	if (!result || typeof result !== "object") {
		return null;
	}

	const obj = result as Record<string, unknown>;

	// Direct block hash returned
	if (typeof obj === "string" && obj.startsWith("0x")) {
		return obj as string;
	}

	// block.block.header.hash or block.header.hash
	if (obj.block) {
		const block = obj.block as Record<string, unknown>;
		if (block.header) {
			const header = block.header as Record<string, unknown>;
			if (typeof header.hash === "string") {
				return header.hash;
			}
		}
	}

	// header.hash
	if (obj.header) {
		const header = obj.header as Record<string, unknown>;
		if (typeof header.hash === "string") {
			return header.hash;
		}
	}

	// Direct hash property
	if (typeof obj.hash === "string") {
		return obj.hash;
	}

	return null;
}

/**
 * Extract block number from JSON response
 */
export function extractBlockNumberFromResult(result: unknown): number | null {
	if (!result || typeof result !== "object") {
		return null;
	}

	const obj = result as Record<string, unknown>;

	// block.block.header.number
	if (obj.block) {
		const block = obj.block as Record<string, unknown>;
		if (block.header) {
			const header = block.header as Record<string, unknown>;
			if (header.number) {
				const numberStr =
					typeof header.number === "string" ? header.number : String(header.number);
				// Convert from hexadecimal if needed
				if (numberStr.startsWith("0x")) {
					return parseInt(numberStr, 16);
				}
				return parseInt(numberStr, 10);
			}
		}
	}

	// header.number
	if (obj.header) {
		const header = obj.header as Record<string, unknown>;
		if (header.number) {
			const numberStr =
				typeof header.number === "string" ? header.number : String(header.number);
			if (numberStr.startsWith("0x")) {
				return parseInt(numberStr, 16);
			}
			return parseInt(numberStr, 10);
		}
	}

	// Direct number property
	if (obj.number !== undefined) {
		const numberStr = typeof obj.number === "string" ? obj.number : String(obj.number);
		if (numberStr.startsWith("0x")) {
			return parseInt(numberStr, 16);
		}
		return parseInt(numberStr, 10);
	}

	return null;
}

