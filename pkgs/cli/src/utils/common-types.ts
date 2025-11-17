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

import { Counter, type CounterPrivateState, PatientRegistry } from 'contract';
import type { ImpureCircuitId, MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { DeployedContract, FoundContract } from '@midnight-ntwrk/midnight-js-contracts';

export type CounterCircuits = ImpureCircuitId<Counter.Contract<CounterPrivateState>>;

export const CounterPrivateStateId = 'counterPrivateState';

export type CounterProviders = MidnightProviders<CounterCircuits, typeof CounterPrivateStateId, CounterPrivateState>;

export type CounterContract = Counter.Contract<CounterPrivateState>;

export type DeployedCounterContract = DeployedContract<CounterContract> | FoundContract<CounterContract>;

// Patient Registry types
export type PatientRegistryPrivateState = Record<string, never>; // Empty object for contracts without private state

export type PatientRegistryCircuits = ImpureCircuitId<PatientRegistry.Contract<PatientRegistryPrivateState>>;

export const PatientRegistryPrivateStateId = 'patientRegistryPrivateState';

export type PatientRegistryProviders = MidnightProviders<
	PatientRegistryCircuits,
	typeof PatientRegistryPrivateStateId,
	PatientRegistryPrivateState
>;

export type PatientRegistryContract = PatientRegistry.Contract<PatientRegistryPrivateState>;

export type DeployedPatientRegistryContract =
	| DeployedContract<PatientRegistryContract>
	| FoundContract<PatientRegistryContract>;
