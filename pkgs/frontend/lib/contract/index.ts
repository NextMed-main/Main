/**
 * Contract Integration Module
 *
 * Exports all contract-related functionality for the Patient Registry.
 */

export type { BrowserPrivateStateOptions } from "./browser-private-state-provider";
// Browser Private State Provider
export {
  browserPrivateStateProvider,
  clearAllPrivateState,
} from "./browser-private-state-provider";
// Patient Registry Contract Service
export {
  checkContractConnection,
  DEPLOYED_CONTRACT,
  GenderCode,
  getLedgerState,
  getRegistrationStats,
  hashCondition,
  PATIENT_REGISTRY_ADDRESS,
  RegistrationState,
  registerPatient,
  verifyAgeRangeLocal,
} from "./patient-registry";
// Types
export type {
  ContractConnectionStatus,
  ContractProviders,
  LedgerState,
  PatientRegistrationParams,
  PatientRegistryConfig,
  RegistrationResult,
  RegistrationStats,
} from "./types";
