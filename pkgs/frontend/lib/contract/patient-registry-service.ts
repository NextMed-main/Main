/**
 * Patient Registry Service
 *
 * Browser-compatible service for interacting with the Patient Registry contract.
 * Provides high-level methods for patient registration and statistics.
 *
 * This service wraps the low-level contract operations with proper witness handling
 * and provides a clean API for the frontend components.
 */

import type { DAppConnectorWalletAPI } from "@midnight-ntwrk/dapp-connector-api";
import type {
  PatientRegistrationParams,
  RegistrationResult,
  RegistrationStats,
  LedgerState,
  ContractProviders,
} from "./types";

/**
 * Private state for the patient registry
 * Stored locally in the browser - never leaves the device
 */
export interface PatientRegistryPrivateState {
  /** Secret key for authentication (32 bytes) */
  secretKey: Uint8Array;
  /** Optional file hash for upload verification */
  fileHash?: Uint8Array;
}

/**
 * Create initial private state
 * @param secretKey - 32-byte secret key derived from wallet
 */
export const createPrivateState = (
  secretKey: Uint8Array
): PatientRegistryPrivateState => ({
  secretKey,
});

/**
 * Create a patient registry service instance
 *
 * @param providers - Contract providers configuration
 * @returns Service methods for patient registry operations
 */
export const createPatientRegistryService = (providers: ContractProviders) => {
  let privateState: PatientRegistryPrivateState | null = null;

  /**
   * Initialize private state from wallet
   * Derives a secret key from the wallet's signing capability
   */
  const initializePrivateState = async (
    walletApi: DAppConnectorWalletAPI
  ): Promise<void> => {
    // In production, derive secret key from wallet
    // For now, create a deterministic key
    const secretKey = new Uint8Array(32);
    crypto.getRandomValues(secretKey);
    privateState = createPrivateState(secretKey);
  };

  /**
   * Register a new patient
   *
   * @param params - Patient registration parameters
   * @returns Registration result with transaction ID
   */
  const registerPatient = async (
    params: PatientRegistrationParams
  ): Promise<RegistrationResult> => {
    if (!privateState) {
      throw new Error("Private state not initialized. Call initializePrivateState first.");
    }

    console.log("[PatientRegistryService] Registering patient:", {
      age: params.age,
      genderCode: params.genderCode,
    });

    // TODO: Implement after contract is compiled and deployed
    // This will call the contract via callTx with proper witnesses
    // const result = await contract.callTx.registerPatient(
    //   BigInt(params.age),
    //   BigInt(params.genderCode),
    //   params.conditionHash
    // );

    // Placeholder result
    return {
      txId: "placeholder-tx-id",
      blockHeight: 0,
      success: true,
    };
  };

  /**
   * Get registration statistics
   *
   * @returns Current registration statistics from the contract
   */
  const getRegistrationStats = async (): Promise<RegistrationStats> => {
    console.log("[PatientRegistryService] Getting registration stats...");

    // TODO: Implement after contract is compiled
    // const result = await contract.callTx.getRegistrationStats();
    // return {
    //   totalCount: result[0],
    //   maleCount: result[1],
    //   femaleCount: result[2],
    //   otherCount: result[3],
    // };

    return {
      totalCount: BigInt(0),
      maleCount: BigInt(0),
      femaleCount: BigInt(0),
      otherCount: BigInt(0),
    };
  };

  /**
   * Verify age is within a range
   *
   * @param age - Age to verify
   * @param minAge - Minimum age
   * @param maxAge - Maximum age
   * @returns Whether age is within range
   */
  const verifyAgeRange = async (
    age: number,
    minAge: number,
    maxAge: number
  ): Promise<boolean> => {
    console.log("[PatientRegistryService] Verifying age range:", {
      age,
      minAge,
      maxAge,
    });

    // TODO: Use pureCircuits.verifyAgeRange after contract is compiled
    // const result = pureCircuits.verifyAgeRange(
    //   BigInt(age),
    //   BigInt(minAge),
    //   BigInt(maxAge)
    // );
    // return result;

    return age >= minAge && age <= maxAge;
  };

  /**
   * Get current ledger state
   *
   * @returns Current ledger state from the contract
   */
  const getLedgerState = async (): Promise<LedgerState | null> => {
    console.log("[PatientRegistryService] Getting ledger state...");

    // TODO: Implement after contract connection is established
    return null;
  };

  /**
   * Check if service is initialized
   */
  const isInitialized = (): boolean => {
    return privateState !== null;
  };

  return {
    initializePrivateState,
    registerPatient,
    getRegistrationStats,
    verifyAgeRange,
    getLedgerState,
    isInitialized,
  };
};

export type PatientRegistryService = ReturnType<typeof createPatientRegistryService>;
