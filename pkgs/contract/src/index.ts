// This file is part of NextMed Patient Registry
// Copyright (C) 2026 NextMed Team
// SPDX-License-Identifier: Apache-2.0

// ============================================================================
// PHASE 1: FOUNDATION CONTRACTS
// ============================================================================

// Patient Registry
export * as PatientRegistry from "./managed/patient-registry/contract/index.js";
export * from "./types";
export * from "./utils";
export * from "./witnesses";
export type { PatientRegistryPrivateState } from "./witnesses";

// Consent Registry (Phase 1)
export * as ConsentRegistry from "./managed/consent-registry/contract/index.js";

// Incentive Pool (Phase 1)
export * as IncentivePool from "./managed/incentive-pool/contract/index.js";

// Medical Upload Verifier (Phase 1)
export * as MedicalUploadVerifier from "./managed/medical-upload-verifier/contract/index.js";

// ============================================================================
// PHASE 2: PRIVACY CORE CONTRACTS
// ============================================================================

// ZK Data Masking
export * as ZKDataMasking from "./managed/zk-data-masking/contract/index.js";
export * from "./zk-data-masking-witnesses";
export type { ZKDataMaskingPrivateState } from "./zk-data-masking-witnesses";

// Viewing Key Manager
export * as ViewingKeyManager from "./managed/viewing-key-manager/contract/index.js";
export * from "./viewing-key-manager-witnesses";
export type { ViewingKeyManagerPrivateState } from "./viewing-key-manager-witnesses";
