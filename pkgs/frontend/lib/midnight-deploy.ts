/**
 * Browser-based Midnight contract deployment utilities
 * Uses the Lace Wallet DApp Connector API v4.0.0
 * 
 * Based on official Midnight bboard-ui example:
 * https://github.com/midnightntwrk/example-bboard/blob/main/bboard-ui/src/contexts/BrowserDeployedBoardManager.ts
 */

import { setNetworkId, getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { createBalancedTx } from '@midnight-ntwrk/midnight-js-types';
import type { 
  BalancedTransaction, 
  UnbalancedTransaction,
} from '@midnight-ntwrk/midnight-js-types';
import type { CoinInfo } from '@midnight-ntwrk/ledger';

// Contract names
export const ContractType = {
  PATIENT_REGISTRY: 'patient-registry',
  CONSENT_REGISTRY: 'consent-registry',
} as const;

export type ContractTypeName = (typeof ContractType)[keyof typeof ContractType];

interface DeploymentResult {
  success: boolean;
  contractAddress?: string;
  txHash?: string;
  error?: string;
}

// Lace Wallet API v4.0.0 interface (based on browser inspection)
export interface WalletAPIv4 {
  getUnshieldedAddress(): Promise<{ unshieldedAddress: string }>;
  getShieldedAddresses(): Promise<{
    shieldedAddress: string;
    shieldedCoinPublicKey: string;
    shieldedEncryptionPublicKey: string;
  }>;
  getDustBalance(): Promise<{ balance: string; cap: string }>;
  getConfiguration(): Promise<{
    networkId: string;
    indexerUri: string;
    indexerWsUri: string;
    proverServerUri: string;
    substrateNodeUri: string;
  }>;
  submitTransaction(tx: unknown): Promise<string>;
  balanceUnsealedTransaction(tx: unknown): Promise<unknown>;
  balanceSealedTransaction(tx: unknown): Promise<unknown>;
  makeTransfer(params: unknown): Promise<unknown>;
}

// Type for circuit keys
type PatientRegistryCircuitKeys = 'registerPatient' | 'getRegistrationStats';

/**
 * Create deployment providers from the Lace wallet API v4.0.0
 */
export async function createProvidersFromWallet(
  walletApi: WalletAPIv4,
  zkConfigUrl: string = window.location.origin
) {
  const config = await walletApi.getConfiguration();
  const shieldedInfo = await walletApi.getShieldedAddresses();

  // Set the network ID globally
  setNetworkId(config.networkId);

  console.log(`[Deploy] Network ID set to: ${config.networkId}`);
  console.log(`[Deploy] Indexer: ${config.indexerUri}`);
  console.log(`[Deploy] Prover: ${config.proverServerUri}`);

  // Create providers
  const publicDataProvider = indexerPublicDataProvider(
    config.indexerUri,
    config.indexerWsUri
  );

  const proofProvider = httpClientProofProvider(config.proverServerUri);

  // Use FetchZkConfigProvider for browser environment
  const zkConfigProvider = new FetchZkConfigProvider<PatientRegistryCircuitKeys>(
    zkConfigUrl,
    fetch.bind(window)
  );

  // Create wallet provider wrapper for the DApp connector
  // This adapts the v4.0.0 API to what midnight-js-contracts expects
  const walletProvider = {
    coinPublicKey: shieldedInfo.shieldedCoinPublicKey,
    encryptionPublicKey: shieldedInfo.shieldedEncryptionPublicKey,
    
    async balanceTx(
      tx: UnbalancedTransaction,
      newCoins: CoinInfo[]
    ): Promise<BalancedTransaction> {
      // Use the wallet's balanceUnsealedTransaction
      const balancedTx = await walletApi.balanceUnsealedTransaction(tx);
      return createBalancedTx(balancedTx as never);
    },
  };

  // Create Midnight provider wrapper
  const midnightProvider = {
    async submitTx(tx: BalancedTransaction): Promise<string> {
      return walletApi.submitTransaction(tx);
    },
  };

  return {
    publicDataProvider,
    proofProvider,
    zkConfigProvider,
    walletProvider,
    midnightProvider,
  };
}

/**
 * Deploy a contract using the Lace wallet
 * 
 * IMPORTANT: This requires:
 * 1. The contract ZK config files to be served from the frontend
 * 2. The contract's compiled JavaScript to be bundled
 */
export async function deployContractFromBrowser(
  walletApi: WalletAPIv4,
  contractType: ContractTypeName,
  onProgress?: (message: string) => void
): Promise<DeploymentResult> {
  const log = (msg: string) => {
    console.log(`[Deploy] ${msg}`);
    onProgress?.(msg);
  };

  try {
    log('Step 1: Creating providers from wallet configuration...');
    const config = await walletApi.getConfiguration();
    log(`Using network: ${config.networkId}`);
    log(`Prover server: ${config.proverServerUri}`);

    const providers = await createProvidersFromWallet(walletApi);
    log('Providers created successfully');

    log(`Step 2: Loading ${contractType} contract module...`);

    // Dynamic import of the contract
    // The contract package must be properly bundled with the frontend
    let contractModule: { Contract: new (witnesses: object) => unknown };
    
    try {
      // Try importing from the contract package
      if (contractType === 'patient-registry') {
        // This requires the contract to be bundled with the frontend
        // The typical setup is to have it in node_modules or linked
        contractModule = await import('contract/dist/managed/patient-registry/contract');
      } else if (contractType === 'consent-registry') {
        contractModule = await import('contract/dist/managed/consent-registry/contract');
      } else {
        throw new Error(`Unknown contract type: ${contractType}`);
      }
    } catch (importErr) {
      log(`ERROR: Could not import contract module.`);
      log(`The contract package must be bundled with the frontend.`);
      log(`Try running: pnpm --filter contract build first.`);
      throw new Error(
        `Contract module not found: ${contractType}. ` +
          `Ensure the contract package is built and linked. ` +
          `Error: ${importErr}`
      );
    }

    log('Contract module loaded');

    log('Step 3: Creating contract instance...');
    // Create the contract instance with empty witnesses for deployment
    const contractInstance = new contractModule.Contract({});
    log('Contract instance created');

    log('Step 4: Generating initial private state...');
    const secretKey = new Uint8Array(32);
    crypto.getRandomValues(secretKey);
    log('Secret key generated (32 bytes)');

    log('Step 5: Deploying contract to network...');
    log('This may take a few minutes for ZK proof generation...');

    const deployedContract = await deployContract(providers, {
      contract: contractInstance,
      privateStateId: `${contractType}PrivateState`,
      initialPrivateState: { secretKey },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deployData = deployedContract.deployTxData?.public as any;
    const contractAddress = deployData?.contractAddress;
    const txHash = deployData?.txHash;

    log('');
    log('='.repeat(50));
    log('DEPLOYMENT SUCCESSFUL!');
    log('='.repeat(50));
    log(`Contract Address: ${contractAddress}`);
    if (txHash) {
      log(`Transaction Hash: ${txHash}`);
    }
    log('');

    return {
      success: true,
      contractAddress,
      txHash,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`ERROR: ${message}`);
    console.error('[Deploy] Full error:', error);
    return {
      success: false,
      error: message,
    };
  }
}
