// This file is part of NextMed Patient Registry CLI
// Copyright (C) 2025 NextMed Team
// SPDX-License-Identifier: Apache-2.0

import type { Resource } from '@midnight-ntwrk/wallet';
import type { Wallet } from '@midnight-ntwrk/wallet-api';
import { stdin as input, stdout as output } from 'node:process';
import { createInterface, type Interface } from 'node:readline/promises';
import type { Logger } from 'pino';
import type { DockerComposeEnvironment, StartedDockerComposeEnvironment } from 'testcontainers';
import * as api from './api';
import { type Config, StandaloneConfig } from './config';
import type { DeployedPatientRegistryContract, PatientRegistryProviders } from './utils/common-types';

let logger: Logger;

/**
 * ジェネシスブロックでミントされたトークンにアクセスするためのシード
 * スタンドアロンネットワークでのみ使用され、初期資金を持つウォレットを構築します
 */
const GENESIS_MINT_WALLET_SEED = '0000000000000000000000000000000000000000000000000000000000000001';

const DEPLOY_OR_JOIN_QUESTION = `
以下のいずれかを選択してください:
  1. 新しいPatient Registryコントラクトをデプロイ
  2. 既存のPatient Registryコントラクトに接続
  3. 終了
選択してください: `;

const MAIN_LOOP_QUESTION = `
以下のいずれかを選択してください:
  1. 患者データを登録
  2. 登録統計を表示
  3. 年齢範囲を検証
  4. 終了
選択してください: `;

/**
 * 既存のPatient Registryコントラクトに接続
 *
 * @param providers - Patient Registryプロバイダー
 * @param rli - Readlineインターフェース
 * @returns デプロイ済みコントラクトインスタンス
 */
const join = async (providers: PatientRegistryProviders, rli: Interface): Promise<DeployedPatientRegistryContract> => {
  const contractAddress = await rli.question('コントラクトアドレス（16進数）を入力してください: ');
  return await api.joinPatientRegistryContract(providers, contractAddress);
};

/**
 * 新規デプロイまたは既存コントラクトへの接続を選択
 *
 * @param providers - Patient Registryプロバイダー
 * @param rli - Readlineインターフェース
 * @returns デプロイ済みコントラクトインスタンス、または終了時はnull
 */
const deployOrJoin = async (
  providers: PatientRegistryProviders,
  rli: Interface,
): Promise<DeployedPatientRegistryContract | null> => {
  while (true) {
    const choice = await rli.question(DEPLOY_OR_JOIN_QUESTION);
    switch (choice) {
      case '1':
        return await api.deployPatientRegistry(providers);
      case '2':
        return await join(providers, rli);
      case '3':
        logger.info('終了します...');
        return null;
      default:
        logger.error(`無効な選択: ${choice}`);
    }
  }
};

/**
 * メインループ - 患者データの登録と統計表示
 *
 * @param providers - Patient Registryプロバイダー
 * @param rli - Readlineインターフェース
 */
const mainLoop = async (providers: PatientRegistryProviders, rli: Interface): Promise<void> => {
  const contract = await deployOrJoin(providers, rli);
  if (contract === null) {
    return;
  }

  while (true) {
    const choice = await rli.question(MAIN_LOOP_QUESTION);
    switch (choice) {
      case '1': {
        // 患者データを登録
        const ageStr = await rli.question('年齢を入力してください: ');
        const age = BigInt(ageStr);

        const genderStr = await rli.question('性別を入力してください (0: 男性, 1: 女性, 2: その他): ');
        const gender = BigInt(genderStr);

        const condition = await rli.question('症状を入力してください: ');

        await api.registerPatient(contract, BigInt(age), BigInt(gender), BigInt(condition));
        logger.info('患者データを登録しました');
        break;
      }
      case '2': {
        // 登録統計を表示
        const stats = await api.getRegistrationStats(contract, providers);
        logger.info('=== 登録統計 ===');
        logger.info(`総登録数: ${stats[0]}`);
        logger.info(`男性: ${stats[1]}`);
        logger.info(`女性: ${stats[2]}`);
        logger.info(`その他: ${stats[3]}`);
        break;
      }
      case '3': {
        // 年齢範囲を検証
        const ageStr = await rli.question('検証する年齢を入力してください: ');
        const age = BigInt(ageStr);

        const minAgeStr = await rli.question('最小年齢を入力してください: ');
        const minAge = BigInt(minAgeStr);

        const maxAgeStr = await rli.question('最大年齢を入力してください: ');
        const maxAge = BigInt(maxAgeStr);

        const isInRange = await api.verifyAgeRange(contract, age, minAge, maxAge);
        logger.info(`年齢 ${age} は範囲 [${minAge}, ${maxAge}] 内: ${isInRange ? 'はい' : 'いいえ'}`);
        break;
      }
      case '4':
        logger.info('終了します...');
        return;
      default:
        logger.error(`無効な選択: ${choice}`);
    }
  }
};

/**
 * シードからウォレットを構築
 *
 * @param config - Midnight設定
 * @param rli - Readlineインターフェース
 * @returns ウォレットインスタンス
 */
const buildWalletFromSeed = async (config: Config, rli: Interface): Promise<Wallet & Resource> => {
  const seed = await rli.question('ウォレットシードを入力してください: ');
  return await api.buildWalletAndWaitForFunds(config, seed, '');
};

const WALLET_LOOP_QUESTION = `
以下のいずれかを選択してください:
  1. 新しいウォレットを作成
  2. シードからウォレットを復元
  3. 終了
選択してください: `;

/**
 * ウォレットを構築
 *
 * @param config - Midnight設定
 * @param rli - Readlineインターフェース
 * @returns ウォレットインスタンス、または終了時はnull
 */
const buildWallet = async (config: Config, rli: Interface): Promise<(Wallet & Resource) | null> => {
  if (config instanceof StandaloneConfig) {
    // スタンドアロンネットワークの場合、ジェネシスマイントウォレットから資金を取得
    return await api.buildWalletAndWaitForFunds(config, GENESIS_MINT_WALLET_SEED, '');
  }
  while (true) {
    const choice = await rli.question(WALLET_LOOP_QUESTION);
    switch (choice) {
      case '1':
        return await api.buildFreshWallet(config);
      case '2':
        return await buildWalletFromSeed(config, rli);
      case '3':
        logger.info('終了します...');
        return null;
      default:
        logger.error(`無効な選択: ${choice}`);
    }
  }
};

/**
 * Dockerコンテナのポートをマッピング
 *
 * @param env - Docker Compose環境
 * @param url - 元のURL
 * @param containerName - コンテナ名
 * @returns マッピングされたURL
 */
const mapContainerPort = (env: StartedDockerComposeEnvironment, url: string, containerName: string): string => {
  const mappedUrl = new URL(url);
  const container = env.getContainer(containerName);

  mappedUrl.port = String(container.getFirstMappedPort());

  return mappedUrl.toString().replace(/\/+$/, '');
};

/**
 * Patient Registry CLIのメインエントリーポイント
 *
 * @param config - Midnight設定
 * @param _logger - Pinoロガー
 * @param dockerEnv - Docker Compose環境（オプション）
 */
export const run = async (config: Config, _logger: Logger, dockerEnv?: DockerComposeEnvironment): Promise<void> => {
  logger = _logger;
  api.setLogger(_logger);
  const rli = createInterface({ input, output, terminal: true });
  let env: StartedDockerComposeEnvironment | undefined;

  if (dockerEnv !== undefined) {
    env = await dockerEnv.up();

    if (config instanceof StandaloneConfig) {
      config.indexer = mapContainerPort(env, config.indexer, 'patient-registry-indexer');
      config.indexerWS = mapContainerPort(env, config.indexerWS, 'patient-registry-indexer');
      config.node = mapContainerPort(env, config.node, 'patient-registry-node');
      config.proofServer = mapContainerPort(env, config.proofServer, 'patient-registry-proof-server');
    }
  }

  // ウォレットを構築
  const wallet = await buildWallet(config, rli);
  try {
    if (wallet !== null) {
      // Patient Registry用のプロバイダーを生成
      const providers = await api.configurePatientRegistryProviders(wallet, config);
      await mainLoop(providers, rli);
    }
  } catch (e) {
    if (e instanceof Error) {
      logger.error(`エラーが発生しました: '${e.message}'`);
      logger.info('終了します...');
      logger.debug(`${e.stack}`);
    } else {
      throw e;
    }
  } finally {
    try {
      rli.close();
      rli.removeAllListeners();
    } catch (e) {
      logger.error(`Readlineインターフェースのクローズエラー: ${e}`);
    } finally {
      try {
        if (wallet !== null) {
          await wallet.close();
        }
      } catch (e) {
        logger.error(`ウォレットのクローズエラー: ${e}`);
      } finally {
        try {
          if (env !== undefined) {
            await env.down();
            logger.info('さようなら');
          }
        } catch (e) {
          logger.error(`Docker環境のシャットダウンエラー: ${e}`);
        }
      }
    }
  }
};
