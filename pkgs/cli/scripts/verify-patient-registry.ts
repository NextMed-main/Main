// This file is part of NextMed Patient Registry Deployment
// Copyright (C) 2025 NextMed Team
// SPDX-License-Identifier: Apache-2.0

import * as dotenv from 'dotenv';
import * as fsAsync from 'node:fs/promises';
import * as path from 'node:path';
import type { Logger } from 'pino';
import * as api from '../src/api.js';
import { type Config, StandaloneConfig, TestnetLocalConfig, TestnetRemoteConfig } from '../src/config.js';
import { createLogger } from '../src/utils/logger-utils.js';

dotenv.config();

const { NETWORK_ENV_VAR, SEED_ENV_VAR, CACHE_FILE_ENV_VAR } = process.env;

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
const loadDeploymentInfo = async (filename: string = 'deployment-patient-registry.json'): Promise<DeploymentInfo> => {
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
  let providers: Awaited<ReturnType<typeof api.configurePatientRegistryProviders>> | undefined;

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
    providers = await api.configurePatientRegistryProviders(wallet, config);

    // コントラクトに接続
    logger.info('Connecting to contract...');
    const contract = await api.joinPatientRegistryContract(providers, deploymentInfo.contractAddress);

    // ========================================
    // テスト1: 初期状態の確認
    // ========================================
    logger.info('');
    logger.info('='.repeat(60));
    logger.info('Test 1: Checking initial registration stats');
    logger.info('='.repeat(60));
    const initialStats = await api.getRegistrationStats(contract, providers);
    logger.info(
      `Initial stats - Total: ${initialStats[0]}, Male: ${initialStats[1]}, Female: ${initialStats[2]}, Other: ${initialStats[3]}`,
    );

    // ========================================
    // テスト2: 患者登録機能のテスト
    // ========================================
    logger.info('');
    logger.info('='.repeat(60));
    logger.info('Test 2: Testing patient registration');
    logger.info('='.repeat(60));
    
    // 男性患者を登録
    logger.info('Registering male patient (Age: 30, Gender: Male, Condition: Diabetes)...');
    await api.registerPatient(contract, BigInt(30n), BigInt(0n), BigInt('Diabetes'));
    logger.info('✅ Male patient registered successfully');

    // 更新後の状態を確認
    logger.info('Checking updated registration stats...');
    const afterMaleStats = await api.getRegistrationStats(contract, providers);
    logger.info(
      `After male registration - Total: ${afterMaleStats[0]}, Male: ${afterMaleStats[1]}, Female: ${afterMaleStats[2]}, Other: ${afterMaleStats[3]}`,
    );

    // 検証: 男性カウントが増加したか
    if (afterMaleStats[0] !== initialStats[0] + 1n) {
      throw new Error(`Total count verification failed. Expected: ${initialStats[0] + 1n}, Got: ${afterMaleStats[0]}`);
    }
    if (afterMaleStats[1] !== initialStats[1] + 1n) {
      throw new Error(`Male count verification failed. Expected: ${initialStats[1] + 1n}, Got: ${afterMaleStats[1]}`);
    }
    logger.info('✅ Male patient registration verified');

    // 女性患者を登録
    logger.info('');
    logger.info('Registering female patient (Age: 45, Gender: Female, Condition: Hypertension)...');
    await api.registerPatient(contract, BigInt(45n), BigInt(1n), BigInt('Hypertension'));
    logger.info('✅ Female patient registered successfully');

    // 更新後の状態を確認
    const afterFemaleStats = await api.getRegistrationStats(contract, providers);
    logger.info(
      `After female registration - Total: ${afterFemaleStats[0]}, Male: ${afterFemaleStats[1]}, Female: ${afterFemaleStats[2]}, Other: ${afterFemaleStats[3]}`,
    );

    // 検証: 女性カウントが増加したか
    if (afterFemaleStats[0] !== afterMaleStats[0] + 1n) {
      throw new Error(`Total count verification failed. Expected: ${afterMaleStats[0] + 1n}, Got: ${afterFemaleStats[0]}`);
    }
    if (afterFemaleStats[2] !== afterMaleStats[2] + 1n) {
      throw new Error(`Female count verification failed. Expected: ${afterMaleStats[2] + 1n}, Got: ${afterFemaleStats[2]}`);
    }
    logger.info('✅ Female patient registration verified');

    // ========================================
    // テスト3: 年齢範囲検証機能のテスト
    // ========================================
    logger.info('');
    logger.info('='.repeat(60));
    logger.info('Test 3: Testing age range verification');
    logger.info('='.repeat(60));

    // 年齢範囲内のテスト
    logger.info('Testing age 30 in range [18, 65]...');
    const ageInRange = await api.verifyAgeRange(contract, 30n, 18n, 65n);
    if (!ageInRange) {
      throw new Error('Age range verification failed: 30 should be in range [18, 65]');
    }
    logger.info('✅ Age in range verification passed');

    // 年齢範囲外のテスト（下限）
    logger.info('Testing age 15 in range [18, 65]...');
    const ageBelowRange = await api.verifyAgeRange(contract, 15n, 18n, 65n);
    if (ageBelowRange) {
      throw new Error('Age range verification failed: 15 should NOT be in range [18, 65]');
    }
    logger.info('✅ Age below range verification passed');

    // 年齢範囲外のテスト（上限）
    logger.info('Testing age 70 in range [18, 65]...');
    const ageAboveRange = await api.verifyAgeRange(contract, 70n, 18n, 65n);
    if (ageAboveRange) {
      throw new Error('Age range verification failed: 70 should NOT be in range [18, 65]');
    }
    logger.info('✅ Age above range verification passed');

    // 境界値テスト
    logger.info('Testing boundary values...');
    const ageAtLowerBound = await api.verifyAgeRange(contract, 18n, 18n, 65n);
    const ageAtUpperBound = await api.verifyAgeRange(contract, 65n, 18n, 65n);
    if (!ageAtLowerBound || !ageAtUpperBound) {
      throw new Error('Boundary value verification failed');
    }
    logger.info('✅ Boundary value verification passed');

    // ========================================
    // 最終結果の表示
    // ========================================
    logger.info('');
    logger.info('='.repeat(60));
    logger.info('✅ ALL VERIFICATION TESTS PASSED!');
    logger.info('='.repeat(60));
    logger.info('Summary:');
    logger.info(`  Initial total count: ${initialStats[0]}`);
    logger.info(`  Final total count: ${afterFemaleStats[0]}`);
    logger.info(`  Patients registered: ${afterFemaleStats[0] - initialStats[0]}`);
    logger.info(`  Male patients: ${afterFemaleStats[1]}`);
    logger.info(`  Female patients: ${afterFemaleStats[2]}`);
    logger.info(`  Other patients: ${afterFemaleStats[3]}`);
    logger.info('');
    logger.info('All contract functions are working correctly!');
    logger.info('='.repeat(60));

    console.log('\n✅ Contract verification successful!');
    console.log('All tests passed. Contract is working as expected.');

    // 状態を保存
    await api.saveState(wallet, cacheFileName);
  } catch (error) {
    if (logger !== undefined) {
      logger.error('❌ Verification failed');
      if (error instanceof Error) {
        logger.error(`Error: ${error.message}`);
        logger.debug(error.stack ?? '');
      } else {
        logger.error(`Error: ${String(error)}`);
      }
    } else {
      console.error('❌ Verification failed:', error);
    }
    process.exitCode = 1;
  } finally {
    // リソースのクリーンアップ
    if (providers !== undefined) {
      await closeIfPossible(providers.privateStateProvider, 'private state provider');
    }
    if (wallet !== undefined) {
      await closeIfPossible(wallet, 'wallet');
    }
  }
};;

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
