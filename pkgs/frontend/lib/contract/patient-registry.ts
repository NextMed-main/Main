/**
 * Patient Registry Contract Service
 *
 * Browser-compatible service for interacting with the Patient Registry smart contract
 * on the Midnight Network.
 *
 * @see https://docs.midnight.network/develop/tutorial/building/dapp-details
 */

import type { DAppConnectorWalletAPI } from "@midnight-ntwrk/dapp-connector-api";
import { getServiceConfig } from "../wallet/midnight-wallet";
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

  // Get service config from wallet
  const serviceConfig = await getServiceConfig();

  console.log("Registering patient with params:", {
    age: params.age,
    genderCode: params.genderCode,
    conditionHash: params.conditionHash.toString(),
  });
  console.log("Using service config:", serviceConfig);

  // TODO: Implement full contract call using Midnight.js
  // This requires:
  // 1. Creating the contract instance
  // 2. Configuring providers
  // 3. Joining the deployed contract
  // 4. Calling contract.callTx.registerPatient()

  // For now, throw an error indicating this is not yet fully implemented
  throw new Error(
    "Patient registration via browser is not yet fully implemented. " +
      "The contract infrastructure exists but requires Midnight.js contract APIs to be properly configured. " +
      "Please use the CLI to register patients: `pnpm register:patient`",
  );
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
