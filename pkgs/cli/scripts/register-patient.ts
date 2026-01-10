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
import { createLogger } from "../src/utils/logger-utils.js";

dotenv.config();

const {
  NETWORK_ENV_VAR,
  SEED_ENV_VAR,
  CONTRACT_ADDRESS,
  PATIENT_AGE,
  PATIENT_GENDER,
  PATIENT_CONDITION,
  CACHE_FILE_ENV_VAR,
} = process.env;

/**
 * 患者登録CLIスクリプト
 *
 * 環境変数:
 * - NETWORK_ENV_VAR: ネットワーク (standalone | testnet-local | testnet)
 * - SEED_ENV_VAR: ウォレットシード（必須）
 * - CONTRACT_ADDRESS: Patient Registryコントラクトアドレス（必須）
 * - PATIENT_AGE: 患者年齢 0-150（必須）
 * - PATIENT_GENDER: 患者性別 0=Male, 1=Female, 2=Other（必須）
 * - PATIENT_CONDITION: 患者症状（必須、ハッシュ化される）
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
 * 患者年齢のパース（0-150の範囲チェック）
 */
const parseAge = (value: string | undefined): bigint => {
  if (value === undefined || value.trim() === "") {
    throw new Error(
      "PATIENT_AGE is required. Please set the patient age (0-150).",
    );
  }
  const age = Number(value);
  if (!Number.isSafeInteger(age) || age < 0 || age > 150) {
    throw new Error(
      `PATIENT_AGE must be between 0 and 150. Received: ${value}`,
    );
  }
  return BigInt(age);
};

/**
 * 患者性別のパース（0, 1, 2のチェック）
 */
const parseGender = (value: string | undefined): bigint => {
  if (value === undefined || value.trim() === "") {
    throw new Error(
      "PATIENT_GENDER is required. Please set the patient gender (0=Male, 1=Female, 2=Other).",
    );
  }
  const gender = Number(value);
  if (![0, 1, 2].includes(gender)) {
    throw new Error(
      `PATIENT_GENDER must be 0 (Male), 1 (Female), or 2 (Other). Received: ${value}`,
    );
  }
  return BigInt(gender);
};

/**
 * 患者症状の検証（非空文字列チェック）
 */
const ensureCondition = (value: string | undefined): string => {
  if (value === undefined || value.trim() === "") {
    throw new Error(
      "PATIENT_CONDITION is required. Please set the patient condition.",
    );
  }
  return value.trim();
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
 * 性別コードを文字列に変換
 */
const genderToString = (gender: bigint): string => {
  switch (Number(gender)) {
    case 0:
      return "Male";
    case 1:
      return "Female";
    case 2:
      return "Other";
    default:
      return "Unknown";
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
  const age = parseAge(PATIENT_AGE);
  const gender = parseGender(PATIENT_GENDER);
  const condition = ensureCondition(PATIENT_CONDITION);
  const cacheFileName = CACHE_FILE_ENV_VAR ?? defaultCacheName(seed, network);

  // 2. 設定とロガーの初期化
  const config = buildConfig(network);
  logger = await createLogger(config.logDir);
  api.setLogger(logger);

  logger.info("=".repeat(60));
  logger.info("Patient Registration");
  logger.info("=".repeat(60));
  logger.info(`Network: ${network}`);
  logger.info(`Contract Address: ${contractAddress}`);
  logger.info(`Patient Age: ${age}`);
  logger.info(`Patient Gender: ${genderToString(gender)}`);
  logger.info(`Patient Condition: ${condition}`);
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

    // 6. 患者登録
    logger.info("Registering patient...");
    const txInfo = await api.registerPatient(contract, BigInt(age), BigInt(gender), BigInt(condition));

    // 7. 結果表示
    logger.info("=".repeat(60));
    logger.info("✅ Registration Successful!");
    logger.info("=".repeat(60));
    logger.info(`Transaction Hash: ${txInfo.txId}`);
    logger.info(`Block Height: ${txInfo.blockHeight}`);
    logger.info("=".repeat(60));

    console.log("\n✅ Patient registered successfully!");
    console.log(`Transaction Hash: ${txInfo.txId}`);
    console.log(`Block Height: ${txInfo.blockHeight}`);
    console.log(`\nPatient Details:`);
    console.log(`  Age: ${age}`);
    console.log(`  Gender: ${genderToString(gender)}`);
    console.log(`  Condition: ${condition} (hashed)`);

    // 8. 状態保存
    await api.saveState(wallet, cacheFileName);
  } catch (error) {
    // エラーハンドリング
    if (logger !== undefined) {
      if (error instanceof Error) {
        logger.error(`Registration failed: ${error.message}`);
        logger.debug(error.stack ?? "");
      } else {
        logger.error(`Registration failed: ${String(error)}`);
      }
    } else {
      console.error("❌ Registration failed:", error);
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
