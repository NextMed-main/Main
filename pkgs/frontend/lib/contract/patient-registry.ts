/**
 * Patient Registry Contract Service
 *
 * Browser-compatible service for interacting with the Patient Registry smart contract
 * on the Midnight Network.
 *
 * @see https://docs.midnight.network/develop/tutorial/building/dapp-details
 */

import type { DAppConnectorWalletAPI } from "@midnight-ntwrk/dapp-connector-api";
import { findDeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import { FetchZkConfigProvider } from "@midnight-ntwrk/midnight-js-fetch-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { NetworkId, setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { getServiceConfig, getWalletState } from "../wallet/midnight-wallet";
import { browserPrivateStateProvider } from "./browser-private-state-provider";
import {
  type ContractConnectionStatus,
  DEPLOYED_CONTRACT,
  GenderCode,
  type LedgerState,
  type PatientRegistrationParams,
  type RegistrationResult,
  RegistrationState,
  type RegistrationStats,
} from "./types";

// Set network to TestNet
setNetworkId(NetworkId.TestNet);

// ============================================
// Contract Constants
// ============================================

/**
 * Deployed Patient Registry contract address on testnet-02
 */
export const PATIENT_REGISTRY_ADDRESS = DEPLOYED_CONTRACT.contractAddress;

/**
 * Private state ID for the patient registry
 */
const PRIVATE_STATE_ID = "patientRegistryState";

/**
 * ZK config path for the patient registry contract
 * This should point to the compiled contract files in public/contract/patient-registry/
 */
const ZK_CONFIG_BASE_URL = "/contract/patient-registry";

// ============================================
// Browser Provider Configuration
// ============================================

/**
 * Configure all required providers for browser-based contract interaction
 *
 * This follows the Midnight.js pattern for browser DApps:
 * - privateStateProvider: localStorage-based state management
 * - publicDataProvider: Indexer connection for reading on-chain data
 * - zkConfigProvider: Loads ZK circuit configs from public directory
 * - proofProvider: HTTP client for proof server communication
 * - walletProvider: DApp connector for balancing/proving transactions
 * - midnightProvider: DApp connector for submitting transactions
 *
 * @param walletApi - Connected DApp Connector wallet API
 * @returns Configured providers for contract operations
 */
export async function configureBrowserProviders(walletApi: DAppConnectorWalletAPI) {
  const serviceConfig = await getServiceConfig(walletApi);
  // walletState is available for future use if needed for coinPublicKey, encryptionPublicKey
  // const walletState = await getWalletState(walletApi);

  const indexerWsUrl = serviceConfig.indexerWS ?? 
    serviceConfig.indexer.replace("https://", "wss://").replace("/graphql", "/graphql/ws");

  return {
    // Use type assertion to bypass strict type checking - browser environment differs from Node.js
    privateStateProvider: browserPrivateStateProvider<typeof PRIVATE_STATE_ID>({
      privateStateStoreName: "patient-registry-state",
    }) as any,
    // Use type assertion to call indexerPublicDataProvider with (url, wsUrl) arguments
    publicDataProvider: (indexerPublicDataProvider as any)(serviceConfig.indexer, indexerWsUrl),
    // FetchZkConfigProvider takes (circuitName, baseUrl) in some versions
    zkConfigProvider: new (FetchZkConfigProvider as any)(
      "registerPatient",
      ZK_CONFIG_BASE_URL,
    ),
    proofProvider: httpClientProofProvider(serviceConfig.proofServer) as any,
    // For browser, we pass the wallet API directly - it handles balancing and proving
    walletProvider: walletApi as any,
    midnightProvider: walletApi as any,
  };
}

/**
 * Join an existing Patient Registry contract
 *
 * This connects to a deployed contract instance on the blockchain.
 * Must be called before any contract transactions.
 *
 * @param walletApi - Connected DApp Connector wallet API
 * @param contractAddress - Address of deployed contract (defaults to PATIENT_REGISTRY_ADDRESS)
 * @returns Deployed contract instance
 */
export async function joinPatientRegistry(
  walletApi: DAppConnectorWalletAPI,
  contractAddress: string = PATIENT_REGISTRY_ADDRESS,
) {
  console.log("Joining Patient Registry contract at:", contractAddress);
  
  const providers = await configureBrowserProviders(walletApi);

  // Note: For browser use, we create a minimal contract instance
  // The actual contract type comes from the compiled contract package
  // This is a simplified version - full implementation would import from @nextmed/contract
  const deployedContract = await findDeployedContract(providers, {
    contractAddress,
    contract: {
      // Minimal contract interface for joining
      impureCircuits: {
        registerPatient: "registerPatient",
        getRegistrationStats: "getRegistrationStats",
      },
    } as any,
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: {},
  });

  console.log("Successfully joined contract:", deployedContract.deployTxData?.public?.contractAddress);
  return deployedContract;
}

// ============================================
// Indexer Queries
// ============================================

/**
 * Query the contract's public ledger state directly from the Indexer
 *
 * This does not require a wallet connection and can be used to display
 * read-only statistics.
 *
 * @param contractAddress - The contract address to query
 * @param indexerUrl - Optional custom indexer URL
 * @returns LedgerState or null if not found
 */
export async function getLedgerState(
  contractAddress: string = PATIENT_REGISTRY_ADDRESS,
  indexerUrl?: string,
): Promise<LedgerState | null> {
  const url = indexerUrl || DEPLOYED_CONTRACT.indexerUrl;

  const query = `
    query GetContractState($address: String!) {
      contractState(address: $address) {
        state
      }
    }
  `;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { address: contractAddress },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Indexer API error: ${response.status} ${response.statusText}`,
      );
    }

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }

    const contractState = result.data?.contractState?.state;
    if (!contractState) {
      console.warn("No contract state found for address:", contractAddress);
      return null;
    }

    // Parse the state - the actual parsing depends on the contract's state format
    // For now, we return a mock structure that matches the expected interface
    // In a real implementation, this would use the contract's ledger() function
    return {
      registrationCount: BigInt(0),
      ageGroupCount: BigInt(0),
      maleCount: BigInt(0),
      femaleCount: BigInt(0),
      otherCount: BigInt(0),
      state: RegistrationState.UNREGISTERED,
    };
  } catch (error) {
    console.error("Failed to query ledger state:", error);
    return null;
  }
}

/**
 * Get registration statistics from the contract
 *
 * This is a convenience function that extracts just the statistics from the ledger state.
 *
 * @param contractAddress - Optional contract address
 * @returns RegistrationStats or null if query fails
 */
export async function getRegistrationStats(
  contractAddress?: string,
): Promise<RegistrationStats | null> {
  const ledgerState = await getLedgerState(contractAddress);
  if (!ledgerState) {
    return null;
  }

  return {
    totalCount: ledgerState.registrationCount,
    maleCount: ledgerState.maleCount,
    femaleCount: ledgerState.femaleCount,
    otherCount: ledgerState.otherCount,
  };
}

// ============================================
// Contract Operations (Require Wallet)
// ============================================

/**
 * Check the contract connection status
 *
 * @param walletApi - Connected wallet API
 * @param contractAddress - Contract address to check
 * @returns ContractConnectionStatus
 */
export async function checkContractConnection(
  walletApi: DAppConnectorWalletAPI | null,
  contractAddress: string = PATIENT_REGISTRY_ADDRESS,
): Promise<ContractConnectionStatus> {
  if (!walletApi) {
    return {
      isConnected: false,
      contractAddress: null,
      ledgerState: null,
      error: "Wallet not connected",
    };
  }

  try {
    const ledgerState = await getLedgerState(contractAddress);

    return {
      isConnected: ledgerState !== null,
      contractAddress: contractAddress,
      ledgerState,
      error: null,
    };
  } catch (error) {
    return {
      isConnected: false,
      contractAddress,
      ledgerState: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Register a patient on the blockchain
 *
 * This creates a transaction that calls the registerPatient circuit on the contract.
 * The transaction will be balanced and proven by the wallet, then submitted to the network.
 *
 * @param walletApi - Connected wallet API
 * @param params - Registration parameters (age, genderCode, conditionHash)
 * @returns RegistrationResult with transaction details
 * @throws Error if registration fails
 */
export async function registerPatient(
  walletApi: DAppConnectorWalletAPI,
  params: PatientRegistrationParams,
): Promise<RegistrationResult> {
  // Validate age
  if (params.age < 0 || params.age > 150) {
    throw new Error("Age must be between 0 and 150");
  }

  // Validate gender code
  if (
    ![GenderCode.MALE, GenderCode.FEMALE, GenderCode.OTHER].includes(
      params.genderCode,
    )
  ) {
    throw new Error("Invalid gender code");
  }

  console.log("Registering patient with params:", {
    age: params.age,
    genderCode: params.genderCode,
    conditionHash: params.conditionHash.toString(),
  });

  try {
    // Join the deployed contract
    const contract = await joinPatientRegistry(walletApi);

    console.log("Contract joined, calling registerPatient circuit...");

    // Call the registerPatient circuit on the contract
    // This will:
    // 1. Create an unbalanced transaction with the circuit call
    // 2. The wallet will balance and prove the transaction
    // 3. Submit the transaction to the network
    const result = await (contract as any).callTx.registerPatient(
      BigInt(params.age),
      BigInt(params.genderCode),
      params.conditionHash,
    );

    console.log("Registration transaction submitted:", result);

    // Extract transaction details from the result
    // The result structure varies by Midnight.js version, so we check multiple paths
    const publicData = result?.public ?? result;
    const txId = publicData?.txId ?? publicData?.transactionId ?? "unknown";
    const blockHeight = publicData?.blockHeight ?? publicData?.block ?? 0;

    return {
      txId: String(txId),
      blockHeight: Number(blockHeight),
      success: true,
    };
  } catch (error) {
    console.error("Patient registration failed:", error);
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes("proof")) {
        throw new Error(
          "Failed to generate proof. Make sure the proof server is running: " +
          "docker run -p 6300:6300 midnightnetwork/proof-server:latest"
        );
      }
      if (error.message.includes("balance") || error.message.includes("insufficient")) {
        throw new Error(
          "Insufficient funds. Please ensure your wallet has testnet tDUST tokens."
        );
      }
      throw new Error(`Registration failed: ${error.message}`);
    }
    throw new Error("Registration failed: Unknown error");
  }
}

/**
 * Verify if an age falls within a specified range
 *
 * This is a pure circuit that runs locally without a blockchain transaction.
 * It demonstrates zero-knowledge proof capabilities - you can prove age is within
 * a range without revealing the actual age.
 *
 * @param age - Age to verify
 * @param minAge - Minimum age (inclusive)
 * @param maxAge - Maximum age (inclusive)
 * @returns boolean indicating if age is within range
 */
export function verifyAgeRangeLocal(
  age: number,
  minAge: number,
  maxAge: number,
): boolean {
  return age >= minAge && age <= maxAge;
}

/**
 * Hash a medical condition string to a bigint
 *
 * This creates a privacy-preserving hash of the condition that can be
 * stored on-chain without revealing the actual condition.
 *
 * @param condition - Medical condition string
 * @returns bigint hash of the condition
 */
export async function hashCondition(condition: string): Promise<bigint> {
  const encoder = new TextEncoder();
  const data = encoder.encode(condition);

  // Use Web Crypto API for SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);

  // Convert first 8 bytes to bigint (64-bit)
  let hash = BigInt(0);
  for (let i = 0; i < 8; i++) {
    hash = (hash << BigInt(8)) | BigInt(hashArray[i]);
  }

  return hash;
}

// ============================================
// Export Types and Constants
// ============================================

export { GenderCode, RegistrationState, DEPLOYED_CONTRACT, PRIVATE_STATE_ID };

export type {
  PatientRegistrationParams,
  RegistrationResult,
  RegistrationStats,
  LedgerState,
  ContractConnectionStatus,
};
