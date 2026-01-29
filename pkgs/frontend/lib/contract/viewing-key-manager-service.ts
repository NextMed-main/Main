// This file is part of NextMed Patient Registry
// Copyright (C) 2026 NextMed Team
// SPDX-License-Identifier: Apache-2.0

/**
 * Viewing Key Manager Service for Browser
 *
 * Provides a high-level interface for managing viewing keys that enable
 * selective data disclosure to specific parties.
 */

import { browserPrivateStateProvider } from "./browser-private-state-provider";

/**
 * Private state for viewing key operations
 */
export interface ViewingKeyPrivateState {
  secretKey: Uint8Array;
  viewingKey?: Uint8Array;
}

/**
 * Viewing key metadata
 */
export interface ViewingKeyInfo {
  keyId: string;
  ownerId: string;
  recipientId: string;
  expiryTimestamp: number;
  isValid: boolean;
}

/**
 * Viewing Key Manager Service
 * Handles viewing key generation, issuance, verification, and revocation
 */
export class ViewingKeyManagerService {
  private privateState: ViewingKeyPrivateState | null = null;
  private readonly storageProvider;
  private readonly contractAddress: string;
  private readonly issuedKeys: Map<string, Uint8Array> = new Map();

  constructor(contractAddress: string) {
    this.contractAddress = contractAddress;
    this.storageProvider = browserPrivateStateProvider({
      privateStateStoreName: `viewing_keys_${contractAddress.slice(0, 8)}`,
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
    await this.persistState();
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
    
    // Load issued keys
    const keysBytes = await this.storageProvider.get("issued_keys");
    if (keysBytes) {
      this.loadIssuedKeys(keysBytes);
    }
    
    return true;
  }

  /**
   * Generate a new viewing key for a recipient
   */
  generateViewingKey(recipientId: string): Uint8Array {
    if (!this.privateState) {
      throw new Error("Service not initialized. Call initialize() first.");
    }

    // Generate deterministic viewing key from secret key and recipient
    const combined = new Uint8Array([
      ...new TextEncoder().encode("nextmed:viewkey:generate"),
      ...this.privateState.secretKey,
      ...new TextEncoder().encode(recipientId),
    ]);

    // Use simple hash for browser (in production, use proper KDF)
    const viewingKey = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      viewingKey[i] = combined[i % combined.length] ^ combined[(i + 17) % combined.length];
    }

    // Store the key locally
    this.issuedKeys.set(recipientId, viewingKey);
    this.persistIssuedKeys();

    return viewingKey;
  }

  /**
   * Set the viewing key for verification operations
   */
  setViewingKey(viewingKey: Uint8Array): void {
    if (!this.privateState) {
      throw new Error("Service not initialized. Call initialize() first.");
    }

    this.privateState = {
      ...this.privateState,
      viewingKey,
    };

    this.persistState();
  }

  /**
   * Get the current private state for contract calls
   */
  getPrivateState(): ViewingKeyPrivateState {
    if (!this.privateState) {
      throw new Error("Service not initialized. Call initialize() first.");
    }
    return this.privateState;
  }

  /**
   * Get a previously issued viewing key for a recipient
   */
  getIssuedKey(recipientId: string): Uint8Array | undefined {
    return this.issuedKeys.get(recipientId);
  }

  /**
   * List all issued keys
   */
  listIssuedKeys(): string[] {
    return Array.from(this.issuedKeys.keys());
  }

  /**
   * Calculate expiry timestamp (current time + duration in seconds)
   */
  calculateExpiry(durationSeconds: number): bigint {
    const expiryMs = Date.now() + durationSeconds * 1000;
    return BigInt(Math.floor(expiryMs / 1000));
  }

  /**
   * Clear all state from storage
   */
  async clearState(): Promise<void> {
    this.privateState = null;
    this.issuedKeys.clear();
    await this.storageProvider.clear();
  }

  /**
   * Persist private state to storage
   */
  private async persistState(): Promise<void> {
    if (!this.privateState) return;
    
    const stateBytes = this.serializePrivateState(this.privateState);
    await this.storageProvider.set("state", stateBytes);
  }

  /**
   * Persist issued keys to storage
   */
  private async persistIssuedKeys(): Promise<void> {
    const keysArray: [string, number[]][] = [];
    this.issuedKeys.forEach((value, key) => {
      keysArray.push([key, Array.from(value)]);
    });
    
    const json = JSON.stringify(keysArray);
    const bytes = new TextEncoder().encode(json);
    await this.storageProvider.set("issued_keys", bytes);
  }

  /**
   * Load issued keys from storage
   */
  private loadIssuedKeys(bytes: Uint8Array): void {
    const json = new TextDecoder().decode(bytes);
    const keysArray: [string, number[]][] = JSON.parse(json);
    
    this.issuedKeys.clear();
    keysArray.forEach(([key, value]) => {
      this.issuedKeys.set(key, new Uint8Array(value));
    });
  }

  /**
   * Serialize private state for storage
   */
  private serializePrivateState(state: ViewingKeyPrivateState): Uint8Array {
    const json = JSON.stringify({
      secretKey: Array.from(state.secretKey),
      viewingKey: state.viewingKey ? Array.from(state.viewingKey) : null,
    });
    return new TextEncoder().encode(json);
  }

  /**
   * Deserialize private state from storage
   */
  private deserializePrivateState(bytes: Uint8Array): ViewingKeyPrivateState {
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json);
    return {
      secretKey: new Uint8Array(data.secretKey),
      viewingKey: data.viewingKey ? new Uint8Array(data.viewingKey) : undefined,
    };
  }
}

/**
 * Helper: Convert string to 32-byte user ID
 */
export function stringToUserId(str: string): Uint8Array {
  const bytes = new TextEncoder().encode(str);
  const result = new Uint8Array(32);
  result.set(bytes.slice(0, 32));
  return result;
}

/**
 * Helper: Convert Uint8Array to hex string
 */
export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Helper: Convert hex string to Uint8Array
 */
export function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}
