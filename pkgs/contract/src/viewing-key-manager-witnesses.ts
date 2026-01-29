// This file is part of NextMed Patient Registry
// Copyright (C) 2026 NextMed Team
// SPDX-License-Identifier: Apache-2.0

/**
 * Witness Implementation for Viewing Key Manager Contract
 *
 * Pattern: Verified via Midnight MCP server
 *
 * Witnesses provide private/off-chain data to ZK circuits. They:
 * 1. Take a WitnessContext<Ledger, PrivateState> as first argument
 * 2. Return a tuple [newPrivateState, returnValue]
 * 3. Never leave the user's device - only the ZK proof is submitted
 */

import type { WitnessContext } from "@midnight-ntwrk/compact-runtime";
import { randomBytes, createHash } from "node:crypto";

// Import the Ledger type from the compiled contract
import * as ViewingKeyManagerContract from "./managed/viewing-key-manager/contract/index.js";

/**
 * Ledger type alias for the Viewing Key Manager contract
 */
export type ViewingKeyManagerLedger = ReturnType<typeof ViewingKeyManagerContract.ledger>;

/**
 * Private state for Viewing Key Manager operations
 * This data never leaves the device
 */
export type ViewingKeyManagerPrivateState = {
  /** Secret key for authentication (32 bytes) */
  readonly secretKey: Uint8Array;
  /** Viewing key for data access (32 bytes) */
  readonly viewingKey?: Uint8Array;
};

/**
 * Create initial private state with only secret key
 */
export const createViewingKeyPrivateState = (
  secretKey: Uint8Array,
): ViewingKeyManagerPrivateState => ({
  secretKey,
});

/**
 * Create private state with viewing key for verification
 */
export const createViewingKeyPrivateStateWithKey = (
  secretKey: Uint8Array,
  viewingKey: Uint8Array,
): ViewingKeyManagerPrivateState => ({
  secretKey,
  viewingKey,
});

/**
 * Generate a new viewing key
 * @returns A random 32-byte viewing key
 */
export const generateViewingKey = (): Uint8Array => {
  return randomBytes(32);
};

/**
 * Derive viewing key from secret key and recipient ID
 * Creates a deterministic viewing key for a specific recipient
 */
export const deriveViewingKey = (
  secretKey: Uint8Array,
  recipientId: Uint8Array,
): Uint8Array => {
  const combined = Buffer.concat([
    Buffer.from("nextmed:viewkey:derive"),
    Buffer.from(secretKey),
    Buffer.from(recipientId),
  ]);
  return new Uint8Array(createHash("sha256").update(combined).digest());
};

/**
 * Witness implementations for Viewing Key Manager contract
 */
export const viewingKeyManagerWitnesses = {
  /**
   * Witness: local_secret_key
   * Provides the user's secret key for authentication
   */
  local_secret_key: ({
    privateState,
  }: WitnessContext<
    ViewingKeyManagerLedger,
    ViewingKeyManagerPrivateState
  >): [ViewingKeyManagerPrivateState, Uint8Array] => {
    if (!privateState.secretKey) {
      throw new Error("No secret key found in private state");
    }
    return [privateState, privateState.secretKey];
  },

  /**
   * Witness: local_viewing_key
   * Provides the viewing key for verification
   */
  local_viewing_key: ({
    privateState,
  }: WitnessContext<
    ViewingKeyManagerLedger,
    ViewingKeyManagerPrivateState
  >): [ViewingKeyManagerPrivateState, Uint8Array] => {
    if (!privateState.viewingKey) {
      throw new Error("No viewing key found in private state");
    }
    return [privateState, privateState.viewingKey];
  },
};

// Re-export the Contract for convenience
export { ViewingKeyManagerContract };
