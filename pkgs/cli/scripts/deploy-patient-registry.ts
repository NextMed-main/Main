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
import * as Rx from 'rxjs';

dotenv.config();

const {
    NETWORK_ENV_VAR,
    SEED_ENV_VAR,
    CACHE_FILE_ENV_VAR,
} = process.env;

/**
 * Patient Registryコントラクトのデプロイスクリプト
 * 
 * 環境変数:
 * - NETWORK_ENV_VAR: デプロイ先ネットワーク (standalone | testnet-local | testnet)
 * - SEED_ENV_VAR: ウォレットシード（必須）
 * - CACHE_FILE_ENV_VAR: ウォレット状態のキャッシュファイル名（オプション）
 */

type SupportedNetwork = 'standalone' | 'testnet-local' | 'testnet' | 'testnet-remote';

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
		throw new Error(`Wallet seed is required. Set ${SEED_ENV_VAR}.`);
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
 * デプロイ情報をJSONファイルに保存
 */
const saveDeploymentInfo = async (
	deploymentInfo: DeploymentInfo,
	filename: string = 'deployment-patient-registry.json'
): Promise<void> => {
	const filePath = path.join(process.cwd(), filename);
	await fsAsync.writeFile(
		filePath,
		JSON.stringify(deploymentInfo, null, 2),
		'utf-8'
	);
	if (logger !== undefined) {
		logger.info(`Deployment info saved to: ${filePath}`);
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
	logger.info('Patient Registry Contract Deployment');
	logger.info('='.repeat(60));
	logger.info(`Network: ${network}`);
	logger.info(`Cache file: ${cacheFileName}`);
	logger.info('='.repeat(60));

	let wallet: Awaited<ReturnType<typeof api.buildWalletAndWaitForFunds>> | undefined;
	
	try {
		// ウォレットの作成と資金確認
		logger.info('Building wallet and waiting for funds...');
		wallet = await api.buildWalletAndWaitForFunds(config, seed, cacheFileName);
		
		// プロバイダーの設定
		logger.info('Configuring providers...');
		const providers = await api.configurePatientRegistryProviders(wallet, config);
		
		// Patient Registryコントラクトのデプロイ
		logger.info('Deploying Patient Registry contract...');
		const patientRegistryContract = await api.deployPatientRegistry(providers);
		const deployTx = patientRegistryContract.deployTxData.public;
		
		// デプロイ情報の作成
		const walletState = await Rx.firstValueFrom(wallet.state());
		const deploymentInfo: DeploymentInfo = {
			contractAddress: deployTx.contractAddress,
			transactionHash: deployTx.txId,
			deployedAt: new Date().toISOString(),
			network,
			deployer: walletState.address,
			initialState: {
				registrationCount: 0,
				maleCount: 0,
				femaleCount: 0,
				otherCount: 0,
			},
		};
		
		// デプロイ情報の保存
		await saveDeploymentInfo(deploymentInfo);
		
		// 成功メッセージ
		logger.info('='.repeat(60));
		logger.info('✅ Deployment Successful!');
		logger.info('='.repeat(60));
		logger.info(`Contract Address: ${deployTx.contractAddress}`);
		logger.info(`Transaction Hash: ${deployTx.txId}`);
		logger.info(`Deployer Address: ${walletState.address}`);
		logger.info('='.repeat(60));
		
		console.log('\n✅ Patient Registry contract deployed successfully!');
		console.log(`Contract Address: ${deployTx.contractAddress}`);
		console.log(`Transaction Hash: ${deployTx.txId}`);
		console.log(`\nDeployment info saved to: deployment-patient-registry.json`);
		
		await api.saveState(wallet, cacheFileName);
		await closeIfPossible(providers.privateStateProvider, 'private state provider');
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
			logger.error(`Deployment failed: ${error.message}`);
			logger.debug(error.stack ?? '');
		} else {
			logger.error(`Deployment failed: ${String(error)}`);
		}
	} else {
		console.error('❌ Deployment failed:', error);
	}
	process.exitCode = 1;
});
