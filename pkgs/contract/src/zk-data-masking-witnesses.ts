// This file is part of NextMed Patient Registry
// Copyright (C) 2026 NextMed Team
// SPDX-License-Identifier: Apache-2.0

/**
 * Witness Implementation for ZK Data Masking Contract
 *
 * Pattern: Verified via Midnight MCP server
 *
 * Witnesses provide private/off-chain data to ZK circuits. They:
 * 1. Take a WitnessContext<Ledger, PrivateState> as first argument
 * 2. Return a tuple [newPrivateState, returnValue]
 * 3. Never leave the user's device - only the ZK proof is submitted
 */

import type { WitnessContext } from "@midnight-ntwrk/compact-runtime";
import { createHash, randomBytes } from "node:crypto";

// Import the Ledger type from the compiled contract
import * as ZKDataMaskingContract from "./managed/zk-data-masking/contract/index.js";

/**
 * Ledger type alias for the ZK Data Masking contract
 */
export type ZKDataMaskingLedger = ReturnType<typeof ZKDataMaskingContract.ledger>;

/**
 * Private state for ZK Data Masking operations
 * This data never leaves the device
 */
export type ZKDataMaskingPrivateState = {
  /** Secret key for authentication (32 bytes) */
  readonly secretKey: Uint8Array;
  /** Private data to be masked (32 bytes) */
  readonly privateData?: Uint8Array;
  /** Salt for commitment generation (32 bytes) */
  readonly maskingSalt?: Uint8Array;
};

/**
 * Create initial private state with only secret key
 */
export const createZKMaskingPrivateState = (
  secretKey: Uint8Array,
): ZKDataMaskingPrivateState => ({
  secretKey,
});

/**
 * Create private state with data and salt for masking
 */
export const createZKMaskingPrivateStateWithData = (
  secretKey: Uint8Array,
  privateData: Uint8Array,
  maskingSalt?: Uint8Array,
): ZKDataMaskingPrivateState => ({
  secretKey,
  privateData,
  maskingSalt: maskingSalt ?? randomBytes(32),
});

/**
 * Generate a random masking salt
 */
export const generateMaskingSalt = (): Uint8Array => {
  return randomBytes(32);
};

/**
 * Compute data hash for commitment
 */
export const computeDataHash = (data: Buffer): Uint8Array => {
  const hash = createHash("sha256").update(data).digest();
  return new Uint8Array(hash);
};

/**
 * Witness implementations for ZK Data Masking contract
 */
export const zkDataMaskingWitnesses = {
  /**
   * Witness: local_private_data
   * Provides the user's private data from local state
   */
  local_private_data: ({
    privateState,
  }: WitnessContext<
    ZKDataMaskingLedger,
    ZKDataMaskingPrivateState
  >): [ZKDataMaskingPrivateState, Uint8Array] => {
    if (!privateState.privateData) {
      throw new Error("No private data found in private state");
    }
    return [privateState, privateState.privateData];
  },

  /**
   * Witness: local_secret_key
   * Provides the user's secret key for authentication
   */
  local_secret_key: ({
    privateState,
  }: WitnessContext<
    ZKDataMaskingLedger,
    ZKDataMaskingPrivateState
  >): [ZKDataMaskingPrivateState, Uint8Array] => {
    if (!privateState.secretKey) {
      throw new Error("No secret key found in private state");
    }
    return [privateState, privateState.secretKey];
  },

  /**
   * Witness: local_masking_salt
   * Provides the salt used for commitment generation
   */
  local_masking_salt: ({
    privateState,
  }: WitnessContext<
    ZKDataMaskingLedger,
    ZKDataMaskingPrivateState
  >): [ZKDataMaskingPrivateState, Uint8Array] => {
    if (!privateState.maskingSalt) {
      throw new Error("No masking salt found in private state");
    }
    return [privateState, privateState.maskingSalt];
  },
};

// Re-export the Contract for convenience
export { ZKDataMaskingContract };
