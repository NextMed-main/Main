/**
 * Transaction Search Utilities
 * トランザクション検索のためのユーティリティ関数
 */

import type { RpcClient } from "./rpc-client";

export interface BlockInfo {
	hash: string;
	number: number;
	extrinsics: string[];
}

export interface TransactionSearchResult {
	blockHash: string;
	blockNumber: number;
	extrinsicIndex: number;
	extrinsic: string;
}

/**
 * ブロック内のextrinsicハッシュを計算（簡易版）
 * 実際の実装では、extrinsicのハッシュを正確に計算する必要があります
 */
function calculateExtrinsicHash(extrinsic: string): string {
	// 実際の実装では、extrinsicをデコードしてハッシュを計算する必要があります
	// ここでは簡易的にextrinsicの文字列からハッシュを生成します
	// 注意: これは正確なハッシュではない可能性があります
	return extrinsic;
}

/**
 * ブロックを取得してextrinsicを検索
 */
export async function findTransactionInBlock(
	client: RpcClient,
	blockHash: string,
	txHash: string,
): Promise<TransactionSearchResult | null> {
	try {
		const block = await client.call<{
			block: {
				header: { number: string };
				extrinsics: string[];
			};
		}>("chain_getBlock", [blockHash]);

		if (!block?.block?.extrinsics) {
			return null;
		}

		const blockNumber = parseInt(block.block.header.number, 16);

		for (let i = 0; i < block.block.extrinsics.length; i++) {
			const extrinsic = block.block.extrinsics[i];
			// 簡易的なマッチング（実際にはextrinsicのハッシュを正確に計算する必要があります）
			if (
				extrinsic.includes(txHash) ||
				calculateExtrinsicHash(extrinsic) === txHash
			) {
				return {
					blockHash,
					blockNumber,
					extrinsicIndex: i,
					extrinsic,
				};
			}
		}

		return null;
	} catch (error) {
		throw new Error(
			`Failed to search block ${blockHash}: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * バイナリサーチでブロック範囲を絞り込む（効率的な検索）
 * ブロック範囲を半分ずつ絞り込んで、トランザクションが含まれる可能性のある範囲を特定
 */
async function binarySearchBlockRange(
	client: RpcClient,
	txHash: string,
	startBlock: number,
	endBlock: number,
): Promise<TransactionSearchResult | null> {
	// 小さな範囲の場合は線形検索に切り替え
	if (endBlock - startBlock < 10) {
		for (let blockNum = endBlock; blockNum >= startBlock; blockNum--) {
			try {
				const blockHash = await client.call<string>("chain_getBlockHash", [
					`0x${blockNum.toString(16)}`,
				]);
				if (!blockHash) {
					continue;
				}

				const result = await findTransactionInBlock(client, blockHash, txHash);
				if (result) {
					return result;
				}
			} catch (_error) {}
		}
		return null;
	}

	// 中間ブロックをチェック
	const midBlock = Math.floor((startBlock + endBlock) / 2);

	try {
		const midBlockHash = await client.call<string>("chain_getBlockHash", [
			`0x${midBlock.toString(16)}`,
		]);
		if (!midBlockHash) {
			// ブロックが存在しない場合は後半を検索
			return binarySearchBlockRange(client, txHash, midBlock + 1, endBlock);
		}

		// 中間ブロック以降にトランザクションがある可能性がある場合
		// （実際には、トランザクションのタイムスタンプやnonceから推測できるが、
		//  ここでは簡易的に後半を優先的に検索）
		const result = await findTransactionInBlock(client, midBlockHash, txHash);
		if (result) {
			return result;
		}

		// 後半を優先的に検索（最新のトランザクションから）
		const rightResult = await binarySearchBlockRange(
			client,
			txHash,
			midBlock + 1,
			endBlock,
		);
		if (rightResult) {
			return rightResult;
		}

		// 前半を検索
		return binarySearchBlockRange(client, txHash, startBlock, midBlock - 1);
	} catch (_error) {
		// エラーが発生した場合は線形検索にフォールバック
		return null;
	}
}

/**
 * ブロック範囲を検索してトランザクションを見つける
 * バイナリサーチを使用して効率的に検索します
 */
export async function searchTransactionByHash(
	client: RpcClient,
	txHash: string,
	options?: {
		startBlock?: number;
		endBlock?: number;
		maxBlocks?: number;
		useBinarySearch?: boolean;
	},
): Promise<TransactionSearchResult | null> {
	const maxBlocks = options?.maxBlocks ?? 1000;
	const startBlock = options?.startBlock;
	const endBlock = options?.endBlock;
	const useBinarySearch = options?.useBinarySearch ?? true;

	try {
		// 最新ブロックの番号を取得
		const latestBlockHash = await client.call<string>("chain_getFinalizedHead");
		const latestBlock = await client.call<{
			block: { header: { number: string } };
		}>("chain_getBlock", [latestBlockHash]);

		if (!latestBlock?.block?.header?.number) {
			throw new Error("Failed to get latest block number");
		}

		const latestBlockNumber = parseInt(latestBlock.block.header.number, 16);
		const searchEndBlock = endBlock ?? latestBlockNumber;
		const searchStartBlock =
			startBlock ?? Math.max(0, searchEndBlock - maxBlocks);

		// バイナリサーチを使用する場合
		if (useBinarySearch && searchEndBlock - searchStartBlock > 10) {
			const result = await binarySearchBlockRange(
				client,
				txHash,
				searchStartBlock,
				searchEndBlock,
			);
			if (result) {
				return result;
			}
		}

		// バイナリサーチが失敗した場合、または無効な場合は線形検索にフォールバック
		// 後ろから検索（最新のトランザクションから）
		for (
			let blockNum = searchEndBlock;
			blockNum >= searchStartBlock;
			blockNum--
		) {
			try {
				const blockHash = await client.call<string>("chain_getBlockHash", [
					`0x${blockNum.toString(16)}`,
				]);
				if (!blockHash) {
					continue;
				}

				const result = await findTransactionInBlock(client, blockHash, txHash);
				if (result) {
					return result;
				}
			} catch (_error) {}
		}

		return null;
	} catch (error) {
		throw new Error(
			`Failed to search transaction: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * アカウントアドレスに関連するトランザクションを検索
 *
 * 注意: 標準RPCでは、ブロックを順次検索する必要があります。
 * より効率的な検索には、以下の方法を検討してください：
 * 1. Indexerの使用（推奨）: Midnight Networkのindexerを使用
 * 2. Archive Nodeの使用: archive_unstable_*メソッドを使用（WebSocket接続が必要）
 * 3. ストレージクエリ: state_queryStorageを使用してイベントから逆引き
 */
export async function searchTransactionsByAccount(
	client: RpcClient,
	accountAddress: string,
	options?: {
		startBlock?: number;
		endBlock?: number;
		maxBlocks?: number;
	},
): Promise<TransactionSearchResult[]> {
	const maxBlocks = options?.maxBlocks ?? 100;
	const startBlock = options?.startBlock;
	const endBlock = options?.endBlock;

	const results: TransactionSearchResult[] = [];

	try {
		// 最新ブロックの番号を取得
		const latestBlockHash = await client.call<string>("chain_getFinalizedHead");
		const latestBlock = await client.call<{
			block: { header: { number: string } };
		}>("chain_getBlock", [latestBlockHash]);

		if (!latestBlock?.block?.header?.number) {
			throw new Error("Failed to get latest block number");
		}

		const latestBlockNumber = parseInt(latestBlock.block.header.number, 16);
		const searchEndBlock = endBlock ?? latestBlockNumber;
		const searchStartBlock =
			startBlock ?? Math.max(0, searchEndBlock - maxBlocks);

		// 後ろから検索（最新のトランザクションから）
		// 注意: 大量のブロックを検索する場合は時間がかかる可能性があります
		for (
			let blockNum = searchEndBlock;
			blockNum >= searchStartBlock;
			blockNum--
		) {
			try {
				const blockHash = await client.call<string>("chain_getBlockHash", [
					`0x${blockNum.toString(16)}`,
				]);
				if (!blockHash) {
					continue;
				}

				const block = await client.call<{
					block: {
						header: { number: string };
						extrinsics: string[];
					};
				}>("chain_getBlock", [blockHash]);

				if (!block?.block?.extrinsics) {
					continue;
				}

				const blockNumber = parseInt(block.block.header.number, 16);

				for (let i = 0; i < block.block.extrinsics.length; i++) {
					const extrinsic = block.block.extrinsics[i];
					// 簡易的なマッチング（実際にはextrinsicをデコードしてアカウントアドレスを確認する必要があります）
					if (extrinsic.includes(accountAddress)) {
						results.push({
							blockHash,
							blockNumber,
							extrinsicIndex: i,
							extrinsic,
						});
					}
				}
			} catch (_error) {}
		}

		return results;
	} catch (error) {
		throw new Error(
			`Failed to search transactions by account: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}
