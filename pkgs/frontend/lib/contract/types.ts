/**
 * Type definitions for Patient Registry Contract integration
 */

import type { DAppConnectorWalletAPI } from "@midnight-ntwrk/dapp-connector-api";

/**
 * Contract configuration
 */
export interface PatientRegistryConfig {
  contractAddress: string;
  proofServerUrl: string;
  indexerUrl: string;
  indexerWsUrl: string;
}

/**
 * Default deployed contract configuration
 */
export const DEPLOYED_CONTRACT: PatientRegistryConfig = {
  contractAddress:
    "0200f683ce77beddfed112fdb915dde64f5075c7f2ccdbf319fd8738e89e131806cc",
  proofServerUrl: "http://localhost:6300",
  indexerUrl: "https://indexer.testnet-02.midnight.network/api/v1/graphql",
  indexerWsUrl: "wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws",
};

/**
 * Registration statistics from the contract ledger
 */
export interface RegistrationStats {
  totalCount: bigint;
  maleCount: bigint;
  femaleCount: bigint;
  otherCount: bigint;
}

/**
 * Gender codes for patient registration
 */
export enum GenderCode {
  MALE = 0,
  FEMALE = 1,
  OTHER = 2,
}

/**
 * Registration state from the contract
 */
export enum RegistrationState {
  UNREGISTERED = 0,
  REGISTERED = 1,
  VERIFIED = 2,
}

/**
 * Parameters for registering a patient
 */
export interface PatientRegistrationParams {
  age: number;
  genderCode: GenderCode;
  conditionHash: bigint;
}

/**
 * Result of a successful patient registration
 */
export interface RegistrationResult {
  txId: string;
  blockHeight: number;
  success: boolean;
}

/**
 * Ledger state from the contract
 */
export interface LedgerState {
  registrationCount: bigint;
  ageGroupCount: bigint;
  maleCount: bigint;
  femaleCount: bigint;
  otherCount: bigint;
  state: RegistrationState;
}

/**
 * Provider configuration for contract operations
 */
export interface ContractProviders {
  walletApi: DAppConnectorWalletAPI;
  contractAddress: string;
  indexerUrl: string;
  indexerWsUrl: string;
  proofServerUrl: string;
}

/**
 * Connection status for the contract
 */
export interface ContractConnectionStatus {
  isConnected: boolean;
  contractAddress: string | null;
  ledgerState: LedgerState | null;
  error: string | null;
}
