// This file is part of NextMed Patient Registry
// Copyright (C) 2025 NextMed Team
// SPDX-License-Identifier: Apache-2.0

import * as dotenv from "dotenv";
import type { Logger } from "pino";
import * as api from "../src/api.js";
import {
    type Config,
    StandaloneConfig,
    TestnetLocalConfig,
    TestnetRemoteConfig,
} from "../src/config.js";
import type { RegistrationStats } from "../src/utils/common-types.js";
import { createLogger } from "../src/utils/logger-utils.js";

dotenv.config();

const { NETWORK_ENV_VAR, SEED_ENV_VAR, CONTRACT_ADDRESS, CACHE_FILE_ENV_VAR } =
  process.env;

/**
 * 統計情報取得CLIスクリプト
 *
 * 環境変数:
 * - NETWORK_ENV_VAR: ネットワーク (standalone | testnet-local | testnet)
 * - SEED_ENV_VAR: ウォレットシード（必須）
 * - CONTRACT_ADDRESS: Patient Registryコントラクトアドレス（必須）
 * - CACHE_FILE_ENV_VAR: ウォレット状態のキャッシュファイル名（オプション）
 */

type SupportedNetwork =
  | "standalone"
  | "testnet-local"
  | "testnet"
  | "testnet-remote";

/**
 * 環境変数からネットワークを解決
 */
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
      throw new Error(
        `Unsupported network '${value}'. Supported: standalone, testnet-local, testnet`,
      );
  }
};

/**
 * ネットワークに応じた設定を構築
 */
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

/**
 * ウォレットシードの検証
 */
const ensureSeed = (seed: string | undefined): string => {
  if (seed === undefined || seed.trim() === "") {
    throw new Error("SEED_ENV_VAR is required. Please set the wallet seed.");
  }
  return seed.trim();
};

/**
 * コントラクトアドレスの検証
 */
const ensureContractAddress = (address: string | undefined): string => {
  if (address === undefined || address.trim() === "") {
    throw new Error(
      "CONTRACT_ADDRESS is required. Please set the deployed contract address.",
    );
  }
  return address.trim();
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

/**
 * 統計情報を見やすくフォーマットして表示
 */
const displayStats = (stats: RegistrationStats): void => {
  console.log("\n" + "=".repeat(50));
  console.log("   Patient Registry Statistics");
  console.log("=".repeat(50));
  console.log(`Total Registrations: ${stats[0]}`);
  console.log("-".repeat(50));
  console.log("Gender Distribution:");
  console.log(`  Male:   ${stats[1]}`);
  console.log(`  Female: ${stats[2]}`);
  console.log(`  Other:  ${stats[3]}`);
  console.log("=".repeat(50) + "\n");

  if (logger !== undefined) {
    logger.info(
      {
        totalCount: stats[0].toString(),
        maleCount: stats[1].toString(),
        femaleCount: stats[2].toString(),
        otherCount: stats[3].toString(),
      },
      "Statistics retrieved successfully",
    );
  }
};

let logger: Logger | undefined;

/**
 * メイン処理
 */
const main = async () => {
  // 1. 環境変数の検証
  const network = resolveNetwork(NETWORK_ENV_VAR);
  const seed = ensureSeed(SEED_ENV_VAR);
  const contractAddress = ensureContractAddress(CONTRACT_ADDRESS);
  const cacheFileName = CACHE_FILE_ENV_VAR ?? defaultCacheName(seed, network);

  // 2. 設定とロガーの初期化
  const config = buildConfig(network);
  logger = await createLogger(config.logDir);
  api.setLogger(logger);

  logger.info("=".repeat(60));
  logger.info("Patient Registry Statistics Retrieval");
  logger.info("=".repeat(60));
  logger.info(`Network: ${network}`);
  logger.info(`Contract Address: ${contractAddress}`);
  logger.info(`Cache file: ${cacheFileName}`);
  logger.info("=".repeat(60));

  let wallet:
    | Awaited<ReturnType<typeof api.buildWalletAndWaitForFunds>>
    | undefined;
  let providers:
    | Awaited<ReturnType<typeof api.configurePatientRegistryProviders>>
    | undefined;

  try {
    // 3. ウォレット作成
    logger.info("Building wallet and waiting for funds...");
    wallet = await api.buildWalletAndWaitForFunds(config, seed, cacheFileName);

    // 4. プロバイダー設定
    logger.info("Configuring providers...");
    providers = await api.configurePatientRegistryProviders(wallet, config);

    // 5. コントラクトに接続
    logger.info("Connecting to Patient Registry contract...");
    const contract = await api.joinPatientRegistryContract(
      providers,
      contractAddress,
    );

    // 6. 統計情報取得
    logger.info("Fetching registration statistics...");
    const stats = await api.getRegistrationStats(contract, providers);

    // 7. 結果表示
    displayStats(stats);

    // 8. 状態保存
    await api.saveState(wallet, cacheFileName);
  } catch (error) {
    // エラーハンドリング
    if (logger !== undefined) {
      if (error instanceof Error) {
        logger.error(`Failed to retrieve statistics: ${error.message}`);
        logger.debug(error.stack ?? "");
      } else {
        logger.error(`Failed to retrieve statistics: ${String(error)}`);
      }
    } else {
      console.error("❌ Failed to retrieve statistics:", error);
    }
    process.exitCode = 1;
  } finally {
    // リソースクリーンアップ
    if (providers !== undefined) {
      await closeIfPossible(
        providers.privateStateProvider,
        "private state provider",
      );
    }
    if (wallet !== undefined) {
      await closeIfPossible(wallet, "wallet");
    }
  }
};

/**
 * エントリーポイント
 */
await main();
