// This file is part of NextMed Patient Registry Deployment
// Copyright (C) 2025 NextMed Team
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
import * as fsAsync from 'node:fs/promises';
import * as path from 'node:path';

dotenv.config();

const {
    NETWORK_ENV_VAR,
    SEED_ENV_VAR,
    CACHE_FILE_ENV_VAR,
} = process.env;

/**
 * Patient Registryコントラクトの検証スクリプト
 * 
 * デプロイされたコントラクトの動作を確認します。
 */

type SupportedNetwork = 'standalone' | 'testnet-local' | 'testnet' | 'testnet-remote';

/**
 * デプロイ情報の型定義
 */
interface DeploymentInfo {
	contractAddress: string;
	transactionHash: string;
	deployedAt: string;
	network: string;
	deployer: string;
	initialState: {
		registrationCount: number;
		maleCount: number;
		femaleCount: number;
		otherCount: number;
	};
}

/**
 * 環境変数からネットワークを解決
 */
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
			throw new Error(`Unsupported network '${value}'. Supported: standalone, testnet-local, testnet`);
	}
};

/**
 * ネットワークに応じた設定を構築
 */
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

/**
 * ウォレットシードの検証
 */
const ensureSeed = (seed: string | undefined): string => {
	if (seed === undefined || seed.trim() === '') {
		throw new Error('Wallet seed is required. Set SEED_ENV_VAR environment variable.');
	}
	return seed.trim();
};

/**
 * デフォルトのキャッシュファイル名を生成
 */
const defaultCacheName = (seed: string, network: SupportedNetwork): string => {
	const prefix = seed.substring(0, 8);
	return `${prefix}-patient-registry-${network}.state`;
};

/**
 * デプロイ情報をJSONファイルから読み込み
 */
const loadDeploymentInfo = async (
	filename: string = 'deployment-patient-registry.json'
): Promise<DeploymentInfo> => {
	const filePath = path.join(process.cwd(), filename);
	try {
		const content = await fsAsync.readFile(filePath, 'utf-8');
		return JSON.parse(content) as DeploymentInfo;
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
			throw new Error(`Deployment info file not found: ${filePath}. Please run deploy script first.`);
		}
		throw error;
	}
};

/**
 * リソースのクローズ（best-effort）
 */
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
 * メイン処理
 */
const main = async () => {
	// 環境変数から設定を読み込み
	const network = resolveNetwork(NETWORK_ENV_VAR);
	const seed = ensureSeed(SEED_ENV_VAR);
	const cacheFileName = CACHE_FILE_ENV_VAR ?? defaultCacheName(seed, network);
	
	// 設定とロガーの初期化
	const config = buildConfig(network);
	logger = await createLogger(config.logDir);
	api.setLogger(logger);

	logger.info('='.repeat(60));
	logger.info('Patient Registry Contract Verification');
	logger.info('='.repeat(60));
	logger.info(`Network: ${network}`);
	logger.info(`Cache file: ${cacheFileName}`);
	logger.info('='.repeat(60));

	let wallet: Awaited<ReturnType<typeof api.buildWalletAndWaitForFunds>> | undefined;
	
	try {
		// デプロイ情報の読み込み
		logger.info('Loading deployment info...');
		const deploymentInfo = await loadDeploymentInfo();
		logger.info(`Contract Address: ${deploymentInfo.contractAddress}`);
		logger.info(`Deployed At: ${deploymentInfo.deployedAt}`);
		logger.info(`Deployer: ${deploymentInfo.deployer}`);
		
		// ネットワークの一致確認
		if (deploymentInfo.network !== network) {
			logger.warn(`Warning: Deployment network (${deploymentInfo.network}) differs from current network (${network})`);
		}
		
		// ウォレットの作成
		logger.info('Building wallet...');
		wallet = await api.buildWalletAndWaitForFunds(config, seed, cacheFileName);
		
		// プロバイダーの設定
		logger.info('Configuring providers...');
		const providers = await api.configureProviders(wallet, config);
		
		// コントラクトに接続
		logger.info('Connecting to contract...');
		const contract = await api.joinContract(providers, deploymentInfo.contractAddress);
		
		// 初期状態の確認
		logger.info('Checking initial state...');
		const initialState = await api.getCounterLedgerState(providers, deploymentInfo.contractAddress);
		logger.info(`Initial counter value: ${initialState}`);
		
		// TODO: Patient Registry固有の検証
		// 現在はCounterコントラクトの検証を実行
		logger.warn('Note: Using Counter contract verification as placeholder. Patient Registry verification will be implemented.');
		
		// テスト: incrementを実行
		logger.info('Testing increment operation...');
		await api.increment(contract);
		
		// 更新後の状態を確認
		logger.info('Checking updated state...');
		const updatedState = await api.getCounterLedgerState(providers, deploymentInfo.contractAddress);
		logger.info(`Updated counter value: ${updatedState}`);
		
		// 検証結果の確認
		if (initialState !== null && updatedState !== null && updatedState === initialState + 1n) {
			logger.info('='.repeat(60));
			logger.info('✅ Verification Successful!');
			logger.info('='.repeat(60));
			logger.info(`Initial value: ${initialState}`);
			logger.info(`Updated value: ${updatedState}`);
			logger.info(`Increment worked correctly!`);
			logger.info('='.repeat(60));
			
			console.log('\n✅ Contract verification successful!');
			console.log(`Contract is working as expected.`);
		} else {
			throw new Error(`Verification failed. Initial: ${initialState}, Updated: ${updatedState}`);
		}
		
		// プロバイダーのクローズ
		await closeIfPossible(providers.privateStateProvider, 'private state provider');
	} catch (error) {
		logger?.error('Verification failed');
		throw error;
	} finally {
		if (wallet !== undefined) {
			await closeIfPossible(wallet, 'wallet');
		}
	}
};

/**
 * エントリーポイント
 */
await main().catch((error) => {
	if (logger !== undefined) {
		if (error instanceof Error) {
			logger.error(`Verification failed: ${error.message}`);
			logger.debug(error.stack ?? '');
		} else {
			logger.error(`Verification failed: ${String(error)}`);
		}
	} else {
		console.error('❌ Verification failed:', error);
	}
	process.exitCode = 1;
});
