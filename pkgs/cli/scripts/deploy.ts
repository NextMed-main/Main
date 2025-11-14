// This file is part of midnightntwrk/example-counter.
// Copyright (C) 2025 Midnight Foundation
// SPDX-License-Identifier: Apache-2.0

import type { Logger } from "pino";
import { createLogger } from "../src/utils/logger-utils.js";
import {
	StandaloneConfig,
	TestnetLocalConfig,
	TestnetRemoteConfig,
	type Config,
} from "../src/config.js";
import * as api from "../src/api.js";
import * as dotenv from "dotenv";

console.log("Starting deploy script...");
dotenv.config();
console.log("dotenv.config() completed");

const {
	NETWORK_ENV_VAR,
	SEED_ENV_VAR,
	INITIAL_COUNTER_ENV_VAR,
	CACHE_FILE_ENV_VAR,
} = process.env;

/**
 * CIやスクリプト実行向けの非対話的なデプロイヘルパー。
 * 対象ネットワークと再利用するウォレットシードを環境変数で指定し、手動入力なしに安全に再デプロイできる。
 */

type SupportedNetwork =
	| "standalone"
	| "testnet-local"
	| "testnet"
	| "testnet-remote";

const resolveNetwork = (value: string | undefined): SupportedNetwork => {
	const normalized = (value ?? "testnet").toLowerCase();
	if (normalized === "testnet") {
		return "testnet";
	}
	switch (normalized) {
		case "testnet-remote":
		case "standalone":
		case "testnet-local":
			return normalized;
		default:
			throw new Error(`Unsupported network '${value}'.`);
	}
};

const buildConfig = (network: SupportedNetwork): Config => {
	switch (network) {
		case "standalone":
			return new StandaloneConfig();
		case "testnet-local":
			return new TestnetLocalConfig();
		case "testnet":
		case "testnet-remote":
		default:
			return new TestnetRemoteConfig();
	}
};

const ensureSeed = async (seed: string | undefined): Promise<string> => {
	if (seed === undefined || seed.trim() === "") {
		throw new Error(
			"Wallet seed is required. Set SEED_ENV_VAR environment variable.",
		);
	}
	// シードをトリム
	const trimmedSeed = seed.trim();
	if (trimmedSeed.length === 0) {
		throw new Error(
			"Wallet seed cannot be empty. Set SEED_ENV_VAR environment variable.",
		);
	}
	// 空白を含む場合はニーモニックフレーズとみなす
	if (trimmedSeed.includes(" ")) {
		// ニーモニックフレーズを16進数シードに変換
		// 動的にbip39をインポート
		try {
			const { createRequire } = await import("module");
			const require = createRequire(import.meta.url);
			const bip39 = require("bip39");
			const { createHash } = await import("crypto");

			if (!bip39.validateMnemonic(trimmedSeed)) {
				throw new Error(
					"Invalid mnemonic phrase. Please check your SEED_ENV_VAR.",
				);
			}
			// ニーモニックフレーズからシードを生成（BIP39標準: 512ビット）
			const seedBuffer = bip39.mnemonicToSeedSync(trimmedSeed);

			// Midnightウォレットは32バイトのシードを期待
			// Laceウォレットとの互換性のため、BIP39の512ビットシードの最初の32バイトを使用
			// これはBIP39の標準的な導出方法で、多くのウォレットが使用している
			// 注意: Laceウォレットが異なる導出方法を使用している場合は、この方法では一致しない可能性がある
			const first32Bytes = seedBuffer.slice(0, 32);

			// 32バイト（64文字の16進数文字列）を返す
			return Buffer.from(first32Bytes).toString("hex");
		} catch (error) {
			console.error("Error converting mnemonic to seed:", error);
			throw new Error(
				`Failed to convert mnemonic phrase to seed: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
	// 空白を含まない場合は16進数文字列として検証
	const cleanedSeed = trimmedSeed.replace(/\s+/g, "");
	const hexPattern = /^(0x)?[0-9a-fA-F]+$/;
	if (!hexPattern.test(cleanedSeed)) {
		throw new Error(
			"Wallet seed must be a valid hexadecimal string or mnemonic phrase. Remove any invalid characters.",
		);
	}
	// 0xプレフィックスを除去
	const seedWithoutPrefix = cleanedSeed.startsWith("0x")
		? cleanedSeed.substring(2)
		: cleanedSeed;
	// 64文字の16進数文字列であることを確認（必要に応じてパディング）
	if (seedWithoutPrefix.length < 64) {
		throw new Error(
			`Wallet seed must be at least 64 hexadecimal characters (32 bytes). Current length: ${seedWithoutPrefix.length}`,
		);
	}
	// 64文字に切り詰める（長すぎる場合）
	return seedWithoutPrefix.substring(0, 64);
};

const parseInitialCounter = (value: string | undefined): number => {
	if (value === undefined || value.trim() === "") {
		return 0;
	}
	const parsed = Number(value);
	if (!Number.isSafeInteger(parsed) || parsed < 0) {
		throw new Error(
			`Initial counter must be a non-negative safe integer. Received '${value}'.`,
		);
	}
	return parsed;
};

const defaultCacheName = (seed: string, network: SupportedNetwork): string => {
	// ニーモニックフレーズの場合は最初の単語を使用
	if (seed.includes(" ")) {
		const firstWord = seed.split(/\s+/)[0];
		return `${firstWord}-${network}.state`;
	}
	// 16進数文字列の場合は先頭8文字を使用
	const cleanedSeed = seed.replace(/\s+/g, "");
	const seedWithoutPrefix = cleanedSeed.startsWith("0x")
		? cleanedSeed.substring(2)
		: cleanedSeed;
	const prefix = seedWithoutPrefix.substring(0, 8);
	return `${prefix}-${network}.state`;
};

// Midnight系リソースはbest-effortなcloseメソッドを持つことが多いため、失敗は握り潰して再実行可能性を保つ。
const closeIfPossible = async (
	resource: unknown,
	label: string,
): Promise<void> => {
	if (resource !== null && typeof resource === "object") {
		const maybeClosable = resource as { close?: () => unknown };
		if (typeof maybeClosable.close === "function") {
			try {
				await Promise.resolve(maybeClosable.close());
			} catch (error) {
				if (logger !== undefined) {
					if (error instanceof Error) {
						logger.warn(`Failed to close ${label}: ${error.message}`);
						logger.debug(error.stack ?? "");
					} else {
						logger.warn(`Failed to close ${label}: ${String(error)}`);
					}
				}
			}
		}
	}
};

let logger: Logger | undefined;

/**
 * コントラクトデプロイ用のスクリプト
 */
const main = async () => {
	// ネットワーク情報を取得する
	const network = resolveNetwork(NETWORK_ENV_VAR);
	const seed = await ensureSeed(SEED_ENV_VAR);
	const initialCounter = parseInitialCounter(INITIAL_COUNTER_ENV_VAR);
	const cacheFileName = CACHE_FILE_ENV_VAR ?? defaultCacheName(seed, network);
	// 設定ファイルの読み込み
	const config = buildConfig(network);
	// ロガーの設定
	logger = await createLogger(config.logDir);
	api.setLogger(logger);

	logger.info(`Deploying counter contract to '${network}' network.`);
	logger.info(`Using cache file '${cacheFileName}'.`);

	let wallet:
		| Awaited<ReturnType<typeof api.buildWalletAndWaitForFunds>>
		| undefined;

	try {
		// シードからウォレットを作成
		wallet = await api.buildWalletAndWaitForFunds(config, seed, cacheFileName);
		// プロバイダーインスタンスを生成
		const providers = await api.configureProviders(wallet, config);
		// Counterコントラクトをデプロイする
		const counterContract = await api.deploy(providers, {
			privateCounter: initialCounter,
		});
		// デプロイしたトランザクション情報を出力する
		const deployTx = counterContract.deployTxData.public;
		logger.info(`Deployment transaction: ${deployTx.txId}`);
		logger.info(`Contract address: ${deployTx.contractAddress}`);
		console.log(`Counter contract deployed at: ${deployTx.contractAddress}`);
		await api.saveState(wallet, cacheFileName);
		await closeIfPossible(
			providers.privateStateProvider,
			"private state provider",
		);
	} finally {
		if (wallet !== undefined) {
			await closeIfPossible(wallet, "wallet");
		}
	}
};

/**
 * メインメソッド
 */
main().catch((error) => {
	try {
		if (logger !== undefined) {
			if (error instanceof Error) {
				logger.error(`Deployment failed: ${error.message}`);
				logger.debug(error.stack ?? "");
				// スタックトレースも出力
				console.error("Error stack:", error.stack);
			} else {
				logger.error(`Deployment failed: ${String(error)}`);
				console.error("Error:", error);
			}
		} else {
			console.error("Error:", error);
			if (error instanceof Error) {
				console.error("Error message:", error.message);
				console.error("Error stack:", error.stack);
			} else {
				console.error("Error type:", typeof error);
				console.error("Error value:", JSON.stringify(error, null, 2));
			}
		}
	} catch (logError) {
		console.error("Failed to log error:", logError);
		console.error("Original error:", error);
	}
	process.exitCode = 1;
	process.exit(1);
});
