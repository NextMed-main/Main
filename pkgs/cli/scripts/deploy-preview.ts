/**
 * Deploy Midnight DApp Contracts - Preview Network
 * 
 * Sequentially deploys:
 * 1. PatientRegistry
 * 2. ConsentRegistry (optional)
 * 3. IncentivePool (optional)
 * 4. MedicalUploadVerifier (optional)
 * 
 * Uses WalletBuilder pattern with SDK v3.0.0-alpha.14
 */

import "dotenv/config";
import * as fsAsync from "node:fs/promises";
import * as path from "node:path";
import * as Rx from "rxjs";
import { mnemonicToEntropy } from "bip39";
import { WebSocket } from "ws";
import { webcrypto } from "crypto";
import { createInterface } from "node:readline/promises";

// SDK v3.0.0-alpha imports
import { setNetworkId, getNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { nativeToken, Transaction, type ShieldedCoinInfo, type TransactionId, type UnprovenTransaction } from "@midnight-ntwrk/ledger-v6";

// Wallet imports (SDK v5.0.0)
import { type Resource, WalletBuilder } from "@midnight-ntwrk/wallet";
import { type Wallet } from "@midnight-ntwrk/wallet-api";
import { Transaction as ZswapTransaction, NetworkId as ZswapNetworkId } from "@midnight-ntwrk/zswap";

// Use TestNet ID for Preview network
const ZSWAP_NETWORK_ID = ZswapNetworkId.TestNet;

// Contract imports
import { deployContract } from "@midnight-ntwrk/midnight-js-contracts";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import {
  type BalancedProvingRecipe,
  NOTHING_TO_PROVE,
  type MidnightProvider,
  type WalletProvider,
  type Contract,
  type Witnesses,
} from "@midnight-ntwrk/midnight-js-types";

// Import all contracts
import {
  PatientRegistry,
  ConsentRegistry,
  IncentivePool,
  MedicalUploadVerifier,
  ViewingKeyManager,
  ZKDataMasking,
  witnesses as patientRegistryWitnesses,
  createPrivateState as createPatientPrivateState,
  viewingKeyManagerWitnesses,
  createViewingKeyPrivateState,
  zkDataMaskingWitnesses,
  createZKMaskingPrivateState,
} from "../../contract/dist/index.js";

// Fix WebSocket for Node.js environment
// @ts-expect-error: Node.js WebSocket fix
globalThis.WebSocket = WebSocket;

// Environment variables
const {
  SEED_ENV_VAR,
  PROOF_SERVER_URL,
} = process.env;

// Preview Network Configuration
const PREVIEW_CONFIG = {
  networkId: "preview" as const,
  indexer: "https://indexer.preview.midnight.network/api/v3/graphql",
  indexerWS: "wss://indexer.preview.midnight.network/api/v3/graphql/ws", // Added /ws suffix
  node: "https://rpc.preview.midnight.network",
  proofServer: PROOF_SERVER_URL || "https://lace-proof-pub.preview.midnight.network",
  faucet: "https://faucet.preview.midnight.network",
};

// Base path for ZK config
const currentDir = path.dirname(new URL(import.meta.url).pathname);
const CONTRACT_BASE_PATH = path.resolve(currentDir, "..", "..", "contract", "dist", "managed");

// Interfaces
interface DeploymentResult {
  contractName: string;
  contractAddress: string;
  txId: string;
  blockHeight: bigint;
  timestamp: string;
}

/**
 * Create wallet and midnight provider
 */
const createWalletAndMidnightProvider = async (wallet: Wallet): Promise<WalletProvider & MidnightProvider> => {
  const state = await Rx.firstValueFrom(wallet.state());
  return {
    getCoinPublicKey: () => Promise.resolve(state.coinPublicKey),
    getEncryptionPublicKey: () => Promise.resolve(state.encryptionPublicKey),
    balanceTx(tx: UnprovenTransaction, newCoins: any[]): Promise<BalancedProvingRecipe> {
      return wallet
        .balanceTransaction(
          ZswapTransaction.deserialize(tx.serialize(), ZSWAP_NETWORK_ID),
          newCoins,
        )
        .then((tx) => wallet.proveTransaction(tx))
        .then((zswapTx) => Transaction.deserialize('signature', 'proof', 'binding', zswapTx.serialize(ZSWAP_NETWORK_ID)))
        .then((finalizedTx) => ({
          type: NOTHING_TO_PROVE,
          transaction: finalizedTx,
        } as any));
    },
    submitTx(tx: Transaction<any, any, any>): Promise<TransactionId> {
      return wallet.submitTransaction(tx as any);
    },
  } as any;
};

/**
 * Wait for wallet to sync
 */
const waitForSync = async (wallet: Wallet) => {
  const sync$ = wallet.state().pipe(
    Rx.throttleTime(1000),
    Rx.tap((state) => {
      const synced = state.syncProgress?.synced;
      console.log(`   Sync progress: Synced=${synced}`);
    }),
    Rx.filter((state) => {
      // Consider synced if explicitly true
      return Boolean(state.syncProgress?.synced);
    }),
    Rx.take(1),
    Rx.timeout(300 * 1000) // 5 minutes
  );

  return Rx.lastValueFrom(sync$);
};

/**
 * Deploy a single contract
 */
async function deploySingleContract(
  name: string,
  contractInstance: Contract<any, Witnesses<any>>,
  initialPrivateState: any,
  privateStateStoreName: string,
  zkConfigPath: string,
  providers: any
): Promise<DeploymentResult> {
  console.log(`\n🚀 Deploying ${name} contract...`);
  console.log(`   ZK Config: ${zkConfigPath}`);
  console.log("   Generating proofs (this may take 1-5 minutes)...");

  // Create contract specific providers with required password provider for v3
  const specificProviders = {
    ...providers,
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: privateStateStoreName,
      privateStoragePasswordProvider: async () => process.env.STORAGE_PASSWORD || "password123",
    }),
    zkConfigProvider: new NodeZkConfigProvider(zkConfigPath),
  };

  const deployedContract = await deployContract(specificProviders, {
    contract: contractInstance,
    privateStateId: privateStateStoreName,
    initialPrivateState: initialPrivateState,
    args: [],
  } as any);

  console.log(`\n✅ ${name} DEPLOYED!`);
  console.log(`   Address: ${deployedContract.deployTxData.public.contractAddress}`);
  console.log(`   TxID:    ${deployedContract.deployTxData.public.txId}`);

  return {
    contractName: name,
    contractAddress: deployedContract.deployTxData.public.contractAddress,
    txId: deployedContract.deployTxData.public.txId,
    blockHeight: BigInt(deployedContract.deployTxData.public.blockHeight),
    timestamp: new Date().toISOString(),
  };
}

async function main(): Promise<void> {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("         Midnight DApp Contract Deployment Suite");
  console.log("              MIDNIGHT PREVIEW NETWORK");
  console.log("═══════════════════════════════════════════════════════════════\n");

  if (!SEED_ENV_VAR) {
    throw new Error("SEED_ENV_VAR is required in .env");
  }

  // Set network ID globally
  setNetworkId(PREVIEW_CONFIG.networkId);

  // Calculate hex seed from mnemonic (32 bytes)
  const seedHex = mnemonicToEntropy(SEED_ENV_VAR.trim());

  // Initialize Wallet
  console.log("📦 Initializing Wallet...");
  const wallet = await WalletBuilder.buildFromSeed(
    PREVIEW_CONFIG.indexer,
    PREVIEW_CONFIG.indexerWS,
    PREVIEW_CONFIG.proofServer,
    PREVIEW_CONFIG.node,
    seedHex,
    ZSWAP_NETWORK_ID,
    "info" as any 
  );
  wallet.start();

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    // Check initial state more deeply
    const initialState = await Rx.firstValueFrom(wallet.state());
    console.log(`📬 Wallet Address: ${initialState.address}`);
    console.log(`   Initial Sync Status: ${initialState.syncProgress ? 'Defined' : 'UNDEFINED'}`);

    // Sync Wallet
    console.log("\n⏳ Syncing wallet (may take time)...");
    try {
      await waitForSync(wallet);
      console.log("✅ Wallet Synced!");
    } catch (e) {
      console.warn("⚠️ Sync timed out, proceeding but deployment may fail if funds are unspent.");
    }

    // Check Balance
    const state = await Rx.firstValueFrom(wallet.state());
    const balance = state.balances[nativeToken() as unknown as string] ?? 0n;
    console.log(`💰 Balance: ${balance} tNIGHT`);

    if (balance === 0n) {
        console.error("❌ ZERO BALANCE. Please fund your wallet via the faucet.");
        console.log(`   Address: ${initialState.address}`);
        console.log(`   Faucet:  ${PREVIEW_CONFIG.faucet}`);
        process.exit(1);
    }

    // Setup Common Providers
    const walletAndMidnightProvider = await createWalletAndMidnightProvider(wallet);
    const commonProviders = {
      publicDataProvider: indexerPublicDataProvider(PREVIEW_CONFIG.indexer, PREVIEW_CONFIG.indexerWS),
      proofProvider: httpClientProofProvider(PREVIEW_CONFIG.proofServer),
      walletProvider: walletAndMidnightProvider,
      midnightProvider: walletAndMidnightProvider,
    };

    const results: DeploymentResult[] = [];
    const secretKey = new Uint8Array(32);
    webcrypto.getRandomValues(secretKey);

    // Deployment queue
    const queue = [
      { name: "PatientRegistry", folder: "patient-registry", contract: PatientRegistry as any, witnesses: patientRegistryWitnesses, state: createPatientPrivateState(secretKey) },
      { name: "ConsentRegistry", folder: "consent-registry", contract: ConsentRegistry as any, witnesses: patientRegistryWitnesses, state: createPatientPrivateState(secretKey) },
      { name: "IncentivePool", folder: "incentive-pool", contract: IncentivePool as any, witnesses: patientRegistryWitnesses, state: createPatientPrivateState(secretKey) },
      { name: "MedicalUploadVerifier", folder: "medical-upload-verifier", contract: MedicalUploadVerifier as any, witnesses: patientRegistryWitnesses, state: createPatientPrivateState(secretKey) },
      { name: "ViewingKeyManager", folder: "viewing-key-manager", contract: ViewingKeyManager as any, witnesses: viewingKeyManagerWitnesses, state: createViewingKeyPrivateState(secretKey) },
      { name: "ZKDataMasking", folder: "zk-data-masking", contract: ZKDataMasking as any, witnesses: zkDataMaskingWitnesses, state: createZKMaskingPrivateState(secretKey) },
    ];

    for (const item of queue) {
      const deploy = await rl.question(`\nDeploy ${item.name}? (y/n/skip): `);
      if (deploy.toLowerCase() === 'y') {
        try {
          const result = await deploySingleContract(
            item.name,
            new (item.contract.Contract as any)(item.witnesses),
            item.state,
            `${item.name.toLowerCase()}-store`,
            item.folder,
            commonProviders
          );
          results.push(result);
          
          // Wait for one block confirmation to avoid nonce issues if needed
          console.log("   Waiting for 5 seconds before next deployment...");
          await new Promise(r => setTimeout(r, 5000));
        } catch (err) {
          console.error(`❌ Failed to deploy ${item.name}:`, err);
          const cont = await rl.question("Continue with next contract? (y/n): ");
          if (cont.toLowerCase() !== 'y') break;
        }
      } else if (deploy.toLowerCase() === 'skip') {
        continue;
      }
    }

    // Save final results
    if (results.length > 0) {
      const deployFile = path.join(currentDir, "..", "deployment-summary.json");
      await fsAsync.writeFile(deployFile, JSON.stringify(results, null, 2));
      console.log(`\n📄 Deployment summary saved to ${deployFile}`);
    }

  } catch (error) {
    console.error("❌ Deployment Error:", error);
  } finally {
    wallet.close();
    rl.close();
  }
}

main();
