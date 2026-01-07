/**
 * Contract Integration Module
 * 
 * Exports all contract-related functionality for the Patient Registry.
 */

// Patient Registry Contract Service
export {
  PATIENT_REGISTRY_ADDRESS,
  DEPLOYED_CONTRACT,
  getLedgerState,
  getRegistrationStats,
  checkContractConnection,
  registerPatient,
  verifyAgeRangeLocal,
  hashCondition,
  GenderCode,
  RegistrationState,
} from "./patient-registry";

// Types
export type {
  PatientRegistrationParams,
  RegistrationResult,
  RegistrationStats,
  LedgerState,
  ContractConnectionStatus,
  PatientRegistryConfig,
  ContractProviders,
} from "./types";

// Browser Private State Provider
export {
  browserPrivateStateProvider,
  clearAllPrivateState,
} from "./browser-private-state-provider";

export type { BrowserPrivateStateOptions } from "./browser-private-state-provider";
