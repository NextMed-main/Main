/**
 * Contract Integration Module
 *
 * Exports all contract-related functionality for NextMed.
 * Includes Phase 1 (Foundation) and Phase 2 (Privacy Core) services.
 */

// ============================================================================
// BROWSER PRIVATE STATE PROVIDER
// ============================================================================

export type { BrowserPrivateStateOptions } from "./browser-private-state-provider";
export {
  browserPrivateStateProvider,
  clearAllPrivateState,
} from "./browser-private-state-provider";

// ============================================================================
// PHASE 1: PATIENT REGISTRY
// ============================================================================

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

export type {
  ContractConnectionStatus,
  ContractProviders,
  LedgerState,
  PatientRegistrationParams,
  PatientRegistryConfig,
  RegistrationResult,
  RegistrationStats,
} from "./types";

// ============================================================================
// PHASE 1: PATIENT REGISTRY SERVICE (High-level API)
// ============================================================================

export { createPatientRegistryService } from "./patient-registry-service";
export type { PatientRegistryService } from "./patient-registry-service";

// ============================================================================
// PHASE 2: ZK DATA MASKING SERVICE
// ============================================================================

export {
  ZKDataMaskingService,
  createUserId,
  generateSecretKey,
} from "./zk-data-masking-service";

export type {
  ZKMaskingPrivateState,
  AccessGrant,
} from "./zk-data-masking-service";

// ============================================================================
// PHASE 2: VIEWING KEY MANAGER SERVICE
// ============================================================================

export {
  ViewingKeyManagerService,
  stringToUserId,
  toHex,
  fromHex,
} from "./viewing-key-manager-service";

export type {
  ViewingKeyPrivateState,
  ViewingKeyInfo,
} from "./viewing-key-manager-service";
