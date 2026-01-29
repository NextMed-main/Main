// This file is part of midnightntwrk/example-counter.
// Copyright (C) 2025 Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type { DeployedContract, FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { ImpureCircuitId, MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { 
  PatientRegistry, type PatientRegistryPrivateState,
  ConsentRegistry,
  IncentivePool,
  MedicalUploadVerifier,
  ZKDataMasking, type ZKDataMaskingPrivateState,
  ViewingKeyManager, type ViewingKeyManagerPrivateState
} from 'contract';

// ========================================
// Patient Registry Types
// ========================================

export type PatientRegistryCircuits = ImpureCircuitId<
  PatientRegistry.Contract<PatientRegistryPrivateState>
>;

export const PatientRegistryPrivateStateId = "patientRegistryPrivateState";

export type PatientRegistryProviders = MidnightProviders<
  PatientRegistryCircuits,
  typeof PatientRegistryPrivateStateId,
  PatientRegistryPrivateState
>;

export type PatientRegistryContract = PatientRegistry.Contract<PatientRegistryPrivateState>;

export type DeployedPatientRegistryContract =
	| DeployedContract<PatientRegistryContract>
	| FoundContract<PatientRegistryContract>;

export type { PatientRegistryPrivateState };

// ========================================
// Consent Registry Types
// ========================================

export type ConsentRegistryCircuits = ImpureCircuitId<
  ConsentRegistry.Contract<PatientRegistryPrivateState>
>;

export const ConsentRegistryPrivateStateId = "consentRegistryPrivateState";

export type ConsentRegistryProviders = MidnightProviders<
  ConsentRegistryCircuits,
  typeof ConsentRegistryPrivateStateId,
  PatientRegistryPrivateState
>;

export type ConsentRegistryContract = ConsentRegistry.Contract<PatientRegistryPrivateState>;

export type DeployedConsentRegistryContract =
	| DeployedContract<ConsentRegistryContract>
	| FoundContract<ConsentRegistryContract>;

// ========================================
// Incentive Pool Types
// ========================================

export type IncentivePoolCircuits = ImpureCircuitId<
  IncentivePool.Contract<PatientRegistryPrivateState>
>;

export const IncentivePoolPrivateStateId = "incentivePoolPrivateState";

export type IncentivePoolProviders = MidnightProviders<
  IncentivePoolCircuits,
  typeof IncentivePoolPrivateStateId,
  PatientRegistryPrivateState
>;

export type IncentivePoolContract = IncentivePool.Contract<PatientRegistryPrivateState>;

export type DeployedIncentivePoolContract =
	| DeployedContract<IncentivePoolContract>
	| FoundContract<IncentivePoolContract>;

// ========================================
// Medical Upload Verifier Types
// ========================================

export type MedicalUploadVerifierCircuits = ImpureCircuitId<
  MedicalUploadVerifier.Contract<PatientRegistryPrivateState>
>;

export const MedicalUploadVerifierPrivateStateId = "medicalUploadVerifierPrivateState";

export type MedicalUploadVerifierProviders = MidnightProviders<
  MedicalUploadVerifierCircuits,
  typeof MedicalUploadVerifierPrivateStateId,
  PatientRegistryPrivateState
>;

export type MedicalUploadVerifierContract = MedicalUploadVerifier.Contract<PatientRegistryPrivateState>;

export type DeployedMedicalUploadVerifierContract =
	| DeployedContract<MedicalUploadVerifierContract>
	| FoundContract<MedicalUploadVerifierContract>;

// ========================================
// ZK Data Masking Types
// ========================================

export type ZKDataMaskingCircuits = ImpureCircuitId<
  ZKDataMasking.Contract<ZKDataMaskingPrivateState>
>;

export const ZKDataMaskingPrivateStateId = "zkDataMaskingPrivateState";

export type ZKDataMaskingProviders = MidnightProviders<
  ZKDataMaskingCircuits,
  typeof ZKDataMaskingPrivateStateId,
  ZKDataMaskingPrivateState
>;

export type ZKDataMaskingContract = ZKDataMasking.Contract<ZKDataMaskingPrivateState>;

export type DeployedZKDataMaskingContract =
	| DeployedContract<ZKDataMaskingContract>
	| FoundContract<ZKDataMaskingContract>;

export type { ZKDataMaskingPrivateState };

// ========================================
// Viewing Key Manager Types
// ========================================

export type ViewingKeyManagerCircuits = ImpureCircuitId<
  ViewingKeyManager.Contract<ViewingKeyManagerPrivateState>
>;

export const ViewingKeyManagerPrivateStateId = "viewingKeyManagerPrivateState";

export type ViewingKeyManagerProviders = MidnightProviders<
  ViewingKeyManagerCircuits,
  typeof ViewingKeyManagerPrivateStateId,
  ViewingKeyManagerPrivateState
>;

export type ViewingKeyManagerContract = ViewingKeyManager.Contract<ViewingKeyManagerPrivateState>;

export type DeployedViewingKeyManagerContract =
	| DeployedContract<ViewingKeyManagerContract>
	| FoundContract<ViewingKeyManagerContract>;

export type { ViewingKeyManagerPrivateState };

// RegistrationStats type
export type RegistrationStats = [bigint, bigint, bigint, bigint];
