// This file is part of NextMed Patient Registry
// Copyright (C) 2026 NextMed Team
// SPDX-License-Identifier: Apache-2.0

/**
 * ZK Data Masking Service for Browser
 *
 * Provides a high-level interface for interacting with the ZK Data Masking contract
 * in the browser environment.
 */

import { browserPrivateStateProvider } from "./browser-private-state-provider";

/**
 * Private state for ZK data masking operations
 */
export interface ZKMaskingPrivateState {
  secretKey: Uint8Array;
  privateData?: Uint8Array;
  maskingSalt?: Uint8Array;
}

/**
 * Access grant record
 */
export interface AccessGrant {
  userId: string;
  viewerId: string;
  grantedAt: Date;
  revoked: boolean;
}

/**
 * ZK Data Masking Service
 * Handles data masking, access control, and integrity verification
 */
export class ZKDataMaskingService {
  private privateState: ZKMaskingPrivateState | null = null;
  private readonly storageProvider;
  private readonly contractAddress: string;

  constructor(contractAddress: string) {
    this.contractAddress = contractAddress;
    this.storageProvider = browserPrivateStateProvider({
      privateStateStoreName: `zk_masking_${contractAddress.slice(0, 8)}`,
    });
  }

  /**
   * Initialize the service with a secret key
   */
  async initialize(secretKey: Uint8Array): Promise<void> {
    this.privateState = {
      secretKey,
    };

    // Persist to local storage
    const stateBytes = this.serializePrivateState(this.privateState);
    await this.storageProvider.set("state", stateBytes);
  }

  /**
   * Load private state from storage
   */
  async loadState(): Promise<boolean> {
    const stateBytes = await this.storageProvider.get("state");
    if (!stateBytes) {
      return false;
    }

    this.privateState = this.deserializePrivateState(stateBytes);
    return true;
  }

  /**
   * Set private data to be masked
   */
  async setPrivateData(data: Uint8Array): Promise<void> {
    if (!this.privateState) {
      throw new Error("Service not initialized. Call initialize() first.");
    }

    // Generate random salt
    const salt = new Uint8Array(32);
    crypto.getRandomValues(salt);

    this.privateState = {
      ...this.privateState,
      privateData: data,
      maskingSalt: salt,
    };

    // Persist updated state
    const stateBytes = this.serializePrivateState(this.privateState);
    await this.storageProvider.set("state", stateBytes);
  }

  /**
   * Get the current private state for contract calls
   */
  getPrivateState(): ZKMaskingPrivateState {
    if (!this.privateState) {
      throw new Error("Service not initialized. Call initialize() first.");
    }
    return this.privateState;
  }

  /**
   * Compute data commitment locally (for verification)
   */
  async computeCommitment(): Promise<Uint8Array> {
    if (!this.privateState?.privateData || !this.privateState?.maskingSalt) {
      throw new Error("Private data and salt required for commitment");
    }

    // Use Web Crypto API for SHA-256
    const combinedData = new Uint8Array([
      ...new TextEncoder().encode("nextmed:zkmasking:commit"),
      ...this.privateState.privateData,
      ...this.privateState.maskingSalt,
    ]);

    const hashBuffer = await crypto.subtle.digest("SHA-256", combinedData);
    return new Uint8Array(hashBuffer);
  }

  /**
   * Clear private state from storage
   */
  async clearState(): Promise<void> {
    this.privateState = null;
    await this.storageProvider.clear();
  }

  /**
   * Serialize private state for storage
   */
  private serializePrivateState(state: ZKMaskingPrivateState): Uint8Array {
    const json = JSON.stringify({
      secretKey: Array.from(state.secretKey),
      privateData: state.privateData ? Array.from(state.privateData) : null,
      maskingSalt: state.maskingSalt ? Array.from(state.maskingSalt) : null,
    });
    return new TextEncoder().encode(json);
  }

  /**
   * Deserialize private state from storage
   */
  private deserializePrivateState(bytes: Uint8Array): ZKMaskingPrivateState {
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json);
    return {
      secretKey: new Uint8Array(data.secretKey),
      privateData: data.privateData ? new Uint8Array(data.privateData) : undefined,
      maskingSalt: data.maskingSalt ? new Uint8Array(data.maskingSalt) : undefined,
    };
  }
}

/**
 * Create a user ID from a string (for contract calls)
 */
export function createUserId(identifier: string): Uint8Array {
  const encoder = new TextEncoder();
  const data = encoder.encode(identifier);
  
  // Pad or truncate to 32 bytes
  const result = new Uint8Array(32);
  result.set(data.slice(0, 32));
  return result;
}

/**
 * Generate a random secret key
 */
export function generateSecretKey(): Uint8Array {
  const key = new Uint8Array(32);
  crypto.getRandomValues(key);
  return key;
}
