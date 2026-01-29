// This file is part of NextMed Patient Registry Deployment
// Copyright (C) 2026 NextMed Team
// SPDX-License-Identifier: Apache-2.0

import * as dotenv from "dotenv";
import * as fsAsync from "node:fs/promises";
import * as path from "node:path";
import type { Logger } from "pino";
import * as Rx from "rxjs";
import * as api from "../src/api.js";
import {
  type Config,
  StandaloneConfig,
  TestnetLocalConfig,
  TestnetRemoteConfig,
  PreviewNetConfig,
} from "../src/config.js";
import { createLogger } from "../src/utils/logger-utils.js";

dotenv.config();

const { NETWORK_ENV_VAR, SEED_ENV_VAR, CACHE_FILE_ENV_VAR } = process.env;

type SupportedNetwork =
  | "standalone"
  | "testnet-local"
  | "testnet"
  | "testnet-remote"
  | "preview";

const resolveNetwork = (value: string | undefined): SupportedNetwork => {
  const normalized = (value ?? "preview").toLowerCase();
  switch (normalized) {
    case "testnet":
    case "testnet-remote":
    case "standalone":
    case "testnet-local":
    case "preview":
      return normalized;
    default:
      throw new Error(
        `Unsupported network '${value}'. Supported: standalone, testnet-local, testnet, preview`,
      );
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
      return new TestnetRemoteConfig();
    case "preview":
    default:
      return new PreviewNetConfig();
  }
};

const ensureSeed = (seed: string | undefined): string => {
  if (seed === undefined || seed.trim() === "") {
    throw new Error(`Wallet seed is required. Set SEED_ENV_VAR.`);
  }
  return seed.trim();
};

const defaultCacheName = (seed: string, network: SupportedNetwork): string => {
  const prefix = seed.substring(0, 8);
  return `${prefix}-all-contracts-${network}.state`;
};

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
          logger.warn(`Failed to close ${label}`);
        }
      }
    }
  }
};

interface DeploymentRecord {
  name: string;
  contractAddress: string;
  transactionHash: string;
}

interface AllDeploymentsInfo {
  deployedAt: string;
  network: string;
  deployer: string;
  contracts: DeploymentRecord[];
}

let logger: Logger | undefined;

const main = async () => {
	const network = resolveNetwork(NETWORK_ENV_VAR);
	const seed = ensureSeed(SEED_ENV_VAR);
	const cacheFileName = CACHE_FILE_ENV_VAR ?? defaultCacheName(seed, network);
	
	const config = buildConfig(network);
	logger = await createLogger(config.logDir);
	api.setLogger(logger);

	logger.info('='.repeat(60));
	logger.info('NextMed Master Contract Deployment');
	logger.info('='.repeat(60));
	logger.info(`Network: ${network}`);
	logger.info('='.repeat(60));

	let wallet: any;
	
try {
		logger.info('Building wallet and waiting for funds...');
		wallet = await api.buildWalletAndWaitForFunds(config, seed, cacheFileName);
		const walletState = await Rx.firstValueFrom(wallet.state()) as { address: string };
		
		const deploymentRecords: DeploymentRecord[] = [];

		// 1. Patient Registry
		logger.info('\n--- [1/6] Deploying Patient Registry ---');
		const patientProviders = await api.configurePatientRegistryProviders(wallet, config);
		const patientContract = await api.deployPatientRegistry(patientProviders);
	
deploymentRecords.push({
			name: 'Patient Registry',
			contractAddress: patientContract.deployTxData.public.contractAddress,
			transactionHash: patientContract.deployTxData.public.txId
		});
		await closeIfPossible(patientProviders.privateStateProvider, 'patient private state');

		// 2. Consent Registry
		logger.info('\n--- [2/6] Deploying Consent Registry ---');
		const consentProviders = await api.configureConsentRegistryProviders(wallet, config);
		const consentContract = await api.deployConsentRegistry(consentProviders);
	
deploymentRecords.push({
			name: 'Consent Registry',
			contractAddress: consentContract.deployTxData.public.contractAddress,
			transactionHash: consentContract.deployTxData.public.txId
		});
		await closeIfPossible(consentProviders.privateStateProvider, 'consent private state');

		// 3. Incentive Pool
		logger.info('\n--- [3/6] Deploying Incentive Pool ---');
		const incentiveProviders = await api.configureIncentivePoolProviders(wallet, config);
		const incentiveContract = await api.deployIncentivePool(incentiveProviders);
	
deploymentRecords.push({
			name: 'Incentive Pool',
			contractAddress: incentiveContract.deployTxData.public.contractAddress,
			transactionHash: incentiveContract.deployTxData.public.txId
		});
		await closeIfPossible(incentiveProviders.privateStateProvider, 'incentive private state');

		// 4. Medical Upload Verifier
		logger.info('\n--- [4/6] Deploying Medical Upload Verifier ---');
		const medicalProviders = await api.configureMedicalUploadVerifierProviders(wallet, config);
		const medicalContract = await api.deployMedicalUploadVerifier(medicalProviders);
	
deploymentRecords.push({
			name: 'Medical Upload Verifier',
			contractAddress: medicalContract.deployTxData.public.contractAddress,
			transactionHash: medicalContract.deployTxData.public.txId
		});
		await closeIfPossible(medicalProviders.privateStateProvider, 'medical private state');

		// 5. ZK Data Masking
		logger.info('\n--- [5/6] Deploying ZK Data Masking ---');
		const maskingProviders = await api.configureZKDataMaskingProviders(wallet, config);
		const maskingContract = await api.deployZKDataMasking(maskingProviders);
	
deploymentRecords.push({
			name: 'ZK Data Masking',
			contractAddress: maskingContract.deployTxData.public.contractAddress,
			transactionHash: maskingContract.deployTxData.public.txId
		});
		await closeIfPossible(maskingProviders.privateStateProvider, 'masking private state');

		// 6. Viewing Key Manager
		logger.info('\n--- [6/6] Deploying Viewing Key Manager ---');
		const viewingProviders = await api.configureViewingKeyManagerProviders(wallet, config);
		const viewingContract = await api.deployViewingKeyManager(viewingProviders);
	
deploymentRecords.push({
			name: 'Viewing Key Manager',
			contractAddress: viewingContract.deployTxData.public.contractAddress,
			transactionHash: viewingContract.deployTxData.public.txId
		});
		await closeIfPossible(viewingProviders.privateStateProvider, 'viewing private state');

		// Final Result
		const allDeployments: AllDeploymentsInfo = {
			deployedAt: new Date().toISOString(),
			network,
			deployer: walletState.address,
			contracts: deploymentRecords
		};

		await fsAsync.writeFile(
			path.join(process.cwd(), 'all-deployments.json'),
			JSON.stringify(allDeployments, null, 2),
			'utf-8'
		);

		logger.info('='.repeat(60));
		logger.info('✅ All Contracts Deployed Successfully!');
		logger.info('='.repeat(60));
		deploymentRecords.forEach(r => {
			logger?.info(`${r.name.padEnd(25)}: ${r.contractAddress}`);
		});
		logger.info('='.repeat(60));
		
		console.log('\n✅ All contracts deployed successfully!');
		console.log(`Deployment info saved to: all-deployments.json`);
		
		await api.saveState(wallet, cacheFileName);
	} finally {
		if (wallet !== undefined) {
			await closeIfPossible(wallet, 'wallet');
		}
	}
};

await main().catch((error) => {
  if (logger !== undefined) {
    logger.error(`Deployment failed: ${error.message}`);
  } else {
    console.error("❌ Deployment failed:", error);
  }
  process.exitCode = 1;
});
