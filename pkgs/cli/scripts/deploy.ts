// This file is part of midnightntwrk/example-counter.
// Copyright (C) 2025 Midnight Foundation
// SPDX-License-Identifier: Apache-2.0

import type { Logger } from 'pino';
import { createLogger } from '../src/utils/logger-utils.js';
import {
	StandaloneConfig,
	TestnetLocalConfig,
	TestnetRemoteConfig,
	type Config,
} from '../src/config.js';
import * as api from '../src/api.js';
import * as dotenv from 'dotenv';

dotenv.config();

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

type SupportedNetwork = 'standalone' | 'testnet-local' | 'testnet' | 'testnet-remote';

const resolveNetwork = (value: string | undefined): SupportedNetwork => {
	const normalized = (value ?? 'testnet').toLowerCase();
	if (normalized === 'testnet') {
		return 'testnet';
	}
	switch (normalized) {
		case 'testnet-remote':
		case 'standalone':
		case 'testnet-local':
			return normalized;
		default:
			throw new Error(`Unsupported network '${value}'.`);
	}
};

const buildConfig = (network: SupportedNetwork): Config => {
	switch (network) {
		case 'standalone':
			return new StandaloneConfig();
		case 'testnet-local':
			return new TestnetLocalConfig();
		case 'testnet':
		case 'testnet-remote':
		default:
			return new TestnetRemoteConfig();
	}
};

const ensureSeed = (seed: string | undefined): string => {
	if (seed === undefined || seed.trim() === '') {
		throw new Error(`Wallet seed is required. Set ${SEED_ENV_VAR}.`);
	}
	return seed.trim();
};

const parseInitialCounter = (value: string | undefined): number => {
	if (value === undefined || value.trim() === '') {
		return 0;
	}
	const parsed = Number(value);
	if (!Number.isSafeInteger(parsed) || parsed < 0) {
		throw new Error(`Initial counter must be a non-negative safe integer. Received '${value}'.`);
	}
	return parsed;
};

const defaultCacheName = (seed: string, network: SupportedNetwork): string => {
	const prefix = seed.substring(0, 8);
	return `${prefix}-${network}.state`;
};

// Midnight系リソースはbest-effortなcloseメソッドを持つことが多いため、失敗は握り潰して再実行可能性を保つ。
const closeIfPossible = async (resource: unknown, label: string): Promise<void> => {
	if (resource !== null && typeof resource === 'object') {
		const maybeClosable = resource as { close?: () => unknown };
		if (typeof maybeClosable.close === 'function') {
			try {
				await Promise.resolve(maybeClosable.close());
			} catch (error) {
				if (logger !== undefined) {
					if (error instanceof Error) {
						logger.warn(`Failed to close ${label}: ${error.message}`);
						logger.debug(error.stack ?? '');
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
	const seed = ensureSeed(SEED_ENV_VAR);
	const initialCounter = parseInitialCounter(INITIAL_COUNTER_ENV_VAR);
	const cacheFileName = CACHE_FILE_ENV_VAR ?? defaultCacheName(seed, network);
    // 設定ファイルの読み込み
	const config = buildConfig(network);
    // ロガーの設定
	logger = await createLogger(config.logDir);
	api.setLogger(logger);

	logger.info(`Deploying counter contract to '${network}' network.`);
	logger.info(`Using cache file '${cacheFileName}'.`);
    
	let wallet: Awaited<ReturnType<typeof api.buildWalletAndWaitForFunds>> | undefined;
	
    try {
        // シードからウォレットを作成
		wallet = await api.buildWalletAndWaitForFunds(config, seed, cacheFileName);
        // プロバイダーインスタンスを生成
		const providers = await api.configureProviders(wallet, config);
        // Counterコントラクトをデプロイする
		const counterContract = await api.deploy(providers, { privateCounter: initialCounter });
        // デプロイしたトランザクション情報を出力する
		const deployTx = counterContract.deployTxData.public;
		logger.info(`Deployment transaction: ${deployTx.txId}`);
		logger.info(`Contract address: ${deployTx.contractAddress}`);
		console.log(`Counter contract deployed at: ${deployTx.contractAddress}`);
		await api.saveState(wallet, cacheFileName);
		await closeIfPossible(providers.privateStateProvider, 'private state provider');
	} finally {
		if (wallet !== undefined) {
			await closeIfPossible(wallet, 'wallet');
		}
	}
};

/**
 * メインメソッド
 */
await main().catch((error) => {
	if (logger !== undefined) {
		if (error instanceof Error) {
			logger.error(`Deployment failed: ${error.message}`);
			logger.debug(error.stack ?? '');
		} else {
			logger.error(`Deployment failed: ${String(error)}`);
		}
	} else {
		console.error(error);
	}
	process.exitCode = 1;
});

