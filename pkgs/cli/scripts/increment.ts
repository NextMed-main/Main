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
import { assertIsContractAddress } from '@midnight-ntwrk/midnight-js-utils';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * 既存のカウンターコントラクトに対し、非対話的に increment を実行するヘルパー。
 * ネットワークやウォレットシード、コントラクトアドレスは環境変数で受け取り、CI 等でもそのまま利用できる。
 */

type SupportedNetwork = 'standalone' | 'testnet-local' | 'testnet' | 'testnet-remote';

const { NETWORK_ENV_VAR, SEED_ENV_VAR, CONTRACT_ADDRESS, CACHE_FILE_ENV_VAR } = process.env;

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
		throw new Error('Wallet seed is required. Set SEED_ENV_VAR.');
	}
	return seed.trim();
};

const ensureContractAddress = (address: string | undefined): string => {
	if (address === undefined || address.trim() === '') {
		throw new Error('Contract address is required. Set CONTRACT_ADDRESS.');
	}
	const trimmed = address.trim();
	assertIsContractAddress(trimmed);
	return trimmed;
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

const main = async () => {
	const network = resolveNetwork(NETWORK_ENV_VAR);
	const seed = ensureSeed(SEED_ENV_VAR);
	const contractAddress = ensureContractAddress(CONTRACT_ADDRESS);
	const cacheFileName = CACHE_FILE_ENV_VAR ?? defaultCacheName(seed, network);

	const config = buildConfig(network);
	logger = await createLogger(config.logDir);
	api.setLogger(logger);

	logger.info(`Incrementing counter contract on '${network}' network.`);
	logger.info(`Target contract address: ${contractAddress}`);
	logger.info(`Using cache file '${cacheFileName}'.`);

	let wallet: Awaited<ReturnType<typeof api.buildWalletAndWaitForFunds>> | undefined;
	let providers: Awaited<ReturnType<typeof api.configureProviders>> | undefined;
	try {
		wallet = await api.buildWalletAndWaitForFunds(config, seed, cacheFileName);
		providers = await api.configureProviders(wallet, config);
        // デプロイ済みのコントラクトインスタンスを生成
		const counterContract = await api.joinContract(providers, contractAddress);
        // Counterコントラクトの increment メソッドを呼び出す
		const txInfo = await api.increment(counterContract);
		logger.info(`Increment transaction: ${txInfo.txId} (block ${txInfo.blockHeight})`);
		console.log(`Counter incremented. txId=${txInfo.txId} block=${txInfo.blockHeight}`);
		const { counterValue } = await api.displayCounterValue(providers, counterContract);
		if (counterValue !== null) {
			logger.info(`Current counter value: ${counterValue.toString()}`);
			console.log(`Current counter value: ${counterValue.toString()}`);
		}
		await api.saveState(wallet, cacheFileName);
	} finally {
		if (providers !== undefined) {
			await closeIfPossible(providers.privateStateProvider, 'private state provider');
		}
		if (wallet !== undefined) {
			await closeIfPossible(wallet, 'wallet');
		}
	}
};

await main().catch((error) => {
	if (logger !== undefined) {
		if (error instanceof Error) {
			logger.error(`Increment failed: ${error.message}`);
			logger.debug(error.stack ?? '');
		} else {
			logger.error(`Increment failed: ${String(error)}`);
		}
	} else {
		console.error(error);
	}
	process.exitCode = 1;
});

